-- Run this entire script in Supabase SQL Editor
-- Go to: supabase.com → your project → SQL Editor → New Query → paste → Run

-- 1. Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  phone text unique,
  password text,
  avatar text default '',
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

-- 2. Dishes table
create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text[] not null default '{}',
  image text not null,
  ingredients jsonb not null default '[]',
  instructions text[] not null default '{}',
  created_at timestamptz default now()
);

-- 3. Cart (one cart per user, items stored as JSON array)
create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id) on delete cascade,
  items jsonb default '[]',
  updated_at timestamptz default now()
);

-- 4. Wishlist (one wishlist per user, dish IDs stored as array)
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id) on delete cascade,
  dish_ids uuid[] default '{}',
  updated_at timestamptz default now()
);

-- 5. Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  items jsonb not null default '[]',
  status text default 'pending' check (status in ('pending','confirmed','delivered')),
  created_at timestamptz default now()
);

-- Disable Row Level Security (we use service role key in backend, so no RLS needed)
alter table users disable row level security;
alter table dishes disable row level security;
alter table carts disable row level security;
alter table wishlists disable row level security;
alter table orders disable row level security;
