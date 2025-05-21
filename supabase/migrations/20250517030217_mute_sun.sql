/*
  # Create career development tables

  1. New Tables
    - `career_tracks` - Career paths and learning roadmaps
    - `learning_resources` - Educational materials and courses
    - `tech_communities` - Nigerian tech communities and hubs
    - `job_opportunities` - Job listings and internships
    - `user_preferences` - User bookmarks and saved items

  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Public read access to career tracks, resources, communities, and opportunities
      - Authenticated users can update their own preferences
*/

-- Create career_tracks table
CREATE TABLE IF NOT EXISTS public.career_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  level text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration text NOT NULL,
  salary_range text NOT NULL,
  demand_level text NOT NULL CHECK (demand_level IN ('high', 'medium', 'low')),
  tools jsonb NOT NULL DEFAULT '[]'::jsonb,
  certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create learning_resources table
CREATE TABLE IF NOT EXISTS public.learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('video', 'article', 'course', 'book', 'interactive')),
  level text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  is_free boolean NOT NULL DEFAULT false,
  track_id uuid REFERENCES public.career_tracks(id) ON DELETE CASCADE,
  rating numeric NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tech_communities table
CREATE TABLE IF NOT EXISTS public.tech_communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  type text NOT NULL CHECK (type IN ('physical', 'online', 'hybrid')),
  website text NOT NULL,
  coordinates jsonb NOT NULL,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_opportunities table
CREATE TABLE IF NOT EXISTS public.job_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  is_remote boolean NOT NULL DEFAULT false,
  type text NOT NULL CHECK (type IN ('full-time', 'part-time', 'contract', 'internship', 'mentorship')),
  level text NOT NULL CHECK (level IN ('entry', 'mid', 'senior')),
  description text NOT NULL,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  salary_range text,
  application_url text NOT NULL,
  deadline timestamptz NOT NULL,
  posted_date timestamptz NOT NULL DEFAULT now(),
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bookmarked_resources jsonb NOT NULL DEFAULT '[]'::jsonb,
  saved_opportunities jsonb NOT NULL DEFAULT '[]'::jsonb,
  career_interests jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_preferences_user_id_key UNIQUE (user_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS career_tracks_level_idx ON public.career_tracks(level);
CREATE INDEX IF NOT EXISTS career_tracks_demand_level_idx ON public.career_tracks(demand_level);
CREATE INDEX IF NOT EXISTS learning_resources_track_id_idx ON public.learning_resources(track_id);
CREATE INDEX IF NOT EXISTS learning_resources_type_idx ON public.learning_resources(type);
CREATE INDEX IF NOT EXISTS learning_resources_level_idx ON public.learning_resources(level);
CREATE INDEX IF NOT EXISTS learning_resources_is_free_idx ON public.learning_resources(is_free);
CREATE INDEX IF NOT EXISTS tech_communities_type_idx ON public.tech_communities(type);
CREATE INDEX IF NOT EXISTS job_opportunities_type_idx ON public.job_opportunities(type);
CREATE INDEX IF NOT EXISTS job_opportunities_level_idx ON public.job_opportunities(level);
CREATE INDEX IF NOT EXISTS job_opportunities_is_remote_idx ON public.job_opportunities(is_remote);
CREATE INDEX IF NOT EXISTS job_opportunities_deadline_idx ON public.job_opportunities(deadline);

-- Enable RLS on all tables
ALTER TABLE public.career_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public read access to career tracks
CREATE POLICY "Public can view career tracks"
  ON public.career_tracks
  FOR SELECT
  TO public
  USING (true);

-- Public read access to learning resources
CREATE POLICY "Public can view learning resources"
  ON public.learning_resources
  FOR SELECT
  TO public
  USING (true);

-- Public read access to tech communities
CREATE POLICY "Public can view tech communities"
  ON public.tech_communities
  FOR SELECT
  TO public
  USING (true);

-- Public read access to job opportunities
CREATE POLICY "Public can view job opportunities"
  ON public.job_opportunities
  FOR SELECT
  TO public
  USING (true);

-- Users can manage their own preferences
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_career_tracks_timestamp
  BEFORE UPDATE ON public.career_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_learning_resources_timestamp
  BEFORE UPDATE ON public.learning_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_tech_communities_timestamp
  BEFORE UPDATE ON public.tech_communities
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_job_opportunities_timestamp
  BEFORE UPDATE ON public.job_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_preferences_timestamp
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();