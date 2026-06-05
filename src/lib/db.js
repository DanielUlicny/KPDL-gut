import { supabase, isSupabaseConfigured } from './supabase.js';
import { LOGBOOK as MOCK_LOGBOOK, PROJECTS as MOCK_PROJECTS, USER as MOCK_USER, BADGES as MOCK_BADGES, REGIONS as MOCK_REGIONS, LOKALITY as MOCK_LOKALITY, SEKTORY as MOCK_SEKTORY, ROUTES_LOM_A as MOCK_ROUTES } from '../data/mock.js';

// ──────────────────────────────────────────────────────────────
// GUIDEBOOK — Kraje, Lokality, Sektory, Cesty
// ──────────────────────────────────────────────────────────────

export async function fetchKraje() {
  if (!isSupabaseConfigured) {
    return MOCK_REGIONS.map(r => ({
      id: r.code,
      kod: r.code,
      nazov: r.name,
      lokalit: r.lokalit,
      sektorov: r.sektorov,
      ciest: r.ciest,
      color: r.color,
    }));
  }

  const { data: kraje, error } = await supabase.from('kraje').select('*').order('kod');
  if (error) throw error;

  // Count lokality per kraj
  const { data: lokData } = await supabase.from('lokality').select('id, kraj_id');
  const lokalitaIds = (lokData || []).map(l => l.id);

  // Count sektory per lokalita
  const { data: sekData } = lokalitaIds.length
    ? await supabase.from('sektory').select('id, lokalita_id')
    : { data: [] };
  const sektorIds = (sekData || []).map(s => s.id);

  // Count cesty per sektor
  const { data: cestyData } = sektorIds.length
    ? await supabase.from('cesty').select('sektor_id')
    : { data: [] };

  // Build sektor→lokalita and localita→kraj maps
  const sekToLok = {};
  const lokToKraj = {};
  for (const l of lokData || []) lokToKraj[l.id] = l.kraj_id;
  for (const s of sekData || []) sekToLok[s.id] = s.lokalita_id;

  const counts = {};
  const init = (krajId) => { if (!counts[krajId]) counts[krajId] = { lokalit: 0, sektorov: 0, ciest: 0 }; };
  for (const l of lokData || []) { if (l.kraj_id) { init(l.kraj_id); counts[l.kraj_id].lokalit++; } }
  for (const s of sekData || []) {
    const krajId = lokToKraj[s.lokalita_id];
    if (krajId) { init(krajId); counts[krajId].sektorov++; }
  }
  for (const c of cestyData || []) {
    const lokId = sekToLok[c.sektor_id];
    const krajId = lokId && lokToKraj[lokId];
    if (krajId) { init(krajId); counts[krajId].ciest++; }
  }

  return (kraje || []).map(k => ({
    ...k,
    lokalit: counts[k.id]?.lokalit || 0,
    sektorov: counts[k.id]?.sektorov || 0,
    ciest: counts[k.id]?.ciest || 0,
  }));
}

export async function fetchLokality(krajKod) {
  if (!isSupabaseConfigured) {
    const mockData = MOCK_LOKALITY[krajKod] || [];
    return mockData.map(l => ({
      id: l.id,
      nazov: l.name,
      popis: l.desc,
      foto_url: l.img,
      lat: 0, lng: 0,
      typ_skaly: l.rock,
      orientacia: l.orient,
      sezona: l.best,
      pristupnost: '',
      sektorov: l.sektory,
      ciest: l.ciest,
      gradesMin: null,
      gradesMax: null,
    }));
  }

  // Get kraj id
  const { data: krajData, error: krajErr } = await supabase
    .from('kraje').select('id').eq('kod', krajKod).single();
  if (krajErr || !krajData) return [];

  // Get lokality (plain fields only)
  const { data, error } = await supabase
    .from('lokality')
    .select('*')
    .eq('kraj_id', krajData.id)
    .order('nazov');
  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Get sektory for these lokality
  const lokalitaIds = data.map(l => l.id);
  const { data: sekData } = await supabase
    .from('sektory')
    .select('id, lokalita_id')
    .in('lokalita_id', lokalitaIds);
  const sektorIds = (sekData || []).map(s => s.id);

  // Get cesty counts per sektor
  const { data: cestyData } = sektorIds.length
    ? await supabase.from('cesty').select('id, sektor_id').in('sektor_id', sektorIds)
    : { data: [] };

  // Build counts
  const sekToLok = {};
  for (const s of sekData || []) sekToLok[s.id] = s.lokalita_id;
  const sektorovPerLok = {};
  const ciestPerLok = {};
  for (const s of sekData || []) {
    sektorovPerLok[s.lokalita_id] = (sektorovPerLok[s.lokalita_id] || 0) + 1;
  }
  for (const c of cestyData || []) {
    const lokId = sekToLok[c.sektor_id];
    if (lokId) ciestPerLok[lokId] = (ciestPerLok[lokId] || 0) + 1;
  }

  return data.map(l => ({
    ...l,
    sektorov: sektorovPerLok[l.id] || 0,
    ciest: ciestPerLok[l.id] || 0,
    gradesMin: null,
    gradesMax: null,
  }));
}

export async function fetchAllLokality() {
  if (!isSupabaseConfigured) {
    return Object.values(MOCK_LOKALITY).flat().map(l => ({
      id: l.id,
      nazov: l.name,
      popis: l.desc,
      sektorov: l.sektory,
      ciest: l.ciest,
      typ_skaly: l.rock,
      sezona: l.best,
      orientacia: l.orient,
    }));
  }
  const { data, error } = await supabase
    .from('lokality')
    .select('id, nazov, popis')
    .order('nazov')
    .limit(10);
  if (error) throw error;
  if (!data || data.length === 0) return [];

  const lokalitaIds = data.map(l => l.id);
  const { data: sekData } = await supabase
    .from('sektory').select('id, lokalita_id').in('lokalita_id', lokalitaIds);
  const sektorIds = (sekData || []).map(s => s.id);
  const { data: cestyData } = sektorIds.length
    ? await supabase.from('cesty').select('sektor_id').in('sektor_id', sektorIds)
    : { data: [] };

  const sekToLok = {};
  for (const s of sekData || []) sekToLok[s.id] = s.lokalita_id;
  const sektorovPerLok = {};
  const ciestPerLok = {};
  for (const s of sekData || []) sektorovPerLok[s.lokalita_id] = (sektorovPerLok[s.lokalita_id] || 0) + 1;
  for (const c of cestyData || []) {
    const lokId = sekToLok[c.sektor_id];
    if (lokId) ciestPerLok[lokId] = (ciestPerLok[lokId] || 0) + 1;
  }

  return data.map(l => ({
    ...l,
    sektorov: sektorovPerLok[l.id] || 0,
    ciest: ciestPerLok[l.id] || 0,
  }));
}

export async function fetchSektory(lokalitaId) {
  if (!isSupabaseConfigured) {
    const mockSektory = MOCK_SEKTORY[lokalitaId] || [];
    return mockSektory.map(s => ({
      id: s.id,
      nazov: s.name,
      poradie: s.num,
      popis: '',
      foto_url: '',
      ciest: s.ciest,
    }));
  }
  const { data, error } = await supabase
    .from('sektory')
    .select('*')
    .eq('lokalita_id', lokalitaId)
    .order('poradie');
  if (error) throw error;
  if (!data || data.length === 0) return [];

  const sektorIds = data.map(s => s.id);
  const { data: cestyData } = await supabase
    .from('cesty').select('sektor_id').in('sektor_id', sektorIds);
  const ciestPerSektor = {};
  for (const c of cestyData || []) {
    ciestPerSektor[c.sektor_id] = (ciestPerSektor[c.sektor_id] || 0) + 1;
  }
  return data.map(s => ({ ...s, ciest: ciestPerSektor[s.id] || 0 }));
}

export async function fetchCesty(sektoryId) {
  if (!isSupabaseConfigured) {
    return MOCK_ROUTES.map(r => ({
      id: r.num.toString(),
      nazov: r.name,
      obtaznost: r.grade,
      dlzka_m: r.length,
      pocet_isteni: r.bolts,
      popis: r.beta || '',
      poradie: r.num,
      sektor_id: sektoryId,
    }));
  }
  const { data, error } = await supabase
    .from('cesty')
    .select('*')
    .eq('sektor_id', sektoryId)
    .order('poradie');
  if (error) throw error;
  return data || [];
}

export async function fetchCesta(cestaId) {
  if (!isSupabaseConfigured) {
    const cesta = MOCK_ROUTES.find(r => r.num.toString() === cestaId);
    return cesta ? {
      id: cestaId,
      nazov: cesta.name,
      obtaznost: cesta.grade,
      dlzka_m: cesta.length,
      pocet_isteni: cesta.bolts,
      popis: cesta.beta || '',
    } : null;
  }
  const { data, error } = await supabase.from('cesty').select('*').eq('id', cestaId).single();
  if (error) throw error;
  return data;
}

// ──────────────────────────────────────────────────────────────
// LOGBOOK — User's ascents
// ──────────────────────────────────────────────────────────────

export async function fetchLogbook(userId) {
  if (!isSupabaseConfigured) return MOCK_LOGBOOK;
  const { data, error } = await supabase
    .from('logbook')
    .select('id, route_id, ascent_style, note, ascended_at')
    .eq('user_id', userId)
    .order('ascended_at', { ascending: false });
  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Resolve route → sektor → lokalita names in batch
  const routeIds = [...new Set(data.map(r => r.route_id).filter(Boolean))];
  const { data: cestyData } = routeIds.length
    ? await supabase.from('cesty').select('id, nazov, obtaznost, dlzka_m, sektor_id').in('id', routeIds)
    : { data: [] };
  const sektorIds = [...new Set((cestyData || []).map(c => c.sektor_id).filter(Boolean))];
  const { data: sekData } = sektorIds.length
    ? await supabase.from('sektory').select('id, nazov, lokalita_id').in('id', sektorIds)
    : { data: [] };
  const lokIds = [...new Set((sekData || []).map(s => s.lokalita_id).filter(Boolean))];
  const { data: lokData } = lokIds.length
    ? await supabase.from('lokality').select('id, nazov').in('id', lokIds)
    : { data: [] };

  const cestaMap = Object.fromEntries((cestyData || []).map(c => [c.id, c]));
  const sekMap = Object.fromEntries((sekData || []).map(s => [s.id, s]));
  const lokMap = Object.fromEntries((lokData || []).map(l => [l.id, l]));

  return data.map(row => {
    const cesta = cestaMap[row.route_id] || {};
    const sek = sekMap[cesta.sektor_id] || {};
    const lok = lokMap[sek.lokalita_id] || {};
    return {
      id: row.id,
      route_id: row.route_id,
      route: cesta.nazov || 'Unknown',
      grade: cesta.obtaznost || '?',
      dlzka_m: cesta.dlzka_m || 0,
      sektor: sek.nazov || '',
      lokalita: lok.nazov || '',
      when: formatRelative(row.ascended_at),
      ascended_at: row.ascended_at,
      style: row.ascent_style,
      note: row.note || '',
    };
  });
}

export async function addLogbookEntry(userId, entry) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('logbook')
    .insert({
      user_id: userId,
      route_id: entry.route_id,
      ascent_style: entry.style,
      note: entry.note || '',
      ascended_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLogbookNote(id, note) {
  if (!isSupabaseConfigured) return null;
  const { error } = await supabase.from('logbook').update({ note }).eq('id', id);
  if (error) throw error;
}

// ──────────────────────────────────────────────────────────────
// PROJECTS — User's climbing projects
// ──────────────────────────────────────────────────────────────

export async function fetchProjects(userId) {
  if (!isSupabaseConfigured) return MOCK_PROJECTS;
  const { data, error } = await supabase
    .from('projects')
    .select('id, route_id, attempts, notes, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  if (!data || data.length === 0) return [];

  const routeIds = [...new Set(data.map(r => r.route_id).filter(Boolean))];
  const { data: cestyData } = routeIds.length
    ? await supabase.from('cesty').select('id, nazov, obtaznost, dlzka_m, pocet_isteni, sektor_id').in('id', routeIds)
    : { data: [] };
  const sektorIds = [...new Set((cestyData || []).map(c => c.sektor_id).filter(Boolean))];
  const { data: sekData } = sektorIds.length
    ? await supabase.from('sektory').select('id, nazov, lokalita_id').in('id', sektorIds)
    : { data: [] };
  const lokIds = [...new Set((sekData || []).map(s => s.lokalita_id).filter(Boolean))];
  const { data: lokData } = lokIds.length
    ? await supabase.from('lokality').select('id, nazov').in('id', lokIds)
    : { data: [] };

  const cestaMap = Object.fromEntries((cestyData || []).map(c => [c.id, c]));
  const sekMap = Object.fromEntries((sekData || []).map(s => [s.id, s]));
  const lokMap = Object.fromEntries((lokData || []).map(l => [l.id, l]));

  return data.map(row => {
    const cesta = cestaMap[row.route_id] || {};
    const sek = sekMap[cesta.sektor_id] || {};
    const lok = lokMap[sek.lokalita_id] || {};
    return {
      id: row.id,
      route_id: row.route_id,
      route: cesta.nazov || 'Unknown',
      grade: cesta.obtaznost || '?',
      length: cesta.dlzka_m || 0,
      bolts: cesta.pocet_isteni || 0,
      attempts: row.attempts,
      sektor: sek.nazov || '',
      lokalita: lok.nazov || '',
      notes: row.notes || '',
      _cesta: { ...cesta, sektory: { ...sek, lokality: lok } },
    };
  });
}

export async function addProject(userId, project) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      route_id: project.route_id,
      attempts: 0,
      notes: project.notes || '',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeProject(id) {
  if (!isSupabaseConfigured) return null;
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function updateProjectNotes(id, notes) {
  if (!isSupabaseConfigured) return null;
  const { error } = await supabase.from('projects').update({ notes }).eq('id', id);
  if (error) throw error;
}

export async function incrementProjectAttempts(id) {
  if (!isSupabaseConfigured) return null;
  const { error } = await supabase.rpc('increment_project_attempts', { project_id: id });
  if (error) throw error;
}

// ──────────────────────────────────────────────────────────────
// PROFILE — User info (no computed fields — derive from logbook)
// ──────────────────────────────────────────────────────────────

export async function fetchProfile(userId) {
  if (!isSupabaseConfigured) return MOCK_USER;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, surname, handle, bio, avatar_url, age, ape_index, climbing_since, styles')
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    try {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({ id: userId, name: 'Climber', handle: '@climber' })
        .select()
        .single();
      return {
        id: newProfile?.id || userId,
        name: newProfile?.name || 'Climber',
        surname: '', handle: newProfile?.handle || '@climber',
        bio: '', avatar_url: '', age: null, apeIndex: null, since: null, styles: [],
      };
    } catch (e) {
      console.error('Failed to create profile:', e);
      return { name: 'Climber', handle: '@climber', bio: '', styles: [] };
    }
  }

  if (error) { console.error('Fetch profile error:', error); throw error; }

  return {
    id: data?.id || userId,
    name: data?.name || 'Climber',
    surname: data?.surname || '',
    handle: data?.handle || '@climber',
    bio: data?.bio || '',
    avatar_url: data?.avatar_url || '',
    age: data?.age || null,
    apeIndex: data?.ape_index || null,
    since: data?.climbing_since || null,
    styles: data?.styles || [],
  };
}

export async function upsertProfile(userId, updates) {
  if (!isSupabaseConfigured) return null;
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates }, { onConflict: 'id' });
  if (error) throw error;
}

// ──────────────────────────────────────────────────────────────
// USER STATS — Computed dynamically from logbook
// ──────────────────────────────────────────────────────────────

export async function fetchUserStats(userId) {
  if (!isSupabaseConfigured) {
    return {
      sent: MOCK_USER.sent || MOCK_LOGBOOK.length,
      totalLen: MOCK_USER.totalLen || 0,
      best: MOCK_USER.best || '?',
      streak: MOCK_USER.streak || 0,
      thisWeek: MOCK_USER.thisWeek || 0,
    };
  }

  const { data, error } = await supabase
    .from('logbook')
    .select('route_id, ascended_at')
    .eq('user_id', userId)
    .order('ascended_at', { ascending: false });
  if (error) throw error;

  const rows = data || [];
  const sent = rows.length;

  // Get route details for grade and length
  const routeIds = [...new Set(rows.map(r => r.route_id).filter(Boolean))];
  const { data: cestyData } = routeIds.length
    ? await supabase.from('cesty').select('id, obtaznost, dlzka_m').in('id', routeIds)
    : { data: [] };
  const cestaMap = Object.fromEntries((cestyData || []).map(c => [c.id, c]));

  const totalLen = rows.reduce((s, r) => s + (cestaMap[r.route_id]?.dlzka_m || 0), 0);
  const grades = rows.map(r => cestaMap[r.route_id]?.obtaznost).filter(Boolean);
  const best = computeBestGrade(grades);
  const streak = computeStreak(rows.map(r => r.ascended_at));
  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeekDays = new Set(
    rows
      .filter(r => new Date(r.ascended_at).getTime() >= weekAgo)
      .map(r => new Date(r.ascended_at).toDateString())
  );

  return { sent, totalLen, best, streak, thisWeek: thisWeekDays.size };
}

// ──────────────────────────────────────────────────────────────
// BADGES — User achievements
// ──────────────────────────────────────────────────────────────

export async function awardBadgesIfNeeded(userId, logbook) {
  if (!isSupabaseConfigured || !userId || !logbook.length) return [];

  const [{ data: allBadges, error: e1 }, { data: earned, error: e2 }] = await Promise.all([
    supabase.from('badges').select('id, code'),
    supabase.from('user_badges').select('badge_id').eq('user_id', userId),
  ]);
  if (e1 || e2) return [];

  const earnedSet = new Set((earned || []).map(e => e.badge_id));
  const byCode = Object.fromEntries((allBadges || []).map(b => [b.code, b.id]));

  const flashCount = logbook.filter(e => e.style === 'flash').length;
  const onsightCount = logbook.filter(e => e.style === 'onsight').length;
  const total = logbook.length;
  const streak = computeStreak(logbook.map(e => e.ascended_at));

  const checks = [
    ['first_ascent', total >= 1],
    ['first_flash', flashCount >= 1],
    ['first_onsight', onsightCount >= 1],
    ['routes_10', total >= 10],
    ['routes_50', total >= 50],
    ['routes_100', total >= 100],
    ['streak_7', streak >= 7],
    ['streak_30', streak >= 30],
  ];

  const toAward = checks
    .filter(([code, cond]) => cond && byCode[code] && !earnedSet.has(byCode[code]))
    .map(([code]) => byCode[code]);

  if (!toAward.length) return [];

  const now = new Date().toISOString();
  const { error } = await supabase.from('user_badges').insert(
    toAward.map(bid => ({ user_id: userId, badge_id: bid, earned_at: now }))
  );
  if (error) { console.error('Badge award error:', error); return []; }
  return toAward;
}

export async function fetchUserBadges(userId) {
  if (!isSupabaseConfigured) return MOCK_BADGES;

  const [{ data: allBadges, error: e1 }, { data: earnedData, error: e2 }] = await Promise.all([
    supabase.from('badges').select('*').order('name'),
    supabase.from('user_badges').select('badge_id, earned_at').eq('user_id', userId),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;

  const earnedMap = new Map((earnedData || []).map(r => [r.badge_id, r.earned_at]));
  return (allBadges || []).map(b => ({
    id: b.id,
    code: b.code,
    name: b.name,
    description: b.description,
    icon: b.icon || 'star',
    earned: earnedMap.has(b.id),
    earnedAt: earnedMap.get(b.id) || null,
  }));
}

// ──────────────────────────────────────────────────────────────
// UTILITY
// ──────────────────────────────────────────────────────────────

function formatRelative(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'dnes';
  if (days === 1) return 'pred 1 dňom';
  if (days < 7) return `pred ${days} dňami`;
  if (days < 14) return 'pred týždňom';
  if (days < 30) return `pred ${Math.floor(days / 7)} týž.`;
  return `pred ${Math.floor(days / 30)} mes.`;
}

const GRADE_ORDER = [
  '3', '3+', '4', '4-', '4+', '5', '5-', '5+',
  '5a', '5b', '5c', '6', '6-', '6a', '6a+', '6b', '6b+', '6c', '6c+', '6+',
  '7', '7-', '7a', '7a+', '7b', '7b+', '7c', '7c+', '7+',
  '8', '8-', '8a', '8a+', '8b', '8b+', '8c', '8c+', '8+', '9a',
];

function computeBestGrade(grades) {
  if (!grades.length) return '?';
  return grades.reduce((best, g) => {
    const bi = GRADE_ORDER.indexOf(best);
    const gi = GRADE_ORDER.indexOf(g);
    if (bi === -1 && gi === -1) return best;
    if (bi === -1) return g;
    if (gi === -1) return best;
    return gi > bi ? g : best;
  }, grades[0]);
}

function computeStreak(dates) {
  if (!dates.length) return 0;
  const days = [...new Set(dates.filter(Boolean).map(d => new Date(d).toDateString()))]
    .map(d => new Date(d))
    .sort((a, b) => b - a);
  if (!days.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDay = new Date(days[0]);
  firstDay.setHours(0, 0, 0, 0);
  if ((today - firstDay) / 86400000 > 1) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    prev.setHours(0, 0, 0, 0);
    curr.setHours(0, 0, 0, 0);
    if ((prev - curr) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}
