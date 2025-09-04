-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  degree VARCHAR(255) NOT NULL,
  degree_other VARCHAR(255),
  course VARCHAR(255) NOT NULL,
  course_other VARCHAR(255),
  experience_years INTEGER NOT NULL,
  experience_details TEXT NOT NULL,
  project VARCHAR(255) NOT NULL,
  resume_filename VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at DESC);
CREATE INDEX idx_applications_email ON applications(email);

-- Create admin users table (for authentication)
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Store plain text passwords for now
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Insert a default admin user (password: admin123)
-- You can manually insert more admin users in Supabase
INSERT INTO admin_users (email, password, name) VALUES 
('admin@lifewood.com', 'admin123', 'Admin User');

-- You can also manually insert additional admin users via Supabase dashboard:
-- INSERT INTO admin_users (email, password, name) VALUES 
-- ('your-email@example.com', 'your-password', 'Your Name');

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for applications table
-- Allow all operations for authenticated users (you'll need to implement proper auth)
CREATE POLICY "Allow all operations for authenticated users" ON applications
  FOR ALL USING (true);

-- Create policies for admin_users table
CREATE POLICY "Allow all operations for authenticated users" ON admin_users
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
