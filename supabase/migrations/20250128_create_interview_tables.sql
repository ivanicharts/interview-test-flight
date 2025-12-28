-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  mode TEXT,
  plan JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Create interview_questions table (denormalized for easier querying)
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  category TEXT NOT NULL,
  question_text TEXT NOT NULL,
  context TEXT,
  rubric JSONB NOT NULL,
  target_gap TEXT,
  target_strength TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for interview_sessions
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_analysis_id ON interview_sessions(analysis_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at ON interview_sessions(created_at DESC);

-- Create indexes for interview_questions
CREATE INDEX IF NOT EXISTS idx_interview_questions_session_id ON interview_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_order_index ON interview_questions(session_id, order_index);

-- Enable Row Level Security
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- RLS policies for interview_sessions
CREATE POLICY "Users can view their own interview sessions"
  ON interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interview sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview sessions"
  ON interview_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview sessions"
  ON interview_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for interview_questions (inherit from sessions)
CREATE POLICY "Users can view questions for their own interview sessions"
  ON interview_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_questions.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert questions for their own interview sessions"
  ON interview_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_questions.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions for their own interview sessions"
  ON interview_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_questions.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions for their own interview sessions"
  ON interview_questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_questions.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );
