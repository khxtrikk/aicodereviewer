import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function reviewCode(
  prTitle: string,
  files: {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    patch?: string;
  }[]
): Promise<{ summary: string; riskScore: number; comments: any[] }> {

  const filesSummary = files
    .map((f) => `File: ${f.filename}\nStatus: ${f.status}\nPatch:\n${f.patch ?? "No patch"}`)
    .join("\n\n---\n\n");

  const prompt = `
    You are an expert code reviewer. Review this pull request and respond ONLY with valid JSON, no markdown.

    PR Title: ${prTitle}

    Changed Files:
    ${filesSummary}

    Respond with this exact JSON format:
    {
      "summary": "brief summary of changes",
      "riskScore": 5,
      "comments": [
        {
          "file": "file.ts",
          "line": 10,
          "comment": "your comment here"
        }
      ]
    }
  `;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text);
}