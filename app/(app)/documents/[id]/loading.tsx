export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
      <div className="bg-muted h-8 w-48 animate-pulse rounded" />
      <div className="bg-muted mt-4 h-100 animate-pulse rounded" />
    </div>
  );
}
