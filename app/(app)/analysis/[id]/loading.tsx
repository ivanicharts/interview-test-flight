export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 rounded bg-zinc-800" />
        <div className="h-4 w-80 rounded bg-zinc-800" />
        <div className="h-40 rounded-xl bg-zinc-900" />
        <div className="h-80 rounded-xl bg-zinc-900" />
      </div>
    </main>
  );
}
