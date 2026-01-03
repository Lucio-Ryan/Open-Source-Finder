-- Migration: Add short_description column to alternatives table
-- Run this SQL in your Supabase SQL Editor if you already have an existing database

-- Add the short_description column
ALTER TABLE alternatives 
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Optional: Update existing records to copy description as short_description
-- UPDATE alternatives SET short_description = LEFT(regexp_replace(description, '<[^>]*>', '', 'g'), 200) WHERE short_description IS NULL;

COMMENT ON COLUMN alternatives.short_description IS 'Brief summary shown below the alternative name. Supports basic formatting: bold, italic, links, inline code.';
