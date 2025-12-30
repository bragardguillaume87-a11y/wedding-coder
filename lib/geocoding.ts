/**
 * Service de géocodage utilisant Nominatim (OpenStreetMap)
 * Transforme une adresse en coordonnées GPS (latitude, longitude)
 *
 * Exemple :
 * "10 Rue de Rivoli, Paris" → { latitude: 48.8566, longitude: 2.3522 }
 */

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  country_code: string;
  display_name: string;
  city: string;
}

/**
 * Géocode une adresse en coordonnées GPS
 * Utilise l'API Nominatim (gratuite, limite: 1 requête/seconde)
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address || address.trim() === '') {
    return null;
  }

  try {
    // Appel à l'API Nominatim (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(address)}` +
      `&format=json&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'WeddingCoder/1.0', // Requis par Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Aucun résultat trouvé
    if (!data || data.length === 0) {
      console.warn('❌ Aucune adresse trouvée pour:', address);
      return null;
    }

    const result = data[0];

    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      country_code: result.address?.country_code?.toUpperCase() || 'FR',
      display_name: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village || '',
    };
  } catch (error) {
    console.error('❌ Géocodage échoué:', error);
    return null;
  }
}

/**
 * Helper pour respecter le rate limiting (1 req/sec pour Nominatim)
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
