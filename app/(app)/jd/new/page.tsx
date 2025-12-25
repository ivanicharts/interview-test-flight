import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default function NewJdPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Job Description</h1>
        <p className="text-muted-foreground text-sm">Paste JD + CV. Step 5 will save + run analysis.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Senior Frontend Engineer — React" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="jd">Job Description</Label>
            <Textarea id="jd" placeholder="Paste the JD here..." className="min-h-40" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cv">Your CV</Label>
            <Textarea id="cv" placeholder="Paste your CV here..." className="min-h-40" />
          </div>

          <div className="flex gap-2">
            <Button disabled>Save (next step)</Button>
            <Button variant="secondary" disabled>
              Save + Run analysis (next step)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
