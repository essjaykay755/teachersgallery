-- Add INSERT policy for profiles table
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add INSERT policy for profiles table that allows service role to insert any profile
-- This is needed for the registration API endpoint
CREATE POLICY "Service role can insert any profile" 
ON public.profiles 
FOR INSERT 
TO service_role
USING (true); 