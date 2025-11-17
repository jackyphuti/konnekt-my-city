-- Create municipalities table
CREATE TABLE IF NOT EXISTS public.municipalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  municipality_id UUID REFERENCES public.municipalities(id),
  user_type TEXT CHECK (user_type IN ('citizen', 'municipal_official')) DEFAULT 'citizen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue categories table
CREATE TABLE IF NOT EXISTS public.issue_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issues table
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.issue_categories(id),
  municipality_id UUID REFERENCES public.municipalities(id),
  reporter_id UUID REFERENCES public.profiles(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  status TEXT CHECK (status IN ('reported', 'acknowledged', 'in_progress', 'resolved', 'closed')) DEFAULT 'reported',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  image_url TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue updates table
CREATE TABLE IF NOT EXISTS public.issue_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  message TEXT NOT NULL,
  status_change TEXT,
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue votes table
CREATE TABLE IF NOT EXISTS public.issue_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(issue_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for municipalities (public read)
CREATE POLICY "Allow public read access to municipalities" ON public.municipalities FOR SELECT USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for issue categories (public read)
CREATE POLICY "Allow public read access to issue categories" ON public.issue_categories FOR SELECT USING (true);

-- RLS Policies for issues (public read, authenticated write)
CREATE POLICY "Allow public read access to issues" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to create issues" ON public.issues FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Allow users to update their own issues" ON public.issues FOR UPDATE USING (auth.uid() = reporter_id);

-- RLS Policies for issue updates (public read, authenticated write)
CREATE POLICY "Allow public read access to issue updates" ON public.issue_updates FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to create updates" ON public.issue_updates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for issue votes (public read, authenticated write)
CREATE POLICY "Allow public read access to issue votes" ON public.issue_votes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to vote" ON public.issue_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own votes" ON public.issue_votes FOR DELETE USING (auth.uid() = user_id);
