-- Create interview_answers table
CREATE TABLE IF NOT EXISTS interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,

  -- Answer content
  answer_text TEXT,
  answer_audio_url TEXT,
  answer_mode TEXT NOT NULL CHECK (answer_mode IN ('text', 'audio')) DEFAULT 'text',

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure one answer per question per session
  UNIQUE(session_id, question_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_interview_answers_session_id
  ON interview_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_question_id
  ON interview_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_updated_at
  ON interview_answers(session_id, updated_at DESC);

-- Enable Row Level Security
ALTER TABLE interview_answers ENABLE ROW LEVEL SECURITY;

-- RLS policies (inherit session ownership)
CREATE POLICY "Users can view answers for their own sessions"
  ON interview_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert answers for their own sessions"
  ON interview_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update answers for their own sessions"
  ON interview_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete answers for their own sessions"
  ON interview_answers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE interview_sessions.id = interview_answers.session_id
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_interview_answers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER interview_answers_updated_at
  BEFORE UPDATE ON interview_answers
  FOR EACH ROW
  EXECUTE FUNCTION update_interview_answers_updated_at();
