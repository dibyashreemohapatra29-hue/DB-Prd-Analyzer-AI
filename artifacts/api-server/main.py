import os
import json
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY   = os.getenv("GROQ_API_KEY")
SUPABASE_URL   = os.getenv("SUPABASE_URL")
SUPABASE_KEY   = os.getenv("SUPABASE_KEY")

VAGUE_WORDS = [
    "fast", "scalable", "intuitive", "efficient",
    "simple", "easy", "seamless", "robust", "flexible",
]

MAX_ISSUES    = 5
MAX_QUESTIONS = 3


def get_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    try:
        from supabase import create_client
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Supabase init error: {e}")
        return None


class AnalyzeRequest(BaseModel):
    prd_text: str


def run_rule_engine(text: str) -> list:
    issues = []
    found_vague = []

    for word in VAGUE_WORDS:
        if re.search(r'\b' + re.escape(word) + r'\b', text, re.IGNORECASE):
            found_vague.append(word)

    if found_vague:
        top = found_vague[:2]
        issues.append({
            "text": f'Vague language: "{", ".join(top)}"',
            "type": "ambiguity",
            "explanation": (
                f'Terms like "{", ".join(top)}" are unmeasurable. '
                "Replace with concrete, testable criteria (e.g. response time < 200 ms)."
            ),
            "confidence": 0.8,
        })

    has_edge_cases = "edge case" in text.lower()
    if not has_edge_cases:
        issues.append({
            "text": "No edge cases mentioned",
            "type": "missing_logic",
            "explanation": "The specification does not address edge cases or failure scenarios. Consider at least 2–3 error paths.",
            "confidence": 0.85,
        })

    return issues, has_edge_cases


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


def compute_confidence(issues: list, has_edge_cases: bool, llm_score: float) -> float:
    base = 0.85
    penalty = len(issues) * 0.08
    edge_bonus = 0.05 if has_edge_cases else 0.0
    rule_score = max(0.30, min(0.95, base - penalty + edge_bonus))

    if llm_score and llm_score != 0.5:
        final = round((rule_score * 0.4 + llm_score * 0.6), 2)
    else:
        final = round(rule_score, 2)

    return max(0.20, min(0.95, final))


def call_groq(text: str) -> dict:
    if not GROQ_API_KEY:
        return {"issues": [], "questions": [], "confidence_score": 0.5}

    try:
        client = Groq(api_key=GROQ_API_KEY)

        prompt = f"""You are a senior product analyst. Analyze this PRD strictly and return JSON.

Rules:
- Return at most 3 issues — only the most critical ones
- Each issue must have a UNIQUE root cause (no duplicates)
- Return exactly 2-3 clarifying questions (the most important ones)
- confidence_score: 0.0–1.0 reflecting how implementation-ready this PRD is
  (0.8+ means clear and complete, 0.5 means significant gaps, below 0.4 means very poor)

Return this JSON shape only — no markdown, no code fences:
{{
  "issues": [
    {{"text": "short label", "type": "ambiguity|missing_logic|undefined_input", "explanation": "1-2 sentences", "confidence": 0.0-1.0}}
  ],
  "questions": ["question 1", "question 2"],
  "confidence_score": 0.0-1.0
}}

PRD:
---
{text}
---"""

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
            "issues": parsed.get("issues", [])[:3],
            "questions": parsed.get("questions", [])[:MAX_QUESTIONS],
            "confidence_score": float(parsed.get("confidence_score", 0.5)),
        }
    except Exception as e:
        print(f"Groq error: {e}")
        return {"issues": [], "questions": [], "confidence_score": 0.5}


def save_to_supabase(prd_text: str, issues: list, questions: list, confidence_score: float):
    client = get_supabase()
    if not client:
        return
    try:
        client.table("prd_analysis").insert({
            "prd_text":        prd_text,
            "issues":          json.dumps(issues),
            "questions":       json.dumps(questions),
            "confidence_score": confidence_score,
        }).execute()
    except Exception as e:
        print(f"Supabase save error: {e}")
        try:
            client.table("prd_analysis").insert({
                "prd_text":        prd_text,
                "confidence_score": confidence_score,
            }).execute()
            print("Supabase: saved with minimal fields")
        except Exception as e2:
            print(f"Supabase minimal save error: {e2}")


@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    text = req.prd_text.strip()

    rule_issues, has_edge_cases = run_rule_engine(text)
    llm_result   = call_groq(text)
    llm_issues   = llm_result.get("issues", [])
    questions    = llm_result.get("questions", [])[:MAX_QUESTIONS]
    llm_score    = llm_result.get("confidence_score", 0.5)

    combined = rule_issues + llm_issues
    combined.sort(key=lambda i: i.get("confidence", 0), reverse=True)
    deduped  = deduplicate(combined)[:MAX_ISSUES]

    confidence = compute_confidence(deduped, has_edge_cases, llm_score)

    save_to_supabase(text, deduped, questions, confidence)

    return {
        "issues":           deduped,
        "questions":        questions,
        "confidence_score": confidence,
    }


@app.get("/api/analyses")
def get_analyses():
    client = get_supabase()
    if not client:
        return {"analyses": []}
    try:
        result = client.table("prd_analysis") \
            .select("id, prd_text, confidence_score, issues, created_at") \
            .order("created_at", desc=True) \
            .limit(10) \
            .execute()
        return {"analyses": result.data}
    except Exception as e:
        print(f"Supabase fetch error: {e}")
        return {"analyses": []}


@app.get("/api/healthz")
def healthz():
    return {"status": "ok"}
