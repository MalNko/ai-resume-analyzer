import React, { useState, useRef } from "react";
import axios from "axios";

const COLORS = {
  green:  { bg: "#f0fdf4", border: "#86efac", text: "#15803d", bar: "#22c55e" },
  amber:  { bg: "#fffbeb", border: "#fcd34d", text: "#92400e", bar: "#f59e0b" },
  red:    { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b", bar: "#ef4444" },
};

function getColor(score) {
  if (score >= 75) return COLORS.green;
  if (score >= 50) return COLORS.amber;
  return COLORS.red;
}

function getLabel(score) {
  if (score >= 75) return "Strong Match";
  if (score >= 50) return "Moderate Match";
  return "Weak Match";
}

function ScoreRing({ score }) {
  const c = getColor(score);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={c.bar} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="70" y="64" textAnchor="middle" fontSize="26" fontWeight="700" fill="#0f172a">{score}%</text>
      <text x="70" y="84" textAnchor="middle" fontSize="11" fill="#94a3b8">{getLabel(score)}</text>
    </svg>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div style={{ background: "#f1f5f9", borderRadius: 999, height: 7, overflow: "hidden" }}>
      <div style={{
        width: `${value}%`, height: "100%",
        background: color, borderRadius: 999,
        transition: "width 1s ease"
      }} />
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 14, padding: "1rem", textAlign: "center",
      flex: 1
    }}>
      <div style={{ fontSize: "1.6rem", fontWeight: 700, color }}>{value}%</div>
      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 18, padding: "1.5rem", marginBottom: "1rem"
    }}>
      <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function App() {
  const [file, setFile]       = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [activeTab, setTab]   = useState("skills");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (f && f.name.endsWith(".pdf")) { setFile(f); setError(null); }
    else setError("Only PDF files are supported.");
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file)          { setError("Please upload a resume PDF."); return; }
    if (!jobDesc.trim()) { setError("Please paste a job description."); return; }
    setError(null); setResult(null); setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("job_desc", jobDesc);
      const res = await axios.post("/analyze", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      setTab("skills");
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const TABS = ["skills", "experience", "feedback", "tips"];

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: "2rem 1rem"
    }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{
          background: "#0f172a", borderRadius: 20, padding: "1.75rem 2rem",
          marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 16
        }}>
          <div style={{
            width: 46, height: 46, background: "#3b82f6",
            borderRadius: 12, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22, flexShrink: 0
          }}>🤖</div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#f8fafc" }}>
              AI Resume Analyzer
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#94a3b8" }}>
              Powered by semantic AI — upload your CV and a job description to get your match score
            </p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span style={{
              background: "#064e3b", color: "#6ee7b7",
              borderRadius: 999, padding: "4px 12px", fontSize: "0.72rem", fontWeight: 600
            }}>● Live</span>
          </div>
        </div>

        {/* ── Upload Card ── */}
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 18, padding: "1.5rem", marginBottom: "1rem"
        }}>

          {/* Drop Zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragging ? "#3b82f6" : file ? "#86efac" : "#cbd5e1"}`,
              borderRadius: 14, padding: "1.75rem",
              textAlign: "center", cursor: "pointer",
              background: dragging ? "#eff6ff" : file ? "#f0fdf4" : "#f8fafc",
              marginBottom: "1.25rem", transition: "all 0.2s"
            }}
          >
            <input
              ref={fileRef} type="file" accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div style={{ fontSize: 28, marginBottom: 8 }}>{file ? "✅" : "📄"}</div>
            {file ? (
              <>
                <div style={{ fontWeight: 600, color: "#15803d", fontSize: "0.9rem" }}>{file.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#86efac", marginTop: 4 }}>
                  {(file.size / 1024).toFixed(1)} KB — click to change
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}>
                  Drop your resume here
                </div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>
                  PDF only · max 5MB · or click to browse
                </div>
              </>
            )}
          </div>

          {/* Job Description */}
          <label htmlFor="jd" style={{
            display: "block", fontSize: "0.82rem", fontWeight: 600,
            color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em"
          }}>
            Job Description
          </label>
          <textarea
            id="jd"
            placeholder="Paste the full job description here for the best results..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            style={{
              width: "100%", height: 130, padding: "0.875rem",
              border: "1px solid #e2e8f0", borderRadius: 12,
              resize: "vertical", fontSize: "0.875rem",
              color: "#334155", background: "#f8fafc",
              boxSizing: "border-box", outline: "none",
              lineHeight: 1.6, fontFamily: "inherit"
            }}
          />

          {/* Character count */}
          <div style={{ fontSize: "0.72rem", color: "#94a3b8", textAlign: "right", marginTop: 4 }}>
            {jobDesc.length} characters
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fca5a5",
              color: "#991b1b", borderRadius: 10, padding: "0.75rem 1rem",
              fontSize: "0.85rem", marginTop: "0.75rem", display: "flex",
              alignItems: "center", gap: 8
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: "1rem", width: "100%", padding: "0.9rem",
              background: loading ? "#94a3b8" : "#0f172a",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: "0.95rem", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, transition: "background 0.2s"
            }}
          >
            {loading ? (
              <>
                <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
                Analyzing — this may take 15–20 seconds...
              </>
            ) : (
              <> Analyze Resume &nbsp;→ </>
            )}
          </button>
        </div>

        {/* ── Results ── */}
        {result && (
          <>
            {/* Score Hero */}
            <div style={{
              background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 18, padding: "1.75rem",
              marginBottom: "1rem", textAlign: "center"
            }}>
              <ScoreRing score={result.score.overall} />
              <div style={{
                display: "flex", gap: 10, justifyContent: "center",
                marginTop: "1.25rem", flexWrap: "wrap"
              }}>
                <MetricCard label="Semantic Match"  value={result.score.semantic_match}  color={getColor(result.score.semantic_match).bar} />
                <MetricCard label="Skill Coverage"  value={result.score.skill_coverage}  color={getColor(result.score.skill_coverage).bar} />
                <MetricCard label="Experience"       value={result.score.experience_score} color={getColor(result.score.experience_score).bar} />
              </div>

              {/* Breakdown bars */}
              <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                {[
                  { label: "Semantic match", value: result.score.semantic_match },
                  { label: "Skill coverage", value: result.score.skill_coverage },
                  { label: "Experience score", value: result.score.experience_score },
                ].map(({ label, value }) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: "0.82rem", color: "#64748b" }}>{label}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: getColor(value).bar }}>{value}%</span>
                    </div>
                    <ProgressBar value={value} color={getColor(value).bar} />
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Bar */}
            <div style={{ display: "flex", gap: 6, marginBottom: "1rem", flexWrap: "wrap" }}>
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "7px 18px", borderRadius: 999,
                    border: activeTab === t ? "none" : "1px solid #e2e8f0",
                    background: activeTab === t ? "#0f172a" : "#fff",
                    color: activeTab === t ? "#fff" : "#64748b",
                    fontSize: "0.82rem", fontWeight: 500, cursor: "pointer",
                    textTransform: "capitalize", transition: "all 0.15s"
                  }}
                >
                  {t === "skills" && "🎯 "}
                  {t === "experience" && "🔍 "}
                  {t === "feedback" && "📝 "}
                  {t === "tips" && "💡 "}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <SectionCard title="Skills detected on your resume">
                {Object.keys(result.skills_detected).length === 0 ? (
                  <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No skills detected.</p>
                ) : (
                  Object.entries(result.skills_detected).map(([cat, skills]) => (
                    <div key={cat} style={{ marginBottom: "1.1rem" }}>
                      <div style={{
                        fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8",
                        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8
                      }}>{cat}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {skills.map((s) => (
                          <span key={s} style={{
                            background: "#f0fdf4", color: "#15803d",
                            border: "1px solid #86efac", borderRadius: 999,
                            padding: "3px 12px", fontSize: "0.8rem", fontWeight: 500
                          }}>✓ {s}</span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </SectionCard>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <SectionCard title="Experience extracted from your resume">
                {[
                  { key: "Years of experience", val: result.experience.years_of_experience > 0 ? `${result.experience.years_of_experience} years` : "Not detected" },
                  { key: "Job titles found", val: result.experience.job_titles.length > 0 ? result.experience.job_titles.join(", ") : "None detected" },
                  { key: "Education", val: result.experience.education.length > 0 ? result.experience.education.join(", ") : "Not detected" },
                ].map(({ key, val }) => (
                  <div key={key} style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", padding: "12px 0",
                    borderBottom: "1px solid #f1f5f9", gap: 16
                  }}>
                    <span style={{ fontSize: "0.85rem", color: "#94a3b8", flexShrink: 0 }}>{key}</span>
                    <span style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: 500, textAlign: "right" }}>{val}</span>
                  </div>
                ))}
              </SectionCard>
            )}

            {/* Feedback Tab */}
            {activeTab === "feedback" && (
              <SectionCard title="Detailed AI feedback">
                <div style={{
                  background: "#f8fafc", borderRadius: 12, padding: "1rem",
                  fontSize: "0.875rem", color: "#334155", lineHeight: 1.8
                }}>
                  {result.detailed_feedback}
                </div>
              </SectionCard>
            )}

            {/* Tips Tab */}
            {activeTab === "tips" && (
              <SectionCard title="Smart recommendations">
                {result.recommendations.map((rec, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, padding: "0.875rem",
                    background: "#fffbeb", border: "1px solid #fcd34d",
                    borderRadius: 12, marginBottom: 8, alignItems: "flex-start"
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#78350f", lineHeight: 1.6 }}>{rec}</p>
                  </div>
                ))}
              </SectionCard>
            )}

            {/* Reset */}
            <button
              onClick={() => { setResult(null); setFile(null); setJobDesc(""); setError(null); }}
              style={{
                width: "100%", padding: "0.75rem",
                background: "transparent", color: "#94a3b8",
                border: "1px solid #e2e8f0", borderRadius: 12,
                fontSize: "0.85rem", cursor: "pointer", marginBottom: "2rem"
              }}
            >
              ↺ Analyze another resume
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        textarea:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        button:hover:not(:disabled) { opacity: 0.88; }
      `}</style>
    </div>
  );
}