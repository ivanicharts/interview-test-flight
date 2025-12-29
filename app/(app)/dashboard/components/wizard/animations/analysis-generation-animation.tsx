export const AnalysisLoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Animated Document Comparison Visualization */}
      <div className="relative h-32 w-64">
        {/* CV Document - Left */}
        <div className="absolute top-1/2 left-0 h-24 w-20 -translate-y-1/2 animate-pulse rounded-lg border-2 border-blue-500/40 bg-gradient-to-br from-blue-500/20 to-blue-600/20 shadow-lg">
          <div className="absolute inset-2 space-y-1">
            <div className="h-1 animate-pulse rounded bg-blue-500/60" style={{ animationDelay: '0s' }} />
            <div className="h-1 animate-pulse rounded bg-blue-500/40" style={{ animationDelay: '0.1s' }} />
            <div
              className="h-1 w-3/4 animate-pulse rounded bg-blue-500/60"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="h-1 w-1/2 animate-pulse rounded bg-blue-500/40"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
        </div>

        {/* JD Document - Right */}
        <div
          className="absolute top-1/2 right-0 h-24 w-20 -translate-y-1/2 animate-pulse rounded-lg border-2 border-purple-500/40 bg-gradient-to-br from-purple-500/20 to-purple-600/20 shadow-lg"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="absolute inset-2 space-y-1">
            <div className="h-1 animate-pulse rounded bg-purple-500/60" style={{ animationDelay: '0.4s' }} />
            <div className="h-1 animate-pulse rounded bg-purple-500/40" style={{ animationDelay: '0.5s' }} />
            <div
              className="h-1 w-3/4 animate-pulse rounded bg-purple-500/60"
              style={{ animationDelay: '0.6s' }}
            />
            <div
              className="h-1 w-1/2 animate-pulse rounded bg-purple-500/40"
              style={{ animationDelay: '0.7s' }}
            />
          </div>
        </div>

        {/* Animated Connection Lines */}
        <div className="absolute top-1/2 left-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 opacity-60">
            <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
        </div>

        {/* AI Brain Icon in Center */}
        <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl">
          <svg
            className="h-6 w-6 animate-bounce text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>

        {/* Orbiting Particles */}
        <div className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2">
          <div
            className="absolute top-0 left-1/2 h-2 w-2 origin-bottom animate-spin rounded-full bg-blue-500"
            style={{ animationDuration: '2s' }}
          />
          <div
            className="absolute top-0 left-1/2 h-2 w-2 origin-bottom animate-spin rounded-full bg-purple-500"
            style={{ animationDuration: '3s', animationDirection: 'reverse' }}
          />
          <div
            className="absolute top-0 left-1/2 h-2 w-2 origin-bottom animate-spin rounded-full bg-green-500"
            style={{ animationDuration: '2.5s' }}
          />
        </div>
      </div>
    </div>
  );
};
