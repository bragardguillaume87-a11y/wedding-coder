# Wedding-Coder AI Agent Instructions

## Architecture Overview
This is a Next.js 16 wedding planning application using Supabase for authentication and database. The app manages wedding ceremonies and local events with user authentication.

**Key Components:**
- **Auth Flow**: Login/signup on `/` redirects to `/dashboard`
- **Database Tables**: `users`, `main_ceremony`, `local_events`, `invitation_links`, `available_dates`
- **Middleware**: Auto-syncs authenticated users to `users` table (see `app/middleware.js`)
- **Client Auth**: Use `useUser` hook from `lib/useUser.ts` for auth state in components

## Critical Patterns

### Authentication & User Management
- **Client-side auth**: Import `supabase` from `@/lib/supabase` and `useUser` from `@/lib/useUser`
- **Server-side sync**: Middleware handles user creation in `users` table on auth
- **Post-auth redirect**: After login, use `window.location.href = "/dashboard"` (not Next.js router for full page reload)
- **User data access**: Always check `user` from `useUser()` hook before rendering protected content

### Database Operations
- **Supabase client**: Always use the client from `@/lib/supabase.js`
- **Table relationships**: `local_events.ceremony_id` references `main_ceremony.id`
- **INSERT issue**: Current bug where `INSERT INTO users` returns "Success. No rows returned" - likely RLS policy or trigger issue
- **Data fetching**: Use `.select("*")` with `.order()` for consistent sorting

### Component Structure
- **Client components**: Mark with `"use client"` for auth forms and interactive pages
- **Form handling**: Use controlled components with `useState` for form data
- **Error handling**: Display messages in French (e.g., "Erreur: ${error.message}")
- **Loading states**: Show loading indicators during async operations

### Navigation & Routing
- **App Router**: Use `useRouter` from `next/navigation` for programmatic navigation
- **Protected routes**: Check `user` in `useEffect` and redirect to `/` if not authenticated
- **Path alias**: Import with `@/` prefix (configured in `tsconfig.json`)

### Styling
- **Tailwind CSS v4**: Use utility classes directly in JSX
- **Background gradients**: Common pattern `bg-linear-to-br from-blue-50 to-indigo-100`
- **Responsive design**: Use Tailwind responsive prefixes for mobile-first approach

## Development Workflow
- **Start dev server**: `npm run dev` (serves on http://localhost:3000)
- **Build**: `npm run build` (check for TypeScript errors)
- **Environment**: Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

## Common Gotchas
- **INSERT returns**: If database inserts show "No rows returned", check Supabase RLS policies
- **Auth redirects**: Use `window.location.href` for auth redirects to ensure middleware runs
- **User sync**: Middleware creates users, but verify table constraints aren't blocking inserts
- **Ceremony assumption**: Create-event assumes `ceremony_id: 1` exists - may need dynamic lookup

## Key Files
- `lib/supabase.js`: Supabase client configuration
- `lib/useUser.ts`: Authentication hook
- `app/middleware.js`: Server-side user synchronization
- `app/dashboard/page.tsx`: Events listing with auth protection
- `app/dashboard/create-event/page.tsx`: Event creation form</content>
<parameter name="filePath">c:\Users\Guillaume\Documents\wedding-coder\.github\copilot-instructions.md