-- Create exercise_videos table for community-submitted videos
CREATE TABLE public.exercise_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'x', 'facebook')),
  url TEXT NOT NULL,
  label TEXT DEFAULT '',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exercise_videos ENABLE ROW LEVEL SECURITY;

-- Everyone can view videos
CREATE POLICY "Exercise videos are publicly viewable"
ON public.exercise_videos FOR SELECT
USING (true);

-- Authenticated users can submit videos
CREATE POLICY "Authenticated users can submit videos"
ON public.exercise_videos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "Users can update their own videos"
ON public.exercise_videos FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own submissions
CREATE POLICY "Users can delete their own videos"
ON public.exercise_videos FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Index for fast lookups by exercise
CREATE INDEX idx_exercise_videos_exercise_id ON public.exercise_videos(exercise_id);