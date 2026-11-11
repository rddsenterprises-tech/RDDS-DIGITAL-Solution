-- RDDS recruiter portal: run once in Supabase SQL Editor.
create table if not exists public.recruiter_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  company_name text not null default '',
  phone text not null default '',
  purpose text not null default '',
  interest_status text not null default 'Pending'
    check (interest_status in ('Pending', 'Interested', 'Not Interested')),
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.recruiter_profiles enable row level security;

drop policy if exists "Recruiters can view own profile" on public.recruiter_profiles;
create policy "Recruiters can view own profile"
on public.recruiter_profiles for select to authenticated
using (id = (select auth.uid()));

drop policy if exists "RDDS admins can view recruiter profiles" on public.recruiter_profiles;
create policy "RDDS admins can view recruiter profiles"
on public.recruiter_profiles for select to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

drop policy if exists "RDDS admins can update recruiter profiles" on public.recruiter_profiles;
create policy "RDDS admins can update recruiter profiles"
on public.recruiter_profiles for update to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create or replace function public.create_recruiter_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.recruiter_profiles (id, email, full_name, company_name, phone, purpose)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'company_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'purpose', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    company_name = excluded.company_name,
    phone = excluded.phone,
    purpose = excluded.purpose,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_recruiter on auth.users;
create trigger on_auth_user_created_recruiter
after insert on auth.users
for each row execute procedure public.create_recruiter_profile();

grant select on public.recruiter_profiles to authenticated;
grant update (interest_status, admin_notes, updated_at) on public.recruiter_profiles to authenticated;
