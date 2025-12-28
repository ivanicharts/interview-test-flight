-- Extensions (usually already enabled in Supabase)
create extension if not exists pgcrypto;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- DOCUMENTS: JD and CV (raw text)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  kind text not null check (kind in ('jd','cv')),
  title text,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_documents_updated
before update on public.documents
for each row execute function public.set_updated_at();

create index if not exists idx_documents_user_id on public.documents(user_id);
create index if not exists idx_documents_kind on public.documents(kind);

-- ANALYSES: AI match report stored as JSONB (schema enforced in app)
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  jd_document_id uuid not null references public.documents(id) on delete cascade,
  cv_document_id uuid not null references public.documents(id) on delete cascade,

  model text,
  schema_version text not null default 'v1',
  match_score int check (match_score between 0 and 100),
  report jsonb not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_analyses_updated
before update on public.analyses
for each row execute function public.set_updated_at();

create index if not exists idx_analyses_user_id on public.analyses(user_id);
create index if not exists idx_analyses_docs on public.analyses(jd_document_id, cv_document_id);

-- SESSIONS: mock interview runs (Q by Q)
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),

  analysis_id uuid references public.analyses(id) on delete set null,
  title text,
  status text not null default 'in_progress' check (status in ('in_progress','completed','archived')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_sessions_updated
before update on public.sessions
for each row execute function public.set_updated_at();

create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_sessions_status on public.sessions(status);

-- QUESTIONS: generated per session
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),

  session_id uuid not null references public.sessions(id) on delete cascade,
  order_index int not null,
  question text not null,
  rubric jsonb, -- optional structured rubric

  created_at timestamptz not null default now()
);

create index if not exists idx_questions_user_id on public.questions(user_id);
create index if not exists idx_questions_session on public.questions(session_id, order_index);

-- ANSWERS: text and/or audio reference (audio lives in Storage)
create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),

  session_id uuid not null references public.sessions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,

  answer_text text,
  audio_path text,         -- e.g. "{userId}/{sessionId}/{answerId}.webm"
  audio_mime text,
  audio_duration_ms int,

  created_at timestamptz not null default now(),

  constraint answers_one_per_question unique (question_id)
);

create index if not exists idx_answers_user_id on public.answers(user_id);
create index if not exists idx_answers_session on public.answers(session_id);

-- REVIEWS: AI grading + feedback per answer
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),

  session_id uuid not null references public.sessions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  answer_id uuid not null references public.answers(id) on delete cascade,

  score int check (score between 0 and 100),
  feedback text,
  improvements jsonb,      -- structured suggestions
  schema_version text not null default 'v1',

  created_at timestamptz not null default now(),

  constraint reviews_one_per_answer unique (answer_id)
);

create index if not exists idx_reviews_user_id on public.reviews(user_id);
create index if not exists idx_reviews_session on public.reviews(session_id);
