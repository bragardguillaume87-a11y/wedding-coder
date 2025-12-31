/**
 * Module-level cache pour GeoJSON
 * Architecture à 2 niveaux:
 * 1. Cache mémoire (module-level) - ultra rapide, volatile
 * 2. Cache IndexedDB - persistent, survit aux rechargements
 *
 * Évite de recharger les fichiers à chaque render
 * Cache partagé entre toutes les instances de composants
 *
 * Phase 1.2 - Intégration IndexedDB
 */

import { getCachedGeoJSON, setCachedGeoJSON } from './indexedDBCache';

type GeoJSONCache = {
  [key: string]: {
    data: GeoJSON.FeatureCollection | null;
    loading: boolean;
    error: Error | null;
    timestamp: number;
  };
};

const cache: GeoJSONCache = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure (cache mémoire)

/**
 * Charge un fichier GeoJSON avec cache automatique à 2 niveaux
 * @param url URL du fichier GeoJSON
 * @returns Promise<GeoJSON.FeatureCollection>
 */
export async function loadGeoJSON(url: string): Promise<GeoJSON.FeatureCollection> {
  // Niveau 1: Vérifier le cache module-level (mémoire) - ultra rapide
  const cached = cache[url];
  if (cached?.data) {
    const age = Date.now() - cached.timestamp;
    if (age < CACHE_DURATION) {
      console.log(`✓ GeoJSON cache hit (mémoire): ${url} (age: ${Math.round(age / 1000)}s)`);
      return cached.data;
    } else {
      console.log(`⚠ GeoJSON cache mémoire expiré: ${url}`);
      delete cache[url];
    }
  }

  // Niveau 2: Vérifier IndexedDB - persistent
  const indexedDBData = await getCachedGeoJSON(url);
  if (indexedDBData) {
    // Mettre à jour le cache mémoire aussi pour la prochaine fois
    cache[url] = {
      data: indexedDBData,
      loading: false,
      error: null,
      timestamp: Date.now()
    };
    console.log(`✓ GeoJSON restauré depuis IndexedDB vers cache mémoire: ${url}`);
    return indexedDBData;
  }

  // Attendre si déjà en cours de chargement
  if (cached?.loading) {
    console.log(`⏳ GeoJSON chargement en cours: ${url}`);
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const current = cache[url];
        if (current?.data) {
          clearInterval(checkInterval);
          resolve(current.data);
        } else if (current?.error) {
          clearInterval(checkInterval);
          reject(current.error);
        }
      }, 50);

      // Timeout après 30 secondes
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error(`Timeout loading ${url}`));
      }, 30000);
    });
  }

  // Niveau 3: Charger depuis le réseau
  cache[url] = { data: null, loading: true, error: null, timestamp: Date.now() };

  try {
    console.log(`⬇ Téléchargement GeoJSON depuis le réseau: ${url}`);
    const startTime = performance.now();

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const duration = performance.now() - startTime;
    const size = JSON.stringify(data).length;

    console.log(`✓ GeoJSON chargé depuis le réseau: ${url}`);
    console.log(`  Durée: ${duration.toFixed(2)}ms`);
    console.log(`  Taille: ${(size / 1024).toFixed(2)} KB`);
    console.log(`  Vitesse: ${(size / 1024 / (duration / 1000)).toFixed(2)} KB/s`);

    // Mettre en cache (mémoire + IndexedDB)
    cache[url] = {
      data,
      loading: false,
      error: null,
      timestamp: Date.now()
    };

    // Sauvegarder dans IndexedDB pour persistance
    await setCachedGeoJSON(url, data);

    return data;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error(`✗ Erreur chargement GeoJSON: ${url}`, err);

    cache[url] = {
      data: null,
      loading: false,
      error: err,
      timestamp: Date.now()
    };

    throw err;
  }
}

/**
 * Efface le cache GeoJSON
 * @param url URL spécifique à effacer (optionnel, efface tout si omis)
 */
export function clearGeoJSONCache(url?: string) {
  if (url) {
    delete cache[url];
    console.log(`Cache effacé pour: ${url}`);
  } else {
    Object.keys(cache).forEach(key => delete cache[key]);
    console.log('Cache GeoJSON effacé complètement');
  }
}

/**
 * Récupère les statistiques du cache
 */
export function getCacheStats() {
  return Object.entries(cache).map(([url, entry]) => ({
    url,
    hasData: !!entry.data,
    isLoading: entry.loading,
    age: entry.timestamp ? Date.now() - entry.timestamp : null,
    error: entry.error?.message
  }));
}

/**
 * Précharge des fichiers GeoJSON couramment utilisés
 * @param urls Liste des URLs à précharger
 */
export async function preloadGeoJSON(urls: string[]) {
  console.log(`Préchargement de ${urls.length} fichiers GeoJSON...`);
  await Promise.all(urls.map(url => loadGeoJSON(url)));
  console.log('Préchargement terminé');
}
