-- Add rejection_reason field to alternatives table
-- This allows admins to provide a reason when rejecting submissions
-- and allows users to see why their submission was rejected

ALTER TABLE alternatives ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE alternatives ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- Create an index for faster filtering by approval status
CREATE INDEX IF NOT EXISTS idx_alternatives_approved ON alternatives(approved);
