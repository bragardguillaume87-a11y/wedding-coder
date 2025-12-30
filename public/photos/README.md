# Photos pour le site de mariage

Ce dossier contient les photos à utiliser sur le site de mariage.

## Photos à ajouter

### 1. Hero (Page d'accueil)
- **Nom**: `couple-portrait.jpg`
- **Taille recommandée**: 400x400px (carré)
- **Description**: Portrait du couple pour la section Hero
- **Format**: JPG ou PNG

### 2. Notre Histoire
- **Nom**: `story-1.jpg`, `story-2.jpg`, `story-3.jpg`, `story-4.jpg`
- **Taille recommandée**: 400x300px (paysage)
- **Description**: Photos illustrant votre rencontre et parcours

### 3. Notre Rêve
- **Nom**: `dream-1.jpg`, `dream-2.jpg`, `dream-3.jpg`, `dream-4.jpg`
- **Taille recommandée**: 600x400px (paysage)
- **Description**: Photos d'intérieurs chaleureux, moments intimes

### 4. Ce que ça signifie (Valeurs)
- **Nom**: `value-1.jpg`, `value-2.jpg`, `value-3.jpg`, `value-4.jpg`
- **Taille recommandée**: 500x500px (carré)
- **Description**: Photos émotionnelles illustrant vos valeurs

### 5. L'Aventure (Itinéraire)
- **Nom**: `city-paris.jpg`, `city-lyon.jpg`, `city-3.jpg`, etc.
- **Taille recommandée**: 400x300px (paysage)
- **Description**: Photos de chaque ville de l'itinéraire
- **Optionnel**: `map.jpg` - Carte géographique avec votre parcours

### 6. CTA (Appel à l'action)
- **Nom**: `cta-background.jpg`
- **Taille recommandée**: 1920x1080px (paysage)
- **Description**: Grande photo du couple pour le fond du CTA

### 7. Footer
- **Nom**: `signature.jpg`
- **Taille recommandée**: 200x200px (carré)
- **Description**: Petite photo signature du couple

## Optimisation des images

Pour de meilleures performances :
1. Compressez vos images (TinyPNG, ImageOptim, etc.)
2. Utilisez le format WebP si possible
3. Nommez vos fichiers clairement
4. Évitez les fichiers trop lourds (max 500KB par image)

## Comment les utiliser dans le code

Une fois les images ajoutées, vous devrez modifier les composants pour utiliser `next/image` :

```jsx
import Image from 'next/image';

<Image
  src="/photos/couple-portrait.jpg"
  alt="Guillaume et [Nom]"
  width={400}
  height={400}
  className="rounded-full"
/>
```

## Placeholders actuels

Pour l'instant, le site utilise des emojis comme placeholders :
- 👰🤵 pour le portrait couple
- ❤️ pour la photo signature
- etc.

Remplacez-les par vos vraies photos quand vous êtes prêts !
