-- =============================================================================
-- Ratebench migration 002 — rate_submissions table
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).
-- =============================================================================

create table if not exists public.rate_submissions (
  id                uuid primary key default uuid_generate_v4(),
  contributor_email text not null,
  skill             text not null,
  city              text not null,
  experience_tier   text not null check (experience_tier in ('Junior', 'Mid', 'Senior')),
  rate_amount       numeric not null check (rate_amount > 0 and rate_amount < 10000),
  rate_unit         text not null check (rate_unit in ('hourly', 'daily', 'project', 'retainer')),
  rate_currency     text not null default 'USD',
  rate_type         text not null check (rate_type in ('current', 'last_engagement', 'aspirational')),
  rate_year         int not null default extract(year from now())::int,
  computed_percentile numeric,
  years_freelance   int,
  client_type       text,
  linkedin_url      text,
  notes             text,
  include_in_avg    boolean default false,
  created_at        timestamptz not null default now()
);

create index if not exists rate_submissions_skill_tier_idx on public.rate_submissions (skill, experience_tier);
create index if not exists rate_submissions_email_idx on public.rate_submissions (contributor_email);
create index if not exists rate_submissions_created_at_idx on public.rate_submissions (created_at desc);

alter table public.rate_submissions enable row level security;
-- No policies = service_role bypass (same pattern as waitlist table).
