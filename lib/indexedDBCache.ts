/**
 * Cache IndexedDB pour GeoJSON
 * Complète le cache module-level existant (geoJsonCache.ts)
 * Permet la persistance des données entre sessions et le mode hors-ligne
 *
 * Architecture à 2 niveaux:
 * 1. Cache mémoire (module-level) - ultra rapide, volatile
 * 2. Cache IndexedDB (ce fichier) - persistent, survit aux rechargements
 *
 * Phase 1.2 - Plan d'implémentation wedding-coder
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface GeoJSONDB extends DBSchema {
  geojson: {
    key: string;
    value: {
      url: string;
      data: GeoJSON.FeatureCollection;
      timestamp: number;
      version: string;
    };
  };
}

const DB_NAME = 'wedding-geojson-cache';
const STORE_NAME = 'geojson';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours (604 800 000 ms)
const DB_VERSION = 1;

let db: IDBPDatabase<GeoJSONDB> | null = null;

/**
 * Initialise ou récupère la connexion à la base IndexedDB
 * Création automatique du store si nécessaire
 */
async function getDB(): Promise<IDBPDatabase<GeoJSONDB>> {
  if (db) return db;

  try {
    db = await openDB<GeoJSONDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        // Créer le store si n'existe pas
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'url' });
          console.log(`✓ IndexedDB store créé: ${STORE_NAME}`);
        }
      },
    });

    console.log(`✓ IndexedDB connecté: ${DB_NAME} v${DB_VERSION}`);
    return db;
  } catch (error) {
    console.error('✗ Erreur connexion IndexedDB:', error);
    throw error;
  }
}

/**
 * Récupère un GeoJSON depuis IndexedDB
 * @param url - URL du fichier GeoJSON
 * @returns GeoJSON.FeatureCollection ou null si absent/expiré
 */
export async function getCachedGeoJSON(url: string): Promise<GeoJSON.FeatureCollection | null> {
  try {
    const database = await getDB();
    const cached = await database.get(STORE_NAME, url);

    if (!cached) {
      console.log(`ⓘ IndexedDB cache miss: ${url}`);
      return null;
    }

    // Vérifier l'expiration (7 jours)
    const age = Date.now() - cached.timestamp;
    if (age > CACHE_DURATION) {
      // Cache expiré - supprimer
      await database.delete(STORE_NAME, url);
      console.log(`⚠ IndexedDB cache expiré (${Math.round(age / 86400000)} jours): ${url}`);
      return null;
    }

    // Cache valide
    const ageInSeconds = Math.round(age / 1000);
    const sizeKB = (JSON.stringify(cached.data).length / 1024).toFixed(2);
    console.log(`✓ IndexedDB cache hit: ${url}`);
    console.log(`  Age: ${ageInSeconds}s | Taille: ${sizeKB} KB | Version: ${cached.version}`);

    return cached.data;
  } catch (error) {
    console.error('✗ Erreur lecture IndexedDB:', error);
    return null;
  }
}

/**
 * Stocke un GeoJSON dans IndexedDB
 * @param url - URL du fichier GeoJSON
 * @param data - Données GeoJSON à mettre en cache
 */
export async function setCachedGeoJSON(url: string, data: GeoJSON.FeatureCollection): Promise<void> {
  try {
    const database = await getDB();

    const entry = {
      url,
      data,
      timestamp: Date.now(),
      version: '1.0',
    };

    await database.put(STORE_NAME, entry);

    const sizeKB = (JSON.stringify(data).length / 1024).toFixed(2);
    console.log(`✓ GeoJSON mis en cache IndexedDB: ${url}`);
    console.log(`  Taille: ${sizeKB} KB | Expiration: 7 jours`);
  } catch (error) {
    console.error('✗ Erreur écriture IndexedDB:', error);
    // Ne pas throw - le cache IndexedDB est optionnel
    // L'application doit continuer à fonctionner même si IndexedDB échoue
  }
}

/**
 * Efface le cache IndexedDB (tout ou une URL spécifique)
 * @param url - URL spécifique à effacer (optionnel, efface tout si omis)
 */
export async function clearIndexedDBCache(url?: string): Promise<void> {
  try {
    const database = await getDB();

    if (url) {
      await database.delete(STORE_NAME, url);
      console.log(`✓ Cache effacé pour: ${url}`);
    } else {
      await database.clear(STORE_NAME);
      console.log('✓ Cache IndexedDB effacé complètement');
    }
  } catch (error) {
    console.error('✗ Erreur effacement cache IndexedDB:', error);
  }
}

/**
 * Récupère les statistiques du cache IndexedDB
 * Utile pour le monitoring et le debug
 */
export async function getIndexedDBStats(): Promise<{
  count: number;
  entries: Array<{
    url: string;
    age: number;
    sizeKB: number;
    version: string;
  }>;
  totalSizeKB: number;
}> {
  try {
    const database = await getDB();
    const allKeys = await database.getAllKeys(STORE_NAME);
    const entries = [];
    let totalSize = 0;

    for (const key of allKeys) {
      const cached = await database.get(STORE_NAME, key);
      if (cached) {
        const size = JSON.stringify(cached.data).length;
        totalSize += size;
        entries.push({
          url: cached.url,
          age: Date.now() - cached.timestamp,
          sizeKB: Number((size / 1024).toFixed(2)),
          version: cached.version,
        });
      }
    }

    return {
      count: entries.length,
      entries,
      totalSizeKB: Number((totalSize / 1024).toFixed(2)),
    };
  } catch (error) {
    console.error('✗ Erreur récupération stats IndexedDB:', error);
    return { count: 0, entries: [], totalSizeKB: 0 };
  }
}

/**
 * Nettoie les entrées expirées du cache
 * À appeler périodiquement (ex: au démarrage de l'app)
 */
export async function cleanupExpiredCache(): Promise<number> {
  try {
    const database = await getDB();
    const allKeys = await database.getAllKeys(STORE_NAME);
    let deletedCount = 0;

    for (const key of allKeys) {
      const cached = await database.get(STORE_NAME, key);
      if (cached) {
        const age = Date.now() - cached.timestamp;
        if (age > CACHE_DURATION) {
          await database.delete(STORE_NAME, key);
          deletedCount++;
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`✓ Nettoyage IndexedDB: ${deletedCount} entrée(s) expirée(s) supprimée(s)`);
    }

    return deletedCount;
  } catch (error) {
    console.error('✗ Erreur nettoyage cache IndexedDB:', error);
    return 0;
  }
}
