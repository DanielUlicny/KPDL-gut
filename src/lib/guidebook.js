// In-memory cache for guidebook data (kraje, lokality, sektory, cesty).
// Lives for the duration of the app session — no re-fetches on navigation.
import { fetchKraje, fetchLokality, fetchAllLokality, fetchSektory, fetchCesty } from './db.js';

const cache = new Map();

function cached(key, fetcher) {
  if (cache.has(key)) return Promise.resolve(cache.get(key));
  return fetcher().then(data => { cache.set(key, data); return data; });
}

export const getKraje = () => cached('kraje', fetchKraje);
export const getLokality = (krajKod) => cached(`lok:${krajKod}`, () => fetchLokality(krajKod));
export const getAllLokality = () => cached('allLokality', fetchAllLokality);
export const getSektory = (lokalitaId) => cached(`sek:${lokalitaId}`, () => fetchSektory(lokalitaId));
export const getCesty = (sektorId) => cached(`ces:${sektorId}`, () => fetchCesty(sektorId));
