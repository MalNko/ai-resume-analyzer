import fetch from "node-fetch";

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
  return await response.json();
}

query({
  inputs: "I bought a phone but it stopped working.",
  parameters: { candidate_labels: ["refund", "technical", "faq"] },
}).then(console.log);
