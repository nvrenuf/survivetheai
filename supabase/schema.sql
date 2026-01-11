create extension if not exists pgcrypto;

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source_page text,
  created_at timestamptz not null default now()
);
