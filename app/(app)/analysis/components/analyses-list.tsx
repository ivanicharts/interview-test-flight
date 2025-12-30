import Link from 'next/link';

import { type Analysis } from '@/lib/supabase/queries';
import { formatDate } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { List, ListItem, ListItemContent } from '@/components/ui/list';

function getScoreTone(score: number): 'default' | 'secondary' | 'outline' {
  if (score >= 75) return 'default';
  if (score >= 50) return 'secondary';
  return 'outline';
}

type Props = {
  analyses: Analysis[];
};

export const AnalysesList = ({ analyses }: Props) => {
  return (
    <List>
      {analyses!.map((a) => (
        <ListItem key={a.id}>
          <ListItemContent>
            <div className="flex items-center gap-2">
              <Badge variant={getScoreTone(a.match_score ?? 0)}>{a.match_score ?? 0}/100</Badge>
              <Link href={`/analysis/${a.id}`} className="line-clamp-1 font-medium hover:underline">
                {(a.jd_document as any)?.title || 'Job Description'} - {(a.cv_document as any)?.title || 'CV'}
              </Link>
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              {formatDate(a.created_at)} • {a.model ?? 'gpt-5-mini'}
            </div>
          </ListItemContent>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/analysis/${a.id}`}>Open</Link>
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
