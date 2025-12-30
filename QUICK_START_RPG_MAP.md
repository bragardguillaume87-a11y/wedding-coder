# 🚀 Quick Start - Carte RPG

**Status** : ✅ Implémentation terminée (sons à télécharger)

---

## ⚡ Démarrage rapide (5 minutes)

### 1. Télécharger les sons

Va dans `public/sounds/` et télécharge ces 6 fichiers MP3 :

| Fichier | Source | Mots-clés recherche |
|---------|--------|---------------------|
| `marker-hover.mp3` | [Pixabay](https://pixabay.com/sound-effects/search/ui/) | "soft UI hover" |
| `marker-click.mp3` | [Mixkit](https://mixkit.co/free-sound-effects/click/) | "button click" |
| `path-draw.mp3` | [ElevenLabs](https://elevenlabs.io/sound-effects) | "magical whoosh" |
| `marker-unlock.mp3` | [Pixabay](https://pixabay.com/sound-effects/) | "gentle bell" |
| `map-load.mp3` | [Freesound](https://freesound.org/) | "parchment open" |
| `celebration.mp3` | [Pixabay](https://pixabay.com/sound-effects/) | "success chime" |

**Note** : Lis `public/sounds/README.md` pour plus de détails.

### 2. Tester

```bash
# Si serveur pas lancé
npm run dev

# Ouvre dans le navigateur
http://localhost:3000/dashboard/journey-map
```

### 3. Ce que tu devrais voir

- ✅ Ligne rouge qui se dessine (1.9s)
- ✅ 6 waypoints qui apparaissent avec bounce (1 par 200ms)
- ✅ Compteur qui monte de 0 à ~1234 km
- ✅ Bouton 🔊 en bas à droite
- ✅ Popups style parchemin avec bordure dorée

---

## 📁 Fichiers clés

**Documentation complète** : `RPG_MAP_IMPLEMENTATION.md` (800+ lignes)

**Code principal** :
- `app/dashboard/journey-map/page.tsx` - Page orchestratrice
- `components/map/JourneyPath.tsx` - Ligne animée
- `components/map/GamingMarker.tsx` - Waypoints
- `lib/soundManager.ts` - Système audio
- `app/globals.css` - Styles RPG

**Composants UI** :
- `components/ui/SoundToggle.tsx` - Bouton mute
- `components/ui/AnimatedCounter.tsx` - Compteur distance

---

## 🎬 Timeline des animations

```
0ms       Carte charge
400ms     Ligne commence (+ son "pathDraw")
1900ms    Ligne finie
1900ms    Waypoint 1 (+ "ding!")
2100ms    Waypoint 2
2300ms    Waypoint 3
2500ms    Waypoint 4
2700ms    Waypoint 5
2900ms    Waypoint 6
3200ms    Compteur démarre
5200ms    Célébration ! ✨
```

---

## 🐛 Dépannage express

**La ligne ne s'affiche pas ?**
→ Vérifier que `latitude/longitude` existent dans `local_events`

**Sons muets ?**
→ 1. Télécharger les MP3
→ 2. Cliquer sur la page avant (autoplay policy)
→ 3. Vérifier bouton 🔊 pas en mute

**Animations lentes ?**
→ Ouvrir DevTools (F12) → Performance → Profiler

**Erreur console ?**
→ Lire `RPG_MAP_IMPLEMENTATION.md` section "Dépannage"

---

## 🎯 Commandes utiles

```bash
# Développement
npm run dev                                    # Port 3000
npm run build                                  # Build prod

# Base de données
node scripts/fix-foreign-key-and-insert.js    # Réinsérer 6 démos

# URLs
http://localhost:3000/dashboard/journey-map   # Carte
http://localhost:3000/dashboard/create-event  # Créer événement
```

---

## 📚 Pour aller plus loin

**Documentation complète** : `RPG_MAP_IMPLEMENTATION.md`

**Sections importantes** :
- Architecture du code (ligne 50)
- Séquence d'animation détaillée (ligne 150)
- Tests complets (ligne 550)
- Prochaines étapes (ligne 700)

**Support** :
- Leaflet : https://leafletjs.com/
- Framer Motion : https://www.framer.com/motion/
- Howler.js : https://howlerjs.com/

---

**✨ Bon développement !**
