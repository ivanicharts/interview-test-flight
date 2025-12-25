// Prompt builders for AI interactions
export function buildAnalyzePrompt(jdText: string, cvText: string) {
  return `
You are Interview Test Flight. Compare the Job Description and CV.

Return ONLY valid JSON. No markdown. No extra text.

Rules:
- Score must be evidence-based.
- Do NOT invent experience.
- Gaps must be based on JD requirements that are missing in CV.
- Keep items concise.

Job Description:
${jdText}

CV:
${cvText}
`.trim();
}

// Prompt to fix malformed JSON output from AI
export function buildFixJsonPrompt(badOutput: string) {
  return `
Fix the following output to be valid JSON that matches the required schema.
Return ONLY JSON. No markdown. No commentary.

Bad output:
${badOutput}
`.trim();
}
