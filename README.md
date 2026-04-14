# Monedo

A web app for daily financial expense tracking, built with TanStack Start, React, TypeScript, Tailwind CSS, and Supabase.

## Stack

- [TanStack Start](https://tanstack.com/start): Full-stack React framework with Vite, SSR, and file-based routing
- [TanStack Router](https://tanstack.com/router): Type-safe routing
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) (shadcn-style components)
- [Supabase](https://supabase.com/): PostgreSQL database and auth
- [Clerk](https://clerk.com/): Authentication
- [Zustand](https://zustand-demo.pmnd.rs/): State management
- [TanStack Query](https://tanstack.com/query): Data fetching
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/): Forms and validation

## Setup

1. Copy `.env.example` to `.env` and fill in:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
├── app/
│   ├── routes/           # File-based routes
│   │   ├── __root.tsx    # Root layout
│   │   ├── sign-in.tsx
│   │   └── _authenticated/  # Protected routes
│   ├── router.tsx
│   ├── client.tsx
│   └── ssr.tsx
├── components/
│   ├── ui/               # shadcn-style components
│   ├── dashboard/
│   ├── layout/
│   └── ...
├── stores/
├── hooks/
├── lib/
└── ...
```

## Migration

This project was migrated from React Native/Expo to TanStack Start (web-only). See `MIGRATION_PLAN.md` for details.
