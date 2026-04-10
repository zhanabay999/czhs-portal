-- Migration for CZHS server (10.100.15.151)
-- Date: 2026-04-07
-- Brings local Postgres in sync with current src/db/schema.ts
-- Safe to re-run: uses IF NOT EXISTS / IF EXISTS guards everywhere.

BEGIN;

-- ============================================================
-- 1. New enum values for user_role
-- ============================================================
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'news_moderator';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'social_admin';

-- ============================================================
-- 2. New columns on existing tables
-- ============================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_alt text;

ALTER TABLE news_articles
  ADD COLUMN IF NOT EXISTS cover_image_url_kk text,
  ADD COLUMN IF NOT EXISTS cover_image_url_ru text;

-- ============================================================
-- 3. New table: patronage_branches
-- ============================================================
CREATE TABLE IF NOT EXISTS patronage_branches (
  id text PRIMARY KEY,
  code varchar(50) NOT NULL UNIQUE,
  name_kk varchar(255) NOT NULL,
  name_ru varchar(255) NOT NULL,
  children_count integer DEFAULT 0 NOT NULL,
  curators jsonb DEFAULT '[]'::jsonb NOT NULL,
  sub_branch_name_kk varchar(255),
  sub_branch_name_ru varchar(255),
  sub_branch_children_count integer,
  sub_branch_curators jsonb,
  sort_order integer DEFAULT 0 NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

-- ============================================================
-- 4. New table: sports_applications
-- ============================================================
CREATE TABLE IF NOT EXISTS sports_applications (
  id text PRIMARY KEY,
  last_name varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  patronymic varchar(255),
  employee_id varchar(50),
  branch varchar(255) NOT NULL,
  sport_type varchar(100) NOT NULL,
  phone varchar(50) NOT NULL,
  status varchar(20) DEFAULT 'new' NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

-- ============================================================
-- 5. New table: hero_slides
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id text PRIMARY KEY,
  image_url text NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

-- ============================================================
-- 6. New table: leaders
-- ============================================================
CREATE TABLE IF NOT EXISTS leaders (
  id text PRIMARY KEY,
  name_kk varchar(255) NOT NULL,
  name_ru varchar(255) NOT NULL,
  position_kk text NOT NULL,
  position_ru text NOT NULL,
  photo_url text,
  photo_position text DEFAULT '50% 20%',
  level integer NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  parent_id text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

COMMIT;
