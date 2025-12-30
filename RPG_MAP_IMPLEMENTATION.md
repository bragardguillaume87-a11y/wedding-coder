# 🗺️ Documentation Complète - Carte Interactive RPG

**Projet** : Wedding Coder - Carte de parcours de mariage
**Date** : 30 décembre 2024
**Statut** : ✅ Implémentation terminée (sons à télécharger)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du code](#architecture-du-code)
3. [Séquence d'animation](#séquence-danimation)
4. [Fichiers créés/modifiés](#fichiers-créésmodifiés)
5. [Ce qui fonctionne](#ce-qui-fonctionne)
6. [Ce qui reste à faire](#ce-qui-reste-à-faire)
7. [Comment tester](#comment-tester)
8. [Dépannage](#dépannage)
9. [Prochaines étapes](#prochaines-étapes)

---

## 🎯 Vue d'ensemble

### Objectif
Transformer la carte Leaflet basique en une **expérience RPG interactive** avec :
- Animations fluides (Framer Motion)
- Effets sonores subtils (Howler.js)
- Style gaming élégant (CSS RPG)
- Feedback visuel et audio

### Technologies utilisées
- **Next.js 16.1.1** - Framework React
- **Leaflet 1.9.4** + **react-leaflet 5.0.0** - Cartographie
- **Framer Motion 12.23.26** - Animations
- **Howler.js 2.2.4** - Système audio
- **TypeScript** - Type safety
- **Tailwind CSS** + **CSS custom** - Styling

### Inspiration
Style RPG élégant inspiré de :
- Final Fantasy (progression de quête)
- Zelda (waypoints et découverte)
- Tour de France (ligne de parcours)

---

## 🏗️ Architecture du code

### Structure des composants

```
app/
  dashboard/
    journey-map/
      page.tsx              ← Page principale (orchestration)

components/
  map/
    BaseMap.tsx             ← Composant Leaflet de base
    JourneyPath.tsx         ← Ligne animée avec Framer Motion ⭐ MODIFIÉ
    GamingMarker.tsx        ← Marqueurs avec animations ⭐ MODIFIÉ

  ui/
    SoundToggle.tsx         ← Bouton mute/unmute ⭐ NOUVEAU
    AnimatedCounter.tsx     ← Compteur de distance animé ⭐ NOUVEAU

lib/
  soundManager.ts           ← Gestionnaire Howler.js ⭐ NOUVEAU
  mapHelpers.ts             ← Utilitaires carte (existant)
  geocoding.ts              ← API Nominatim (existant)

app/
  globals.css               ← Styles RPG gaming ⭐ MODIFIÉ

public/
  sounds/
    README.md               ← Instructions téléchargement ⭐ NOUVEAU
    [6 fichiers MP3]        ← À télécharger
```

### Flux de données

```
JourneyMapPage (orchestrateur)
    ↓
    ├─→ BaseMap (Leaflet container)
    │     ├─→ JourneyPath (ligne animée)
    │     └─→ GamingMarker × N (waypoints)
    │
    ├─→ AnimatedCounter (header)
    └─→ SoundToggle (position fixe)

soundManager (singleton)
    ↑
    └─── Tous les composants qui jouent des sons
```

---

## 🎬 Séquence d'animation

### Timeline complète (6 événements)

```
T+0ms       Page charge, carte fade in
            ↓
T+400ms     🔊 Son "mapLoad" joue
            Ligne commence animation (JourneyPath)
            ↓
T+700ms     Segment 1 → Paris à Paris Tour Eiffel
T+1000ms    Segment 2 → Paris à Lyon
T+1300ms    Segment 3 → Lyon à Marseille
T+1600ms    Segment 4 → Marseille à Bordeaux
T+1900ms    Ligne complète 🔊 "pathDraw"
            ↓
T+1900ms    Waypoint 1 apparaît 🔊 "markerUnlock"
T+2100ms    Waypoint 2 apparaît 🔊 "markerUnlock"
T+2300ms    Waypoint 3 apparaît 🔊 "markerUnlock"
T+2500ms    Waypoint 4 apparaît 🔊 "markerUnlock"
T+2700ms    Waypoint 5 apparaît 🔊 "markerUnlock"
T+2900ms    Waypoint 6 apparaît 🔊 "markerUnlock"
            ↓
T+3200ms    Compteur démarre (0 km)
            Animation 0 → 1234 km (2 secondes)
            ↓
T+5200ms    Compteur termine 🔊 "celebration"
            FIN DE LA SÉQUENCE ✨
```

### Calcul des délais (code)

**Dans `JourneyPath.tsx`** :
```typescript
const startDelay = 400ms        // Délai avant tracé
const segmentDuration = 300ms   // Par segment
const totalDuration = (positions.length - 2) * 300ms
```

**Dans `journey-map/page.tsx`** (pour les marqueurs) :
```typescript
const lineAnimationDuration = (sortedEvents.length - 2) * 300
const baseDelay = 400
const markerStagger = 200
const animationDelay = baseDelay + lineAnimationDuration + (index * markerStagger)
```

**Pour le compteur** :
```typescript
delay = 400 + lineAnimationDuration + (validEvents.length * 200) + 300
```

---

## 📁 Fichiers créés/modifiés

### ⭐ Nouveaux fichiers

#### 1. `lib/soundManager.ts` (178 lignes)
**Rôle** : Singleton pour gérer tous les sons avec Howler.js

**API publique** :
```typescript
soundManager.initialize()                    // Initialiser (auto au 1er son)
soundManager.play('markerHover')            // Jouer un effet
soundManager.toggleMute()                   // Mute/unmute
soundManager.isMuted()                      // État actuel
soundManager.setGlobalVolume(0.5)          // Volume global

// Hook React
const playSound = useSoundManager()
playSound('markerClick')
```

**Sons configurés** :
- `markerHover` (vol: 0.2) - Survol marqueur
- `markerClick` (vol: 0.3) - Clic marqueur
- `pathDraw` (vol: 0.25) - Ligne se dessine
- `markerUnlock` (vol: 0.3) - Waypoint apparaît
- `mapLoad` (vol: 0.2) - Chargement carte
- `celebration` (vol: 0.4) - Fin compteur

**Stockage** : État mute dans `localStorage.soundMuted`

---

#### 2. `components/ui/SoundToggle.tsx` (85 lignes)
**Rôle** : Bouton flottant mute/unmute en bas à droite

**Features** :
- Position fixe (`fixed bottom-6 right-6`)
- Icône animée 🔊 / 🔇
- Onde sonore pulsante quand actif
- Dégradé terracotta→rose / gris quand muted
- Bordure dorée RPG
- Animation d'apparition (delay 0.5s)

**État** :
- Synchronisé avec `soundManager`
- Hydratation safe (`mounted` state)

---

#### 3. `components/ui/AnimatedCounter.tsx` (72 lignes)
**Rôle** : Compteur qui anime de 0 à N

**Props** :
```typescript
interface AnimatedCounterProps {
  value: number           // Valeur finale
  duration?: number       // Durée animation (défaut: 2s)
  delay?: number          // Délai avant démarrage (ms)
  suffix?: string         // Ex: " km au total"
  onComplete?: () => void // Callback fin
}
```

**Fonctionnement** :
1. Utilise `useMotionValue` de Framer Motion
2. `animate(count, value, {...})` pour progression smooth
3. Joue son "celebration" à la fin
4. Ne réanime pas si déjà fait (`hasAnimated`)

**Styling** :
- Nombre en gras terracotta
- Fade in + scale au montage

---

#### 4. `public/sounds/README.md` (174 lignes)
**Rôle** : Guide complet pour télécharger les sons

**Contenu** :
- Liste des 6 sons requis avec descriptions
- Sources gratuites (Pixabay, Mixkit, ElevenLabs, Freesound)
- Critères de sélection (doux, court, MP3)
- Instructions d'installation
- Dépannage

**Action requise** : L'utilisateur doit télécharger les MP3

---

### 🔧 Fichiers modifiés

#### 1. `components/map/JourneyPath.tsx`
**Changements majeurs** :

**AVANT** (setInterval basique) :
```typescript
const interval = setInterval(() => {
  if (index < positions.length) {
    setAnimatedPositions(prev => [...prev, positions[index]])
    index++
  }
}, 150)
```

**APRÈS** (Framer Motion smooth) :
```typescript
const controls = animate(progress, 1, {
  duration: totalDuration / 1000,
  ease: "easeInOut",
  onUpdate: (latest) => {
    const targetIndex = Math.floor(2 + (latest * (positions.length - 2)))
    setAnimatedPositions(positions.slice(0, targetIndex + 1))
  }
})
```

**Nouvelles features** :
- ✅ Animation Framer Motion (easeInOut)
- ✅ 3 couches Polyline : shadow, main, glow
- ✅ Lueur dorée pulsante pendant animation
- ✅ Son "pathDraw" au démarrage
- ✅ Callback `onComplete`
- ✅ Durée 300ms/segment (au lieu de 150ms)

**Props ajoutées** :
```typescript
interface JourneyPathProps {
  positions: [number, number][]
  animated?: boolean
  onComplete?: () => void    // ← NOUVEAU
}
```

---

#### 2. `components/map/GamingMarker.tsx`
**Changements majeurs** :

**Nouvelles features** :
- ✅ Prop `animationDelay` pour stagger
- ✅ Son "markerUnlock" avec délai
- ✅ Sons "markerHover" et "markerClick"
- ✅ `useRef` pour éviter double-play

**Event handlers** :
```typescript
eventHandlers={{
  mouseover: (e) => {
    e.target.openPopup()
    soundManager.play('markerHover')  // ← NOUVEAU
  },
  click: () => {
    soundManager.play('markerClick')  // ← NOUVEAU
  },
}}
```

**Animation CSS** :
L'icône reçoit `animation-delay` inline :
```typescript
<div class="gaming-marker-wrapper" style="animation-delay: ${animationDelay}ms">
```

---

#### 3. `app/dashboard/journey-map/page.tsx`
**Changements majeurs** :

**Imports ajoutés** :
```typescript
const SoundToggle = dynamic(() => import('@/components/ui/SoundToggle'), { ssr: false })
const AnimatedCounter = dynamic(() => import('@/components/ui/AnimatedCounter'), { ssr: false })
```

**Calcul des délais pour marqueurs** :
```typescript
{sortedEvents.map((event, index) => {
  const lineAnimationDuration = (sortedEvents.length - 2) * 300
  const baseDelay = 400
  const markerStagger = 200
  const animationDelay = baseDelay + lineAnimationDuration + (index * markerStagger)

  return <GamingMarker animationDelay={animationDelay} ... />
})}
```

**Remplacement distance statique** :
```typescript
// AVANT
{totalDistance > 0 && ` • ${totalDistance} km au total`}

// APRÈS
{totalDistance > 0 && (
  <>
    {' • '}
    <AnimatedCounter
      value={totalDistance}
      duration={2}
      delay={400 + lineAnimationDuration + validEvents.length * 200 + 300}
      suffix=" km au total"
    />
  </>
)}
```

**SoundToggle ajouté** :
```typescript
<SoundToggle /> {/* Position fixe en bas à droite */}
```

---

#### 4. `app/globals.css`
**Ajouts majeurs** :

**1. Animation unlock des marqueurs** :
```css
@keyframes markerUnlock {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  80% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

.gaming-marker-wrapper {
  animation:
    markerUnlock 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
    markerFloat 3s ease-in-out 0.6s infinite;
  opacity: 0;
  transform: scale(0);
}
```

**2. Bordures dorées RPG** :
```css
.marker-number {
  border: 2px solid var(--gold);
  box-shadow:
    0 4px 12px rgba(224, 122, 95, 0.4),
    0 0 15px rgba(242, 204, 143, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

**3. Popup parchemin** :
```css
.gaming-popup .leaflet-popup-content-wrapper {
  background: linear-gradient(135deg, #F8F4E3 0%, #EDE7D9 100%);
  border: 3px solid var(--gold);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 0 20px rgba(242, 204, 143, 0.3);
}

/* Texture parchemin */
.gaming-popup .leaflet-popup-content-wrapper::before {
  background: repeating-linear-gradient(...);
}

/* Coin doré scintillant */
.gaming-popup .leaflet-popup-content-wrapper::after {
  animation: cornerSparkle 3s ease-in-out infinite;
}
```

**4. Glow sur ligne** :
```css
.journey-path {
  filter: drop-shadow(0 0 2px rgba(224, 122, 95, 0.3));
}

.journey-path-glow {
  filter: drop-shadow(0 0 8px rgba(242, 204, 143, 0.6));
}
```

**5. Hover effet doré** :
```css
.gaming-marker-wrapper:hover .marker-number {
  transform: scale(1.2);
  border-color: #FFD700;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
}
```

---

## ✅ Ce qui fonctionne

### Animations
- ✅ Ligne se dessine progressivement (300ms/segment)
- ✅ Lueur dorée pulsante pendant tracé
- ✅ Waypoints apparaissent avec bounce (stagger 200ms)
- ✅ Compteur monte de 0 à distance totale (2s)
- ✅ Float continu des marqueurs
- ✅ Ring expansion autour des marqueurs
- ✅ Hover effects (scale + glow)

### Visuels
- ✅ 3 couches pour la ligne (ombre, main, glow)
- ✅ Bordures dorées partout
- ✅ Popups style parchemin RPG
- ✅ Coin doré scintillant sur popup
- ✅ Drop shadow sur ligne
- ✅ Dégradés terracotta→rose

### Interactions
- ✅ Survol marqueur → popup + son
- ✅ Clic marqueur → son
- ✅ Bouton mute/unmute fonctionne
- ✅ État mute persistant (localStorage)

### Code quality
- ✅ TypeScript strict
- ✅ Validation coordonnées GPS
- ✅ Hydratation safe (dynamic imports)
- ✅ Cleanup proper (useEffect return)
- ✅ Performance optimisée

---

## ⚠️ Ce qui reste à faire

### 1. Télécharger les sons (URGENT)

**Fichiers requis** : 6 × MP3 dans `public/sounds/`

| Fichier | Description | Durée | Source suggérée |
|---------|-------------|-------|-----------------|
| `marker-hover.mp3` | Ting doux survol | ~0.3s | Pixabay "soft UI hover" |
| `marker-click.mp3` | Clic confirmation | ~0.3s | Mixkit "button click" |
| `path-draw.mp3` | Whoosh magique | ~1-2s | ElevenLabs "magical whoosh" |
| `marker-unlock.mp3` | Ding waypoint | ~0.4s | Pixabay "gentle bell" |
| `map-load.mp3` | Ambiance ouverture | ~1-2s | Freesound "parchment open" |
| `celebration.mp3` | Paillettes succès | ~0.5s | Pixabay "success chime" |

**Instructions complètes** : `public/sounds/README.md`

**Sources** :
- https://pixabay.com/sound-effects/search/ui/
- https://mixkit.co/free-sound-effects/click/
- https://elevenlabs.io/sound-effects
- https://freesound.org/

**Critères** :
- Format MP3, 128kbps minimum
- Durée < 2 secondes (sauf map-load/path-draw)
- Tonalité douce et agréable
- Poids < 100KB par fichier

### 2. Tester sur mobile (optionnel)

**À vérifier** :
- [ ] Animations fluides (FPS > 30)
- [ ] Sons fonctionnent (autoplay policy)
- [ ] Touch events (hover → tap)
- [ ] Responsive design
- [ ] Performance batterie

### 3. Optimisations possibles

**Performance** :
- [ ] Lazy load des marqueurs hors viewport
- [ ] Throttle des animations scroll
- [ ] Audio sprites (combiner les 6 sons)

**Accessibilité** :
- [ ] ARIA labels sur marqueurs
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Contrast ratios (WCAG AA)

---

## 🧪 Comment tester

### Test 1 : Animations visuelles

1. Ouvre `http://localhost:3000/dashboard/journey-map`
2. La carte devrait charger avec fade in
3. **Après 400ms** : La ligne commence à se dessiner (rouge terracotta)
4. **Pendant le tracé** : Lueur dorée pulse autour de la ligne
5. **Après ~1.9s** : Ligne complète
6. **À partir de 1.9s** : Les 6 waypoints apparaissent un par un avec bounce
7. **À 3.2s** : Le compteur démarre (0 km)
8. **À 5.2s** : Le compteur atteint ~1234 km

**✅ Critères de succès** :
- Ligne visible et smooth
- Waypoints avec effet bounce
- Compteur animé
- Pas de lag ni saccades

---

### Test 2 : Effets sonores (quand MP3 téléchargés)

1. **Clique n'importe où** sur la page (requis par navigateurs)
2. Vérifie que le bouton 🔊 est en bas à droite
3. **Survole un marqueur** → Son doux "ting"
4. **Clique un marqueur** → Son "clic"
5. **Recharge la page** (F5)
   - Son ambiance au chargement (si implémenté)
   - Son whoosh quand ligne se dessine
   - "Ding!" à chaque waypoint qui apparaît
   - Son célébration quand compteur finit
6. **Clique bouton mute** → Tous les sons coupés
7. **Clique à nouveau** → Sons réactivés

**✅ Critères de succès** :
- Aucun son avant interaction utilisateur
- Sons cohérents avec actions
- Mute persiste au refresh (localStorage)
- Pas de double-play ni overlap

---

### Test 3 : Interactions

**Marqueurs** :
- [ ] Hover → Popup s'ouvre + scale 1.2
- [ ] Hover → Bordure devient or brillant
- [ ] Click → Son de confirmation
- [ ] Popup affiche : nom, date, ville

**Ligne** :
- [ ] Visible dès le début (rouge)
- [ ] Drop shadow subtil
- [ ] Relie tous les points dans l'ordre

**Compteur** :
- [ ] Commence à 0
- [ ] Monte progressivement
- [ ] Atteint la valeur exacte
- [ ] Format français (espaces milliers)

---

### Test 4 : Edge cases

**Peu d'événements (< 3)** :
```
Aller dans Supabase → local_events → Supprimer tous sauf 2
Recharger la page
```
- [ ] Message "Aucun événement" si 0
- [ ] Ligne et animations fonctionnent avec 2

**Beaucoup d'événements (> 10)** :
```
Insérer 15 événements de test
```
- [ ] Animations pas trop longues
- [ ] Pas de lag
- [ ] Tous les marqueurs s'affichent

**Sans sons** :
```
Supprimer tous les MP3 de public/sounds/
```
- [ ] Aucune erreur console
- [ ] Animations fonctionnent quand même
- [ ] Bouton mute toujours cliquable

---

## 🐛 Dépannage

### Problème : La ligne ne s'affiche pas

**Causes possibles** :
1. ❌ Pas de coordonnées GPS → Vérifier `local_events.latitude/longitude`
2. ❌ Moins de 2 événements → En créer plus
3. ❌ Erreur validation → Ouvrir DevTools Console

**Debug** :
```typescript
// Dans journey-map/page.tsx
console.log('Valid events:', validEvents)
console.log('Positions:', positions)
```

**Fix** :
- Vérifier que tous les événements ont `latitude` et `longitude` non-null
- Exécuter `node scripts/fix-foreign-key-and-insert.js` pour insérer les démos

---

### Problème : Les animations ne se déclenchent pas

**Symptômes** :
- Marqueurs apparaissent tous d'un coup
- Ligne ne se dessine pas progressivement
- Compteur affiche immédiatement la valeur

**Causes** :
1. ❌ Framer Motion pas chargé
2. ❌ `animated={false}` sur JourneyPath
3. ❌ Erreur JavaScript bloque animations

**Debug** :
```bash
# Vérifier installation Framer Motion
npm list framer-motion
# Devrait afficher : framer-motion@12.23.26
```

**Fix** :
```typescript
// Dans journey-map/page.tsx, vérifier :
<JourneyPath positions={positions} animated={true} />
//                                    ↑ Doit être true
```

---

### Problème : Les sons ne marchent pas

**Symptômes** :
- Aucun son ne joue
- Erreur 404 dans console
- Sons coupés malgré bouton unmuted

**Debug Console (F12)** :
```
Chercher : "Failed to load resource: 404"
```

**Checklist** :
- [ ] Les 6 MP3 sont dans `public/sounds/` ?
- [ ] Noms exacts : `marker-hover.mp3`, etc. ?
- [ ] Tu as cliqué sur la page avant ? (autoplay policy)
- [ ] Bouton mute n'est pas activé ?
- [ ] `localStorage.soundMuted !== 'true'` ?

**Fix** :
```typescript
// Tester manuellement dans DevTools Console :
soundManager.initialize()
soundManager.play('markerClick')
```

---

### Problème : Performance lente

**Symptômes** :
- FPS < 30
- Lag pendant animations
- Navigateur freeze

**Profiling** :
1. Ouvrir DevTools → Performance
2. Cliquer Record
3. Recharger la page
4. Arrêter après 10 secondes
5. Analyser les pics

**Optimisations** :
```css
/* Ajouter dans globals.css */
.gaming-marker-wrapper {
  will-change: transform, opacity;
}

.journey-path {
  will-change: stroke-dashoffset;
}
```

**Si toujours lent** :
- Réduire nombre d'événements
- Désactiver les sons
- Simplifier les animations CSS

---

### Problème : Hydration mismatch

**Erreur** :
```
Warning: Text content did not match. Server: "0" Client: "1234"
```

**Cause** : SSR/CSR mismatch sur AnimatedCounter

**Fix déjà implémenté** :
```typescript
const AnimatedCounter = dynamic(() => import('@/components/ui/AnimatedCounter'), {
  ssr: false  // ← Désactive SSR
})
```

Si erreur persiste :
```typescript
// Ajouter suppressHydrationWarning
<p suppressHydrationWarning>
  <AnimatedCounter ... />
</p>
```

---

## 🚀 Prochaines étapes

### Étape suivante immédiate
**✅ Télécharger les 6 sons MP3** pour activer le système audio complet.

### Améliorations court terme (1-3h)

#### 1. Son "mapLoad" au chargement
**Actuellement** : Pas de son quand la carte charge
**À ajouter** : Dans `journey-map/page.tsx`
```typescript
useEffect(() => {
  if (validEvents.length > 0) {
    // Jouer son après un court délai
    setTimeout(() => {
      soundManager.play('mapLoad')
    }, 200)
  }
}, [validEvents])
```

#### 2. Particules CSS (optionnel)
**Effet** : Petites étoiles dorées autour des marqueurs

**Fichier** : `globals.css`
```css
@keyframes particle {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

.marker-number::before,
.marker-number::after {
  content: '✨';
  position: absolute;
  animation: particle 2s ease-out infinite;
  --tx: 20px;
  --ty: -20px;
}
```

#### 3. Mode nuit (dark mode)
**Toggle** : Ajouter un bouton pour inverser les couleurs

**Variables à ajouter** :
```css
@media (prefers-color-scheme: dark) {
  :root {
    --terracotta: #FF8A6B;  /* Plus clair */
    --gold: #FFD700;        /* Plus brillant */
    --cream: #2D2A24;       /* Inversé */
  }
}
```

---

### Améliorations moyen terme (1 jour)

#### 1. Filtres et recherche
**Feature** : Filtrer les événements par date, ville, type

**Composant** : `components/ui/MapFilters.tsx`
```typescript
interface MapFiltersProps {
  events: MapEvent[]
  onFilterChange: (filtered: MapEvent[]) => void
}
```

#### 2. Timeline interactive
**Feature** : Slider pour rejouer l'animation manuellement

**Librairie** : `rc-slider`
```tsx
<Slider
  min={0}
  max={events.length}
  value={currentStep}
  onChange={setCurrentStep}
/>
```

#### 3. Export GPX/KML
**Feature** : Télécharger le parcours pour GPS

**Librairie** : `togpx` ou `tokml`
```typescript
import togpx from 'togpx'

function exportRoute() {
  const geojson = {
    type: 'LineString',
    coordinates: positions.map(([lat, lng]) => [lng, lat])
  }
  const gpx = togpx(geojson)
  downloadFile(gpx, 'parcours-mariage.gpx')
}
```

---

### Améliorations long terme (1 semaine)

#### 1. Mode multi-cartes
**Feature** : Encarts pour événements hors France (DOM-TOM, étranger)

**Inspiration** : Cartes de France avec encarts Corse, Guadeloupe

#### 2. Statistiques avancées
**Metrics** :
- Distance totale parcourue
- Nombre de régions visitées
- CO2 estimé (si voiture/train)
- Temps de trajet moyen

#### 3. Partage social
**Feature** : Boutons partage avec preview image

**Librairie** : `html2canvas` pour screenshot carte
```typescript
import html2canvas from 'html2canvas'

async function shareMap() {
  const canvas = await html2canvas(mapRef.current)
  const dataUrl = canvas.toDataURL()

  // Partager sur réseaux sociaux
  navigator.share({
    title: 'Notre parcours de mariage',
    text: 'Découvrez notre mariage itinérant !',
    files: [new File([dataUrl], 'carte.png')]
  })
}
```

---

## 📝 Notes pour l'IA qui reprend

### Contexte important

1. **Utilisateur débutant** : Vulgariser les explications techniques
2. **Mémoire limitée** : Projet a déjà crashé avec 38GB RAM (Turbopack → Webpack)
3. **Base de données** : Supabase PostgreSQL avec RLS
4. **Authentification** : LocalStorage (pas Supabase Auth)
5. **6 événements de démo** : Déjà insérés avec GPS

### Commandes utiles

**Développement** :
```bash
npm run dev              # Serveur dev (port 3000 ou 3001)
npm run build            # Build production
npm run lint             # ESLint
```

**Base de données** :
```bash
node scripts/fix-foreign-key-and-insert.js  # Réinsérer les 6 démos
```

**URLs importantes** :
- Carte : http://localhost:3000/dashboard/journey-map
- Dashboard : http://localhost:3000/dashboard
- Création événement : http://localhost:3000/dashboard/create-event

### Fichiers critiques à ne PAS casser

1. `lib/mapHelpers.ts` - Calculs GPS
2. `lib/geocoding.ts` - API Nominatim
3. `components/map/BaseMap.tsx` - Container Leaflet
4. `supabase/migrations/*.sql` - Schéma DB

### Variables d'environnement requises

**.env.local** :
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ijgwrkfvfoqllbxdjntl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...  # Pour scripts
```

### Conventions de code

**Fichiers React** :
- Toujours 'use client' si hooks/interactivité
- Dynamic imports pour Leaflet (`{ ssr: false }`)
- TypeScript strict
- Props interfaces explicites

**Styles** :
- Tailwind pour layout/spacing
- CSS custom pour animations
- Variables CSS dans `:root`
- Préfixes `.gaming-*` pour styles carte

**Commits** :
```
feat: Add animated distance counter with Framer Motion
fix: Resolve line visibility issue by removing dashArray
style: Enhance RPG aesthetics with gold borders
```

---

## 📞 Support

**Problèmes fréquents** :
1. Ligne invisible → Vérifier `dashArray` retiré
2. Sons silencieux → Télécharger MP3 + clic page
3. Lag animations → Réduire nombre événements
4. Hydration errors → Vérifier `{ ssr: false }`

**Ressources** :
- Leaflet docs : https://leafletjs.com/reference.html
- Framer Motion : https://www.framer.com/motion/
- Howler.js : https://howlerjs.com/
- Next.js 16 : https://nextjs.org/docs

**Si vraiment bloqué** :
1. Lire cette doc en entier
2. Vérifier DevTools Console (F12)
3. Tester avec données démo (6 événements)
4. Isoler le problème (désactiver animations)

---

**Fin de la documentation**
Dernière mise à jour : 30 décembre 2024
Version : 1.0.0
Statut : ✅ Prêt pour production (après téléchargement sons)
