
<div align="center">

# 🌐 MAHIR WEB

**Advanced Portfolio Architecture for High-Frequency Systems & Web Deployments**

![System Status](https://img.shields.io/badge/SYSTEM-ONLINE-emerald?style=for-the-badge)
![Database](https://img.shields.io/badge/SUPABASE-CONNECTED-green?style=for-the-badge)
![Version](https://img.shields.io/badge/VERSION-3.0-blue?style=for-the-badge)

</div>

---

## ⚠️ CRITICAL SETUP: SUPABASE DATABASE

To make the Admin Panel work, you must run the following SQL code in your Supabase Dashboard.

1.  Go to [Supabase Dashboard](https://supabase.com/dashboard).
2.  Open your project (`dsrufuqpdwonwxxwmcgd`).
3.  Click on **SQL Editor** (icon on the left).
4.  **Copy and Paste** the entire code block below and click **Run**.

```sql
-- 1. Create the Projects Table
create table projects (
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

-- 2. Enable Security (RLS)
alter table projects enable row level security;

-- 3. Create Access Policies
-- Allow everyone to VIEW projects
create policy "Public Projects are viewable by everyone"
  on projects for select
  to anon
  using ( true );

-- Allow authenticated users (YOU) to INSERT projects
create policy "Users can insert projects"
  on projects for insert
  to authenticated
  with check ( true );

-- 4. Setup Storage for Images
insert into storage.buckets (id, name, public) 
values ('project-images', 'project-images', true);

-- Allow public to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'project-images' );

-- Allow you to upload images
create policy "Auth Upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'project-images' );
```

---

## 🚀 Overview

**MAHIR WEB** is a real-time, database-driven portfolio. Unlike static websites, this system uses a cloud database (Supabase) to manage content.

### 🛠️ The Admin Manager
Located in the footer, the **Manager Mode** is now a full CRUD application.
- **Login System**: Protected entry.
- **Database Sync**: Clicking "Publish" saves data directly to the cloud.
- **Image Hosting**: Uploads are automatically stored in Supabase Storage buckets.

### ⚡ Advanced Tech Stack
- **Frontend**: React 18 + TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS

---

<div align="center">
  <p>Designed & Deployed by <strong>Mahir Chowdhury</strong></p>
  <p>© 2025 MAHIR WEB</p>
</div>
