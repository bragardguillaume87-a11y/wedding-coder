# Plan de Visualisation du Parcours du Mariage

**Date de création**: 27 décembre 2025
**Statut**: Approuvé - Prêt pour implémentation

---

## Vue d'Ensemble

Création de **deux systèmes distincts** pour visualiser le parcours du mariage itinérant:

### 1. Illustration SVG Isométrique (Landing Page - Publique)
- **But**: Illustration conceptuelle pour montrer le CONCEPT du mariage itinérant
- **Points**: 6-8 marqueurs FICTIFS (pas de lieux réels)
- **Style**: Vue isométrique 3D de la France, palette wedding (terracotta, rose, or)
- **Animations**: Régions illuminées, trajet dessiné, marqueurs apparaissant, pictogrammes animés
- **Placement**: Section complète remplaçant `Itinerary.jsx`

### 2. Carte Leaflet Interactive (Dashboard - Authentifiée)
- **But**: Gérer et visualiser les VRAIES étapes avec données géocodées
- **Données**: Événements créés par les utilisateurs avec adresses réelles
- **Fonctionnalités**: Marqueurs, lignes connectées, info-bulles, encarts internationaux DOM-TOM
- **Accès**: Uniquement utilisateurs authentifiés (mariés)
- **Placement**: Page dédiée `/dashboard/journey-map`

---

## PARTIE 1: Illustration SVG Isométrique

### Spécifications Techniques

**Fichier principal**: `components/landing/JourneyIllustration.tsx`

**Technologies**:
- SVG inline avec animations CSS
- Framer Motion pour orchestration
- Pas de dépendances externes lourdes

**Caractéristiques**:
- ⚠️ **PUREMENT CONCEPTUEL** - Pas de lieux réels
- 6-8 points fictifs à titre illustratif
- Trajet stylisé (pas l'itinéraire réel)
- Vraies données dans la carte Leaflet du dashboard

### 4 Animations Obligatoires

1. **Régions qui s'illuminent**
   - Animation séquentielle Nord → Sud
   - Transition: crème/beige → terracotta/rose
   - Timing: 3-4 secondes total

2. **Ligne qui se dessine**
   - Technique: `stroke-dasharray` + `stroke-dashoffset`
   - Gradient: terracotta → or
   - Durée: 2 secondes

3. **Marqueurs qui apparaissent**
   - Animation: scale(0) → scale(1.2) → scale(1)
   - Apparition successive (délai 0.3s)
   - 6-8 cercles/formes géométriques

4. **Pictogrammes le long du trajet**
   - Icônes: 💍, ❤️, 🚗
   - Animation `offset-path` le long du trajet
   - Mouvement fluide de 0% à 100%

### Workflow de Création SVG

1. **Télécharger** base SVG France: [MapSVG France](https://mapsvg.com/maps/france)
2. **Importer** dans Figma/Illustrator
3. **Transformer** en isométrique:
   - Rotation 45°
   - Skew vertical pour effet 3D
   - Séparer régions en calques
4. **Styliser**:
   - Dégradés faces supérieures (crème → beige)
   - Assombrir faces latérales (-20%)
   - Ombre portée globale (blur 20px, opacity 30%)
5. **Ajouter** trajet fictif + 6-8 points
6. **Exporter** SVG optimisé (<100KB)
7. **Sauvegarder** dans `public/illustrations/france-isometric.svg`

### Ressources de Design

**Inspirations**:
- [Dribbble - Isometric Maps](https://dribbble.com/tags/isometric-map)
- [Vecteezy - 23K+ ressources](https://www.vecteezy.com/free-vector/isometric-map)
- [Icograms Designer](https://icograms.com/) - 5,286 icônes + templates

**Tutoriels**:
- [Grafikart - Carte interactive SVG](https://grafikart.fr/tutoriels/carte-interactive-791)
- [SVG Genie - Guide animations 2025](https://www.svggenie.com/blog/svg-animations-complete-guide)
- [Codrops - CSS Worlds 2025](https://tympanus.net/codrops/2025/11/10/crafting-generative-css-worlds/)

### Code Squelette

```typescript
// components/landing/JourneyIllustration.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function JourneyIllustration() {
  const [animationStep, setAnimationStep] = useState(0);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[var(--cream)]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            Notre Voyage à Travers la France
          </h2>

          <div className="relative w-full max-w-4xl mx-auto">
            <svg viewBox="0 0 800 600" className="w-full h-auto">
              {/* SVG inline avec animations */}
            </svg>
          </div>

          <div className="mt-8 text-center text-sm text-[var(--charcoal)] opacity-70">
            <p>✨ Illustration conceptuelle du mariage itinérant</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

### Animations CSS

```css
/* app/globals.css */

/* Régions illuminées */
@keyframes regionGlow {
  0% { fill: var(--cream); }
  50% { fill: var(--terracotta); }
  100% { fill: var(--rose-powder); }
}

/* Trajet dessiné */
@keyframes pathDraw {
  to { stroke-dashoffset: 0; }
}

/* Marqueurs apparaissent */
@keyframes markerPop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

/* Pictogrammes le long du trajet */
@keyframes iconMove {
  0% { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}
```

### Intégration Landing Page

```typescript
// app/page.tsx
import JourneyIllustration from '@/components/landing/JourneyIllustration';

// Remplacer Itinerary par:
<main>
  <Hero />
  <OurStory />
  <OurDream />
  <OurValues />
  <JourneyIllustration /> {/* ← NOUVEAU */}
  <JoinOurStory />
  <Footer />
</main>
```

---

## PARTIE 2: Carte Leaflet Interactive

### Spécifications Techniques

**Page principale**: `app/dashboard/journey-map/page.tsx`

**Technologies**:
- Leaflet 1.9+ + react-leaflet
- Nominatim API (OpenStreetMap) pour géocodage
- Supabase pour stockage lat/lng

**Accès**: Protégé - Uniquement utilisateurs authentifiés

### Migration Base de Données

**Fichier**: `supabase/migrations/20251227_add_geocoding_to_events.sql`

```sql
ALTER TABLE public.local_events
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN country_code VARCHAR(2) DEFAULT 'FR',
ADD COLUMN geocoded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN geocoding_source VARCHAR(50) DEFAULT 'nominatim';

-- Index pour performances
CREATE INDEX idx_local_events_coordinates
ON public.local_events(latitude, longitude);

CREATE INDEX idx_local_events_country
ON public.local_events(country_code);
```

### Service Géocodage

**Fichier**: `lib/geocoding.ts`

```typescript
// Géocodage via Nominatim (OSM) - Gratuit
export interface GeocodingResult {
  latitude: number;
  longitude: number;
  country_code: string;
  display_name: string;
}

export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(address)}` +
      `&format=json&limit=1`
    );

    const data = await response.json();

    if (data.length === 0) return null;

    const result = data[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      country_code: result.address.country_code?.toUpperCase() || 'FR',
      display_name: result.display_name,
    };
  } catch (error) {
    console.error('Géocodage échoué:', error);
    return null;
  }
}

// Rate limiting: 1 requête par seconde max
export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));
```

### Helpers Carte

**Fichier**: `lib/mapHelpers.ts`

```typescript
export interface MapEvent {
  id: string;
  title: string;
  date: string;
  address: string;
  latitude: number;
  longitude: number;
  country_code: string;
}

// Grouper événements par pays
export function groupEventsByCountry(events: MapEvent[]) {
  return events.reduce((acc, event) => {
    const country = event.country_code || 'FR';
    if (!acc[country]) acc[country] = [];
    acc[country].push(event);
    return acc;
  }, {} as Record<string, MapEvent[]>);
}

// Position encarts internationaux (style DOM-TOM)
export function getInsetPosition(index: number) {
  const positions = [
    { bottom: '20px', right: '20px' },
    { bottom: '20px', right: '280px' },
    { bottom: '200px', right: '20px' },
    { bottom: '200px', right: '280px' },
  ];
  return positions[index % 4];
}

// Constantes
export const FRANCE_CENTER: [number, number] = [46.603354, 1.888334];
export const FRANCE_ZOOM = 6;
export const DEFAULT_MARKER_COLOR = '#E07A5F'; // terracotta
```

### Composants Leaflet

#### BaseMap.tsx

```typescript
// components/map/BaseMap.tsx
'use client';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface BaseMapProps {
  center: [number, number];
  zoom: number;
  children: React.ReactNode;
}

export default function BaseMap({ center, zoom, children }: BaseMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '600px', width: '100%' }}
      className="rounded-2xl overflow-hidden border-2 border-[var(--beige)]"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      {children}
    </MapContainer>
  );
}
```

#### JourneyMarker.tsx

```typescript
// components/map/JourneyMarker.tsx
'use client';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Icône personnalisée terracotta
const customIcon = new L.Icon({
  iconUrl: '/markers/wedding-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface JourneyMarkerProps {
  position: [number, number];
  title: string;
  date: string;
  address: string;
}

export default function JourneyMarker({
  position,
  title,
  date,
  address
}: JourneyMarkerProps) {
  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-[var(--terracotta)]">{title}</h3>
          <p className="text-sm text-[var(--charcoal)]">{date}</p>
          <p className="text-xs text-[var(--charcoal)] opacity-70">{address}</p>
        </div>
      </Popup>
    </Marker>
  );
}
```

#### InsetMap.tsx (Encarts DOM-TOM)

```typescript
// components/map/InsetMap.tsx
'use client';
import { MapContainer, TileLayer } from 'react-leaflet';
import JourneyMarker from './JourneyMarker';
import { MapEvent } from '@/lib/mapHelpers';

interface InsetMapProps {
  events: MapEvent[];
  country: string;
  position: { bottom: string; right: string };
}

export default function InsetMap({ events, country, position }: InsetMapProps) {
  if (events.length === 0) return null;

  // Calculer centre de la carte
  const avgLat = events.reduce((sum, e) => sum + e.latitude, 0) / events.length;
  const avgLng = events.reduce((sum, e) => sum + e.longitude, 0) / events.length;

  return (
    <div
      className="absolute z-[1000] bg-white rounded-lg shadow-xl border-2 border-[var(--terracotta)] p-2"
      style={{ ...position, width: '240px', height: '160px' }}
    >
      <div className="text-xs font-bold text-[var(--terracotta)] mb-1">
        {country}
      </div>
      <MapContainer
        center={[avgLat, avgLng]}
        zoom={5}
        style={{ height: '120px', width: '100%' }}
        className="rounded"
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {events.map((event) => (
          <JourneyMarker
            key={event.id}
            position={[event.latitude, event.longitude]}
            title={event.title}
            date={event.date}
            address={event.address}
          />
        ))}
      </MapContainer>
    </div>
  );
}
```

### Page Dashboard Carte

**Fichier**: `app/dashboard/journey-map/page.tsx`

```typescript
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import { groupEventsByCountry, getInsetPosition, FRANCE_CENTER, FRANCE_ZOOM } from '@/lib/mapHelpers';
import type { MapEvent } from '@/lib/mapHelpers';

// Import dynamique pour éviter SSR (Leaflet incompatible)
const BaseMap = dynamic(() => import('@/components/map/BaseMap'), { ssr: false });
const JourneyMarker = dynamic(() => import('@/components/map/JourneyMarker'), { ssr: false });
const InsetMap = dynamic(() => import('@/components/map/InsetMap'), { ssr: false });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function JourneyMapPage() {
  const router = useRouter();
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    // Vérifier authentification
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      router.push('/');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('local_events')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl">⏳ Chargement de la carte...</p>
    </div>;
  }

  const eventsByCountry = groupEventsByCountry(events);
  const franceEvents = eventsByCountry['FR'] || [];
  const internationalCountries = Object.keys(eventsByCountry).filter(c => c !== 'FR');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-[var(--terracotta)] hover:text-[var(--charcoal)] font-semibold"
          >
            ← Retour au Dashboard
          </button>
          <h1 className="text-3xl font-bold text-[var(--charcoal)] mt-4">
            🗺️ Carte du Parcours
          </h1>
        </header>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-[var(--charcoal)]">
              Aucun événement géocodé pour le moment.
              Créez un événement avec une adresse pour le voir apparaître sur la carte.
            </p>
          </div>
        ) : (
          <div className="relative">
            <BaseMap center={FRANCE_CENTER} zoom={FRANCE_ZOOM}>
              {franceEvents.map((event) => (
                <JourneyMarker
                  key={event.id}
                  position={[event.latitude, event.longitude]}
                  title={event.title}
                  date={event.date}
                  address={event.address}
                />
              ))}
            </BaseMap>

            {/* Encarts internationaux style DOM-TOM */}
            {internationalCountries.map((country, index) => (
              <InsetMap
                key={country}
                events={eventsByCountry[country]}
                country={country}
                position={getInsetPosition(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Modification Formulaire Create-Event

Ajouter géocodage automatique au blur du champ adresse:

```typescript
// app/dashboard/create-event/page.tsx - Ajouter ceci

import { geocodeAddress, delay } from '@/lib/geocoding';

// Dans le composant:
const [geocoding, setGeocoding] = useState(false);
const [geocodedLocation, setGeocodedLocation] = useState<{lat: number, lng: number} | null>(null);

const handleAddressBlur = async () => {
  if (!address) return;

  setGeocoding(true);
  await delay(1000); // Rate limiting

  const result = await geocodeAddress(address);

  if (result) {
    setGeocodedLocation({ lat: result.latitude, lng: result.longitude });
    console.log('✅ Géocodage réussi:', result);
  } else {
    console.warn('❌ Géocodage échoué');
  }

  setGeocoding(false);
};

// Dans le JSX, ajouter onBlur:
<input
  type="text"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  onBlur={handleAddressBlur}
  placeholder="123 Rue de la Paix, Paris"
/>

{geocoding && <p className="text-xs text-[var(--terracotta)]">🔍 Géocodage...</p>}
{geocodedLocation && (
  <p className="text-xs text-green-600">
    ✅ Coordonnées: {geocodedLocation.lat.toFixed(4)}, {geocodedLocation.lng.toFixed(4)}
  </p>
)}

// Sauvegarder lat/lng dans Supabase lors de la création:
const { error } = await supabase
  .from('local_events')
  .insert({
    // ... autres champs
    latitude: geocodedLocation?.lat,
    longitude: geocodedLocation?.lng,
    country_code: 'FR', // ou détecté par géocodage
    geocoded_at: new Date().toISOString(),
    geocoding_source: 'nominatim',
  });
```

### Installation Dépendances

```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

### Ajout Link CSS Leaflet

```typescript
// app/layout.tsx - Ajouter dans <head>
import 'leaflet/dist/leaflet.css';
```

### Ajouter Card Dashboard

```typescript
// app/dashboard/page.tsx - Ajouter une 7ème card:

<motion.div
  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[var(--beige)]"
  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
>
  <div className="text-4xl mb-4">🗺️</div>
  <h2 className="text-xl font-bold text-[var(--charcoal)] mb-2">
    Carte du Parcours
  </h2>
  <p className="text-[var(--charcoal)] opacity-70 mb-4">
    Visualisez toutes les étapes du mariage sur une carte interactive
  </p>
  <button
    onClick={() => router.push('/dashboard/journey-map')}
    className="w-full bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] text-white py-2 rounded-lg"
  >
    Voir la carte
  </button>
</motion.div>
```

---

## Structure Fichiers Complète

```
wedding-coder/
├── app/
│   ├── dashboard/
│   │   ├── journey-map/
│   │   │   └── page.tsx             # ← NOUVEAU (carte Leaflet)
│   │   ├── create-event/
│   │   │   └── page.tsx             # ← MODIFIER (géocodage)
│   │   └── page.tsx                 # ← MODIFIER (ajouter card)
│   ├── page.tsx                     # ← MODIFIER (intégrer SVG)
│   ├── globals.css                  # ← MODIFIER (animations CSS)
│   └── layout.tsx                   # ← MODIFIER (import Leaflet CSS)
│
├── components/
│   ├── landing/
│   │   └── JourneyIllustration.tsx  # ← NOUVEAU (SVG animé)
│   └── map/
│       ├── BaseMap.tsx              # ← NOUVEAU (carte base)
│       ├── JourneyMarker.tsx        # ← NOUVEAU (marqueur)
│       └── InsetMap.tsx             # ← NOUVEAU (encart international)
│
├── lib/
│   ├── geocoding.ts                 # ← NOUVEAU (service Nominatim)
│   └── mapHelpers.ts                # ← NOUVEAU (utilitaires)
│
├── types/
│   └── map.d.ts                     # ← NOUVEAU (types TypeScript)
│
├── supabase/
│   └── migrations/
│       └── 20251227_add_geocoding_to_events.sql  # ← NOUVEAU (migration)
│
└── public/
    ├── illustrations/
    │   └── france-isometric.svg     # ← NOUVEAU (SVG France)
    └── markers/
        └── wedding-marker.png       # ← NOUVEAU (icône marqueur)
```

---

## Checklist Implémentation

### Phase A: SVG Illustration (4-5h)
- [ ] A1. Télécharger SVG France de MapSVG (15min)
- [ ] A2. Transformer en isométrique dans Figma (1h)
- [ ] A3. Ajouter dégradés, ombres, trajet fictif (45min)
- [ ] A4. Créer composant `JourneyIllustration.tsx` (1h)
- [ ] A5. Ajouter animations CSS dans `globals.css` (30min)
- [ ] A6. Intégrer dans `app/page.tsx` (15min)
- [ ] A7. Tests responsive + polish (1h)

### Phase B: Carte Leaflet (6h)
- [ ] B1. Migration BDD `20251227_add_geocoding_to_events.sql` (15min)
- [ ] B2. Créer service `lib/geocoding.ts` (30min)
- [ ] B3. Créer helpers `lib/mapHelpers.ts` (15min)
- [ ] B4. Installer Leaflet + react-leaflet (5min)
- [ ] B5. Créer `BaseMap.tsx` (30min)
- [ ] B6. Créer `JourneyMarker.tsx` (30min)
- [ ] B7. Créer `InsetMap.tsx` (45min)
- [ ] B8. Créer page `dashboard/journey-map/page.tsx` (1h)
- [ ] B9. Modifier `create-event/page.tsx` (géocodage) (45min)
- [ ] B10. Ajouter card dashboard (15min)
- [ ] B11. Créer types `map.d.ts` (15min)
- [ ] B12. Tests + polish (1h)

---

## Estimation Totale

- **MVP (fonctionnel minimal)**: 3h
- **Version complète**: 10-11h
- **Avec polish et tests**: 12-14h

---

## Risques et Solutions

| Risque | Impact | Solution |
|--------|--------|----------|
| Géocodage échoue | Moyen | Fallback manuel lat/lng + lien latlong.net |
| Leaflet + Next.js SSR | Élevé | Dynamic import avec `{ ssr: false }` |
| Rate limiting Nominatim | Faible | Cache en BDD + delay 1s entre requêtes |
| Trop d'événements (>50) | Faible | Clustering avec `react-leaflet-cluster` |
| Performance SVG animations | Moyen | Optimiser SVG (<100KB), désactiver auto-replay |

---

## Notes Importantes

### Différence Critique SVG vs Leaflet

**SVG (Landing Page)**:
- Illustratif/Conceptuel uniquement
- Points fictifs (6-8)
- But: Montrer le concept du mariage itinérant
- Aucune donnée réelle
- Accessible à tous (public)

**Leaflet (Dashboard)**:
- Fonctionnel avec données réelles
- Points géocodés depuis BDD
- But: Gérer et visualiser vraies étapes
- Données sensibles (adresses)
- Authentification requise

### Protection Données

Si une carte publique est ajoutée plus tard:
- Créer view Supabase `public_events` (ville + date seulement)
- Masquer adresses complètes
- Pas de marqueurs précis (seulement villes)

---

## Prochaines Étapes Après Implémentation

1. Tests utilisateur (mobile, tablette, desktop)
2. Optimisation performance (Lighthouse)
3. Accessibilité (ARIA labels, contraste)
4. Analytics (tracking interactions carte)
5. Backup/export données carte (JSON)
6. Guide utilisateur géocodage

---

**Créé le**: 27 décembre 2025
**Dernière mise à jour**: 27 décembre 2025
**Statut**: Approuvé - Prêt pour implémentation
**Priorité**: Haute - Fonctionnalité clé du projet
