# Ebenezer Baptist Church Website

A modern, comprehensive church website built with Next.js 16, TypeScript, Tailwind CSS v4, and Supabase.

**🌐 Live Site**: [Visit Website](https://your-domain.vercel.app)

## ✨ Features

### Public Pages
- **Home** — Hero section, service times, statistics, announcements, events, sermons, and call-to-action
- **About** — Church history, mission, vision, values, and executives
- **Sermons** — Browse and read sermon messages with Bible references
- **Events** — Upcoming church events with dates and locations
- **Gallery** — Photo gallery with category filtering
- **Livestream** — Embedded YouTube livestream player
- **Announcements** — Priority-coded announcements (Normal, High, Urgent)
- **Enquiry Forms** — Contact forms for various needs:
  - New to Church
  - Counselling
  - Getting Married
  - Child Dedication
  - Prayer Requests
  - Testimonies
- **Branches** — All church locations
- **Give Now** — Bank account details with copy-to-clipboard

### Admin Dashboard (`/admin`)
- Manage sermons, events, announcements
- Upload and manage gallery images
- Configure livestream settings
- View and manage enquiries
- Manage site settings (church name, logo, address, etc.)

### Technician Portal (`/technician`)
- All admin capabilities
- Manage bank accounts for Give page
- Add/edit/delete enquiries
- User management (admins & technicians)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Storage, RLS)
- **Deployment**: Vercel
- **Icons**: React Icons, SVG icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

```bash
# Clone the repository
cd ebenezer-website

# Install dependencies
npm install

# Set up environment variables
# Edit .env.local with your Supabase credentials
```

### Environment Variables

Create/update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a project at [Supabase](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the schema files in order:
   - `database/schema.sql` — Main database schema
   - `database/give_accounts.sql` — Bank accounts table

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
ebenezer-website/
├── app/                      # Next.js pages
│   ├── about/               # About & executives
│   ├── admin/               # Admin dashboard
│   ├── announcements/       # Announcements
│   ├── branches/            # Church branches
│   ├── enquire/             # Enquiry forms
│   ├── events/              # Events
│   ├── gallery/             # Photo gallery
│   ├── give/                # Give Now page
│   ├── livestream/          # Livestream
│   ├── sermons/             # Sermons
│   ├── technician/          # Technician dashboard
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Site footer
│   ├── Notifications.tsx    # Enquiries viewer
│   └── EnquiryForm.tsx      # Form component
├── database/                # SQL migrations
│   ├── schema.sql           # Main database schema
│   └── give_accounts.sql    # Bank accounts schema
├── lib/                     # Utilities
│   ├── supabase/            # Supabase clients
│   ├── auth.ts              # Authentication
│   └── site-settings.ts     # Site settings helper
├── public/                  # Static assets
│   └── logo.png             # Church logo
├── docs/                    # Documentation
│   └── DEPLOYMENT.md        # Deployment guide
├── .env.local               # Environment variables
├── package.json             # Dependencies
├── next.config.ts           # Next.js config
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

## 🎨 Design

### Color Palette
- **Primary**: Navy Blue `#1e3a5f`
- **Accent**: Gold `#d4af37`
- **Secondary**: Burgundy `#7a2040`

### Features
- Responsive mobile-first design
- Glassmorphism effects on cards
- Smooth hover animations
- Dropdown navigation with arrow indicators
- Gold accents and gradient backgrounds

## 🔐 Default Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Technician:**
- Username: `technician`
- Password: `technician123`

⚠️ **Change these passwords in production!**

## 📱 Social Media

- **Facebook**: https://www.facebook.com/ebenezerbclagos50A/
- **YouTube**: https://www.youtube.com/@ebenezerbaptistchurch2246
- **Instagram**: https://www.instagram.com/ebenezerbclagos/

## 📍 Church Information

**Ebenezer Baptist Church**  
50A Campbell Street, Lagos Island, Lagos  
Founded: 1888  
*"…led by the Spirit of God"*

## 📝 License

Created for Ebenezer Baptist Church.

---

**Need help?** Contact the church administrator or refer to `docs/DEPLOYMENT.md`
