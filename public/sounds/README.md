# 🔊 Sons pour la Carte RPG

Cette application utilise 6 effets sonores pour créer une expérience immersive.

## 📥 Fichiers requis

Télécharge ces 6 sons et place-les dans ce dossier (`public/sounds/`) :

1. **marker-hover.mp3** - Son doux quand on survole un marqueur
   - Type : Petit "ting" élégant
   - Durée : ~0.3-0.5 secondes
   - Volume : Subtil

2. **marker-click.mp3** - Son au clic sur un marqueur
   - Type : Clic élégant/confirmation
   - Durée : ~0.2-0.4 secondes
   - Volume : Moyen

3. **path-draw.mp3** - Son quand la ligne se dessine
   - Type : "Whoosh" magique/mystique
   - Durée : ~1-2 secondes
   - Volume : Subtil

4. **marker-unlock.mp3** - Son quand un waypoint apparaît
   - Type : "Ding!" ou clochette
   - Durée : ~0.3-0.5 secondes
   - Volume : Moyen

5. **map-load.mp3** - Son d'ambiance au chargement
   - Type : Ouverture mystique/parchemin
   - Durée : ~1-2 secondes
   - Volume : Subtil

6. **celebration.mp3** - Son de célébration finale
   - Type : Paillettes/succès
   - Durée : ~0.5-1 seconde
   - Volume : Plus marqué

## 🌐 Où trouver des sons gratuits ?

### Option 1 : Pixabay (Recommandé)
- **URL** : https://pixabay.com/sound-effects/search/ui/
- **Avantages** : Gratuit, royalty-free, bonne qualité
- **Recherche** : "elegant UI sound", "soft click", "gentle chime"

### Option 2 : Mixkit
- **URL** : https://mixkit.co/free-sound-effects/click/
- **Avantages** : 36 clics gratuits, haute qualité
- **Recherche** : "UI click", "button click"

### Option 3 : ElevenLabs (Générateur AI)
- **URL** : https://elevenlabs.io/sound-effects
- **Avantages** : Génère des sons sur mesure avec AI
- **Recherche** : Décris le son que tu veux en anglais

### Option 4 : Freesound
- **URL** : https://freesound.org/
- **Avantages** : Énorme bibliothèque communautaire
- **Recherche** : "UI", "game notification", "soft bell"

## 🎯 Critères de sélection

Pour une expérience élégante et subtile :

✅ **À RECHERCHER** :
- Sons courts (moins d'1 seconde sauf path-draw et map-load)
- Tonalité douce et agréable
- Sans distorsion ni bruit de fond
- Format MP3 de bonne qualité (128kbps minimum)

❌ **À ÉVITER** :
- Sons trop forts ou agressifs
- Sons de jeux vidéo "8-bit" (trop arcade)
- Sons électroniques durs
- Fichiers trop lourds (> 100KB par son)

## 🎨 Style sonore

**Ambiance cible** : RPG élégant façon Final Fantasy / Zelda
- Doux mais présent
- Mystique/magique sans être "over the top"
- Classy et raffiné (c'est pour un mariage !)

## 📝 Installation

1. Télécharge les 6 fichiers MP3
2. Renomme-les exactement comme indiqué ci-dessus
3. Place-les dans `public/sounds/`
4. Redémarre le serveur Next.js
5. Teste en cliquant sur le bouton 🔊 dans la carte

## 🔇 Mode silencieux par défaut

Si tu n'as pas les sons pour l'instant :
- L'application fonctionnera quand même sans erreur
- Le bouton 🔊 sera visible
- Les sons seront simplement silencieux jusqu'à ce que tu les ajoutes

## 🛠️ Dépannage

**Les sons ne marchent pas ?**

1. Vérifie que les fichiers sont bien nommés (exactement comme ci-dessus)
2. Vérifie qu'ils sont dans `public/sounds/` (PAS `./sounds/`)
3. Ouvre la console (F12) → Cherche des erreurs 404
4. Clique sur la page avant d'écouter (les navigateurs bloquent l'audio avant interaction)
5. Vérifie que le bouton mute 🔇 n'est pas activé

**Les sons sont trop forts/faibles ?**

Tu peux ajuster le volume dans `lib/soundManager.ts` :
```typescript
markerHover: {
  src: '/sounds/marker-hover.mp3',
  volume: 0.2, // Change ce nombre (0 = silence, 1 = max)
},
```

## 💡 Exemples de recherche

**Pour Pixabay** :
- "elegant notification"
- "soft UI click"
- "gentle bell"
- "magic whoosh"
- "success chime"

**Pour ElevenLabs** :
- "Elegant soft click for user interface"
- "Gentle magical whoosh sound"
- "Soft celebration bell with sparkle"

---

Une fois les sons téléchargés, ta carte interactive sera 100% opérationnelle ! 🎮✨
