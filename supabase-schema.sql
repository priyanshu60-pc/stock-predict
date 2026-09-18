-- ╔══════════════════════════════════════════════════════════╗
-- ║        Signalist — Supabase Schema                       ║
-- ║  Run this SQL in Supabase → SQL Editor                   ║
-- ╚══════════════════════════════════════════════════════════╝

-- -- Watchlist table ------------------------------------------
create table if not exists watchlist (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null,         -- Clerk user ID (e.g. user_abc123)
  symbol     text not null,
  company_name text default '',
  added_at   timestamp with time zone default now()
);

-- Prevent duplicate symbols per user
create unique index if not exists watchlist_user_symbol_idx
  on watchlist(user_id, symbol);

-- Row-level security (restrict reads/writes to the owning user)
alter table watchlist enable row level security;

-- -- Alerts table ---------------------------------------------
create table if not exists alerts (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  symbol      text not null,
  condition   text not null check (condition in ('above', 'below')),
  threshold   numeric not null,
  alert_type  text not null check (alert_type in ('price', 'volume')),
  active      boolean default true,
  created_at  timestamp with time zone default now()
);

alter table alerts enable row level security;

-- -- User emails table -----------------------------------------
-- Populated by the Clerk webhook (app/api/webhooks/clerk/route.ts)
create table if not exists user_emails (
  user_id  text primary key,         -- Clerk user ID
  email    text not null,
  name     text default '',
  created_at timestamp with time zone default now()
);

alter table user_emails enable row level security;
