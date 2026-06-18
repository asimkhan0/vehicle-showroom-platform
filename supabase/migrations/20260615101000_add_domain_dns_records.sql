-- Cache DNS records returned by Vercel when a domain is added.
alter table public.domains add column if not exists dns_records jsonb;
