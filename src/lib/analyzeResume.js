import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_API_KEY);

async function analyzeResume(resumeText) {
  try {
    console.log("📌 Resume text loaded...");

    // 1️⃣ Zero-Shot Classification (job fit check)
    const labels = ["Software Engineer", "Cloud Engineer", "Data Scientist", "Frontend Developer", "Backend Developer"];
    const classification = await hf.zeroShotClassification({
      model: "facebook/bart-large-mnli",
      inputs: resumeText,
      parameters: { candidate_labels: labels }
    });

    console.log("\n🎯 Zero-Shot Classification Results:");
    classification.labels.forEach((label, idx) => {
      console.log(`- ${label}: ${(classification.scores[idx] * 100).toFixed(2)}%`);
    });

    // 2️⃣ Summarization (profile summary)
    const summary = await hf.summarization({
      model: "facebook/bart-large-cnn",
      inputs: resumeText,
      parameters: { max_length: 100, min_length: 30 }
    });

    console.log("\n📝 Resume Summary:");
    console.log(summary[0].summary_text);

  } catch (err) {
    console.error("❌ Error:", err);
  }
}

// Example resume text (replace with real input later)
const resumeSample = `
Malusi Nkosi is a Software Engineer with experience in Python, Node.js, and cloud technologies.
He has worked on AI integration projects and is pursuing a career in DevOps and Cloud Engineering.
He has built an AI Resume Analyzer and contributed to open-source ML tools on Hugging Face.
`;

analyzeResume(resumeSample);
