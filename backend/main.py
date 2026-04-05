from typing import Annotated
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
from sentence_transformers import SentenceTransformer, util
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer('all-MiniLM-L6-v2')

# ── Skill Library ────────────────────────────────────────────────────────────
SKILL_LIBRARY = {
    "Programming Languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "go",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab"
    ],
    "Frontend": [
        "react", "vue", "angular", "next.js", "html", "css", "tailwind",
        "sass", "redux", "webpack", "vite"
    ],
    "Backend": [
        "node.js", "fastapi", "django", "flask", "express", "spring",
        "graphql", "rest", "api", "microservices"
    ],
    "Databases": [
        "mongodb", "postgresql", "mysql", "sqlite", "redis", "elasticsearch",
        "firebase", "supabase", "dynamodb"
    ],
    "DevOps & Cloud": [
        "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "github actions",
        "jenkins", "terraform", "ansible", "linux", "nginx", "prometheus", "grafana"
    ],
    "DevSecOps": [
        "sonarqube", "owasp", "sast", "dast", "snyk", "trivy", "vault",
        "security scanning", "penetration testing", "iam", "zero trust"
    ],
    "AI & ML": [
        "machine learning", "deep learning", "tensorflow", "pytorch",
        "scikit-learn", "nlp", "computer vision", "hugging face", "llm"
    ],
    "Soft Skills": [
        "leadership", "communication", "teamwork", "problem solving",
        "agile", "scrum", "project management", "collaboration"
    ],
}

# ── Helpers ──────────────────────────────────────────────────────────────────

def extract_text(file) -> str:
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted
    return text


def detect_skills(text: str) -> dict:
    """Return matched skills grouped by category."""
    text_lower = text.lower()
    matched = {}
    for category, skills in SKILL_LIBRARY.items():
        found = [s for s in skills if re.search(rf'\b{re.escape(s)}\b', text_lower)]
        if found:
            matched[category] = found
    return matched


def extract_experience(text: str) -> dict:
    """Extract years of experience and job titles."""
    year_patterns = [
        r'(\d+)\+?\s*years?\s*of\s*experience',
        r'(\d+)\+?\s*years?\s*experience',
        r'experience\s*of\s*(\d+)\+?\s*years?',
    ]
    years = 0
    for pattern in year_patterns:
        match = re.search(pattern, text.lower())
        if match:
            years = int(match.group(1))
            break

    titles = [
        "software engineer", "developer", "devops engineer", "data scientist",
        "product manager", "designer", "architect", "analyst", "consultant",
        "intern", "junior", "senior", "lead", "manager", "director", "cto", "ceo"
    ]
    found_titles = [t for t in titles if t in text.lower()]

    education_keywords = ["bachelor", "master", "phd", "diploma", "degree",
                          "b.sc", "m.sc", "b.eng", "honours"]
    education = [e for e in education_keywords if e in text.lower()]

    return {
        "years_of_experience": years,
        "job_titles": found_titles,
        "education": education
    }


def calculate_score(match_score: float, resume_skills: dict, job_text: str, experience: dict) -> dict:
    """
    Score breakdown:
      - Semantic match:  40%
      - Skill coverage:  30%
      - Experience:      20%
      - Resume length:   10%
    """
    job_lower = job_text.lower()
    all_resume_skills = [s for skills in resume_skills.values() for s in skills]
    matched_to_job = [s for s in all_resume_skills if s in job_lower]
    skill_score = (len(matched_to_job) / max(len(all_resume_skills), 1)) * 100

    years = experience.get("years_of_experience", 0)
    exp_score = min(years * 10, 100)

    total = (
        (match_score * 0.40) +
        (skill_score * 0.30) +
        (exp_score   * 0.20) +
        (min(len(" ".join(all_resume_skills)) / 5, 100) * 0.10)
    )

    return {
        "overall": round(total, 2),
        "semantic_match": round(match_score, 2),
        "skill_coverage": round(skill_score, 2),
        "experience_score": round(exp_score, 2),
    }


def generate_recommendations(
    resume_skills: dict,
    job_text: str,
    score: dict,
    experience: dict
) -> list:
    recommendations = []
    job_lower = job_text.lower()

    missing = []
    for category, skills in SKILL_LIBRARY.items():
        for skill in skills:
            if skill in job_lower:
                resume_has = any(skill in s for s in resume_skills.get(category, []))
                if not resume_has:
                    missing.append(skill)

    if missing:
        recommendations.append(
            f"Consider adding these skills mentioned in the job description: {', '.join(missing[:5])}"
        )

    if score["semantic_match"] < 50:
        recommendations.append(
            "Your resume language doesn't closely match the job description. "
            "Try mirroring keywords from the job posting."
        )

    if experience.get("years_of_experience", 0) == 0:
        recommendations.append(
            "No years of experience detected. Add a clear statement like "
            "'3 years of experience in...' to improve ATS matching."
        )

    if not experience.get("education"):
        recommendations.append(
            "Consider adding your educational qualifications explicitly."
        )

    if score["skill_coverage"] < 40:
        recommendations.append(
            "Low skill overlap with the job description. "
            "Tailor your skills section to match what the role requires."
        )

    if not any("leadership" in s or "teamwork" in s
               for s in resume_skills.get("Soft Skills", [])):
        recommendations.append(
            "Add soft skills like leadership, communication, or teamwork "
            "to strengthen your profile."
        )

    if not recommendations:
        recommendations.append(
            "Great match! Make sure your resume has quantifiable achievements "
            "(e.g. 'Reduced deployment time by 40%')."
        )

    return recommendations


def generate_feedback(score: dict, resume_skills: dict, experience: dict) -> str:
    overall = score["overall"]
    total_skills = sum(len(v) for v in resume_skills.values())
    years = experience.get("years_of_experience", 0)

    if overall >= 75:
        strength = "strong"
    elif overall >= 50:
        strength = "moderate"
    else:
        strength = "weak"

    return (
        f"Your resume shows a {strength} match for this role with an overall score of {overall}%. "
        f"We detected {total_skills} relevant skills across {len(resume_skills)} categories. "
        f"{'You have ' + str(years) + ' years of experience mentioned. ' if years > 0 else 'No explicit years of experience were found. '}"
        f"Semantic alignment between your resume and the job description is {score['semantic_match']}%, "
        f"and your skill coverage against the job posting is {score['skill_coverage']}%."
    )


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze(
    file: Annotated[UploadFile, File()],
    job_desc: Annotated[str, Form()]
):
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files are supported."}

    if not job_desc or not job_desc.strip():
        return {"error": "Job description cannot be empty."}

    resume_text = extract_text(file.file)

    if not resume_text.strip():
        return {"error": "Could not extract text from the PDF. It may be image-based."}

    resume_embedding = model.encode(resume_text)
    job_embedding    = model.encode(job_desc)
    semantic_score   = util.cos_sim(resume_embedding, job_embedding).item() * 100

    skills          = detect_skills(resume_text)
    experience      = extract_experience(resume_text)
    score           = calculate_score(semantic_score, skills, job_desc, experience)
    recommendations = generate_recommendations(skills, job_desc, score, experience)
    feedback        = generate_feedback(score, skills, experience)

    return {
        "score": score,
        "skills_detected": skills,
        "experience": experience,
        "recommendations": recommendations,
        "detailed_feedback": feedback,
        "resume_length": len(resume_text),
        "message": "Analysis complete"
    }