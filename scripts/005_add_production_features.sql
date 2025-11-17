-- Add notifications table for real-time updates
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('status_change', 'new_update', 'vote_milestone', 'assigned')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add issue assignments table
CREATE TABLE IF NOT EXISTS public.issue_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id),
  assigned_by UUID REFERENCES public.profiles(id),
  department TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(issue_id, assigned_to)
);

-- Add analytics tracking
CREATE TABLE IF NOT EXISTS public.issue_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipality_id UUID REFERENCES public.municipalities(id),
  date DATE NOT NULL,
  total_issues INTEGER DEFAULT 0,
  resolved_issues INTEGER DEFAULT 0,
  avg_resolution_time_hours DECIMAL(10, 2),
  citizen_satisfaction DECIMAL(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(municipality_id, date)
);

-- Add vote_type column to support upvote/downvote
ALTER TABLE public.issue_votes ADD COLUMN IF NOT EXISTS vote_type TEXT CHECK (vote_type IN ('up', 'down')) DEFAULT 'up';

-- Add resolved_at timestamp for SLA tracking
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- RLS Policies for assignments
CREATE POLICY "Allow public read access to assignments" ON public.issue_assignments FOR SELECT USING (true);
CREATE POLICY "Municipal officials can create assignments" ON public.issue_assignments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'municipal_official')
);

-- RLS Policies for analytics
CREATE POLICY "Allow public read access to analytics" ON public.issue_analytics FOR SELECT USING (true);
CREATE POLICY "System can manage analytics" ON public.issue_analytics FOR ALL USING (true);

-- Create function to automatically create notifications
CREATE OR REPLACE FUNCTION create_status_change_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, issue_id, type, title, message)
    VALUES (
      NEW.reporter_id,
      NEW.id,
      'status_change',
      'Issue Status Updated',
      'Your reported issue "' || NEW.title || '" status changed to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status changes
DROP TRIGGER IF EXISTS issue_status_change_notification ON public.issues;
CREATE TRIGGER issue_status_change_notification
AFTER UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION create_status_change_notification();

-- Create function to track resolution time
CREATE OR REPLACE FUNCTION update_resolution_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for resolution tracking
DROP TRIGGER IF EXISTS track_resolution_time ON public.issues;
CREATE TRIGGER track_resolution_time
BEFORE UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION update_resolution_time();
