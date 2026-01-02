-- Add status column to analyses table for tracking streaming progress
ALTER TABLE analyses
ADD COLUMN status TEXT NOT NULL DEFAULT 'completed'
CHECK (status IN ('pending', 'processing', 'completed', 'failed'));

-- Create index for efficient cleanup queries
CREATE INDEX idx_analyses_status_created
ON analyses(status, created_at)
WHERE status IN ('pending', 'processing');

-- Add comment explaining the status column
COMMENT ON COLUMN analyses.status IS 'Track analysis generation status: pending (created), processing (streaming), completed (finished), failed (error)';
