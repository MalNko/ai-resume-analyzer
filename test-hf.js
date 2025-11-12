import fetch from "node-fetch"; // if using Node 18+, fetch is built-in, so you can remove this line
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return await response.json();
}

async function main() {
  console.log("🔑 HF_TOKEN prefix:", process.env.HF_TOKEN?.slice(0, 8) + "...");
  try {
    const result = await query({
      inputs: "I love programming in JavaScript!",
      parameters: { candidate_labels: ["coding", "sports", "politics"] },
    });

    console.log("✅ Hugging Face Response:");
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();
