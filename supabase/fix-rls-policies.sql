-- Run this SQL in your Supabase SQL Editor to fix INSERT permissions
-- This ensures public submissions work correctly

-- Drop existing insert policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Allow public insert" ON alternatives;
DROP POLICY IF EXISTS "Allow public insert" ON alternative_categories;
DROP POLICY IF EXISTS "Allow public insert" ON alternative_tags;
DROP POLICY IF EXISTS "Allow public insert" ON alternative_tech_stacks;
DROP POLICY IF EXISTS "Allow public insert" ON alternative_to;

-- Re-create INSERT policies with proper permissions
CREATE POLICY "Allow public insert" ON alternatives 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public insert" ON alternative_categories 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public insert" ON alternative_tags 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public insert" ON alternative_tech_stacks 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public insert" ON alternative_to 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Also add screenshots column if it doesn't exist
ALTER TABLE alternatives 
  ADD COLUMN IF NOT EXISTS screenshots TEXT[];

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('alternatives', 'alternative_categories', 'alternative_tags', 'alternative_tech_stacks', 'alternative_to');
