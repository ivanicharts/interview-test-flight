import type { AnalysisResult } from '@/lib/ai/schemas';

interface ReportMetaProps {
  meta: AnalysisResult['meta'];
}

export function ReportMeta({ meta }: ReportMetaProps) {
  return (
    <div className="text-muted-foreground text-xs">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span>Model: {meta.model}</span>
        <span>JD chars: {meta.inputChars.jd}</span>
        <span>CV chars: {meta.inputChars.cv}</span>
        <span>Generated: {meta.generatedAt}</span>
      </div>
      {meta.warnings?.length > 0 && (
        <ul className="mt-2 list-disc pl-5">
          {meta.warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
