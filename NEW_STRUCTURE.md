# Ebenezer Baptist Church - Project Structure

```
ebenezer-baptist-church/
│
├── 📁 app/                              # Next.js App Router
│   ├── 📁 (admin)/                      # Admin Route Group
│   │   ├── 📁 admin/                    # Admin dashboard
│   │   └── 📁 technician/               # Technician portal
│   ├── 📁 (public)/                     # Public Route Group
│   │   ├── 📁 about/
│   │   ├── 📁 announcements/
│   │   ├── 📁 branches/
│   │   ├── 📁 enquire/
│   │   ├── 📁 events/
│   │   ├── 📁 gallery/
│   │   ├── 📁 give/
│   │   ├── 📁 livestream/
│   │   └── 📁 sermons/
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
│
├── 📁 components/                       # React Components
│   ├── 📁 ui/                           # Reusable UI elements
│   ├── 📁 layout/                       # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── 📁 forms/                        # Form components
│   │   └── EnquiryForm.tsx
│   └── 📁 features/                     # Feature components
│       └── Notifications.tsx
│
├── 📁 lib/                              # Shared Libraries
│   ├── 📁 supabase/                     # Supabase client
│   ├── auth.ts
│   ├── site-settings.ts
│   └── types.ts
│
├── 📁 database/                         # Database & Migrations
│   ├── about_content.sql
│   ├── give_accounts.sql
│   └── schema.sql
│
├── 📁 public/                           # Static Assets
│   ├── 📁 fonts/
│   ├── 📁 gallery/
│   ├── 📁 icons/
│   └── 📁 images/
│
├── 📁 docs/                             # Documentation
├── 📁 hooks/                            # Custom React Hooks
├── 📁 styles/                           # Global Styles
├── 📁 types/                            # TypeScript Types
├── 📁 utils/                            # Utility Functions
│
├── .env.local                           # Environment variables
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── STRUCTURE.md
```

## Key Improvements

✅ **Route Groups**: Admin and public routes separated using Next.js `(admin)` and `(public)` groups  
✅ **Component Organization**: Components categorized by purpose (ui, layout, forms, features)  
✅ **Clear Separation**: Business logic, utilities, and types in dedicated folders  
✅ **Scalable Structure**: Easy to add new features without confusion  
✅ **Professional Layout**: Follows Next.js and React best practices  

## Next Steps

- Move existing route imports to use new path structure (if needed)
- Add components to appropriate subfolders as you build
- Update import statements in existing files to reflect new component locations
