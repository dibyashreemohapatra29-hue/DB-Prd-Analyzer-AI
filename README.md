# PRD Analyzer — Bridging the PM ↔ Engineering Gap

## 📌 Problem Statement

Product Requirement Documents (PRDs) are often the source of misalignment between product managers and engineers. 

Common issues include:
- Ambiguous language ("fast", "scalable")
- Missing edge cases
- Undefined assumptions
- Lack of implementation clarity

This leads to:
- Back-and-forth communication
- Delayed development cycles
- Reduced trust between teams

---

## 🎯 Objective

Build a system that helps product managers validate PRDs **before sharing with engineers**, ensuring clarity, completeness, and implementation readiness.

---

## 👤 User

**Primary User:** Product Manager

---

## ⚡ Trigger Moment

> “This PRD isn’t clear enough to build.”

---

## 🧠 Job To Be Done (JTBD)

When I write a PRD,  
I want to identify unclear or missing parts before sharing it,  
so engineers can implement it correctly the first time.

---

## 💡 Solution Overview

PRD Analyzer is an AI-assisted tool that:
- Analyzes PRDs for clarity and completeness
- Identifies ambiguity and missing logic
- Generates engineer-like clarifying questions
- Provides a confidence score and readiness status
- Stores and tracks past analyses

---

## 🚀 Key Features

### 1. Structured PRD Analysis
- Detects:
  - Ambiguity
  - Missing logic
  - Undefined inputs
  - Missing edge cases

---

### 2. Engineer Perspective Simulation
- Generates 2–3 realistic clarifying questions
- Mimics what engineers would ask before implementation

---

### 3. Confidence & Status System
- Confidence score based on clarity
- Status classification:
  - Low Quality PRD
  - Needs Improvement
  - Ready for Engineering

---

### 4. Rule + AI Hybrid Logic
- Rule-based checks (fast, deterministic)
- LLM-based reasoning (contextual understanding)

---

### 5. History & Admin Dashboard
- Stores past analyses
- Displays:
  - PRD preview
  - confidence score
  - issue count
  - timestamp

---

### 6. Clean UX with Structured Output
- Summary-first design
- Tab-based detailed exploration
- Reduced cognitive overload

---

## 🏗️ Product Architecture
Frontend (UI)
↓
Input Validation
↓
Processing Layer (text cleaning)
↓
Rule Engine (pre-AI logic)
↓
Prompt Construction
↓
LLM API (Groq)
↓
Output Parsing
↓
Confidence & Status Logic
↓
Database (Supabase)
↓
Structured UI Output

---

## ⚙️ Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: FastAPI (Python)
- LLM: Groq (groq-compound-mini)
- Database: Supabase
- Hosting: Replit
- Version Control: GitHub

---

## 🔍 How It Works

1. User inputs PRD (text or structured input)
2. System validates input
3. Rule engine flags obvious issues (e.g., vague terms)
4. Prompt is constructed for LLM
5. LLM analyzes PRD and generates:
   - issues
   - questions
   - confidence score
6. Output is parsed and structured
7. Confidence + status assigned
8. Data stored in database
9. Results displayed in UI
10. History updated for future reference

---

## 🧪 Example Output

- Ambiguity detected: "fast", "scalable"
- Missing edge cases
- 2–3 clarifying questions
- Confidence score: 62%
- Status: Needs Improvement

---

## 📊 Impact

### For Product Managers:
- Faster PRD validation
- Reduced rework
- Increased clarity before handoff

### For Engineering Teams:
- Fewer clarification cycles
- Better implementation readiness
- Improved trust in PRDs

---

## 🧠 Design Decisions

- Combined rule-based + AI approach to avoid over-reliance on LLM
- Limited output (max issues/questions) to prevent over-flagging
- Summary-first UI to reduce cognitive load
- Confidence scoring tied to logic, not just AI output

---

## 🚧 Limitations

- LLM output may vary slightly across runs
- Complex PRDs may require deeper domain-specific logic
- File parsing (if added) is basic and not fully robust

---

## 🔮 Future Scope

- Support for document uploads (.docx parsing)
- Team-level analytics (common PRD mistakes)
- Custom rules per organization
- Integration with tools like Jira, Notion, Slack
- PRD auto-suggestions / rewriting
- Multi-agent AI (PM + Engineer simulation)

---

## 🏁 Conclusion

This project focuses on solving a real-world workflow gap between product and engineering teams.

Instead of building a generic AI tool, the approach prioritizes:
- structured thinking
- practical usability
- real-world applicability

The system demonstrates how AI can be meaningfully integrated into workflows—not as a gimmick, but as a **decision-support layer**.

With further iteration, this can evolve into a full-fledged product that improves how teams communicate and build software together.

---

## 🎥 Demo

https://www.loom.com/share/c02877da4b414baf89ab26d8bde23a60

---

## 🔗 Repository

https://github.com/dibyashreemohapatra29-hue/DB-Prd-Analyzer-AI
