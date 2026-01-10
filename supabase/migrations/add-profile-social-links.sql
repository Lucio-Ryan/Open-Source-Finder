-- Add social links to profiles table
-- Run this SQL in your Supabase SQL Editor

-- Add new social link columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS twitter_username TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS discord_username TEXT;

-- Create index for faster email lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
