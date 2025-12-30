import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { type DocumentType } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function clip(text: string, maxChars: number) {
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
  if (normalized.length <= maxChars) return normalized;
  return normalized.slice(0, maxChars) + '\n\n[TRUNCATED]';
}

export function clampDocumentType(v: string | null): DocumentType {
  return v === 'cv' ? 'cv' : 'jd';
}
