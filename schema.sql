-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query) before deploying.
create table if not exists users (
  username text primary key,
  password_hash text not null,
  created_at timestamptz default now()
);
create table if not exists saves (
  username text primary key references users(username) on delete cascade,
  data jsonb not null,
  updated_at timestamptz default now()
);
create table if not exists arena_scores (
  username text primary key references users(username) on delete cascade,
  tier int not null default 1,
  streak int not null default 0,
  updated_at timestamptz default now()
);
create index if not exists arena_scores_tier_idx on arena_scores (tier desc, streak desc);

-- These tables are only ever read/written through the server-side API using the service_role key,
-- which bypasses Row Level Security. Enabling RLS with no policies blocks all other access,
-- which is what we want since there is no direct client-side access to Supabase.
alter table users enable row level security;
alter table saves enable row level security;
alter table arena_scores enable row level security;
