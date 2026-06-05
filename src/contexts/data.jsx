import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from './auth.jsx';
import {
  fetchLogbook, addLogbookEntry, updateLogbookNote,
  fetchProjects, addProject, removeProject, updateProjectNotes,
  fetchProfile, upsertProfile,
  fetchUserBadges, awardBadgesIfNeeded,
} from '../lib/db.js';

const GRADE_ORDER = [
  '3','3+','4','4-','4+','5','5-','5+','5a','5b','5c',
  '6','6-','6a','6a+','6b','6b+','6c','6c+','6+',
  '7','7-','7a','7a+','7b','7b+','7c','7c+','7+',
  '8','8-','8a','8a+','8b','8b+','8c','8c+','8+','9a',
];

function computeStats(logbook) {
  const sent = logbook.length;
  const totalLen = logbook.reduce((s, e) => s + (e.dlzka_m || 0), 0);

  const grades = logbook.map(e => e.grade).filter(g => g && g !== '?');
  const best = grades.length === 0 ? '?' : grades.reduce((b, g) => {
    const bi = GRADE_ORDER.indexOf(b), gi = GRADE_ORDER.indexOf(g);
    if (bi === -1 && gi === -1) return b;
    if (bi === -1) return g;
    if (gi === -1) return b;
    return gi > bi ? g : b;
  }, grades[0]);

  const dates = logbook.map(e => e.ascended_at).filter(Boolean);
  const days = [...new Set(dates.map(d => new Date(d).toDateString()))]
    .map(d => new Date(d)).sort((a, b) => b - a);
  let streak = 0;
  if (days.length > 0) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const first = new Date(days[0]); first.setHours(0, 0, 0, 0);
    if ((today - first) / 86400000 <= 1) {
      streak = 1;
      for (let i = 1; i < days.length; i++) {
        const prev = new Date(days[i - 1]); prev.setHours(0, 0, 0, 0);
        const curr = new Date(days[i]); curr.setHours(0, 0, 0, 0);
        if ((prev - curr) / 86400000 === 1) streak++;
        else break;
      }
    }
  }

  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeekDays = new Set(
    logbook
      .filter(e => e.ascended_at && new Date(e.ascended_at).getTime() >= weekAgo)
      .map(e => new Date(e.ascended_at).toDateString())
  );

  return { sent, totalLen, best: best || '?', streak, thisWeek: thisWeekDays.size };
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();

  // ── Logbook ──
  const [logbook, setLogbook] = useState([]);
  const [logbookLoading, setLogbookLoading] = useState(true);
  const logbookRef = useRef([]);

  // ── Projects ──
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // ── Profile ──
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // ── Stats — reaktívne z logbooku ──
  const stats = useMemo(() => computeStats(logbook), [logbook]);

  // ── Badges ──
  const [badges, setBadges] = useState([]);

  // Fetch everything once when user is available
  useEffect(() => {
    if (!user) return;

    fetchLogbook(user.id)
      .then(data => { logbookRef.current = data; setLogbook(data); setLogbookLoading(false); })
      .catch(console.error);

    fetchProjects(user.id)
      .then(data => { setProjects(data); setProjectsLoading(false); })
      .catch(console.error);

    fetchProfile(user.id)
      .then(data => { setProfile(data); setProfileLoading(false); })
      .catch(console.error);

    fetchUserBadges(user.id).then(setBadges).catch(console.error);
  }, [user]);

  // Re-fetch badges on badge-update event
  const refetchBadges = useCallback(() => {
    if (!user) return;
    fetchUserBadges(user.id).then(setBadges).catch(console.error);
  }, [user]);

  useEffect(() => {
    window.addEventListener('badge-update', refetchBadges);
    return () => window.removeEventListener('badge-update', refetchBadges);
  }, [refetchBadges]);

  // ── Logbook mutations ──
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

  const updateLogbookEntry = useCallback(async (idx, note) => {
    const entry = logbookRef.current[idx];
    if (entry?.id) await updateLogbookNote(entry.id, note);
    setLogbook(prev => {
      const updated = prev.map((e, i) => i === idx ? { ...e, note } : e);
      logbookRef.current = updated;
      return updated;
    });
  }, []);

  // ── Project mutations ──
  const addProjectFn = useCallback(async (project) => {
    const result = await addProject(user.id, project);
    setProjects(prev => [{ ...project, id: result?.id }, ...prev]);
  }, [user]);

  const removeProjectFn = useCallback(async (idx) => {
    setProjects(prev => {
      const p = prev[idx];
      if (p?.id) removeProject(p.id).catch(console.error);
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const updateProjectNotesFn = useCallback(async (idx, notes) => {
    setProjects(prev => {
      const p = prev[idx];
      if (p?.id) updateProjectNotes(p.id, notes).catch(console.error);
      return prev.map((item, i) => i === idx ? { ...item, notes } : item);
    });
  }, []);

  // ── Profile mutation ──
  const updateProfile = useCallback(async (updates) => {
    await upsertProfile(user.id, updates);
    setProfile(prev => ({ ...prev, ...updates }));
  }, [user]);

  return (
    <DataContext.Provider value={{
      logbook, logbookLoading, addEntry, updateLogbookEntry,
      projects, projectsLoading, addProject: addProjectFn, removeProject: removeProjectFn, updateProjectNotes: updateProjectNotesFn,
      profile, profileLoading, updateProfile,
      stats,
      badges,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within DataProvider');
  return ctx;
}
