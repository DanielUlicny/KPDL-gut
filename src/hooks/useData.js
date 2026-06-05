import { useMemo } from 'react';
import { useDataContext } from '../contexts/data.jsx';

export function useLogbook() {
  const { logbook, logbookLoading, addEntry, updateLogbookEntry } = useDataContext();
  return { logbook, loading: logbookLoading, addEntry, updateNote: updateLogbookEntry };
}

export function useProjects() {
  const { projects, projectsLoading, addProject, removeProject, updateProjectNotes } = useDataContext();
  return { projects, loading: projectsLoading, add: addProject, remove: removeProject, updateNotes: updateProjectNotes };
}

export function useProfile() {
  const { profile, profileLoading, updateProfile } = useDataContext();
  return { profile, loading: profileLoading, update: updateProfile };
}

export function useStats() {
  const { stats } = useDataContext();
  return stats;
}

export function useBadges() {
  const { badges } = useDataContext();
  return badges;
}

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
