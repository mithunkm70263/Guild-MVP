# Guild MVP — Backend Auth & Profiles

Google OAuth and session management are handled **client-side via Supabase**. No custom auth server is required for sign-in.

## What the frontend does

1. **Google OAuth** — `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. **Email/password** — `signInWithPassword`, with auto `signUp` on first login
3. **Session recovery** — Supabase client reads tokens from the URL hash after redirect
4. **Profile on sign-in** — `ensureUserProfile()` upserts `id`, `email`, `full_name`, `avatar_url` from auth metadata (fallback when the DB trigger did not run)
5. **Post-auth routing** — `guild-app/src/lib/authRouting.js` checks `profiles.onboarding_complete`:
   - `false` or missing row → `/connect`
   - `true` → `/dashboard`
6. **Connect page** — `completeUserOnboarding()` upserts builder track + sets `onboarding_complete = true`

Application forms (`applications`, `vibe_coder_applications`, etc.) save to their own tables — they do **not** populate `profiles`.

---

## Supabase setup (run once)

Open **Supabase Dashboard → SQL → New query**, paste the contents of:

`guild-app/supabase/001_profiles.sql`

Or run this SQL directly:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  builder_track text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'display_name'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
```

The migration file also includes a **backfill** for existing `auth.users` rows that have no profile yet.

---

## Vercel environment variables (frontend only)

Set these on the **guild-app** Vercel project (Settings → Environment Variables):

| Variable | Required | Notes |
|----------|----------|-------|
| `VITE_SUPABASE_URL` | Yes | Project URL from Supabase → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | **anon / publishable** key (not the service role key) |

Aliases supported by the app (optional fallbacks): `VITE_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**Do not** put the service role key in Vercel frontend env vars — it bypasses RLS.

After changing env vars, **redeploy** the Vercel project so Vite rebuilds with the new values.

---

## Verify in Supabase

1. **Table Editor → `profiles`** — after a user signs in you should see a row with their `id`, `email`, and `full_name` (Google OAuth fills `full_name` / `avatar_url` from metadata).
2. **Authentication → Users** — confirm the user exists; `profiles.id` must match `auth.users.id`.
3. After clicking **Dive In** on `/connect`, `onboarding_complete` should be `true` and `builder_track` should reflect their local track selection (if any).
4. If inserts fail, open **Logs → Postgres** and look for RLS policy violations.

---

## Local development

Create `guild-app/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

Restart `npm run dev` after editing `.env.local`.
