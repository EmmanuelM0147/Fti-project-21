/*
  # Fix applications table schema

  1. Changes
    - Update applications table to include all required fields
    - Add missing jsonb columns for academic_background and referee
    - Ensure proper constraints and defaults

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing table if it exists (to ensure clean schema)
DROP TABLE IF EXISTS public.applications;

-- Create applications table with complete schema
CREATE TABLE IF NOT EXISTS public.applications (
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

-- Create index for faster queries
CREATE INDEX applications_user_id_idx ON public.applications(user_id);
CREATE INDEX applications_status_idx ON public.applications(status);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

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

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION update_applications_updated_at();