# Database Schema Summary
# Last Updated: April 9, 2026
# File: database/schema.sql

## Tables (15 Total)

### 1. sermons
- id, title, preacher, bible_text, date, image_url, content, created_at

### 2. events  
- id, title, date, description, location, image_url, created_at

### 3. announcements
- id, title, content, priority (normal/high/urgent), date, created_at

### 4. gallery_images
- id, url, title, category, created_at

### 5. enquiries
- id, type, first_name, last_name, phone, gender, address, is_member, body, prayer_request, created_at

### 6. branches
- id, name, address, city, phone, service_times, created_at

### 7. livestream
- id, youtube_url, is_active, updated_at

### 8. login_logs ⭐ (Includes Device Name)
- id, user_id, username, role
- ip_address, user_agent
- browser_name, browser_version
- os_name, os_version
- device_type, **device_name** ← Device name is recorded here!
- screen_resolution, language
- connection_type, network_type, platform
- cpu_cores, memory_mb, touch_support, timezone
- login_at, logout_at, is_active

### 9. users
- id, username (unique), password_hash, role (admin/technician), created_at

### 10. leaders
- id, name, position, bio, photo_url, sort_order, created_at

### 11. executives
- id, name, title, image_url, bio, sort_order, created_at

### 12. site_settings
- id, setting_key (unique), setting_value, updated_at

### 13. about_content
- id, section (unique), content, updated_at

### 14. core_values
- id, title, description, sort_order, created_at

### 15. give_accounts
- id, bank, purpose, account_name, account_number, sort_order, is_active, created_at

## What's Already Included

✅ All tables created
✅ Indexes for performance
✅ Default data (users, settings, branches, etc.)
✅ Row Level Security (RLS) policies
✅ Storage bucket setup
✅ Device name tracking in login_logs

## Schema is Complete and Up-to-Date

The `database/schema.sql` file is ready to use. Just run it in your Supabase SQL Editor!
