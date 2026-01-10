-- Discussions table for alternative pages
CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alternative_id UUID NOT NULL REFERENCES alternatives(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    request_creator_response BOOLEAN DEFAULT FALSE,
    parent_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    is_creator_response BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator notifications table
CREATE TABLE IF NOT EXISTS creator_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    alternative_id UUID NOT NULL REFERENCES alternatives(id) ON DELETE CASCADE,
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'response_request',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_discussions_alternative_id ON discussions(alternative_id);
CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_parent_id ON discussions(parent_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creator_notifications_creator_id ON creator_notifications(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_notifications_is_read ON creator_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_creator_notifications_created_at ON creator_notifications(created_at DESC);

-- Update timestamp trigger for discussions
DROP TRIGGER IF EXISTS update_discussions_updated_at ON discussions;
CREATE TRIGGER update_discussions_updated_at
    BEFORE UPDATE ON discussions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discussions

-- Anyone can read discussions
CREATE POLICY "Anyone can read discussions" 
    ON discussions FOR SELECT 
    USING (true);

-- Authenticated users can create discussions
CREATE POLICY "Authenticated users can create discussions" 
    ON discussions FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own discussions
CREATE POLICY "Users can update own discussions" 
    ON discussions FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own discussions
CREATE POLICY "Users can delete own discussions" 
    ON discussions FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- RLS Policies for creator_notifications

-- Users can only see their own notifications
CREATE POLICY "Users can read own notifications" 
    ON creator_notifications FOR SELECT 
    TO authenticated
    USING (auth.uid() = creator_id);

-- System can create notifications (via service role)
CREATE POLICY "Service can create notifications" 
    ON creator_notifications FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications" 
    ON creator_notifications FOR UPDATE 
    TO authenticated
    USING (auth.uid() = creator_id)
    WITH CHECK (auth.uid() = creator_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" 
    ON creator_notifications FOR DELETE 
    TO authenticated
    USING (auth.uid() = creator_id);
