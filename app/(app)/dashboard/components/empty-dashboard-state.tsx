import { BarChart3, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/ui/content-card';

interface EmptyDashboardStateProps {
  onStartFlow?: () => void;
}

export function EmptyDashboardState({ onStartFlow }: EmptyDashboardStateProps) {
  return (
    <ContentCard>
      <div className="mx-auto max-w-md text-center space-y-10 py-10">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Welcome to Interview Test Flight</h2>
          <p className="text-muted-foreground">
            Get started by uploading your documents and creating your first analysis
          </p>
        </div>

        <div className="space-y-3 text-left mx-auto max-w-69">
          <div className="flex gap-3 items-start">
            <div className="rounded-full bg-primary/10 p-2">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium text-sm">1. Upload Documents</div>
              <div className="text-xs text-muted-foreground">Add job descriptions and your CV</div>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="rounded-full bg-primary/10 p-2">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium text-sm">2. Create Analysis</div>
              <div className="text-xs text-muted-foreground">See how your CV matches job requirements</div>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="rounded-full bg-primary/10 p-2">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium text-sm">3. Start Interview</div>
              <div className="text-xs text-muted-foreground">Practice with AI-generated questions</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-center pt-2">
          {onStartFlow ? (
            <Button onClick={onStartFlow} size="lg">
              Start Interview Prep Flow
            </Button>
          ) : (
            <>
              <Button asChild>
                <Link href="/documents/new">Upload Documents</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/analysis/new">Create Analysis</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </ContentCard>
  );
}
