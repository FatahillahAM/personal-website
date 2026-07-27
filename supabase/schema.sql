-- =============================================================
--  Personal site — database schema (Supabase / PostgreSQL)
--  Run this ONCE in the Supabase SQL editor before seed.sql.
--  Every content type the site shows lives here, so both the
--  page and the AI assistant always read from the same source.
-- =============================================================

-- ---------- helper: keep updated_at fresh ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profile (single row) ----------
create table if not exists public.profile (
  id          smallint primary key default 1 check (id = 1),
  name        text not null,
  title       text,
  headline    text,
  bio         text,
  location    text,
  email       text,
  phone       text,
  socials     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ---------- services ("what I do") ----------
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------- skills / tools ----------
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  int  not null default 0
);

-- ---------- projects (Selected Work) ----------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text,
  year        text,
  description text,
  image       text,                       -- e.g. "/work-cnc.jpg"
  href        text not null default '#contact',
  external    boolean not null default false,
  tags        text[] not null default '{}',
  sort_order  int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- experiences (work + education) ----------
create table if not exists public.experiences (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'work' check (kind in ('work','education')),
  role         text not null,
  organization text,
  period       text,
  description  text,
  sort_order   int  not null default 0,
  updated_at   timestamptz not null default now()
);

-- ---------- certifications ----------
create table if not exists public.certifications (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  issuer      text,
  sort_order  int  not null default 0
);

-- ---------- knowledge notes (free-form facts for the AI) ----------
-- Anything you want the assistant to know that isn't a project or
-- role: availability, rates, preferred contact, FAQ answers, etc.
create table if not exists public.knowledge_notes (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null,
  content     text not null,
  published   boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array['profile','services','projects','experiences','knowledge_notes']
  loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on public.%1$s;
       create trigger trg_%1$s_updated before update on public.%1$s
       for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- =============================================================
--  Row Level Security
--  Public visitors (the "anon" key used in the browser) may only
--  READ published content. Nobody can write with the anon key —
--  you edit content in the Supabase dashboard (service role) or
--  from a trusted server using the service_role key.
-- =============================================================
alter table public.profile         enable row level security;
alter table public.services        enable row level security;
alter table public.skills          enable row level security;
alter table public.projects        enable row level security;
alter table public.experiences     enable row level security;
alter table public.certifications  enable row level security;
alter table public.knowledge_notes enable row level security;

-- read policies (anon + authenticated)
create policy "read profile"        on public.profile         for select using (true);
create policy "read services"       on public.services        for select using (true);
create policy "read skills"         on public.skills          for select using (true);
create policy "read projects"       on public.projects        for select using (published = true);
create policy "read experiences"    on public.experiences     for select using (true);
create policy "read certifications" on public.certifications   for select using (true);
create policy "read knowledge"      on public.knowledge_notes for select using (published = true);
