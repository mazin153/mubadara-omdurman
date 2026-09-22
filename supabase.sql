-- =========================================================
-- قاعدة بيانات مبادرة شباب أمدرمان
-- Supabase + GitHub Pages
-- شغّل الملف كاملاً من Supabase > SQL Editor
-- =========================================================

create extension if not exists pgcrypto;

-- =========================
-- 1) ملفات المسؤولين
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer'
    check (role in ('admin','viewer')),
  created_at timestamptz not null default now()
);

-- =========================
-- 2) الأنشطة
-- =========================
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  activity_date date not null default current_date,
  image_url text,
  report_url text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists activities_date_idx
on public.activities(activity_date desc);

-- =========================
-- 3) الحماية
-- =========================
alter table public.profiles enable row level security;
alter table public.activities enable row level security;

-- وظيفة: هل المستخدم مسؤول؟
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- =========================
-- 4) سياسات الأنشطة
-- =========================
drop policy if exists "Public can read activities" on public.activities;
create policy "Public can read activities"
on public.activities for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert activities" on public.activities;
create policy "Admins can insert activities"
on public.activities for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update activities" on public.activities;
create policy "Admins can update activities"
on public.activities for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete activities" on public.activities;
create policy "Admins can delete activities"
on public.activities for delete
to authenticated
using (public.is_admin());

-- =========================
-- 5) سياسات profiles
-- =========================
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

-- =========================
-- 6) Storage: الصور وPDF
-- =========================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Admins upload media" on storage.objects;
create policy "Admins upload media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'media'
  and public.is_admin()
);

drop policy if exists "Admins update media" on storage.objects;
create policy "Admins update media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'media'
  and public.is_admin()
)
with check (
  bucket_id = 'media'
  and public.is_admin()
);

drop policy if exists "Admins delete media" on storage.objects;
create policy "Admins delete media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'media'
  and public.is_admin()
);

-- لأن Bucket media عام، يستطيع الموقع عرض الملفات العامة.
drop policy if exists "Public can view media" on storage.objects;
create policy "Public can view media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'media');

-- =========================================================
-- بعد إنشاء أول مستخدم من:
-- Authentication > Users
--
-- انسخ UUID للمستخدم ثم نفذ:
--
-- insert into public.profiles (id, full_name, role)
-- values ('USER_UUID_HERE', 'مسؤول المبادرة', 'admin');
--
-- لا تجعل أي مستخدم عادي admin.
-- =========================================================
