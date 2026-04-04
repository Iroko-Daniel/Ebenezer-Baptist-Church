-- =====================================================
-- CONSOLIDATED DATABASE SCHEMA
-- Ebenezer Baptist Church Website
-- Complete database setup - Run this in Supabase SQL Editor
-- =====================================================
-- This file consolidates all schema files into one comprehensive setup.
-- Includes: tables, indexes, default data, RLS policies, and site settings.
-- =====================================================

-- =====================================================
-- 1. CREATE ALL TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS sermons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  preacher TEXT NOT NULL,
  bible_text TEXT NOT NULL,
  date DATE NOT NULL,
  image_url TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('normal', 'high', 'urgent')) DEFAULT 'normal',
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT,
  address TEXT,
  is_member TEXT,
  body TEXT,
  prayer_request TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT,
  service_times TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS livestream (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'technician')) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS executives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  bio TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text',
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_date ON announcements(date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(type);
CREATE INDEX IF NOT EXISTS idx_executives_sort ON executives(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

-- =====================================================
-- 3. INSERT DEFAULT DATA
-- =====================================================

-- Default livestream record
INSERT INTO livestream (youtube_url, is_active)
VALUES ('https://www.youtube.com/embed/?rel=0', false)
ON CONFLICT DO NOTHING;

-- Default branch locations
INSERT INTO branches (name, address, city, phone, service_times)
VALUES
  ('Lagos Branch (Main)', '50A Campbell Street, Lagos Island', 'Lagos Island, Lagos', '+234 802 345 6789', 'Sunday School: 9:00 AM | Main Service: 10:00 AM'),
  ('Ikorodu Branch', '15 Lagos Street, Ikorodu', 'Ikorodu, Lagos', '+234 801 234 5678', 'Sunday Service: 10:00 AM'),
  ('Badagry Branch', '28 Marina Road, Badagry', 'Badagry, Lagos', '+234 803 456 7890', 'Sunday Service: 9:30 AM')
ON CONFLICT DO NOTHING;

-- Default users (passwords: admin123, technician123)
-- SHA-256 hashes used by lib/auth.ts
INSERT INTO users (username, password_hash, role)
VALUES
  ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin'),
  ('technician', '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', 'technician')
ON CONFLICT (username) DO NOTHING;

-- Default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('church_name', 'Ebenezer Baptist Church', 'text', 'Official church name'),
  ('church_tagline', 'A Place of Worship and Community', 'text', 'Church tagline/motto'),
  ('church_address', '50A Campbell Street, Lagos Island, Lagos', 'text', 'Main church address'),
  ('church_phone', '+234 802 345 6789', 'text', 'Main church phone number'),
  ('church_email', 'info@ebenezerbaptist.org', 'text', 'Church email'),
  ('founded_year', '1888', 'text', 'Year church was founded'),
  ('church_motto', '...led by the Spirit of God', 'text', 'Church motto verse'),
  ('logo_url', '/logo.png', 'image_url', 'Path to church logo'),
  ('service_times', 'Sunday School: 9:00 AM | Main Service: 10:00 AM', 'textarea', 'Regular service schedule'),
  ('wednesday_service', 'Wednesday Bible Study: 6:00 PM', 'textarea', 'Midweek service time'),
  ('friday_service', 'Friday Prayer Meeting: 7:00 PM', 'textarea', 'Friday service time'),
  ('stat_community', '300+', 'text', 'Community member count display'),
  ('stat_active_members', '359+', 'text', 'Active member count display'),
  ('stat_years', '138+', 'text', 'Years of service count display'),
  ('facebook_url', '', 'url', 'Facebook page URL'),
  ('twitter_url', '', 'url', 'Twitter/X profile URL'),
  ('youtube_url', '', 'url', 'YouTube channel URL'),
  ('instagram_url', '', 'url', 'Instagram profile URL')
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Drop all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow all sermons" ON sermons;
DROP POLICY IF EXISTS "Allow all events" ON events;
DROP POLICY IF EXISTS "Allow all announcements" ON announcements;
DROP POLICY IF EXISTS "Allow all gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Allow all enquiries" ON enquiries;
DROP POLICY IF EXISTS "Allow all branches" ON branches;
DROP POLICY IF EXISTS "Allow all livestream" ON livestream;
DROP POLICY IF EXISTS "Allow all users" ON users;
DROP POLICY IF EXISTS "Allow all executives" ON executives;
DROP POLICY IF EXISTS "Allow all site_settings" ON site_settings;

-- Enable RLS on all tables
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestream ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create simple "Allow All" policies for each table
CREATE POLICY "Allow all sermons" ON sermons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all announcements" ON announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all gallery_images" ON gallery_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all enquiries" ON enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all branches" ON branches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all livestream" ON livestream FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all executives" ON executives FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 5. STORAGE BUCKET POLICIES (for gallery bucket)
-- =====================================================

-- Drop existing storage policies first
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;

-- Create storage policies for gallery bucket
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Allow public viewing" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Allow public deletes" ON storage.objects FOR DELETE USING (bucket_id = 'gallery');

-- =====================================================
-- 6. ADDITIONAL TABLES (About Content & Core Values)
-- =====================================================

-- Create the about_content table
CREATE TABLE IF NOT EXISTS about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the core_values table
CREATE TABLE IF NOT EXISTS core_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for about tables
CREATE INDEX IF NOT EXISTS idx_about_content_section ON about_content(section);
CREATE INDEX IF NOT EXISTS idx_core_values_sort ON core_values(sort_order ASC);

-- Drop existing policies for about tables to avoid conflicts
DROP POLICY IF EXISTS "Allow all about_content" ON about_content;
DROP POLICY IF EXISTS "Allow all core_values" ON core_values;

-- Enable Row Level Security for about tables
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;

-- Create "Allow All" policies for about tables
CREATE POLICY "Allow all about_content" ON about_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all core_values" ON core_values FOR ALL USING (true) WITH CHECK (true);

-- Insert default church history
INSERT INTO about_content (section, content)
VALUES (
  'history',
  'Ebenezer Baptist Church traces its roots to the vibrant Christian community that emerged in Lagos Island during the late 19th century. The church was founded in 1888 by a group of devoted Christians who desired to establish a place of worship that would serve the spiritual needs of the growing population in the Marina area.

The name "Ebenezer" means "stone of help" in Hebrew, taken from 1 Samuel 7:12, where Samuel set up a stone to commemorate God''s help and protection. The founders chose this name to testify of God''s faithfulness and assistance in their journey of faith.

From its humble beginnings in a small structure, the church grew steadily under the leadership of dedicated pastors and lay leaders. The congregation consisted mainly of traders, professionals, and families who lived and worked in the bustling Lagos Island area.

Throughout the years, Ebenezer Baptist Church has been a beacon of hope and spiritual guidance to its members and the surrounding community. The church played a significant role in the establishment of educational institutions and social welfare programs in the Lagos Island area.

The church building itself is a testimony to the faithfulness of God and the dedication of its members. Over the decades, it has been renovated and expanded to accommodate the growing congregation while preserving its historical heritage and architectural significance.

Today, Ebenezer Baptist Church continues to thrive as a vibrant center of worship, discipleship, and community service. With a rich history spanning over 138 years, the church remains committed to its founding vision of reaching the unreached with the message of the cross in the power of the Holy Spirit.'
) ON CONFLICT (section) DO NOTHING;

-- Insert default vision
INSERT INTO about_content (section, content)
VALUES (
  'vision',
  'Reaching the unreached with the message of the cross in the power of the Holy Spirit.

Motto: "...led by the Spirit of God"'
) ON CONFLICT (section) DO NOTHING;

-- Insert default mission
INSERT INTO about_content (section, content)
VALUES (
  'mission',
  'Our mission is to glorify God by making disciples who are Spirit-filled, word-based, and committed to transforming lives and communities through the gospel of Jesus Christ.'
) ON CONFLICT (section) DO NOTHING;

-- Insert default core values
INSERT INTO core_values (title, description, sort_order)
VALUES
  ('Faith Inspired', 'We are committed to walking by faith and not by sight.', 1),
  ('Generous Hearts', 'We believe in giving cheerfully and sacrificially.', 2),
  ('Holy Spirit Dependent', 'We rely on the Holy Spirit for guidance and power.', 3),
  ('Joy', 'We serve God with gladness and joy.', 4),
  ('Love', 'Love is the foundation of all we do.', 5),
  ('People First', 'We prioritize people over programs.', 6),
  ('Responsible Stewardship', 'We are faithful managers of God''s resources.', 7),
  ('Soul Winning', 'We are committed to sharing the gospel with the world.', 8)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. GIVING ACCOUNTS TABLE
-- =====================================================

-- Create the give_accounts table
CREATE TABLE IF NOT EXISTS give_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bank TEXT NOT NULL,
  purpose TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  sort_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_give_accounts_sort ON give_accounts(sort_order ASC);

-- Drop existing policy for give_accounts to avoid conflicts
DROP POLICY IF EXISTS "Allow all give_accounts" ON give_accounts;

-- Enable Row Level Security
ALTER TABLE give_accounts ENABLE ROW LEVEL SECURITY;

-- Create "Allow All" policy
CREATE POLICY "Allow all give_accounts" ON give_accounts FOR ALL USING (true) WITH CHECK (true);

-- Insert default bank accounts
INSERT INTO give_accounts (bank, purpose, account_name, account_number, sort_order, is_active)
VALUES
  ('Polaris Bank', 'Tithes & Offering', 'Ebenezer Baptist Church', '4090684422', 1, true),
  ('First Bank', 'Other Payments', 'Ebenezer Baptist Church', '2000515142', 2, true),
  ('FCMB', 'Benevolence', 'Ebenezer Baptist Church', '2963644010', 3, true),
  ('First Bank', 'Single-Again Fellowship', 'The Single-Again Fellowship', '20076799010', 4, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- SETUP COMPLETE!
-- Next Steps:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create "gallery" bucket and toggle Public ON
-- 3. Test login: admin / admin123  OR  technician / technician123
-- =====================================================
