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

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
VAGUE_WORDS = ["fast", "scalable", "intuitive", "efficient", "simple", "easy", "seamless", "robust", "flexible"]


class AnalyzeRequest(BaseModel):
    prd_text: str


def run_rule_engine(text: str) -> list:
    issues = []

    for word in VAGUE_WORDS:
        if re.search(r'\b' + re.escape(word) + r'\b', text, re.IGNORECASE):
            issues.append({
                "text": word,
                "type": "ambiguity",
                "explanation": f'"{word}" is vague and unmeasurable. Replace with a concrete, testable criterion.',
                "confidence": 0.7,
            })

    if "edge case" not in text.lower():
        issues.append({
            "text": "No edge cases mentioned",
            "type": "missing_logic",
            "explanation": "The specification does not address edge cases or failure scenarios.",
            "confidence": 0.85,
        })

    return issues


def call_groq(text: str) -> dict:
    if not GROQ_API_KEY:
        return {"issues": [], "questions": [], "confidence_score": 0.5}

    try:
        client = Groq(api_key=GROQ_API_KEY)

        prompt = f"""You are a senior product analyst reviewing a PRD for clarity and completeness.

Analyze the following PRD and return a JSON object with exactly these fields:
- "issues": array of objects, each with: "text" (short label), "type" (one of: ambiguity, missing_logic, undefined_input), "explanation" (1-2 sentences), "confidence" (0.0–1.0)
- "questions": array of strings (3–5 clarifying questions an engineer would need answered)
- "confidence_score": a single number 0.0–1.0 representing overall PRD clarity and completeness

PRD to analyze:
---
{text}
---

Return ONLY valid JSON with no markdown, no code blocks, no extra text."""

        response = client.chat.completions.create(
            model="compound-beta-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1200,
        )

        content = response.choices[0].message.content.strip()

        content = re.sub(r"^```[a-z]*\n?", "", content)
        content = re.sub(r"\n?```$", "", content)

        parsed = json.loads(content)
        return {
            "issues": parsed.get("issues", []),
            "questions": parsed.get("questions", []),
            "confidence_score": float(parsed.get("confidence_score", 0.5)),
        }
    except Exception as e:
        print(f"Groq error: {e}")
        return {"issues": [], "questions": [], "confidence_score": 0.5}


@app.post("/api/analyze")
def analyze(req: AnalyzeRequest):
    text = req.prd_text.strip()

    rule_issues = run_rule_engine(text)
    llm_result = call_groq(text)

    all_issues = rule_issues + llm_result.get("issues", [])

    seen = set()
    deduped = []
    for issue in all_issues:
        key = issue.get("text", "").lower()
        if key not in seen:
            seen.add(key)
            deduped.append(issue)

    return {
        "issues": deduped,
        "questions": llm_result.get("questions", []),
        "confidence_score": llm_result.get("confidence_score", 0.5),
    }


@app.get("/api/healthz")
def healthz():
    return {"status": "ok"}
