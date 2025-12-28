-- Enable RLS
alter table public.documents enable row level security;
alter table public.analyses enable row level security;
alter table public.sessions enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.reviews enable row level security;

-- DOCUMENTS
create policy "documents_select_own"
on public.documents for select
to authenticated
using (user_id = auth.uid());

create policy "documents_insert_own"
on public.documents for insert
to authenticated
with check (user_id = auth.uid());

create policy "documents_update_own"
on public.documents for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "documents_delete_own"
on public.documents for delete
to authenticated
using (user_id = auth.uid());

-- ANALYSES
create policy "analyses_select_own"
on public.analyses for select
to authenticated
using (user_id = auth.uid());

create policy "analyses_insert_own"
on public.analyses for insert
to authenticated
with check (user_id = auth.uid());

create policy "analyses_update_own"
on public.analyses for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "analyses_delete_own"
on public.analyses for delete
to authenticated
using (user_id = auth.uid());

-- SESSIONS
create policy "sessions_select_own"
on public.sessions for select
to authenticated
using (user_id = auth.uid());

create policy "sessions_insert_own"
on public.sessions for insert
to authenticated
with check (user_id = auth.uid());

create policy "sessions_update_own"
on public.sessions for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "sessions_delete_own"
on public.sessions for delete
to authenticated
using (user_id = auth.uid());

-- QUESTIONS
create policy "questions_select_own"
on public.questions for select
to authenticated
using (user_id = auth.uid());

create policy "questions_insert_own"
on public.questions for insert
to authenticated
with check (user_id = auth.uid());

create policy "questions_update_own"
on public.questions for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "questions_delete_own"
on public.questions for delete
to authenticated
using (user_id = auth.uid());

-- ANSWERS
create policy "answers_select_own"
on public.answers for select
to authenticated
using (user_id = auth.uid());

create policy "answers_insert_own"
on public.answers for insert
to authenticated
with check (user_id = auth.uid());

create policy "answers_update_own"
on public.answers for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "answers_delete_own"
on public.answers for delete
to authenticated
using (user_id = auth.uid());

-- REVIEWS
create policy "reviews_select_own"
on public.reviews for select
to authenticated
using (user_id = auth.uid());

create policy "reviews_insert_own"
on public.reviews for insert
to authenticated
with check (user_id = auth.uid());

create policy "reviews_update_own"
on public.reviews for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "reviews_delete_own"
on public.reviews for delete
to authenticated
using (user_id = auth.uid());
