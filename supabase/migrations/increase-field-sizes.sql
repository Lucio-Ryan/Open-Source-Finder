-- Migration: Increase field sizes to prevent "value too long" errors
-- Run this in your Supabase SQL Editor

-- Change URL fields from VARCHAR(500) to TEXT for flexibility
ALTER TABLE alternatives 
    ALTER COLUMN website TYPE TEXT,
    ALTER COLUMN github TYPE TEXT,
    ALTER COLUMN icon_url TYPE TEXT;

-- Also update proprietary_software table
ALTER TABLE proprietary_software
    ALTER COLUMN website TYPE TEXT;

-- Ensure description fields are TEXT (not VARCHAR)
ALTER TABLE alternatives
    ALTER COLUMN description TYPE TEXT,
    ALTER COLUMN short_description TYPE TEXT,
    ALTER COLUMN long_description TYPE TEXT;

-- Update license field to allow longer values
ALTER TABLE alternatives
    ALTER COLUMN license TYPE VARCHAR(255);
