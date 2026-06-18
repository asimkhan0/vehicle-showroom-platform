-- Phase 3: indexes for cross-vendor marketplace discovery queries.
-- Partial indexes scoped to published listings keep them small.

create index vehicles_marketplace_published_idx
  on public.vehicles (published_at desc)
  where status = 'published';

create index vehicles_marketplace_make_idx
  on public.vehicles (lower(make))
  where status = 'published' and make is not null;

create index vehicles_marketplace_model_idx
  on public.vehicles (lower(model))
  where status = 'published' and model is not null;

create index vehicles_marketplace_year_idx
  on public.vehicles (year)
  where status = 'published' and year is not null;

create index vehicles_marketplace_price_idx
  on public.vehicles (price_cents)
  where status = 'published' and price_cents is not null;

create index vehicles_marketplace_mileage_idx
  on public.vehicles (mileage)
  where status = 'published' and mileage is not null;
