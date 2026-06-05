import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './auth.jsx';
import {
  fetchLogbook, addLogbookEntry, updateLogbookNote,
  fetchProjects, addProject, removeProject, updateProjectNotes,
  fetchProfile, upsertProfile,
  fetchUserBadges, awardBadgesIfNeeded,
  fetchUserStats,
} from '../lib/db.js';

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

  // ── Stats ──
  const [stats, setStats] = useState({ sent: 0, totalLen: 0, best: '?', streak: 0, thisWeek: 0 });

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

    fetchUserStats(user.id).then(setStats).catch(console.error);

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
