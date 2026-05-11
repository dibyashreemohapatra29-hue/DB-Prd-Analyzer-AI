import os
import json
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from groq import Groq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

VAGUE_WORDS = [
    "fast", "scalable", "intuitive", "efficient",
    "simple", "easy", "seamless", "robust", "flexible",
]

MAX_ISSUES    = 5
MAX_QUESTIONS = 3


# ── Supabase ──────────────────────────────────────────────────────────────────

def get_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    try:
        from supabase import create_client
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Supabase init error: {e}")
        return None


# ── Request model ─────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    prd_text: str

    @field_validator("prd_text")
    @classmethod
    def validate_prd_text(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Please enter a PRD")
        if len(v) < 20:
            raise ValueError("PRD too short — please provide more detail")
        return v


# ── Prompt builder ────────────────────────────────────────────────────────────

def build_prompt(text: str) -> str:
    return f"""You are a senior product analyst performing a strict PRD review.

Your task is to identify the most critical issues in the following PRD and generate focused clarifying questions.

CLASSIFICATION RULES:
- ambiguity      → vague, unmeasurable, or subjective language
- missing_logic  → missing workflows, error handling, or business rules
- undefined_input → unspecified fields, data types, actors, or constraints

OUTPUT RULES:
- Return at most 3 issues — prioritise by severity (highest confidence first)
- Each issue must have a UNIQUE root cause — no duplicates or near-duplicates
- Return exactly 2–3 clarifying questions (the single most valuable ones for an engineer)
- confidence_score must reflect implementation-readiness:
    0.75–0.95 → clear, complete, mostly testable
    0.45–0.74 → moderate gaps, some ambiguity
    0.20–0.44 → significant gaps, engineers will be blocked

Return ONLY this exact JSON — no markdown, no code fences, no extra text:
{{
  "issues": [
    {{
      "text": "short label (max 8 words)",
      "type": "ambiguity | missing_logic | undefined_input",
      "explanation": "One or two concrete sentences explaining the gap.",
      "confidence": 0.0
    }}
  ],
  "questions": [
    "Question 1?",
    "Question 2?"
  ],
  "confidence_score": 0.0
}}

PRD TO REVIEW:
---
{text}
---"""


# ── Rule engine ───────────────────────────────────────────────────────────────

def run_rule_engine(text: str):
    issues = []
    found_vague = [w for w in VAGUE_WORDS if re.search(r'\b' + re.escape(w) + r'\b', text, re.IGNORECASE)]

    if found_vague:
        top = found_vague[:2]
        issues.append({
            "text": f'Vague language: "{", ".join(top)}"',
            "type": "ambiguity",
            "explanation": (
                f'Terms like "{", ".join(top)}" are unmeasurable. '
                "Replace with concrete, testable criteria (e.g. response time < 200 ms)."
            ),
            "confidence": 0.80,
        })

    has_edge_cases = "edge case" in text.lower()
    if not has_edge_cases:
        issues.append({
            "text": "No edge cases mentioned",
            "type": "missing_logic",
            "explanation": "The specification does not address edge cases or failure scenarios. Add at least 2–3 error paths.",
            "confidence": 0.85,
        })

    return issues, has_edge_cases


# ── Deduplication ─────────────────────────────────────────────────────────────

def deduplicate(issues: list) -> list:
    seen_tokens: list[set] = []
    deduped = []
    for issue in issues:
        tokens = set(re.findall(r'\w+', issue.get("text", "").lower()))
        is_dup = any(len(tokens & s) >= 2 for s in seen_tokens)
        if not is_dup:
            seen_tokens.append(tokens)
            deduped.append(issue)
    return deduped


# ── Confidence + status ───────────────────────────────────────────────────────

def compute_confidence(issue_count: int, has_edge_cases: bool, llm_score: float) -> float:
    if issue_count > 4:
        base = 0.35
    elif issue_count >= 2:
        base = 0.55
    else:
        base = 0.80

    edge_bonus = 0.05 if has_edge_cases else 0.0
    rule_score = min(0.95, max(0.20, base + edge_bonus))

    if llm_score and llm_score != 0.5:
        final = round(rule_score * 0.4 + llm_score * 0.6, 2)
    else:
        final = round(rule_score, 2)

    return max(0.20, min(0.95, final))


def get_status(issue_count: int) -> str:
    if issue_count > 4:
        return "Low Quality PRD"
    elif issue_count >= 2:
        return "Needs Improvement"
    else:
        return "Ready for Engineering"


# ── Groq LLM call ─────────────────────────────────────────────────────────────

def call_groq(text: str) -> dict:
    if not GROQ_API_KEY:
        return {"issues": [], "questions": [], "confidence_score": 0.5}
    try:
        client   = Groq(api_key=GROQ_API_KEY)
        prompt   = build_prompt(text)
        response = client.chat.completions.create(
            model="compound-beta-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=900,
        )
        content = response.choices[0].message.content.strip()
        content = re.sub(r"^```[a-z]*\n?", "", content)
        content = re.sub(r"\n?```$", "", content)

        parsed = json.loads(content)
        return {
            "issues":           parsed.get("issues",   [])[:3],
            "questions":        parsed.get("questions", [])[:MAX_QUESTIONS],
            "confidence_score": float(parsed.get("confidence_score", 0.5)),
        }
    except Exception as e:
        print(f"Groq error: {e}")
        return {"issues": [], "questions": [], "confidence_score": 0.5}


# ── Supabase persistence ──────────────────────────────────────────────────────

def save_to_supabase(prd_text: str, issues: list, questions: list, confidence_score: float):
    client = get_supabase()
    if not client:
        return
    try:
        client.table("prd_analysis").insert({
            "prd_text":         prd_text,
            "issues":           json.dumps(issues),
            "questions":        json.dumps(questions),
            "confidence_score": confidence_score,
        }).execute()
    except Exception as e:
        print(f"Supabase save error: {e}")
        try:
            client.table("prd_analysis").insert({
                "prd_text":         prd_text,
                "confidence_score": confidence_score,
            }).execute()
        except Exception as e2:
            print(f"Supabase minimal save error: {e2}")


# ── Routes ────────────────────────────────────────────────────────────────────

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg = errors[0]["msg"].replace("Value error, ", "") if errors else "Invalid input"
    return JSONResponse(status_code=422, content={"detail": msg})


@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    text = req.prd_text

    rule_issues, has_edge_cases = run_rule_engine(text)
    llm_result  = call_groq(text)
    llm_issues  = llm_result.get("issues", [])
    questions   = llm_result.get("questions", [])[:MAX_QUESTIONS]
    llm_score   = llm_result.get("confidence_score", 0.5)

    combined = rule_issues + llm_issues
    combined.sort(key=lambda i: i.get("confidence", 0), reverse=True)
    deduped  = deduplicate(combined)[:MAX_ISSUES]

    confidence = compute_confidence(len(deduped), has_edge_cases, llm_score)
    status     = get_status(len(deduped))

    save_to_supabase(text, deduped, questions, confidence)

    return {
        "issues":           deduped,
        "questions":        questions,
        "confidence_score": confidence,
        "status":           status,
    }


def fetch_analyses_from_supabase(limit: int = 10) -> list:
    client = get_supabase()
    if not client:
        return []
    try:
        result = client.table("prd_analysis") \
            .select("id, prd_text, confidence_score, issues, questions, created_at") \
            .order("created_at", desc=True) \
            .limit(limit) \
            .execute()
        rows = result.data or []
        for row in rows:
            if isinstance(row.get("issues"), str):
                try:
                    row["issues"] = json.loads(row["issues"])
                except Exception:
                    row["issues"] = []
            if isinstance(row.get("questions"), str):
                try:
                    row["questions"] = json.loads(row["questions"])
                except Exception:
                    row["questions"] = []
        return rows
    except Exception as e:
        print(f"Supabase fetch error: {e}")
        return []


@app.get("/api/analyses")
def get_analyses():
    return {"analyses": fetch_analyses_from_supabase(10)}


@app.get("/api/history")
def get_history():
    rows = fetch_analyses_from_supabase(10)
    return [
        {
            "id":               r.get("id"),
            "prd_text":         r.get("prd_text", ""),
            "confidence_score": r.get("confidence_score", 0.5),
            "issues":           r.get("issues", []),
            "questions":        r.get("questions", []),
            "created_at":       r.get("created_at", ""),
        }
        for r in rows
    ]


@app.get("/api/healthz")
def healthz():
    return {"status": "ok"}
