# Monedo: React Native/Expo → TanStack Start (Web-Only) Migration Plan

> **Goal:** Migrate the Monedo expense-tracking app from React Native + Expo to TanStack Start as a fully web application. No native targets.

---

## 1. Executive Summary

| Current | Target |
|--------|--------|
| React Native 0.82 + Expo 54 | React 19 + TanStack Start (Vite) |
| Expo Router (file-based) | TanStack Router (file-based) |
| NativeWind + @rn-primitives | Tailwind CSS + shadcn/ui |
| @clerk/clerk-expo | @clerk/clerk-react |
| react-native-gifted-charts | Recharts or Chart.js |
| Zustand + Supabase + TanStack Query | Same (reusable) |

**Reusable as-is:** Supabase, TanStack Query, Zustand, Zod, React Hook Form, date-fns, clsx, tailwind-merge, class-variance-authority.

---

## 2. Phase Overview

| Phase | Scope | Invasiveness |
|-------|-------|--------------|
| **1** | Scaffold TanStack Start, routing, auth | New project structure |
| **2** | Data layer (Supabase, stores, hooks) | Minimal changes |
| **3** | Layout & theme | New components |
| **4** | UI primitives (@rn-primitives → shadcn) | High – all components |
| **5** | Feature pages & forms | Medium – wiring |
| **6** | Charts, modals, polish | Medium |
| **7** | Cleanup & removal of RN/Expo | Config & deps |

---

## 3. Phase 1: Scaffold & Routing

### 3.1 Create TanStack Start Project

```bash
pnpm create @tanstack/start@latest monedo-web
# or: npx @tanstack/cli create
```

Choose React, TypeScript, Tailwind. This gives you Vite + TanStack Router + Tailwind.

### 3.2 Route Mapping (Expo → TanStack Router)

| Expo Route | TanStack Route File |
|------------|---------------------|
| `(public)/sign-in` | `routes/sign-in.tsx` |
| `(auth)/(tabs)` (index) | `routes/_authenticated/index.tsx` |
| `(auth)/(tabs)/statistics` | `routes/_authenticated/statistics.tsx` |
| `(auth)/(tabs)/wallet` | `routes/_authenticated/wallet/index.tsx` |
| `(auth)/(tabs)/wallet/edit/[id]` | `routes/_authenticated/wallet/edit.$id.tsx` |
| `(auth)/(tabs)/profile` | `routes/_authenticated/profile/index.tsx` |
| `(auth)/(modals)/add-expense` | `routes/_authenticated/add-expense.tsx` (or modal route) |
| `(auth)/(modals)/details/[id]` | `routes/_authenticated/details.$id.tsx` |
| `(auth)/(modals)/buy-premium` | `routes/_authenticated/buy-premium.tsx` |

**Layout structure:**
- `routes/__root.tsx` – Root layout (Clerk, QueryClient, theme)
- `routes/_authenticated.tsx` – Layout with sidebar + outlet
- `routes/_authenticated/index.tsx`, `statistics.tsx`, etc. – Page routes

### 3.3 Auth: Clerk Expo → Clerk React

**Remove:** `@clerk/clerk-expo`  
**Add:** `@clerk/clerk-react`

**Changes:**
- Token cache: Replace `expo-secure-store` with `localStorage` or Clerk’s default web storage
- OAuth: Use Clerk’s web OAuth flow (no `expo-auth-session` / `expo-web-browser`)
- Wrap app in `<ClerkProvider>` in `__root.tsx`
- Use `<SignedIn>`, `<SignedOut>`, `<RedirectToSignIn>` for route protection

### 3.4 Auth Guard

Replace Expo Router `useSegments()` + `router.push()` with TanStack Router’s `beforeLoad` or a wrapper:

```tsx
// In _authenticated.tsx or route beforeLoad
if (!isSignedIn) {
  throw redirect({ to: '/sign-in' })
}
```

---

## 4. Phase 2: Data Layer

### 4.1 Supabase Client

**File:** `lib/supabase.ts`

- Remove `Platform.OS` and `AsyncStorage`
- Use default Supabase storage (works in browser)
- Keep `createClerkSupabaseClient()` pattern; update `getToken` usage for web

### 4.2 Zustand Stores

**Files:** `stores/expense.ts`, `budget.ts`, `category.ts`, `payment.ts`

- No changes to logic
- Replace any `Platform.OS` usage with web-only behavior
- Ensure imports use `@supabase/supabase-js` (no RN deps)

### 4.3 TanStack Query & Hooks

- `hooks/useRealTimeQuery.ts` – Keep; ensure Supabase realtime works in browser
- `hooks/useUserPlan.ts` – Keep
- Wrap app in `<QueryClientProvider>` in root layout

### 4.4 Environment Variables

Rename `EXPO_PUBLIC_*` → `VITE_*` (or keep a shared `.env` with both prefixes during migration).

---

## 5. Phase 3: Layout & Theme

### 5.1 Root Layout

**Replace:**
- `GestureHandlerRootView` – Remove
- `ThemeProvider` from `@react-navigation/native` – Replace with CSS variables + Tailwind dark mode
- `StatusBar` – Remove (web)
- `PortalHost` – Replace with React DOM `createPortal` or Radix/shadcn portal
- `SplashScreen` – Replace with simple loading state or skeleton
- `NetInfo` – Replace with `navigator.onLine` + `window.addEventListener('online'/'offline')`
- `QuickActionsSetup` – Remove (no web equivalent)
- `setAndroidNavigationBar` – Remove

### 5.2 Theme

- Use `global.css` `:root` and `.dark` variables (already present)
- Add `class="dark"` to `<html>` for dark mode
- Remove `@react-navigation/native` theme

### 5.3 Sidebar Layout

Current: `_layout.web.tsx` with `View`, `Pressable`, `expo-image`, `Stack`.

**Replace with:**
- Semantic HTML: `<nav>`, `<aside>`, `<main>`
- `lucide-react` instead of `lucide-react-native`
- `<img>` or Next-style `Image` instead of `expo-image`
- `Link` from TanStack Router instead of `router.push()`
- CSS `backdrop-filter` for blur (no `expo-blur`)
- Responsive: sidebar on desktop, bottom nav on mobile (same as current web layout)

---

## 6. Phase 4: UI Primitives (@rn-primitives → shadcn/ui)

### 6.1 Component Mapping

| @rn-primitives / RN | Web Replacement |
|--------------------|-----------------|
| `@rn-primitives/accordion` | shadcn Accordion |
| `@rn-primitives/alert-dialog` | shadcn AlertDialog |
| `@rn-primitives/avatar` | shadcn Avatar |
| `@rn-primitives/dialog` | shadcn Dialog |
| `@rn-primitives/select` | shadcn Select |
| `@rn-primitives/tabs` | shadcn Tabs |
| `@rn-primitives/switch` | shadcn Switch |
| `@rn-primitives/radio-group` | shadcn RadioGroup |
| `@rn-primitives/progress` | shadcn Progress |
| `@rn-primitives/tooltip` | shadcn Tooltip |
| `@rn-primitives/collapsible` | shadcn Collapsible |
| `@rn-primitives/separator` | shadcn Separator |
| `@rn-primitives/label` | shadcn Label |
| `@rn-primitives/slot` | Radix Slot or custom |
| `View` | `div` |
| `Text` | `span` / `p` |
| `Pressable` / `TouchableOpacity` | `button` or shadcn `Button` |
| `TextInput` | shadcn `Input` |
| `ScrollView` | `div` with `overflow-y-auto` |
| `FlatList` / `FlashList` | `map()` or `@tanstack/react-virtual` |

### 6.2 Add shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add button input dialog select tabs avatar ...
```

### 6.3 Styling

- **Remove:** `nativewind`, `nativewind/preset` from `tailwind.config.js`
- **Keep:** Tailwind, `tailwindcss-animate`, design tokens
- **Update:** `tailwind.config.js` for standard web Tailwind (no NativeWind)
- **Keep:** `cn()` helper (clsx + tailwind-merge)
- **Keep:** `class-variance-authority` for variants

### 6.4 Icons

**Replace:** `lucide-react-native` → `lucide-react`  
API is almost identical; update imports.

---

## 7. Phase 5: Feature Pages & Forms

### 7.1 Pages to Migrate

| Page | Key Dependencies | Notes |
|------|------------------|-------|
| Sign-in | Clerk | Use Clerk’s `<SignIn />` |
| Dashboard (index) | Expense store, charts | Replace gifted-charts |
| Statistics | Charts, export | Replace charts |
| Wallet | Budget store, FlashList | Replace list |
| Profile | Category store, forms | RHF + Zod |
| Add expense modal | RHF, category select | Form wiring |
| Details modal | Expense by ID | Simple |
| Buy premium | Stripe, RHF + Zod | Keep Zod |

### 7.2 Forms (RHF + Zod)

- RHF and Zod stay
- Replace `Controller` + RN `TextInput` with `Controller` + shadcn `Input`
- Use `zodResolver` where you already have Zod (e.g. Stripe)
- Add Zod schemas for other forms (add expense, budget, category) for consistency

### 7.3 Lists

- **Remove:** `@shopify/flash-list`
- **Use:** `map()` for small lists, or `@tanstack/react-virtual` for long lists

---

## 8. Phase 6: Charts, Modals, Polish

### 8.1 Charts

**Remove:** `react-native-gifted-charts`  
**Add:** `recharts` or `chart.js` + `react-chartjs-2`

- LineChart → Recharts `LineChart`
- PieChart → Recharts `PieChart`
- Match colors and layout from current design

### 8.2 Modals

- **Remove:** `@gorhom/bottom-sheet`, `zeego`, `@react-native-menu/menu`
- **Use:** shadcn `Dialog`, `DropdownMenu`, `Sheet` (for mobile-style bottom sheet if needed)

### 8.3 Confetti

**Remove:** `react-native-fast-confetti`  
**Add:** `canvas-confetti` or `react-confetti`

### 8.4 Toasts

**Replace:** `sonner-native` → `sonner` (web)

### 8.5 Onboarding

- **Remove:** `react-native-onboarding-swiper`
- **Options:** Custom carousel (e.g. Embla), or simple step-based layout
- Onboarding is currently native-only; decide if you want it on web

### 8.6 Animations

**Remove:** `react-native-reanimated`, `moti`, `react-native-reanimated-carousel`  
**Use:** CSS transitions, Framer Motion, or Embla for carousels

---

## 9. Phase 7: Cleanup

### 9.1 Remove Dependencies

```json
// REMOVE
"@clerk/clerk-expo"
"@react-native-async-storage/async-storage"
"@react-native-community/netinfo"
"@react-navigation/native"
"@rn-primitives/*"
"@shopify/flash-list"
"@shopify/react-native-skia"
"expo", "expo-*"
"nativewind"
"react-native", "react-native-*"
"lucide-react-native"
"sonner-native"
"zeego", "@gorhom/bottom-sheet", "@react-native-menu/menu"
"react-native-gifted-charts"
"react-native-onboarding-swiper"
"react-native-reanimated", "react-native-reanimated-carousel"
"react-native-fast-confetti"
"moti"
```

### 9.2 Remove Config Files

- `app.json`
- `babel.config.js`
- `metro.config.js`
- `expo-*.config.js`
- SVG transformer config (if only for RN)

### 9.3 Add Dependencies

```json
{
  "@clerk/clerk-react": "^5.x",
  "@tanstack/react-start": "latest",
  "@tanstack/react-router": "latest",
  "recharts": "^2.x",
  "canvas-confetti": "^1.x",
  "sonner": "^1.x",
  "lucide-react": "^0.x",
  "framer-motion": "optional"
}
```

---

## 10. Suggested TanStack Start Folder Structure

```
monedo-web/
├── app/
│   ├── client.tsx           # Client entry
│   ├── router.tsx           # Route tree
│   └── ssr.tsx              # SSR entry (if used)
├── routes/
│   ├── __root.tsx
│   ├── sign-in.tsx
│   ├── _authenticated.tsx   # Layout with sidebar
│   ├── _authenticated/
│   │   ├── index.tsx
│   │   ├── statistics.tsx
│   │   ├── add-expense.tsx
│   │   ├── details.$id.tsx
│   │   ├── buy-premium.tsx
│   │   ├── wallet/
│   │   │   ├── index.tsx
│   │   │   └── edit.$id.tsx
│   │   └── profile/
│   │       ├── index.tsx
│   │       ├── personal-info.tsx
│   │       ├── categories.tsx
│   │       └── membership.tsx
│   └── +not-found.tsx
├── components/
│   ├── ui/                  # shadcn components
│   ├── dashboard/
│   ├── statistics/
│   ├── wallet/
│   ├── profile/
│   └── layout/              # Sidebar, bottom-nav
├── stores/
├── hooks/
├── lib/
├── config/
├── types/
├── styles/
│   └── global.css
└── assets/
```

---

## 11. Execution Order (Recommended)

1. **Scaffold** – Create TanStack Start project, basic routing, Clerk web
2. **Data** – Supabase client, env vars, move stores/hooks
3. **Root layout** – Theme, QueryClient, Clerk, toasts
4. **Auth layout** – Sidebar, bottom nav, protected routes
5. **Sign-in page** – Clerk `<SignIn />`
6. **Dashboard** – Placeholder, then wire expense data
7. **UI primitives** – Install shadcn, migrate `components/ui/`
8. **Dashboard components** – Replace RN components
9. **Charts** – Replace gifted-charts with Recharts
10. **Wallet, Profile, Statistics** – Page by page
11. **Modals** – Add expense, details, buy-premium
12. **Forms** – RHF + Zod for all forms
13. **Polish** – Confetti, toasts, loading states
14. **Cleanup** – Remove RN/Expo deps and config

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Clerk token/session differences | Test auth flow early; use Clerk web docs |
| Supabase RLS with Clerk | Ensure JWT template and RLS policies match |
| Chart parity | Match colors and labels; accept minor layout differences |
| Form validation gaps | Add Zod schemas where only RHF rules exist |
| Performance of long lists | Use `@tanstack/react-virtual` if needed |
| SEO | TanStack Start supports SSR; enable if needed |

---

## 13. Quick Reference: Native-Only Features to Drop

| Feature | Location | Action |
|---------|----------|--------|
| expo-secure-store | Root layout, Supabase | Use localStorage / Clerk default |
| expo-quick-actions | Root, quick-actions.tsx | Remove |
| expo-navigation-bar | android-navigation-bar.ts | Remove |
| expo-haptics | add-expense-modal | Remove |
| expo-blur | Tab bar | CSS backdrop-filter |
| expo-splash-screen | Root | Simple loading state |
| expo-dynamic-app-icon | app.json | Remove |
| NetInfo | Root | navigator.onLine |
| GestureHandlerRootView | Root | Remove |
| Onboarding (native-only) | onboarding.tsx | Optional: add web version or skip |

---

*Plan generated for Monedo React Native/Expo → TanStack Start (web-only) migration.*
