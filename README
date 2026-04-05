# 🤖 AI Resume Analyzer

> An AI-powered resume analysis tool that matches your CV against job descriptions using semantic similarity, skill detection, and experience extraction.

![Python](https://img.shields.io/badge/Python-3.10-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## ✨ Features

- 📄 **PDF Resume Upload** — drag and drop or click to browse
- 🧠 **Semantic AI Matching** — uses `all-MiniLM-L6-v2` sentence transformers to compute similarity between your resume and a job description
- 🎯 **Skill Detection** — identifies skills across 8 categories including DevOps, DevSecOps, AI/ML, Programming Languages, and more
- 📊 **Weighted Scoring** — overall score based on semantic match (40%), skill coverage (30%), experience (20%), and resume length (10%)
- 🔍 **Experience Extraction** — detects years of experience, job titles, and education from raw resume text
- 💡 **Smart Recommendations** — actionable tips to improve your resume for the specific role
- 📝 **Detailed Feedback** — AI-generated summary paragraph explaining your match
- 📱 **Responsive Design** — works on desktop and mobile
- 🔒 **No Data Storage** — resumes are analyzed in memory and never persisted to a database

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Axios, Tailwind CSS |
| Backend | Python 3.10, FastAPI, Uvicorn |
| AI / ML | Sentence Transformers (`all-MiniLM-L6-v2`), pdfplumber |
| DevOps | Docker, Docker Compose |
| Security | CORS middleware, input validation, file type enforcement |
| Code Quality | SonarQube |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Python 3.10+](https://www.python.org/)
- [Docker](https://www.docker.com/) (optional but recommended)

### Option 1 — Run with Docker (recommended)

```bash
# Clone the repository
git clone https://github.com/MalNko/ai-resume-analyzer.git
cd ai-resume-analyzer

# Start both services
docker-compose up --build
```

Then open [http://localhost:3000](http://localhost:3000)

---

### Option 2 — Run locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend** (in a separate terminal):
```bash
cd frontend
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
ai-resume-analyzer/
├── backend/
│   ├── main.py              # FastAPI app — analysis logic
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Global styles
│   ├── public/
│   │   └── index.html       # HTML shell
│   ├── package.json         # Node dependencies
│   └── Dockerfile           # Frontend container
├── docker-compose.yml       # Orchestrates both services
├── .env.example             # Environment variable template
└── README.md
```

---

## 🔍 How It Works

```
PDF Upload → Text Extraction (pdfplumber)
                    ↓
         Skill Detection (regex + keyword library)
                    ↓
         Experience Extraction (regex patterns)
                    ↓
    Semantic Encoding (all-MiniLM-L6-v2 embeddings)
                    ↓
       Cosine Similarity Score vs Job Description
                    ↓
         Weighted Score Calculation
                    ↓
    Recommendations + Feedback Generation → Response
```

---

## 📡 API Reference

### `GET /health`
Returns backend status.
```json
{ "status": "ok" }
```

### `POST /analyze`
Analyzes a resume against a job description.

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| `file` | PDF file | The resume to analyze |
| `job_desc` | string | The job description to match against |

**Response:**
```json
{
  "score": {
    "overall": 74.5,
    "semantic_match": 82.3,
    "skill_coverage": 64.0,
    "experience_score": 70.0
  },
  "skills_detected": {
    "DevOps & Cloud": ["docker", "aws", "ci/cd"],
    "Programming Languages": ["python", "javascript"]
  },
  "experience": {
    "years_of_experience": 0,
    "job_titles": ["software engineer", "developer"],
    "education": ["bachelor"]
  },
  "recommendations": ["Add quantifiable achievements..."],
  "detailed_feedback": "Your resume shows a strong match...",
  "resume_length": 2048,
  "message": "Analysis complete"
}
```

---

## 🔒 Security Practices

- PDF file type enforced on both frontend and backend
- Input validation on all API parameters
- CORS configured to allow only the frontend origin
- No resume data persisted to any database
- Environment variables never committed to version control (see `.env.example`)
- SonarQube static analysis integrated for code quality

---

## 🗺️ Roadmap

- [x] PDF upload and text extraction
- [x] Semantic similarity scoring
- [x] Skill detection across 8 categories
- [x] Experience extraction
- [x] Smart recommendations
- [x] Docker containerization
- [ ] ATS compatibility scoring
- [ ] Missing keyword highlighter
- [ ] Export results as PDF
- [ ] GitHub Actions CI/CD pipeline
- [ ] Rate limiting on API endpoints
- [ ] Job title role suggestion

---

## 👨‍💻 Author

**Malusi Nkosi**

[![GitHub](https://img.shields.io/badge/GitHub-MalNko-black?style=flat-square&logo=github)](https://github.com/MalNko)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Malusi_Nkosi-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/malusi-nkosi-6995a92b1/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-orange?style=flat-square)](https://software-dev-portfolio.netlify.app/)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.