-- KPDL — seed data
-- Initial guidebook data: regions, areas, sectors, routes

-- ──────────────────────────────────────────────────────────────
-- KRAJE (Regions)
-- ──────────────────────────────────────────────────────────────
insert into public.kraje (nazov, kod) values
  ('Bratislava', 'BA'),
  ('Trnava', 'TT'),
  ('Trenčín', 'TN'),
  ('Nitra', 'NR'),
  ('Žilina', 'ZA'),
  ('Banská Bystrica', 'BB'),
  ('Prešov', 'PO'),
  ('Košice', 'KE')
on conflict (kod) do nothing;

-- ──────────────────────────────────────────────────────────────
-- LOKALITY (Areas)
-- ──────────────────────────────────────────────────────────────
insert into public.lokality (kraj_id, nazov, popis, lat, lng, typ_skaly, orientacia, sezona, pristupnost)
select id, 'Tatranská kotlina', 'Veľké lezecké dedisko s množstvom sektorov', null, null, 'vápenec', 'juh-západ', 'apríl-september', 'ľahký prístup'
from public.kraje where kod = 'PO'
on conflict do nothing;

-- ──────────────────────────────────────────────────────────────
-- SEKTORY (Sectors)
-- ──────────────────────────────────────────────────────────────
insert into public.sektory (lokalita_id, nazov, popis, typ_skaly, orientacia, sezona, poradie)
select id, 'Lom A', 'Prvých 12 ciest (vľavo od stromu)', 'vápenec', 'juh', 'apríl-september', 1
from public.lokality where nazov = 'Tatranská kotlina'
union all
select id, 'Lom B', 'Druhých 15 ciest (vpravo od stromu)', 'vápenec', 'juh-západ', 'apríl-september', 2
from public.lokality where nazov = 'Tatranská kotlina'
on conflict do nothing;

-- ──────────────────────────────────────────────────────────────
-- CESTY (Routes)
-- ──────────────────────────────────────────────────────────────
-- Lom A routes (grades in Arabic/French system: 4+, 5+, 6-, 6, 6+, 7-, 7, 7+)
insert into public.cesty (sektor_id, nazov, obtaznost, dlzka_m, pocet_isteni, poradie)
select id, 'Školácka',        '4+',  12,  5,  1 from public.sektory where nazov = 'Lom A' union all
select id, 'Šapra 1',         '5+',  12,  3,  2 from public.sektory where nazov = 'Lom A' union all
select id, 'Šapra 2',         '5+',  12,  3,  3 from public.sektory where nazov = 'Lom A' union all
select id, 'Naklonenná',      '4-',  16,  4,  4 from public.sektory where nazov = 'Lom A' union all
select id, 'Cez platňu',      '7+',  14,  5,  5 from public.sektory where nazov = 'Lom A' union all
select id, 'Štvrtá',          '5+',  15,  9,  6 from public.sektory where nazov = 'Lom A' union all
select id, 'Štvorka doprava', '5+',  15,  8,  7 from public.sektory where nazov = 'Lom A' union all
select id, 'Škárkou vľavo',   '4+',  16,  5,  8 from public.sektory where nazov = 'Lom A' union all
select id, 'Brucho zľava',    '6+',  17,  7,  9 from public.sektory where nazov = 'Lom A' union all
select id, 'Brucho direkt',   '6+',  17,  6, 10 from public.sektory where nazov = 'Lom A' union all
select id, 'Brucho sprava',   '6',   18,  6, 11 from public.sektory where nazov = 'Lom A' union all
select id, 'Stará cesta',     '5',   18,  5, 12 from public.sektory where nazov = 'Lom A'
on conflict do nothing;

-- Lom B routes
insert into public.cesty (sektor_id, nazov, obtaznost, dlzka_m, pocet_isteni, poradie)
select id, 'Mokrá cesta',         '5+',  20,  6,  1 from public.sektory where nazov = 'Lom B' union all
select id, 'Pekná cesta',         '6-',  21,  4,  2 from public.sektory where nazov = 'Lom B' union all
select id, 'Vízia GPS',           '7+',  22,  6,  3 from public.sektory where nazov = 'Lom B' union all
select id, 'Fatamorgána',         '7-',  24,  6,  4 from public.sektory where nazov = 'Lom B' union all
select id, 'Dve zlaté',           '6',   25,  7,  5 from public.sektory where nazov = 'Lom B' union all
select id, 'Tri zlaté',           '6+',  26,  8,  6 from public.sektory where nazov = 'Lom B' union all
select id, 'Štyri zlaté',         '6+',  27,  8,  7 from public.sektory where nazov = 'Lom B' union all
select id, 'Geo',                 '6',   28, 10,  8 from public.sektory where nazov = 'Lom B' union all
select id, 'Pilier',              '7',   30, 11,  9 from public.sektory where nazov = 'Lom B' union all
select id, 'Pilier sprava',       '5+',  32,  8, 10 from public.sektory where nazov = 'Lom B' union all
select id, 'Vane',                '7',   30, 10, 11 from public.sektory where nazov = 'Lom B' union all
select id, 'Variant vaní sprava', '7',   32, 10, 12 from public.sektory where nazov = 'Lom B' union all
select id, 'Nejasná a rozbitá',   '6+',  34, 18, 13 from public.sektory where nazov = 'Lom B' union all
select id, 'Dosť dlhá',           '6+',  34,null, 14 from public.sektory where nazov = 'Lom B' union all
select id, '2017',                '?',   35,  6, 15 from public.sektory where nazov = 'Lom B' union all
select id, 'Štolina',             '6+',  35,  5, 16 from public.sektory where nazov = 'Lom B' union all
select id, 'Krátka vaňovitá',     '7-',  16,  6, 17 from public.sektory where nazov = 'Lom B' union all
select id, 'Zakázané ovocie',     '7+',  36,  5, 18 from public.sektory where nazov = 'Lom B'
on conflict do nothing;

-- ──────────────────────────────────────────────────────────────
-- BADGES (Achievement definitions)
-- ──────────────────────────────────────────────────────────────
insert into public.badges (code, name, description, icon) values
  ('first_ascent', 'Prvá výlez', 'Tvoja prvá vylezená cesta', '🎯'),
  ('first_flash', 'Prvý flash', 'Prvýkrát si urobil flash', '⚡'),
  ('first_onsight', 'Prvý onsight', 'Prvýkrát si urobil onsight', '👁️'),
  ('routes_10', '10 ciest', 'Vyliezol si 10 ciest', '🔟'),
  ('routes_50', '50 ciest', 'Vyliezol si 50 ciest', '5️⃣0️⃣'),
  ('routes_100', '100 ciest', 'Vyliezol si 100 ciest', '💯'),
  ('sektor_complete', 'Sektor kompletný', 'Vyliezol si všetky cesty v sektore', '🏆'),
  ('lokalita_complete', 'Lokalita kompletná', 'Vyliezol si všetky cesty v lokalite', '👑'),
  ('project_sent', '1. projekt vyriešený', 'Dokončil si 1. projekt', '✅'),
  ('project_sent_5', '5 projektov vyriešených', 'Dokončil si 5 projektov', '✅'),
  ('project_sent_10', '10 projektov vyriešených', 'Dokončil si 10 projektov', '✅')
on conflict (code) do nothing;
