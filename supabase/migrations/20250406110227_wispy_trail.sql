/*
  # Create applications table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `personal_info` (jsonb)
      - `program_selection` (jsonb)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `applications` table
    - Add policies for:
      - Users can read their own applications
      - Users can create applications
      - Users can update their own applications
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_info jsonb NOT NULL,
  program_selection jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own applications
CREATE POLICY "Users can read own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to allow users to create applications
CREATE POLICY "Users can create applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own applications
CREATE POLICY "Users can update own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);