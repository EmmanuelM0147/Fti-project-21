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

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
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