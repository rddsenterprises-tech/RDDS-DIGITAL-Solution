create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table public.services (
  id uuid primary key default gen_random_uuid(), title text not null,
  description text not null default '', slug text not null default '',
  category text not null default '', published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.projects (
  id uuid primary key default gen_random_uuid(), title text not null,
  description text not null default '', slug text not null default '',
  category text not null default '', published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(), title text not null,
  description text not null default '', slug text not null default '',
  category text not null default '', published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null default '',
  email text not null default '', subject text not null default '',
  message text not null default '',
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);
create index services_published_idx on public.services (published);
create index projects_published_idx on public.projects (published);
create index blog_posts_published_idx on public.blog_posts (published);
create index contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.admin_users enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;

create policy "Admins can verify their own membership" on public.admin_users
for select to authenticated using (user_id = (select auth.uid()));

create policy "Public can read published services" on public.services
for select to anon, authenticated using (published = true or exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can insert services" on public.services for insert to authenticated
with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can update services" on public.services for update to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can delete services" on public.services for delete to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

create policy "Public can read published projects" on public.projects
for select to anon, authenticated using (published = true or exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can insert projects" on public.projects for insert to authenticated
with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can update projects" on public.projects for update to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can delete projects" on public.projects for delete to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

create policy "Public can read published blog posts" on public.blog_posts
for select to anon, authenticated using (published = true or exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can insert blog posts" on public.blog_posts for insert to authenticated
with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can update blog posts" on public.blog_posts for update to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can delete blog posts" on public.blog_posts for delete to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

create policy "Admins can read contact messages" on public.contact_messages for select to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));
create policy "Admins can update contact messages" on public.contact_messages for update to authenticated
using (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users au where au.user_id = (select auth.uid())));

grant select on public.admin_users to authenticated;
grant select on public.services, public.projects, public.blog_posts to anon, authenticated;
grant insert, update, delete on public.services, public.projects, public.blog_posts to authenticated;
grant select, update on public.contact_messages to authenticated;