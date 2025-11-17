-- Insert South African municipalities
INSERT INTO public.municipalities (name, province, contact_email, contact_phone) VALUES
('City of Cape Town', 'Western Cape', 'info@capetown.gov.za', '021 400 1111'),
('City of Johannesburg', 'Gauteng', 'callcentre@joburg.org.za', '011 375 5555'),
('eThekwini Municipality', 'KwaZulu-Natal', 'info@durban.gov.za', '031 311 1111'),
('City of Tshwane', 'Gauteng', 'info@tshwane.gov.za', '012 358 7911'),
('Nelson Mandela Bay Municipality', 'Eastern Cape', 'info@mandelametro.gov.za', '041 506 5000'),
('Buffalo City Municipality', 'Eastern Cape', 'info@buffalocity.gov.za', '043 705 2000');

-- Insert issue categories
INSERT INTO public.issue_categories (name, description, icon, color) VALUES
('Potholes', 'Road surface damage and potholes', '🕳️', '#EF4444'),
('Water Issues', 'Water leaks, burst pipes, and water quality problems', '💧', '#3B82F6'),
('Water Leakage', 'Visible water leaks from pipes and infrastructure', '💨', '#0EA5E9'),
('Electricity', 'Power outages, street lighting, and electrical issues', '⚡', '#F59E0B'),
('Waste Management', 'Garbage collection, illegal dumping, and recycling', '🗑️', '#10B981'),
('Garbage Report', 'Overflowing garbage bins and improper waste disposal', '🗑️', '#059669'),
('Traffic & Transport', 'Traffic lights, road signs, and public transport', '🚦', '#8B5CF6'),
('Parks & Recreation', 'Public spaces, playgrounds, and recreational facilities', '🌳', '#059669'),
('Housing', 'Housing issues, informal settlements, and building maintenance', '🏠', '#DC2626'),
('Safety & Security', 'Crime, vandalism, and public safety concerns', '🛡️', '#7C2D12');
