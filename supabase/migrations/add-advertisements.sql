-- Advertisement System Migration
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- ADVERTISEMENT TABLES
-- ============================================

-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic info
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Ad type: 'banner' (header), 'popup' (bottom right), 'card' (alternatives grid)
    ad_type VARCHAR(50) NOT NULL CHECK (ad_type IN ('banner', 'popup', 'card')),
    
    -- Company/Advertiser info
    company_name VARCHAR(255) NOT NULL,
    company_website TEXT NOT NULL,
    company_logo TEXT,
    
    -- Ad content
    headline VARCHAR(255),
    cta_text VARCHAR(100) DEFAULT 'Learn More',
    destination_url TEXT NOT NULL,
    
    -- Card-specific fields (for card ads that look like alternatives)
    icon_url TEXT,
    short_description TEXT,
    
    -- Display settings
    is_active BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0,
    
    -- Approval workflow
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES profiles(id),
    
    -- Scheduling
    start_date DATE,
    end_date DATE,
    
    -- Submitter info
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    submitter_name VARCHAR(255),
    submitter_email VARCHAR(255) NOT NULL,
    
    -- Tracking (for future analytics)
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_advertisements_ad_type ON advertisements(ad_type);
CREATE INDEX IF NOT EXISTS idx_advertisements_status ON advertisements(status);
CREATE INDEX IF NOT EXISTS idx_advertisements_is_active ON advertisements(is_active);
CREATE INDEX IF NOT EXISTS idx_advertisements_user_id ON advertisements(user_id);

-- Enable RLS
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active approved ads" ON advertisements;
DROP POLICY IF EXISTS "Users can view their own ads" ON advertisements;
DROP POLICY IF EXISTS "Users can create ads" ON advertisements;
DROP POLICY IF EXISTS "Users can update their own pending ads" ON advertisements;
DROP POLICY IF EXISTS "Admins can view all ads" ON advertisements;
DROP POLICY IF EXISTS "Admins can update all ads" ON advertisements;

-- RLS Policies for advertisements

-- Anyone can view active, approved ads
CREATE POLICY "Anyone can view active approved ads"
ON advertisements FOR SELECT
TO public
USING (status = 'approved' AND is_active = TRUE);

-- Users can view their own ads (any status)
CREATE POLICY "Users can view their own ads"
ON advertisements FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can create ads
CREATE POLICY "Users can create ads"
ON advertisements FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own pending ads
CREATE POLICY "Users can update their own pending ads"
ON advertisements FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND status = 'pending')
WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- Admins can view all ads
CREATE POLICY "Admins can view all ads"
ON advertisements FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Admins can update all ads
CREATE POLICY "Admins can update all ads"
ON advertisements FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Admins can delete ads
CREATE POLICY "Admins can delete ads"
ON advertisements FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Update trigger for updated_at
DROP TRIGGER IF EXISTS update_advertisements_updated_at ON advertisements;
CREATE TRIGGER update_advertisements_updated_at
    BEFORE UPDATE ON advertisements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
