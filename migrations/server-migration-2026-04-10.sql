-- Migration: 2026-04-10
-- Add contest_blocks table

CREATE TABLE IF NOT EXISTS contest_blocks (
  id text PRIMARY KEY,
  title_kk varchar(255) NOT NULL,
  title_ru varchar(255) NOT NULL,
  image_url text NOT NULL,
  link_url text,
  link_label varchar(100),
  is_active boolean DEFAULT true NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);
