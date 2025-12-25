// Extracts and parses JSON from a given text, handling optional code fences.
export function extractJson(text: string): unknown {
  const trimmed = text.trim();

  // Strip ```json fences if present
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenceMatch ? fenceMatch[1] : trimmed;

  return JSON.parse(candidate);
}
