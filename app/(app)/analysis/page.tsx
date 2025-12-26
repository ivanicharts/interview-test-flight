import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AnalysisPage() {
  const supabase = await supabaseServer();
  const { data: userRes } = await supabase.auth.getUser();

  if (!userRes.user) redirect('/login');

  const { data, error } = await supabase
    .from('analyses')
    .select('id, match_score, created_at, model')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl md:text-2xl">analysis</CardTitle>
            <Button asChild>
              <Link href="/analysis/new">New analysis</Link>
            </Button>
          </div>
          <div className="text-muted-foreground text-sm">Your match reports.</div>
        </CardHeader>

        <CardContent className="space-y-2">
          {(data ?? []).length === 0 ? (
            <div className="border-border/60 bg-muted/10 rounded-md border p-6 text-center">
              <div className="text-muted-foreground text-sm">No analysis yet.</div>
              <Button asChild className="mt-3">
                <Link href="/analysis/new">Create one</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-border/60 border-border/60 divide-y overflow-hidden rounded-md border">
              {data!.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{a.match_score ?? 0}/100</Badge>
                      <Link href={`/analysis/${a.id}`} className="truncate font-medium hover:underline">
                        {a.title || 'Analysis'}
                      </Link>
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      {new Date(a.created_at).toLocaleString()} • {a.model ?? 'model'}
                    </div>
                  </div>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/analysis/${a.id}`}>Open</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
