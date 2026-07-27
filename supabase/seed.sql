-- =============================================================
--  Seed data — your real content, pulled from the CV and the
--  current site. Run AFTER schema.sql.
--  Safe to re-run: it clears the content tables first.
--  ▶ TODO markers show the few fields you should fill in yourself.
-- =============================================================

truncate table
  public.services, public.skills, public.projects,
  public.experiences, public.certifications, public.knowledge_notes
  restart identity cascade;

-- ---------- profile ----------
insert into public.profile (id, name, title, headline, bio, location, email, phone, socials)
values (
  1,
  'Fatahillah Aditya M.',
  'Automation Engineer',
  'An automation engineering graduate who is just as comfortable behind a CNC control panel as behind a camera.',
  'I graduated in Automation Engineering from Universitas Diponegoro with a 3.52 GPA, after finishing vocational school in Computer and Network Technology. My work spans CNC machine operation and maintenance, CAD/CAM design in SolidWorks, IT support and networking, and video editing and videography.',
  'Indonesia',                       -- ▶ TODO: set your city if you want
  null,                              -- ▶ TODO: add your public email (e.g. 'you@example.com')
  null,                              -- ▶ TODO: add a phone number if you want it public
  '{}'::jsonb                        -- ▶ TODO: e.g. {"linkedin":"https://...","youtube":"https://..."}
)
on conflict (id) do update set
  name = excluded.name, title = excluded.title, headline = excluded.headline,
  bio = excluded.bio, location = excluded.location, email = excluded.email,
  phone = excluded.phone, socials = excluded.socials;

-- ---------- services ----------
insert into public.services (title, description, sort_order) values
  ('Automation Engineering', 'CNC machine operation, control, and routine maintenance on the production line.', 1),
  ('CAD / CAM Design',       'Part modelling, assemblies, and manufacturing drawings in SolidWorks.',            2),
  ('IT Support & Networking','Helpdesk, workstation and server maintenance, and network configuration with Cisco and Mikrotik.', 3),
  ('Video Editing & Videography', 'Shooting and editing documentation, recaps, and promotional video for organisations and events.', 4);

-- ---------- skills / tools ----------
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
   'Shot and edited the official company profile video for BEM Universitas Diponegoro — concept, footage, and post-production. Watch it on YouTube.',
   '/work-comprof.png', 'https://www.youtube.com/watch?v=wkwx5XyAEk8', true, array['Videography','Editing'], 4);

-- ---------- experiences: work ----------
insert into public.experiences (kind, role, organization, period, description, sort_order) values
  ('work', 'Mechanical Engineer', 'CV. Laksana Carroserie — Semarang, Indonesia', 'Sep 2021 — Dec 2021',
   'Operated and controlled CNC machines on the production line, and carried out routine maintenance to keep them running.', 1),
  ('work', 'IT Helpdesk', 'PT. PLN (Persero) Distribusi Jakarta Raya — Jakarta, Indonesia', 'May 2017 — Jul 2017',
   'Maintained local computers across the Jakarta office and its service areas, and supported the office servers.', 2);

-- ---------- experiences: education ----------
insert into public.experiences (kind, role, organization, period, description, sort_order) values
  ('education', 'Automation Engineering — GPA 3.52 / 4.00', 'Universitas Diponegoro', 'Aug 2018 — Feb 2023',
   'Focused on automation systems, CNC machining, and CAD/CAM design with SolidWorks.', 1),
  ('education', 'Computer and Network Technology', 'SMKN 1 Kota Tangerang', 'Aug 2015 — May 2018',
   'Vocational programme in computer hardware, network configuration, and IT support fundamentals.', 2);

-- ---------- certifications ----------
insert into public.certifications (title, issuer, sort_order) values
  ('Connecting Operator', 'BNSP', 1),
  ('Visiting Lecture: Medical Robot Controlled Intelligent Assistive Technology for Handling Covid-19', 'Automation Engineering, Universitas Diponegoro', 2);

-- ---------- knowledge notes (for the AI assistant) ----------
-- ▶ TODO: edit these freely. Add availability, rates, response time,
--   preferred contact method, or FAQ answers you want the AI to give.
insert into public.knowledge_notes (topic, content) values
  ('Summary',
   'Fatahillah Aditya M. is an Automation Engineering graduate from Universitas Diponegoro (GPA 3.52). He combines hands-on manufacturing experience — CNC operation and maintenance, CAD/CAM design in SolidWorks — with IT support/networking (Cisco, Mikrotik) and video editing/videography.'),
  ('What I''m open to',
   'Open to opportunities and collaborations in automation engineering, CAD/CAM design, IT support and networking, and videography. ▶ Update this note with your current availability and the kind of work you want.'),
  ('How to get in touch',
   'The best way to reach Fatahillah is through the contact section of this website. ▶ Once you add your email to the profile, mention it here too.');
