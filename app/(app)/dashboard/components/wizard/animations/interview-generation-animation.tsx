export const InterviewGenerationAnimation = () => {
  return (
    <div>
      {/* Animated Question Generation Visualization */}
      <div className="relative h-40 w-72">
        {/* Analysis Document - Center Top */}
        <div className="absolute top-0 left-1/2 h-16 w-24 -translate-x-1/2 rounded-lg border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 to-green-600/20 shadow-lg">
          <div className="absolute inset-2 space-y-1">
            <div className="h-1 animate-pulse rounded bg-emerald-500/60" />
            <div className="h-1 w-3/4 animate-pulse rounded bg-emerald-500/40" />
            <div className="h-1 w-1/2 animate-pulse rounded bg-emerald-500/60" />
          </div>
          <div className="bg-background absolute -bottom-1 left-1/2 -translate-x-1/2 rounded px-2 text-[10px] font-medium text-emerald-600">
            Analysis
          </div>
        </div>

        {/* Radiating Lines to Questions */}
        <svg className="absolute inset-0 h-full w-full">
          {/* Line to Q1 */}
          <line
            x1="50%"
            y1="16"
            x2="20%"
            y2="70%"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-pulse text-purple-500/30"
            strokeDasharray="4 4"
          />
          {/* Line to Q2 */}
          <line
            x1="50%"
            y1="16"
            x2="50%"
            y2="70%"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-pulse text-blue-500/30"
            strokeDasharray="4 4"
            style={{ animationDelay: '0.2s' }}
          />
          {/* Line to Q3 */}
          <line
            x1="50%"
            y1="16"
            x2="80%"
            y2="70%"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-pulse text-pink-500/30"
            strokeDasharray="4 4"
            style={{ animationDelay: '0.4s' }}
          />
        </svg>

        {/* Question Cards - Floating in */}
        <div
          className="absolute bottom-0 left-0 h-12 w-20 animate-bounce rounded border border-purple-500/40 bg-gradient-to-br from-purple-500/20 to-purple-600/20 shadow"
          style={{ animationDelay: '0s', animationDuration: '2s' }}
        >
          <div className="absolute inset-1.5 space-y-0.5">
            <div className="h-0.5 rounded bg-purple-500/60" />
            <div className="h-0.5 w-3/4 rounded bg-purple-500/40" />
            <div className="h-0.5 w-1/2 rounded bg-purple-500/60" />
          </div>
          <div className="bg-background absolute -top-1 right-1 rounded px-1 text-[8px] font-bold text-purple-600">
            Q1
          </div>
        </div>

        <div
          className="absolute bottom-0 left-1/2 h-12 w-20 -translate-x-1/2 animate-bounce rounded border border-blue-500/40 bg-gradient-to-br from-blue-500/20 to-blue-600/20 shadow"
          style={{ animationDelay: '0.2s', animationDuration: '2s' }}
        >
          <div className="absolute inset-1.5 space-y-0.5">
            <div className="h-0.5 rounded bg-blue-500/60" />
            <div className="h-0.5 w-3/4 rounded bg-blue-500/40" />
            <div className="h-0.5 w-1/2 rounded bg-blue-500/60" />
          </div>
          <div className="bg-background absolute -top-1 right-1 rounded px-1 text-[8px] font-bold text-blue-600">
            Q2
          </div>
        </div>

        <div
          className="absolute right-0 bottom-0 h-12 w-20 animate-bounce rounded border border-pink-500/40 bg-gradient-to-br from-pink-500/20 to-pink-600/20 shadow"
          style={{ animationDelay: '0.4s', animationDuration: '2s' }}
        >
          <div className="absolute inset-1.5 space-y-0.5">
            <div className="h-0.5 rounded bg-pink-500/60" />
            <div className="h-0.5 w-3/4 rounded bg-pink-500/40" />
            <div className="h-0.5 w-1/2 rounded bg-pink-500/60" />
          </div>
          <div className="bg-background absolute -top-1 right-1 rounded px-1 text-[8px] font-bold text-pink-600">
            Q3
          </div>
        </div>

        {/* Sparkle Effects */}
        <div
          className="absolute top-1/3 left-1/4 h-2 w-2 animate-ping rounded-full bg-yellow-400"
          style={{ animationDuration: '1.5s' }}
        />
        <div
          className="absolute top-1/2 right-1/4 h-2 w-2 animate-ping rounded-full bg-cyan-400"
          style={{ animationDuration: '2s', animationDelay: '0.5s' }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 h-1.5 w-1.5 animate-ping rounded-full bg-purple-400"
          style={{ animationDuration: '1.8s', animationDelay: '0.3s' }}
        />
      </div>
    </div>
  );
};
