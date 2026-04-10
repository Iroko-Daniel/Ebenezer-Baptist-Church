# Ebenezer Baptist Church Website

A modern, full-stack website for Ebenezer Baptist Church - A Place of Worship and Community.

Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase project (free tier works)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Iroko-Daniel/Ebenezer-Baptist-Church.git
   cd Ebenezer-Baptist-Church
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   To get these credentials:
   - Go to your Supabase project dashboard
   - Click **Project Settings** (gear icon) → **API**
   - Copy the **Project URL** and **anon public** key

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

### One-Step Database Setup

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard
   - Click on your project
   - Click **SQL Editor** in the left sidebar
   - Click **New query**

2. **Run the schema:**
   - Open the file: `database/schema.sql`
   - Copy ALL content (Ctrl+A, Ctrl+C)
   - Paste into the SQL Editor (Ctrl+V)
   - Click **Run** or press Ctrl+Enter
   - Wait for it to complete (~10 seconds)

3. **Verify the setup:**
   - Click **Table Editor** in the left sidebar
   - You should see 15 tables including:
     - ✅ `users` (with 2 default users)
     - ✅ `sermons`, `events`, `announcements`
     - ✅ `gallery_images`, `enquiries`, `branches`
     - ✅ `livestream`, `login_logs`, `leaders`
     - ✅ `executives`, `site_settings`
     - ✅ `about_content`, `core_values`, `give_accounts`

### Create Storage Bucket

1. In Supabase, go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name it: `gallery`
4. Toggle **Public bucket** to ON
5. Click **Create bucket**

### Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| technician | technician123 | Technician |

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── (admin)/             # Admin routes (protected)
│   │   ├── admin/           # Admin dashboard
│   │   └── technician/      # Technician dashboard
│   ├── (public)/            # Public routes
│   │   ├── about/           # About pages
│   │   ├── announcements/   # Announcements
│   │   ├── branches/        # Church branches
│   │   ├── enquire/         # Enquiry forms
│   │   ├── events/          # Events
│   │   ├── gallery/         # Photo gallery
│   │   ├── give/            # Giving/tithes
│   │   ├── livestream/      # Livestream
│   │   └── sermons/         # Sermons
│   ├── login/               # Login page
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── layout/             # Header, Footer
│   └── features/           # Feature-specific components
├── lib/                    # Utilities & libraries
│   ├── supabase/          # Supabase client
│   ├── auth.ts            # Authentication
│   └── site-settings.ts   # Site configuration
├── database/              # Database schemas
│   └── schema.sql         # Complete database schema
└── public/                # Static assets
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Features

### Public Features
- **Home Page** - Welcome section with service times
- **About** - Church history, mission, vision, values, executives
- **Media** - Sermons, events, gallery, livestream
- **Announcements** - Church announcements with priority levels
- **Enquire** - Forms for new visitors, counselling, marriage, child dedication, prayer requests, testimonies
- **Branches** - Church branch locations
- **Give** - Online giving with multiple bank accounts

### Admin Features
- **Admin Dashboard** - Full site management
- **User Management** - Create and manage user accounts
- **Content Management** - Manage sermons, events, announcements, gallery
- **Login Logs** - Track user login/logout activity with device info
- **Site Settings** - Configure church information, service times, contact details

### Technical Features
- **Responsive Design** - Mobile-first with Tailwind CSS
- **Expandable Mobile Menu** - Collapsible navigation sections on mobile
- **Authentication** - Username/password-based auth with role-based access
- **Row Level Security** - Supabase RLS policies for data protection
- **Device Fingerprinting** - Track login sessions across devices
- **TypeScript** - Full type safety

## 🗃️ Database Schema

### Tables (15 total)

1. **`users`** - User accounts (admin & technician roles)
2. **`sermons`** - Church sermons with images and media
3. **`events`** - Church events with dates
4. **`announcements`** - Announcements with priority levels
5. **`gallery_images`** - Photo gallery uploads
6. **`enquiries`** - User enquiries and prayer requests
7. **`branches`** - Church branch locations
8. **`livestream`** - YouTube livestream configuration
9. **`login_logs`** - User login/logout tracking with device info
10. **`leaders`** - Church leaders
11. **`executives`** - Church executive members
12. **`site_settings`** - Site configuration (church name, address, service times)
13. **`about_content`** - About page content (history, vision, mission)
14. **`core_values`** - Church core values
15. **`give_accounts`** - Bank accounts for tithes/offerings

## 🚨 Troubleshooting

### "Database query timed out" Error

**Solution:** The `site_settings` table doesn't exist yet. Run the database schema as described in the Database Setup section.

### "Error creating user: {}"

**Root Cause:** The `users` table doesn't exist or there's a connection issue.

**Solution:**

1. **Verify Supabase connection:**
   - Check `.env.local` has correct credentials
   - Ensure your Supabase project is not paused

2. **Create the users table:**
   - **Option A (Recommended):** Run the full `database/schema.sql` file
   - **Option B (Quick fix):** Run only `create-users-table-only.sql`

3. **Verify the table was created:**
   - Go to **Table Editor** in Supabase
   - Look for the `users` table
   - You should see 2 default users (admin and technician)

### Common Error Messages

| Error Message | Solution |
|--------------|----------|
| "The users table does not exist" | Run the `schema.sql` file in SQL Editor |
| "Username already exists" | Choose a different username |
| "Cannot connect to Supabase" | Check internet connection and `.env.local` |
| "Permission denied" | Check RLS policies in Table Editor |

### Debugging Tips

1. **Check browser console** (F12) for detailed error messages
2. **Verify environment variables** in `.env.local`
3. **Restart dev server** with `npm run dev`
4. **Clear browser cache** and try again
5. **Check Supabase project** is not paused

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

**Note:** Make sure to run the database schema in Supabase before deploying.

## 📝 Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI:** React 19
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Custom Supabase-based auth
- **Deployment:** Vercel
- **Icons:** React Icons

## 🤝 Contributing

This is a church website project. If you're part of the development team, feel free to submit improvements and bug fixes.

## 📄 License

Private project - All rights reserved

---

**Need Help?** Check the troubleshooting section above or review the browser console for detailed error messages.
