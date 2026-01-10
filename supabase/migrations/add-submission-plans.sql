-- Migration: Add submission plans support
-- This migration adds fields to support Free and Sponsor submission plans

-- Add submission plan fields to alternatives table
ALTER TABLE alternatives 
ADD COLUMN IF NOT EXISTS submission_plan VARCHAR(20) DEFAULT 'free' CHECK (submission_plan IN ('free', 'sponsor')),
ADD COLUMN IF NOT EXISTS backlink_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS backlink_url TEXT,
ADD COLUMN IF NOT EXISTS sponsor_featured_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sponsor_priority_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sponsor_payment_id TEXT,
ADD COLUMN IF NOT EXISTS sponsor_paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS newsletter_included BOOLEAN DEFAULT FALSE;

-- Add index for sponsor queries (finding active sponsors for homepage)
CREATE INDEX IF NOT EXISTS idx_alternatives_sponsor_active 
ON alternatives (sponsor_priority_until) 
WHERE submission_plan = 'sponsor' AND approved = TRUE;

-- Add index for backlink verification queries
CREATE INDEX IF NOT EXISTS idx_alternatives_backlink_pending 
ON alternatives (backlink_verified) 
WHERE submission_plan = 'free' AND backlink_verified = FALSE;

-- Comment on columns
COMMENT ON COLUMN alternatives.submission_plan IS 'The submission plan: free (requires backlink) or sponsor ($19, premium features)';
COMMENT ON COLUMN alternatives.backlink_verified IS 'Whether the required backlink has been verified (for free plan)';
COMMENT ON COLUMN alternatives.backlink_url IS 'The URL where the backlink embed code was found';
COMMENT ON COLUMN alternatives.sponsor_featured_until IS 'Date until which the sponsor submission is featured on homepage';
COMMENT ON COLUMN alternatives.sponsor_priority_until IS 'Date until which the sponsor gets priority placement';
COMMENT ON COLUMN alternatives.sponsor_payment_id IS 'Payment transaction ID for sponsor submissions';
COMMENT ON COLUMN alternatives.sponsor_paid_at IS 'When the sponsor payment was made';
COMMENT ON COLUMN alternatives.newsletter_included IS 'Whether this sponsor has been included in a weekly newsletter';
