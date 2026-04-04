# Project Structure

This document outlines the organized folder structure for the Ebenezer Baptist Church web application.

## Directory Overview

```
ebenezer-baptist-church/
├── app/                      # Next.js App Router (pages & layouts)
│   ├── (admin)/             # Admin routes (route group)
│   │   ├── admin/           # Admin dashboard
│   │   └── technician/      # Technician portal
│   ├── (public)/            # Public routes (route group)
│   │   ├── about/
│   │   ├── announcements/
│   │   ├── branches/
│   │   ├── enquire/
│   │   ├── events/
│   │   ├── gallery/
│   │   ├── give/
│   │   ├── livestream/
│   │   └── sermons/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── loading.tsx          # Loading UI
│   ├── error.tsx            # Error boundary
│   └── not-found.tsx        # 404 page
│
├── components/              # React components
│   ├── ui/                  # Reusable UI components (buttons, inputs, etc.)
│   ├── layout/              # Layout components (Header, Footer, etc.)
│   ├── forms/               # Form components
│   └── features/            # Feature-specific components
│
├── lib/                     # Shared utilities & configurations
│   ├── supabase/            # Supabase client & utilities
│   ├── auth.ts              # Authentication logic
│   ├── site-settings.ts     # Site configuration
│   └── types.ts             # TypeScript type definitions
│
├── database/                # Database schema & migrations
│   ├── schema.sql           # Main database schema
│   ├── about_content.sql    # About page content
│   └── give_accounts.sql    # Giving accounts data
│
├── docs/                    # Documentation
├── public/                  # Static assets (images, fonts, icons)
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles/                  # Global styles (if not in app/)
├── utils/                   # Utility functions
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions (if separate)
├── middleware.ts             # Next.js middleware
├── .env.local               # Environment variables (not in git)
├── .gitignore               # Git ignore rules
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── eslint.config.mjs        # ESLint configuration
├── package.json             # Dependencies & scripts
└── README.md                # Project documentation
```

## Key Principles

- **Route Groups**: Admin and public routes are separated using Next.js route groups
- **Component Organization**: Components are categorized by purpose (UI, layout, forms, features)
- **Separation of Concerns**: Business logic, utilities, and types are in dedicated folders
- **Database Management**: SQL files are organized in the database folder
- **Static Assets**: All public assets go in the `public/` directory
