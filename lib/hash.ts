import crypto from 'crypto';

// Generates a SHA-256 hash for the combined job description and CV texts
export function hashInputs(jdText: string, cvText: string) {
  return crypto
    .createHash('sha256')
    .update(jdText + '\n---\n' + cvText)
    .digest('hex');
}
