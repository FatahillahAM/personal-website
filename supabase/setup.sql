-- =============================================================
--  SETUP LENGKAP — jalankan file ini SAJA di Supabase SQL Editor.
--  Menggantikan schema.sql + seed.sql.
--
--  ✅ Aman dijalankan berulang kali. Tidak akan error kalau
--     sebagian sudah pernah dibuat sebelumnya.
--  ✅ Di bagian paling bawah ada tabel verifikasi yang langsung
--     menunjukkan apakah semuanya berhasil.
-- =============================================================


-- =============================================================
--  BAGIAN 1 — TABEL
-- =============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  sort_order  int  not null default 0,
  updated_at  timestamptz not null default now()
);

create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  int  not null default 0
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text,
  year        text,
  description text,
  image       text,
  href        text not null default '#contact',
  external    boolean not null default false,
  tags        text[] not null default '{}',
  sort_order  int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

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

create table if not exists public.certifications (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  issuer      text,
  sort_order  int  not null default 0
);

create table if not exists public.knowledge_notes (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null,
  content     text not null,
  published   boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- trigger updated_at (idempotent)
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
--  BAGIAN 2 — HAK AKSES (bagian yang sebelumnya hilang)
--  Tanpa GRANT ini, role "anon" tidak bisa membaca apa pun
--  dan Supabase mengembalikan 0 baris TANPA pesan error.
-- =============================================================

grant usage on schema public to anon, authenticated;

grant select on
  public.profile, public.services, public.skills, public.projects,
  public.experiences, public.certifications, public.knowledge_notes
to anon, authenticated;


-- =============================================================
--  BAGIAN 3 — ROW LEVEL SECURITY
--  Policy di-drop dulu sebelum dibuat, supaya menjalankan skrip
--  ini dua kali tidak menyebabkan error "policy already exists".
-- =============================================================

alter table public.profile         enable row level security;
alter table public.services        enable row level security;
alter table public.skills          enable row level security;
alter table public.projects        enable row level security;
alter table public.experiences     enable row level security;
alter table public.certifications  enable row level security;
alter table public.knowledge_notes enable row level security;

drop policy if exists "read profile"        on public.profile;
drop policy if exists "read services"       on public.services;
drop policy if exists "read skills"         on public.skills;
drop policy if exists "read projects"       on public.projects;
drop policy if exists "read experiences"    on public.experiences;
drop policy if exists "read certifications" on public.certifications;
drop policy if exists "read knowledge"      on public.knowledge_notes;

create policy "read profile"        on public.profile
  for select to anon, authenticated using (true);
create policy "read services"       on public.services
  for select to anon, authenticated using (true);
create policy "read skills"         on public.skills
  for select to anon, authenticated using (true);
create policy "read projects"       on public.projects
  for select to anon, authenticated using (published = true);
create policy "read experiences"    on public.experiences
  for select to anon, authenticated using (true);
create policy "read certifications" on public.certifications
  for select to anon, authenticated using (true);
create policy "read knowledge"      on public.knowledge_notes
  for select to anon, authenticated using (published = true);


-- =============================================================
--  BAGIAN 4 — ISI KONTEN
--  delete (bukan truncate) supaya lebih aman dijalankan ulang.
-- =============================================================

delete from public.services;
delete from public.skills;
delete from public.projects;
delete from public.experiences;
delete from public.certifications;
delete from public.knowledge_notes;

-- ---------- profile ----------
insert into public.profile (id, name, title, headline, bio, location, email, phone, socials)
values (
  1,
  'Fatahillah Aditya M.',
  'Automation Engineer',
  'An automation engineering graduate who is just as comfortable behind a CNC control panel as behind a camera.',
  'I graduated in Automation Engineering from Universitas Diponegoro with a 3.52 GPA, after finishing vocational school in Computer and Network Technology. My work spans CNC machine operation and maintenance, CAD/CAM design in SolidWorks, IT support and networking, and video editing and videography.',
  'Semarang, Indonesia',
  null,   -- ▶ TODO: email publik, misalnya 'fatahiladitya7x@gmail.com'
  null,   -- ▶ TODO: nomor telepon kalau mau ditampilkan
  '{}'::jsonb   -- ▶ TODO: {"linkedin":"https://...","youtube":"https://..."}
)
on conflict (id) do update set
  name = excluded.name, title = excluded.title, headline = excluded.headline,
  bio = excluded.bio, location = excluded.location, email = excluded.email,
  phone = excluded.phone, socials = excluded.socials;

-- ---------- services ----------
insert into public.services (title, description, sort_order) values
  ('Automation Engineering', 'CNC machine operation, control, and routine maintenance on the production line.', 1),
  ('CAD / CAM Design',       'Part modelling, assemblies, and manufacturing drawings in SolidWorks.', 2),
  ('IT Support & Networking','Helpdesk, workstation and server maintenance, and network configuration with Cisco and Mikrotik.', 3),
  ('Video Editing & Videography', 'Shooting and editing documentation, recaps, and promotional video for organisations and events.', 4);

-- ---------- skills ----------
insert into public.skills (name, sort_order) values
  ('SolidWorks', 1), ('CNC', 2), ('CAD/CAM', 3),
  ('Cisco', 4), ('Mikrotik', 5), ('Video Editing', 6);

-- ---------- projects ----------
insert into public.projects (title, category, year, description, image, href, external, tags, sort_order) values
  ('CNC Machining Line', 'Automation Engineering', '2021',
   'Ran and maintained CNC machines for bus body manufacturing at CV. Laksana Carroserie, covering machine control and routine servicing.',
   '/work-cnc.jpg', '#contact', false, array['CNC','Maintenance'], 1),

  ('Computer Vision-Based Line Balancing', 'Automation / Computer Vision', '2022',
   'A vision-based system that measures work-station cycle times from video and redistributes tasks to cut bottlenecks and idle time on the production line.',
   '/work-analyze.png', '#contact', false, array['Computer Vision','Line Balancing'], 2),

  ('SolidWorks Part & Assembly Design', 'CAD / CAM', '2022',
   'Modelling, assemblies, and manufacturing drawings built during automation engineering coursework at Universitas Diponegoro.',
   '/work-solidworks.jpg', '#contact', false, array['SolidWorks','CAD/CAM'], 3),

  ('Company Profile BEM UNDIP 2020', 'Videography', '2020',
   'Shot and edited the official company profile video for BEM Universitas Diponegoro — concept, footage, and post-production.',
   '/work-comprof.png', 'https://www.youtube.com/watch?v=wkwx5XyAEk8', true, array['Videography','Editing'], 4);

-- ---------- experiences ----------
insert into public.experiences (kind, role, organization, period, description, sort_order) values
  ('work', 'Mechanical Engineer', 'CV. Laksana Carroserie — Semarang, Indonesia', 'Sep 2021 — Dec 2021',
   'Operated and controlled CNC machines on the production line, and carried out routine maintenance to keep them running.', 1),
  ('work', 'IT Helpdesk', 'PT. PLN (Persero) Distribusi Jakarta Raya — Jakarta, Indonesia', 'May 2017 — Jul 2017',
   'Maintained local computers across the Jakarta office and its service areas, and supported the office servers.', 2),
  ('education', 'Automation Engineering — GPA 3.52 / 4.00', 'Universitas Diponegoro', 'Aug 2018 — Feb 2023',
   'Focused on automation systems, CNC machining, and CAD/CAM design with SolidWorks.', 1),
  ('education', 'Computer and Network Technology', 'SMKN 1 Kota Tangerang', 'Aug 2015 — May 2018',
   'Vocational programme in computer hardware, network configuration, and IT support fundamentals.', 2);

-- ---------- certifications ----------
insert into public.certifications (title, issuer, sort_order) values
  ('Connecting Operator', 'BNSP', 1),
  ('Visiting Lecture: Medical Robot Controlled Intelligent Assistive Technology for Handling Covid-19',
   'Automation Engineering, Universitas Diponegoro', 2);

-- ---------- knowledge notes (untuk asisten AI) ----------
insert into public.knowledge_notes (topic, content) values
  ('Summary',
   'Fatahillah Aditya M. is an Automation Engineering graduate from Universitas Diponegoro (GPA 3.52). He combines hands-on manufacturing experience — CNC operation and maintenance, CAD/CAM design in SolidWorks — with IT support/networking (Cisco, Mikrotik) and video editing/videography.'),
  ('What he is open to',
   'Open to opportunities and collaborations in automation engineering, CAD/CAM design, IT support and networking, and videography.'),
  ('How to get in touch',
   'The best way to reach Fatahillah is through the contact section of this website.');


-- =============================================================
--  BAGIAN 5 — VERIFIKASI
--  Hasilnya langsung tampil di bawah SQL Editor.
--  Kolom "status" harus "OK" semua.
-- =============================================================

select
  t.table_name,
  t.row_count,
  case when t.row_count > 0 then 'OK' else 'KOSONG — cek error di atas' end as status,
  (select count(*) from pg_policies p
    where p.schemaname = 'public' and p.tablename = t.table_name) as jumlah_policy
from (
  select 'profile'         as table_name, count(*) as row_count from public.profile
  union all select 'services',        count(*) from public.services
  union all select 'skills',          count(*) from public.skills
  union all select 'projects',        count(*) from public.projects
  union all select 'experiences',     count(*) from public.experiences
  union all select 'certifications',  count(*) from public.certifications
  union all select 'knowledge_notes', count(*) from public.knowledge_notes
) t
order by t.table_name;
