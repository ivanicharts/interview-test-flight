import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const dynamic = 'force-dynamic';

export default function InterviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Mock Interview</h1>
          <p className="text-muted-foreground text-sm">Session: {params.id}</p>
        </div>
        <Button disabled>Start (next step)</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">Step 6+: show Q-by-Q, rubric, feedback.</p>
            <Textarea placeholder="Type your answer..." className="min-h-40" />
            <div className="flex gap-2">
              <Button disabled>Submit answer</Button>
              <Button variant="secondary" disabled>
                Record audio (next step)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            TODO: session history / navigation (Q list)
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
