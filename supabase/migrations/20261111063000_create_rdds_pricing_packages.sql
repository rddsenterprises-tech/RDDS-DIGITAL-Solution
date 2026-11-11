create table if not exists public.pricing_packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  service_type text not null check (service_type in ('website', 'ecommerce')),
  tier text not null check (tier in ('starter', 'business', 'premium')),
  price_pkr integer not null check (price_pkr > 0),
  price_usd integer not null check (price_usd > 0),
  delivery_days text not null,
  features jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_type, tier)
);

alter table public.pricing_packages enable row level security;
grant select on public.pricing_packages to anon, authenticated;
grant insert, update, delete on public.pricing_packages to authenticated;

create policy "Published pricing packages are public"
on public.pricing_packages for select to anon, authenticated
using (
  published = true
  or exists (
    select 1 from public.admin_users au
    where au.user_id = (select auth.uid())
  )
);

create policy "RDDS admins manage pricing packages"
on public.pricing_packages for all to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.admin_users au
    where au.user_id = (select auth.uid())
  )
);
