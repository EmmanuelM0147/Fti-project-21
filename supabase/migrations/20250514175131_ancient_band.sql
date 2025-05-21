/*
  # Create applications table for student applications

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `personal_info` (jsonb, contains personal information)
      - `academic_background` (jsonb, contains education details)
      - `program_selection` (jsonb, contains program and course details)
      - `accommodation` (jsonb, contains accommodation preferences)
      - `referee` (jsonb, contains referee information)
      - `status` (text, application status)
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on applications table
    - Add policies for:
      - Authenticated users can create their own applications
      - Authenticated users can read their own applications
      - Admins can read all applications
*/

-- Create applications table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'applications') THEN
    CREATE TABLE public.applications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      personal_info jsonb NOT NULL,
      academic_background jsonb NOT NULL,
      program_selection jsonb NOT NULL,
      accommodation jsonb NOT NULL,
      referee jsonb NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      
      CONSTRAINT valid_status CHECK (status IN ('draft', 'pending', 'under_review', 'approved', 'rejected'))
    );
  END IF;
END $$;

-- Create indexes for faster queries if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'applications_user_id_idx') THEN
    CREATE INDEX applications_user_id_idx ON public.applications(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'applications_status_idx') THEN
    CREATE INDEX applications_status_idx ON public.applications(status);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can create their own applications" ON public.applications;
  DROP POLICY IF EXISTS "Users can read their own applications" ON public.applications;
  DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
  DROP POLICY IF EXISTS "Admins can read all applications" ON public.applications;
  DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
END $$;

-- Create policies
CREATE POLICY "Users can create their own applications"
  ON public.applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own applications"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all applications"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Admins can update applications"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS applications_updated_at ON public.applications;

-- Create trigger
CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION update_applications_updated_at();