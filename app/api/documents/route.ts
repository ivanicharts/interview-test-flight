import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/queries';
import { createDocument } from '@/lib/supabase/mutations';

type DocumentKind = 'jd' | 'cv';

export async function POST(req: Request) {
  const { kind, title, content }: { kind?: DocumentKind; title?: string; content?: string } = await req.json();

  if (kind !== 'jd' && kind !== 'cv') {
    return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
  }

  if (!content || content.trim().length < 50) {
    return NextResponse.json({ error: 'Content too short (min ~50 chars)' }, { status: 400 });
  }

  const { user, error: userErr } = await getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await createDocument({
    kind,
    title,
    content,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
