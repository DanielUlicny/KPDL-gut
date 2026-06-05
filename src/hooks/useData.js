import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/auth.jsx';
import {
  fetchLogbook, addLogbookEntry, updateLogbookNote,
  fetchProjects, addProject, removeProject, updateProjectNotes,
  fetchProfile, upsertProfile,
  fetchUserBadges, awardBadgesIfNeeded,
  fetchUserStats,
} from '../lib/db.js';

export function useLogbook() {
  const { user } = useAuth();
  const [logbook, setLogbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const logbookRef = useRef([]);

  useEffect(() => {
    if (!user) return;
    fetchLogbook(user.id)
      .then(data => { logbookRef.current = data; setLogbook(data); setLoading(false); })
      .catch(console.error);
  }, [user]);

  const addEntry = useCallback(async (entry) => {
    const result = await addLogbookEntry(user.id, entry);
    const newEntry = {
      ...entry,
      id: result?.id,
      route: entry.route || '',
      grade: entry.grade || '?',
      when: 'práve teraz',
      ascended_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...logbookRef.current];
    logbookRef.current = updated;
    setLogbook(updated);
    awardBadgesIfNeeded(user.id, updated)
      .then(awarded => { if (awarded.length > 0) window.dispatchEvent(new Event('badge-update')); })
      .catch(console.error);
    return result;
  }, [user]);

  const updateNote = useCallback(async (idx, note) => {
    const entry = logbook[idx];
    if (entry?.id) await updateLogbookNote(entry.id, note);
    setLogbook(prev => prev.map((e, i) => i === idx ? { ...e, note } : e));
  }, [logbook]);

  return { logbook, loading, addEntry, updateNote };
}

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchProjects(user.id)
      .then(data => { setProjects(data); setLoading(false); })
      .catch(console.error);
  }, [user]);

  const add = useCallback(async (project) => {
    const result = await addProject(user.id, project);
    setProjects(prev => [{ ...project, id: result?.id }, ...prev]);
  }, [user]);

  const remove = useCallback(async (idx) => {
    const p = projects[idx];
    if (p?.id) await removeProject(p.id);
    setProjects(prev => prev.filter((_, i) => i !== idx));
  }, [projects]);

  const updateNotes = useCallback(async (idx, notes) => {
    const p = projects[idx];
    if (p?.id) await updateProjectNotes(p.id, notes);
    setProjects(prev => prev.map((item, i) => i === idx ? { ...item, notes } : item));
  }, [projects]);

  return { projects, loading, add, remove, updateNotes };
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchProfile(user.id)
      .then(data => { setProfile(data); setLoading(false); })
      .catch(console.error);
  }, [user]);

  const update = useCallback(async (updates) => {
    await upsertProfile(user.id, updates);
    setProfile(prev => ({ ...prev, ...updates }));
  }, [user]);

  return { profile, loading, update };
}

export function useStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ sent: 0, totalLen: 0, best: '?', streak: 0, thisWeek: 0 });

  useEffect(() => {
    if (!user) return;
    fetchUserStats(user.id).then(setStats).catch(console.error);
  }, [user]);

  return stats;
}

export function useBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);

  const fetchBadges = useCallback(() => {
    if (!user) return;
    fetchUserBadges(user.id).then(setBadges).catch(console.error);
  }, [user]);

  useEffect(() => { fetchBadges(); }, [fetchBadges]);

  useEffect(() => {
    window.addEventListener('badge-update', fetchBadges);
    return () => window.removeEventListener('badge-update', fetchBadges);
  }, [fetchBadges]);

  return badges;
}

// Derives visited lokality from logbook entries
export function useVisited(logbook) {
  return useMemo(() => {
    const lokMap = {};
    for (const entry of logbook) {
      if (!entry.lokalita) continue;
      if (!lokMap[entry.lokalita]) {
        lokMap[entry.lokalita] = { name: entry.lokalita, ascents: 0, lastVisit: '', lastDate: '' };
      }
      lokMap[entry.lokalita].ascents++;
      if (!lokMap[entry.lokalita].lastDate || entry.ascended_at > lokMap[entry.lokalita].lastDate) {
        lokMap[entry.lokalita].lastDate = entry.ascended_at || '';
        lokMap[entry.lokalita].lastVisit = entry.when || '';
      }
    }
    return Object.values(lokMap);
  }, [logbook]);
}

// Builds difficulty pyramid from logbook entries
export function usePyramid(logbook) {
  return useMemo(() => {
    const counts = {};
    for (const entry of logbook) {
      if (entry.grade && entry.grade !== '?') {
        counts[entry.grade] = (counts[entry.grade] || 0) + 1;
      }
    }
    return counts;
  }, [logbook]);
}
