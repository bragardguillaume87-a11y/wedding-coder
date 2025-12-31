/**
 * 🎨 Système d'icônes personnalisées par ville/région
 * Mapping intelligent ville → émoji pour les markers de carte
 *
 * Phase 2.1 - Plan d'implémentation wedding-coder
 */

/**
 * Mapping principal : Ville → Émoji
 * Couvre les principales villes françaises + régions
 */
export const cityIcons: Record<string, string> = {
  // ===== GRANDES VILLES =====
  'paris': '🗼',           // Tour Eiffel
  'lyon': '🦁',            // Lion (symbole historique)
  'marseille': '⚓',       // Port méditerranéen
  'bordeaux': '🍷',        // Capitale mondiale du vin
  'toulouse': '✈️',        // Aéronautique (Airbus)
  'nice': '🏖️',           // Côte d'Azur / Plages
  'nantes': '🏰',          // Château des Ducs de Bretagne
  'strasbourg': '🏛️',      // Cathédrale / Parlement européen
  'lille': '🎭',           // Culture / Grand Palais
  'montpellier': '☀️',     // Ville du soleil
  'rennes': '🎓',          // Ville universitaire
  'reims': '🥂',           // Champagne
  'saint-étienne': '⚽',   // Football / Stade Geoffroy-Guichard
  'toulon': '⚓',          // Port militaire
  'grenoble': '⛷️',       // Capitale des Alpes
  'dijon': '🍯',           // Moutarde (on utilise miel comme proxy)
  'angers': '🌿',          // Ville verte
  'brest': '🌊',           // Océan Atlantique
  'le havre': '🚢',        // Port de commerce
  'clermont-ferrand': '🌋', // Volcans d'Auvergne
  'aix-en-provence': '🌻',  // Provence
  'tours': '🍇',           // Vallée de la Loire / Vins
  'amiens': '⛪',          // Cathédrale gothique
  'limoges': '🎨',         // Porcelaine / Arts
  'villeurbanne': '🏭',    // Banlieue industrielle Lyon
  'besançon': '⏰',        // Capitale de l'horlogerie
  'metz': '🏛️',           // Architecture / Cathédrale
  'perpignan': '🌞',       // Sud / Soleil catalan
  'orléans': '👸',         // Jeanne d'Arc
  'mulhouse': '🚗',        // Musée de l'automobile
  'caen': '⚔️',            // Guillaume le Conquérant
  'nancy': '✨',           // Place Stanislas
  'rouen': '🎨',           // Cathédrale de Monet
  'argenteuil': '🌊',      // Seine
  'montreuil': '🎬',       // Studios de cinéma

  // ===== RÉGIONS FRANÇAISES =====
  'île-de-france': '🗼',   // Paris / Tour Eiffel
  'bretagne': '🌊',         // Océan / Côtes
  'normandie': '🐄',        // Vaches normandes / Camembert
  'limousin': '🐮',         // Vaches limousines
  'provence': '🌻',         // Lavande / Champs
  'provence-alpes-côte d\'azur': '🏖️',  // Côte d'Azur
  'alsace': '🍺',           // Bière / Winstub
  'corse': '🏔️',           // Montagnes corses
  'savoie': '⛷️',          // Ski / Alpes
  'haute-savoie': '🏔️',    // Mont Blanc
  'auvergne': '🌋',         // Volcans
  'auvergne-rhône-alpes': '⛷️',  // Montagnes
  'bourgogne': '🍷',        // Vins de Bourgogne
  'bourgogne-franche-comté': '🧀',  // Fromages (Comté)
  'centre-val de loire': '🏰',  // Châteaux de la Loire
  'grand est': '🍺',        // Alsace / Bière
  'hauts-de-france': '⛪',  // Cathédrales gothiques
  'nouvelle-aquitaine': '🍷',  // Bordeaux / Vins
  'occitanie': '☀️',        // Sud / Soleil
  'pays de la loire': '🏰', // Châteaux
  'champagne': '🥂',        // Champagne
  'champagne-ardenne': '🥂',
  'aquitaine': '🍷',        // Bordeaux
  'midi-pyrénées': '✈️',    // Toulouse / Airbus
  'languedoc-roussillon': '🌞',  // Soleil méditerranéen
  'poitou-charentes': '⚓',  // La Rochelle / Port
  'lorraine': '🥖',         // Quiche lorraine
  'picardie': '🏛️',        // Cathédrales
  'rhône-alpes': '⛷️',     // Alpes
  'franche-comté': '🧀',    // Comté

  // ===== PETITES VILLES / COMMUNES CONNUES =====
  'cannes': '🎬',           // Festival de Cannes
  'deauville': '🐴',        // Courses hippiques
  'chamonix': '🏔️',        // Mont Blanc / Alpinisme
  'lourdes': '⛪',          // Pèlerinage
  'carcassonne': '🏰',      // Cité médiévale
  'avignon': '🎭',          // Festival de théâtre
  'saint-tropez': '⛵',     // Yachts / Luxe
  'annecy': '💧',           // Lac d'Annecy
  'colmar': '🏘️',          // Maisons alsaciennes
  'mont-saint-michel': '🏰', // Abbaye
  'biarritz': '🏄',         // Surf
  'arcachon': '🦪',         // Huîtres
  'étretat': '🪨',          // Falaises
  'giverny': '🎨',          // Jardins de Monet
  'chambord': '🏰',         // Château
  'chenonceau': '🏰',       // Château
  'versailles': '👑',       // Château
  'fontainebleau': '🏰',    // Château

  // ===== PAYS / INTERNATIONAL (si besoin) =====
  'france': '🇫🇷',         // Drapeau français
  'belgique': '🇧🇪',       // Belgique
  'suisse': '🇨🇭',         // Suisse
  'espagne': '🇪🇸',        // Espagne
  'italie': '🇮🇹',         // Italie
  'allemagne': '🇩🇪',      // Allemagne
  'royaume-uni': '🇬🇧',    // UK
  'angleterre': '🇬🇧',     // UK
  'états-unis': '🇺🇸',     // USA
  'canada': '🇨🇦',         // Canada

  // ===== DÉFAUT =====
  'default': '📍',          // Pin générique
};

/**
 * Récupère l'icône associée à une ville/région
 * Gestion intelligente :
 * - Normalisation (minuscules, trim)
 * - Recherche partielle (si "Paris 15" → trouve "paris")
 * - Fallback sur icône par défaut
 *
 * @param cityName - Nom de la ville ou région
 * @returns Émoji représentant la ville
 *
 * @example
 * getCityIcon('Paris') // → '🗼'
 * getCityIcon('BORDEAUX') // → '🍷'
 * getCityIcon('Paris 15ème') // → '🗼' (recherche partielle)
 * getCityIcon('Ville Inconnue') // → '📍' (défaut)
 */
export function getCityIcon(cityName: string | null | undefined): string {
  // Cas null/undefined
  if (!cityName) {
    return cityIcons['default'];
  }

  // Normalisation : minuscules + trim + suppression accents
  const normalized = cityName
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Supprime les accents

  // 1. Recherche exacte
  if (cityIcons[normalized]) {
    return cityIcons[normalized];
  }

  // 2. Recherche partielle (pour "Paris 15" → trouve "paris")
  const partialMatch = Object.keys(cityIcons).find(key =>
    normalized.includes(key) || key.includes(normalized)
  );

  if (partialMatch) {
    return cityIcons[partialMatch];
  }

  // 3. Fallback sur défaut
  return cityIcons['default'];
}

/**
 * Récupère l'icône associée à un type d'événement
 *
 * @param eventType - Type d'événement
 * @returns Émoji représentant le type d'événement
 */
export function getEventTypeIcon(eventType: string | null | undefined): string {
  const eventIcons: Record<string, string> = {
    'ceremony': '💒',    // Cérémonie
    'cocktail': '🍸',    // Cocktail
    'dinner': '🍽️',     // Dîner
    'brunch': '🥐',      // Brunch
    'party': '🎉',       // Soirée
    'activity': '🎯',    // Activité
    'default': '📅',     // Événement générique
  };

  if (!eventType) {
    return eventIcons['default'];
  }

  const normalized = eventType.toLowerCase().trim();
  return eventIcons[normalized] || eventIcons['default'];
}

/**
 * Combine icône de ville + icône d'événement
 * Utile pour les markers de carte qui veulent afficher les deux
 *
 * @param cityName - Nom de la ville
 * @param eventType - Type d'événement
 * @returns Objet avec les deux icônes
 *
 * @example
 * getCombinedIcons('Paris', 'ceremony')
 * // → { city: '🗼', event: '💒' }
 */
export function getCombinedIcons(
  cityName: string | null | undefined,
  eventType: string | null | undefined
): { city: string; event: string } {
  return {
    city: getCityIcon(cityName),
    event: getEventTypeIcon(eventType),
  };
}

/**
 * Récupère la liste de toutes les villes disponibles
 * Utile pour afficher un sélecteur ou un autocomplete
 *
 * @returns Array de noms de villes
 */
export function getAvailableCities(): string[] {
  return Object.keys(cityIcons)
    .filter(key => key !== 'default')
    .sort();
}

/**
 * Récupère des statistiques sur les icônes
 * Utile pour le debug
 */
export function getCityIconStats(): {
  total: number;
  villes: number;
  regions: number;
  pays: number;
} {
  const all = Object.keys(cityIcons).filter(k => k !== 'default');

  return {
    total: all.length,
    villes: all.filter(k => !k.includes('-') && k !== 'france' && k !== 'belgique').length,
    regions: all.filter(k => k.includes('-')).length,
    pays: ['france', 'belgique', 'suisse', 'espagne', 'italie', 'allemagne', 'royaume-uni', 'angleterre', 'états-unis', 'canada']
      .filter(k => all.includes(k)).length,
  };
}
