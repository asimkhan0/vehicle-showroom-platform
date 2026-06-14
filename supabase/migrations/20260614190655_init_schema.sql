-- ============================================================
-- Showroom platform — initial schema
-- See PLAN.md §4 for design notes.
-- ============================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- users: mirrors auth.users with app-level role + profile fields.
-- Created via trigger on auth.users insert.
-- ----------------------------------------------------------------
create type public.user_role as enum ('admin', 'vendor');

create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  role        public.user_role not null default 'vendor',
  created_at  timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ----------------------------------------------------------------
-- showrooms: a tenant. One vendor user can own many showrooms
-- (rare, but cheap to allow).
-- ----------------------------------------------------------------
create type public.showroom_status as enum ('active', 'suspended');

create table public.showrooms (
  id              uuid primary key default gen_random_uuid(),
  owner_user_id   uuid not null references public.users(id) on delete cascade,
  slug            text not null unique,
  name            text not null,
  bio             text,
  logo_url        text,
  theme_json      jsonb not null default '{}'::jsonb,
  plan            text not null default 'free',
  status          public.showroom_status not null default 'active',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint showrooms_slug_format check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$')
);

create index showrooms_owner_idx on public.showrooms(owner_user_id);

-- ----------------------------------------------------------------
-- domains: custom hostnames mapped to a showroom.
-- ----------------------------------------------------------------
create type public.domain_status as enum ('pending', 'verifying', 'active', 'failed');

create table public.domains (
  id                uuid primary key default gen_random_uuid(),
  showroom_id       uuid not null references public.showrooms(id) on delete cascade,
  hostname          text not null unique,
  verified_at       timestamptz,
  vercel_domain_id  text,
  status            public.domain_status not null default 'pending',
  created_at        timestamptz not null default now()
);

create index domains_showroom_idx on public.domains(showroom_id);

-- ----------------------------------------------------------------
-- vehicles: listings.
-- ----------------------------------------------------------------
create type public.vehicle_status as enum ('draft', 'published', 'sold');

create table public.vehicles (
  id            uuid primary key default gen_random_uuid(),
  showroom_id   uuid not null references public.showrooms(id) on delete cascade,
  title         text not null,
  make          text,
  model         text,
  year          int check (year between 1900 and 2100),
  price_cents   bigint check (price_cents >= 0),
  mileage       int check (mileage >= 0),
  body_type     text,
  transmission  text,
  fuel          text,
  vin           text,
  description   text,
  status        public.vehicle_status not null default 'draft',
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index vehicles_showroom_idx on public.vehicles(showroom_id);
create index vehicles_status_idx   on public.vehicles(status);
create index vehicles_published_idx on public.vehicles(showroom_id, status, published_at desc);

-- ----------------------------------------------------------------
-- vehicle_images: ordered photo set per vehicle.
-- ----------------------------------------------------------------
create table public.vehicle_images (
  id            uuid primary key default gen_random_uuid(),
  vehicle_id    uuid not null references public.vehicles(id) on delete cascade,
  storage_path  text not null,
  sort_order    int not null default 0,
  is_primary    boolean not null default false,
  created_at    timestamptz not null default now()
);

create index vehicle_images_vehicle_idx on public.vehicle_images(vehicle_id, sort_order);

-- ----------------------------------------------------------------
-- inquiries: leads from buyers to vendors.
-- ----------------------------------------------------------------
create table public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  showroom_id   uuid not null references public.showrooms(id) on delete cascade,
  vehicle_id    uuid references public.vehicles(id) on delete set null,
  name          text not null,
  email         text not null,
  phone         text,
  message       text not null,
  created_at    timestamptz not null default now(),
  read_at       timestamptz
);

create index inquiries_showroom_idx on public.inquiries(showroom_id, created_at desc);

-- ----------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger showrooms_touch before update on public.showrooms
  for each row execute function public.touch_updated_at();
create trigger vehicles_touch before update on public.vehicles
  for each row execute function public.touch_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.users          enable row level security;
alter table public.showrooms      enable row level security;
alter table public.domains        enable row level security;
alter table public.vehicles       enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.inquiries      enable row level security;

-- users: a user can read/update only their own row.
create policy users_self_select on public.users
  for select using (auth.uid() = id);
create policy users_self_update on public.users
  for update using (auth.uid() = id);

-- showrooms: public can read active rows; owner has full control.
create policy showrooms_public_read on public.showrooms
  for select using (status = 'active');
create policy showrooms_owner_all on public.showrooms
  for all using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

-- domains: only owner can see/manage.
create policy domains_owner_all on public.domains
  for all using (
    exists (select 1 from public.showrooms s
            where s.id = domains.showroom_id and s.owner_user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.showrooms s
            where s.id = domains.showroom_id and s.owner_user_id = auth.uid())
  );

-- vehicles: public can read published vehicles of active showrooms; owner has full control.
create policy vehicles_public_read on public.vehicles
  for select using (
    status = 'published'
    and exists (select 1 from public.showrooms s
                where s.id = vehicles.showroom_id and s.status = 'active')
  );
create policy vehicles_owner_all on public.vehicles
  for all using (
    exists (select 1 from public.showrooms s
            where s.id = vehicles.showroom_id and s.owner_user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.showrooms s
            where s.id = vehicles.showroom_id and s.owner_user_id = auth.uid())
  );

-- vehicle_images: public can read images of publicly-visible vehicles; owner full control.
create policy vehicle_images_public_read on public.vehicle_images
  for select using (
    exists (
      select 1 from public.vehicles v
      join public.showrooms s on s.id = v.showroom_id
      where v.id = vehicle_images.vehicle_id
        and v.status = 'published'
        and s.status = 'active'
    )
  );
create policy vehicle_images_owner_all on public.vehicle_images
  for all using (
    exists (
      select 1 from public.vehicles v
      join public.showrooms s on s.id = v.showroom_id
      where v.id = vehicle_images.vehicle_id and s.owner_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.vehicles v
      join public.showrooms s on s.id = v.showroom_id
      where v.id = vehicle_images.vehicle_id and s.owner_user_id = auth.uid()
    )
  );

-- inquiries: anyone (incl. anon) can insert; only owner can read.
create policy inquiries_anyone_insert on public.inquiries
  for insert with check (true);
create policy inquiries_owner_read on public.inquiries
  for select using (
    exists (select 1 from public.showrooms s
            where s.id = inquiries.showroom_id and s.owner_user_id = auth.uid())
  );
create policy inquiries_owner_update on public.inquiries
  for update using (
    exists (select 1 from public.showrooms s
            where s.id = inquiries.showroom_id and s.owner_user_id = auth.uid())
  );
