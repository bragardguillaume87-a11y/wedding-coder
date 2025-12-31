/**
 * Helpers et utilitaires pour la carte
 * Gère le tri, le groupement, et les calculs géographiques
 */

export interface MapEvent {
  id: string;
  event_name: string;
  event_date: string;
  event_type?: string; // Type d'événement: ceremony, cocktail, dinner, brunch, party, activity
  location_address: string;
  city_name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  display_order?: number;
}

/**
 * Trie les événements par date chronologique
 * Pour afficher le parcours dans l'ordre du voyage
 */
export function sortEventsByDate(events: MapEvent[]): MapEvent[] {
  return [...events].sort((a, b) =>
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );
}

/**
 * Groupe les événements par pays
 * Utile pour afficher des encarts internationaux (style DOM-TOM)
 */
export function groupByCountry(events: MapEvent[]): Record<string, MapEvent[]> {
  return events.reduce((acc, event) => {
    const country = event.country_code || 'FR';
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(event);
    return acc;
  }, {} as Record<string, MapEvent[]>);
}

/**
 * Calcule le centre géographique d'un ensemble d'événements
 * Pour centrer la carte automatiquement
 */
export function calculateCenter(events: MapEvent[]): [number, number] {
  if (events.length === 0) {
    return FRANCE_CENTER; // Défaut: centre de la France
  }

  const avgLat = events.reduce((sum, e) => sum + e.latitude, 0) / events.length;
  const avgLng = events.reduce((sum, e) => sum + e.longitude, 0) / events.length;

  return [avgLat, avgLng];
}

/**
 * Calcule la distance entre deux points GPS (formule de Haversine)
 * Retourne la distance en kilomètres
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calcule la distance totale du parcours
 * Additionne les distances entre chaque étape consécutive
 */
export function calculateTotalDistance(events: MapEvent[]): number {
  if (events.length < 2) return 0;

  const sorted = sortEventsByDate(events);
  let total = 0;

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    total += calculateDistance(
      current.latitude,
      current.longitude,
      next.latitude,
      next.longitude
    );
  }

  return Math.round(total);
}

// ===== CONSTANTES =====

/** Centre géographique de la France */
export const FRANCE_CENTER: [number, number] = [46.603354, 1.888334];

/** Zoom par défaut pour afficher toute la France et pays voisins */
export const DEFAULT_ZOOM = 4.5;

/** Couleur terracotta du thème wedding */
export const MARKER_COLOR = '#E07A5F';

/** Couleur rose powder du thème wedding */
export const MARKER_COLOR_SECONDARY = '#F4ACB7';
