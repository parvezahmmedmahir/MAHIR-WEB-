
<div align="center">

# 🌐 MAHIR WEB

**Advanced Portfolio Architecture for High-Frequency Systems & Web Deployments**

![System Status](https://img.shields.io/badge/SYSTEM-ONLINE-emerald?style=for-the-badge)
![Database](https://img.shields.io/badge/SUPABASE-CONNECTED-green?style=for-the-badge)
![Version](https://img.shields.io/badge/VERSION-3.2-blue?style=for-the-badge)

</div>

---

## ⚠️ CRITICAL SETUP: SUPABASE DATABASE

To enable **Manager Mode**, **Profile Customization**, and **Site Configuration**, you must run the following SQL code in your Supabase Dashboard.

1.  Go to [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open your project.
3.  Click on **SQL Editor** (icon on the left).
4.  **Copy and Paste** the entire code block below and click **Run**.

```sql
-- 1. Create the Projects Table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  link text,
  tags text[],
  "customImage" text,
  type text,
  status text,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create the Profile Table (UPDATED)
create table if not exists profile (
  id uuid default gen_random_uuid() primary key,
  full_name text default 'Mahir Chowdhury',
  tagline text default 'Architecting the Digital Future',
  bio text,
  avatar_url text,
  telegram_link text,
  github_link text,
  email text,
  skills jsonb,
  -- NEW CONFIG COLUMNS
  hero_headline text default 'MAHIR WEB',
  hero_subheadline text default 'The central hub for deployment projects and system architecture.\nBridging the gap between algorithmic trading and modern web solutions.',
  show_preloaded boolean default true,
  
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Enable Security (RLS)
alter table projects enable row level security;
alter table profile enable row level security;

-- 4. Create Access Policies

-- Allow everyone to VIEW projects and profile
create policy "Public Projects" on projects for select to anon using ( true );
create policy "Public Profile" on profile for select to anon using ( true );

-- Allow authenticated users (YOU) to INSERT/UPDATE/DELETE
create policy "Auth Projects All" on projects for all to authenticated using ( true );
create policy "Auth Profile All" on profile for all to authenticated using ( true );

-- 5. Setup Storage for Images
insert into storage.buckets (id, name, public) 
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Allow public to view images
create policy "Public Access" on storage.objects for select using ( bucket_id = 'project-images' );

-- Allow you to upload images
create policy "Auth Upload" on storage.objects for insert to authenticated with check ( bucket_id = 'project-images' );
```

### 🚀 Features
- **Real-time Control Panel**: Edit projects, profile, and site header instantly.
- **AI Version Detection**: Automatically detects version numbers from your GitHub repos.
- **Global Config**: Toggle default projects visibility directly from the Admin Panel.

<div align="center">
  <p>© 2025 MAHIR WEB</p>
</div>
