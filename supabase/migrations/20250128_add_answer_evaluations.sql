-- Add evaluation columns to interview_answers table
ALTER TABLE interview_answers
  ADD COLUMN evaluation_score INTEGER
    CHECK (evaluation_score >= 0 AND evaluation_score <= 100),
  ADD COLUMN evaluation_result JSONB,
  ADD COLUMN evaluated_at TIMESTAMPTZ;

-- Index for filtering by score
CREATE INDEX idx_interview_answers_evaluation_score
  ON interview_answers(session_id, evaluation_score DESC)
  WHERE evaluation_score IS NOT NULL;

-- Index for finding unevaluated answers
CREATE INDEX idx_interview_answers_needs_evaluation
  ON interview_answers(session_id, updated_at)
  WHERE evaluation_score IS NULL AND answer_text IS NOT NULL;

-- Comments for documentation
COMMENT ON COLUMN interview_answers.evaluation_score IS
  'Denormalized score (0-100) from evaluation_result for quick queries';
COMMENT ON COLUMN interview_answers.evaluation_result IS
  'Full AI evaluation result matching AnswerEvaluationSchema';
COMMENT ON COLUMN interview_answers.evaluated_at IS
  'Timestamp of last evaluation (may differ from updated_at if answer re-edited)';
