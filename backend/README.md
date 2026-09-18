# Guild MVP — Backend Auth Notes

Google OAuth and session management are handled **client-side via Supabase**. No custom auth server is required for sign-in.

## What the frontend does

1. **Google OAuth** — `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. **Email/password** — `signInWithPassword`, with auto `signUp` on first login
3. **Session recovery** — Supabase client reads tokens from the URL hash after redirect
4. **Post-auth routing** — `guild-app/src/lib/authRouting.js` checks for a `profiles` row:
   - No profile → `/connect`
   - Profile exists → `/dashboard`

## Supabase setup (profiles table)

Create a `profiles` table so the app can distinguish new vs returning users:

```sql
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

Optionally auto-create a profile on signup with a Supabase Database Webhook or trigger — not required for OAuth to work; users without a row are routed to `/connect`.

## Optional: new-user webhook

If you later need server-side logic (welcome email, CRM sync), add a Supabase Auth hook or Edge Function. For MVP, client-side routing is sufficient.
