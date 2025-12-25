'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold text-zinc-100">Something went wrong</h1>
      <p className="mt-2 text-sm text-zinc-400">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
      >
        Try again
      </button>
    </main>
  );
}
