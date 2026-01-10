-- Migration: Add votes table for Reddit-style upvote/downvote system
-- Run this SQL in your Supabase SQL Editor

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    alternative_id UUID NOT NULL REFERENCES alternatives(id) ON DELETE CASCADE,
    vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 for downvote, 1 for upvote
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, alternative_id)
);

-- Add vote_score column to alternatives table for caching total votes
ALTER TABLE alternatives ADD COLUMN IF NOT EXISTS vote_score INTEGER DEFAULT 0;

-- Create index for faster vote lookups
CREATE INDEX IF NOT EXISTS idx_votes_alternative_id ON votes(alternative_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_alternatives_vote_score ON alternatives(vote_score DESC);

-- Enable RLS on votes table
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for votes
-- Anyone can read votes (to get vote counts)
CREATE POLICY "Votes are viewable by everyone" ON votes FOR SELECT USING (true);

-- Only authenticated users can insert their own votes
CREATE POLICY "Users can insert their own votes" ON votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update their own votes" ON votes FOR UPDATE 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes" ON votes FOR DELETE 
USING (auth.uid() = user_id);

-- Function to update vote_score on alternatives when votes change
CREATE OR REPLACE FUNCTION update_alternative_vote_score()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE alternatives 
        SET vote_score = (
            SELECT COALESCE(SUM(vote_type), 0) 
            FROM votes 
            WHERE alternative_id = NEW.alternative_id
        )
        WHERE id = NEW.alternative_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE alternatives 
        SET vote_score = (
            SELECT COALESCE(SUM(vote_type), 0) 
            FROM votes 
            WHERE alternative_id = NEW.alternative_id
        )
        WHERE id = NEW.alternative_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE alternatives 
        SET vote_score = (
            SELECT COALESCE(SUM(vote_type), 0) 
            FROM votes 
            WHERE alternative_id = OLD.alternative_id
        )
        WHERE id = OLD.alternative_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update vote_score
DROP TRIGGER IF EXISTS on_vote_change ON votes;
CREATE TRIGGER on_vote_change
    AFTER INSERT OR UPDATE OR DELETE ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_alternative_vote_score();

-- Trigger to update votes updated_at
DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;
CREATE TRIGGER update_votes_updated_at
    BEFORE UPDATE ON votes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
