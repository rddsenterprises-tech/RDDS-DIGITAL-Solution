-- RDDS Client Portal + one-time Free Demo request schema.
-- Run only in the dedicated RDDS Supabase project after the existing RDDS tables/admin allowlist are migrated.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.rdds_client_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  business_name text not null,
  business_category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists rdds_client_profiles_email_unique
  on public.rdds_client_profiles (lower(email));
create unique index if not exists rdds_client_profiles_phone_unique
  on public.rdds_client_profiles (regexp_replace(phone, '[^0-9]', '', 'g'));

create table if not exists public.rdds_demo_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.rdds_client_profiles(id) on delete restrict,
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  business_name text not null,
  business_category text not null,
  project_details text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','in_progress','demo_sent','converted','not_interested','archived')),
  demo_url text,
  admin_notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rdds_demo_requests_status_created_idx
  on public.rdds_demo_requests (status, created_at desc);

alter table public.rdds_client_profiles enable row level security;
alter table public.rdds_demo_requests enable row level security;

drop policy if exists "Clients read own profile" on public.rdds_client_profiles;
create policy "Clients read own profile"
  on public.rdds_client_profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Clients update own profile" on public.rdds_client_profiles;
create policy "Clients update own profile"
  on public.rdds_client_profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "RDDS admins manage client profiles" on public.rdds_client_profiles;
create policy "RDDS admins manage client profiles"
  on public.rdds_client_profiles for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists "Clients read own demo request" on public.rdds_demo_requests;
create policy "Clients read own demo request"
  on public.rdds_demo_requests for select to authenticated
  using ((select auth.uid()) = client_id);

drop policy if exists "Verified clients create one demo request" on public.rdds_demo_requests;
create policy "Verified clients create one demo request"
  on public.rdds_demo_requests for insert to authenticated
  with check (
    (select auth.uid()) = client_id
    and exists (
      select 1 from public.rdds_client_profiles p
      where p.id = (select auth.uid())
        and lower(p.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists "RDDS admins manage demo requests" on public.rdds_demo_requests;
create policy "RDDS admins manage demo requests"
  on public.rdds_demo_requests for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

grant select, update on public.rdds_client_profiles to authenticated;
grant select, insert on public.rdds_demo_requests to authenticated;

create or replace function private.handle_new_rdds_client()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.rdds_client_profiles
    (id, full_name, email, phone, business_name, business_category)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'RDDS Client'),
    lower(new.email),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'phone'), ''), ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'business_name'), ''), ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'business_category'), ''), '')
  );
  return new;
end;
$$;
revoke all on function private.handle_new_rdds_client() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_rdds_client on auth.users;
create trigger on_auth_user_created_rdds_client
  after insert on auth.users
  for each row execute function private.handle_new_rdds_client();

-- Admin read/write is authorized through the existing RDDS admin_users allowlist.
