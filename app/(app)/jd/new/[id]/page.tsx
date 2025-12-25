import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function JdDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">JD #{id}</h1>
          <p className="text-muted-foreground text-sm">Detail view placeholder.</p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`/analysis/${id}`} prefetch={false}>
              View analysis
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/interview/${id}`} prefetch={false}>
              Start interview
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">TODO: render JD content</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CV</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">TODO: render CV content</CardContent>
      </Card>
    </div>
  );
}
