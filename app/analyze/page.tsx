'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
// import type { MatchReport } from "@/lib/types";
// import { saveReport } from "@/lib/reportStorage";

// type ApiOk = { reportId?: string; report: MatchReport; cached?: boolean };
type ApiErr = { error: string; details?: any };

function makeFallbackId() {
  // Quick client-side id if backend doesn't return one
  return globalThis.crypto?.randomUUID?.() ?? `r_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function AnalyzePage() {
  const router = useRouter();

  const [jdText, setJdText] = React.useState('');
  const [cvText, setCvText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [serverDetails, setServerDetails] = React.useState<any>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setServerDetails(null);

    // if (jdText.trim().length < 200) {
    //   setError("Job Description is too short (min ~200 chars).");
    //   return;
    // }
    // if (cvText.trim().length < 200) {
    //   setError("CV is too short (min ~200 chars).");
    //   return;
    // }

    // setIsLoading(true);
    // try {
    //   const res = await fetch("/api/analyze", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ jdText, cvText }),
    //   });

    //   const data = (await res.json()) as ApiOk | ApiErr;

    //   if (!res.ok) {
    //     const err = (data as ApiErr)?.error ?? "Request failed";
    //     setError(err);
    //     setServerDetails((data as ApiErr)?.details ?? null);
    //     return;
    //   }

    //   const ok = data as ApiOk;
    //   const reportId = ok.reportId ?? makeFallbackId();

    //   saveReport(reportId, ok.report);

    //   router.push(`/report/${encodeURIComponent(reportId)}`);
    // } catch (err: any) {
    //   setError(err?.message ?? "Unexpected error");
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Interview Test Flight — Analyze</h1>
      <p className="mt-2 text-sm text-gray-600">
        Paste a Job Description and your CV. You’ll get a structured match report (score, evidence, gaps, and rewrites).
      </p>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="font-medium text-red-800">Error</div>
          <div className="mt-1 text-sm text-red-700">{error}</div>
          {serverDetails ? (
            <pre className="mt-3 overflow-auto rounded bg-white/60 p-3 text-xs text-red-800">
              {JSON.stringify(serverDetails, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div className="rounded-xl border bg-white p-4">
          <label className="block text-sm font-medium">Job Description</label>
          <textarea
            className="mt-2 h-56 w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            placeholder="Paste the full JD here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            disabled={isLoading}
          />
          <div className="mt-2 text-xs text-gray-500">{jdText.trim().length} chars</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <label className="block text-sm font-medium">Your CV</label>
          <textarea
            className="mt-2 h-56 w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            placeholder="Paste your CV here..."
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            disabled={isLoading}
          />
          <div className="mt-2 text-xs text-gray-500">{cvText.trim().length} chars</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>

          {isLoading ? (
            <div className="text-sm text-gray-600">
              Generating report… (schema-validated)
              <span className="ml-2 inline-block animate-pulse">●</span>
            </div>
          ) : null}
        </div>
      </form>

      <div className="mt-8 rounded-xl border bg-gray-50 p-4">
        <div className="text-sm font-medium">Tips for better results</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Paste the entire JD (responsibilities + requirements).</li>
          <li>Paste CV as plain text (bullets are fine).</li>
          <li>Keep it honest: the report should only cite what’s present in the CV.</li>
        </ul>
      </div>
    </div>
  );
}
