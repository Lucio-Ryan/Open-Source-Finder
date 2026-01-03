-- Fix RLS policy for users viewing their own alternatives
-- The current policy fails if the user doesn't have a profile row
-- This fix uses auth.jwt() to get the email directly from the JWT token

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can view their own alternatives" ON alternatives;

-- Create a better policy that uses auth.jwt() for email
-- This works even if the user doesn't have a profile
CREATE POLICY "Users can view their own alternatives" ON alternatives 
  FOR SELECT 
  USING (
    user_id = auth.uid() 
    OR submitter_email = auth.jwt() ->> 'email'
  );

-- Also fix the UPDATE policy with the same approach
DROP POLICY IF EXISTS "Users can update their own alternatives" ON alternatives;

CREATE POLICY "Users can update their own alternatives" ON alternatives 
  FOR UPDATE 
  USING (
    user_id = auth.uid() 
    OR submitter_email = auth.jwt() ->> 'email'
  );

-- Verify the policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'alternatives' AND policyname LIKE '%own%';
