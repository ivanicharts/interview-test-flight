import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function AnalysisPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analysis</h1>
        <p className="text-muted-foreground text-sm">For JD/session id: {params.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report (placeholder)</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Step 5+: render structured JSON report here.
        </CardContent>
      </Card>
    </div>
  );
}
