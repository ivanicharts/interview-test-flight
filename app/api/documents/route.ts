import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

type DocumentKind = 'jd' | 'cv';

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  const { kind, title, content }: { kind?: DocumentKind; title?: string; content?: string } = await req.json();

  if (kind !== 'jd' && kind !== 'cv') {
    return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
  }

  if (!content || content.trim().length < 50) {
    return NextResponse.json({ error: 'Content too short (min ~50 chars)' }, { status: 400 });
  }

  const { data: userRes, error: userErr } = await supabase.auth.getUser();

  if (userErr || !userRes.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('documents')
    .insert({
      kind,
      title: title?.trim() || null,
      content: content.trim(),
      // user_id defaults to auth.uid()
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
