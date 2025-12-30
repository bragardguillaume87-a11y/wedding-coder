# 📁 Scripts - Guide d'Utilisation

Ce dossier contient tous les scripts utilitaires pour configurer et gérer la carte interactive Leaflet.

---

## 🚀 Script Principal (RECOMMANDÉ)

### `setup-all.js` - Setup Complet One-Click

**Description:** Configure TOUT automatiquement en mode interactif.

**Utilisation:**
```bash
node scripts/setup-all.js
```

**Ce qu'il fait:**
1. Diagnostic complet du système
2. Migration SQL (choix auto ou manuel)
3. Insertion des événements de démo
4. Vérification finale

**Quand l'utiliser:**
- ✅ Première installation
- ✅ Si tu es débutant
- ✅ Si tu veux tout automatiser

---

## 🔍 Scripts de Diagnostic

### `diagnose-system.js` - Diagnostic Complet

**Description:** Analyse tous les composants du système et génère un rapport détaillé.

**Utilisation:**
```bash
node scripts/diagnose-system.js
```

**Ce qu'il vérifie:**
- ✅ Variables d'environnement (.env.local)
- ✅ Dépendances npm (leaflet, react-leaflet, etc.)
- ✅ Fichiers requis (composants, migrations, etc.)
- ✅ Connexion Supabase
- ✅ Structure de la table local_events
- ✅ Configuration Next.js
- ✅ Import CSS Leaflet

**Résultat:**
- Rapport coloré avec succès ✅, avertissements ⚠️, et problèmes ❌
- Plan d'action personnalisé avec solutions

**Quand l'utiliser:**
- ✅ Avant toute opération
- ✅ Si quelque chose ne fonctionne pas
- ✅ Pour vérifier l'état du système

---

## 🗄️ Scripts de Migration SQL

### `run-migration-postgres.js` - Migration Automatique PostgreSQL

**Description:** Se connecte directement à PostgreSQL Supabase et exécute la migration.

**Utilisation:**
```bash
node scripts/run-migration-postgres.js
```

**Prérequis:**
- Package `pg` installé (déjà fait ✓)
- Mot de passe PostgreSQL Supabase

**Où trouver le mot de passe:**
1. https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl/settings/database
2. Scroll jusqu'à "Connection string"
3. Clique sur "URI"
4. Copie le mot de passe (entre `:` et `@`)

**Avantages:**
- ✅ Totalement automatique
- ✅ Vérifie que les colonnes n'existent pas déjà
- ✅ Messages clairs et colorés
- ✅ Validation du résultat

**Quand l'utiliser:**
- ✅ Si tu as le mot de passe DB
- ✅ Si tu veux automatiser
- ✅ Pour éviter le copier-coller manuel

---

### `run-migration.js` - Guide Migration Manuel

**Description:** Ouvre Supabase Dashboard et guide la migration manuelle.

**Utilisation:**
```bash
node scripts/run-migration.js
```

**Ce qu'il fait:**
1. Affiche les instructions claires
2. Ouvre le navigateur sur Supabase SQL Editor
3. Attend ta confirmation

**Quand l'utiliser:**
- ✅ Si tu n'as pas le mot de passe DB
- ✅ Si la migration auto échoue
- ✅ Si tu préfères le contrôle manuel

---

## 🎉 Scripts de Données de Démo

### `insert-demo-events-simple.js` - Insertion Événements de Démo

**Description:** Insère 6 événements de démo avec vraies coordonnées GPS.

**Utilisation:**
```bash
node scripts/insert-demo-events-simple.js
```

**Événements créés:**
1. 💍 Cérémonie Civile - Paris (Hôtel de Ville)
2. 🥂 Soirée d'Ouverture - Paris (Tour Eiffel)
3. 🍷 Escapade Lyonnaise - Lyon (Place Bellecour)
4. 🌊 Fête au Bord de la Mer - Marseille (Vieux-Port)
5. 🍇 Dégustation Bordelaise - Bordeaux (Place de la Bourse)
6. 🎆 Grande Finale - Nice (Promenade des Anglais)

**Prérequis:**
- Migration SQL exécutée (colonnes de géocodage présentes)

**Quand l'utiliser:**
- ✅ Après la migration SQL
- ✅ Pour tester la carte rapidement
- ✅ Pour voir un exemple de données

---

### `setup-demo-events.js` - Setup Complet (Migration + Démo)

**Description:** Version complète qui fait migration + insertion démo.

**Utilisation:**
```bash
node scripts/setup-demo-events.js
```

**Différence avec insert-demo-events-simple.js:**
- Plus verbeux
- Inclut des tentatives de migration
- Plus de vérifications

**Quand l'utiliser:**
- ✅ Alternative à `setup-all.js`
- ✅ Si tu veux plus de détails

---

## 🛠️ Utilitaires

### `monitor-memory.js` - Surveillance Mémoire

**Description:** Surveille la mémoire Node.js en temps réel.

**Utilisation:**
```bash
node scripts/monitor-memory.js
```

**Ce qu'il fait:**
- Affiche l'utilisation mémoire toutes les 10 secondes
- Alerte si >2GB
- Utile pour détecter les fuites mémoire

**Quand l'utiliser:**
- ✅ Si le serveur consomme trop de RAM
- ✅ Si l'ordi devient lent
- ✅ Pour surveiller pendant le dev

---

## 📖 Documentation

### `SETUP_GUIDE.md` - Guide de Configuration

**Description:** Guide manuel étape par étape pour tout configurer.

**Quand le lire:**
- ✅ Si tu veux comprendre le processus
- ✅ Si les scripts automatiques échouent
- ✅ Pour une config manuelle

---

## 🎯 Ordre d'Exécution Recommandé

### Installation Complète (Premier Usage)

```bash
# 1. Diagnostic initial
node scripts/diagnose-system.js

# 2. Setup complet automatique (RECOMMANDÉ)
node scripts/setup-all.js

# OU manuel :
# 2a. Migration SQL
node scripts/run-migration-postgres.js

# 2b. Événements de démo
node scripts/insert-demo-events-simple.js

# 3. Vérification finale
node scripts/diagnose-system.js
```

### Dépannage

```bash
# Si problème, toujours commencer par le diagnostic
node scripts/diagnose-system.js

# Lire le rapport et suivre le plan d'action
```

---

## ❓ FAQ Scripts

### Quel script utiliser pour commencer?
👉 **`setup-all.js`** - Il fait tout automatiquement en mode interactif.

### La migration automatique échoue, que faire?
👉 Utilise **`run-migration.js`** pour le faire manuellement via Dashboard.

### Comment vérifier si tout fonctionne?
👉 Lance **`diagnose-system.js`** et lis le rapport.

### Les événements de démo sont dupliqués
👉 Normal si tu exécutes plusieurs fois `insert-demo-events-simple.js`.
👉 Supprime les doublons via Supabase Dashboard > Table Editor.

### Comment surveiller la mémoire?
👉 Lance **`monitor-memory.js`** dans un terminal séparé.

---

## 🎨 Codes Couleur des Scripts

- 🟢 **Vert** : Succès / OK
- 🟡 **Jaune** : Avertissement / Non bloquant
- 🔴 **Rouge** : Erreur / Critique
- 🔵 **Bleu** : Information / En cours
- 🟣 **Cyan** : Instructions / Prochaines étapes

---

## 📝 Notes Techniques

### Pourquoi utiliser `pg` pour la migration?

Le client Supabase JS ne permet pas d'exécuter des commandes DDL (ALTER TABLE, CREATE INDEX) directement. Il faut utiliser une connexion PostgreSQL native.

### Pourquoi `dotenv`?

Pour charger les variables d'environnement depuis `.env.local` dans les scripts Node.js.

### Les scripts modifient-ils la base de données?

- ✅ **`run-migration-postgres.js`** : OUI (ajoute colonnes)
- ✅ **`insert-demo-events-simple.js`** : OUI (insère 6 événements)
- ❌ **`diagnose-system.js`** : NON (lecture seule)
- ❌ **`monitor-memory.js`** : NON (surveillance uniquement)

---

## 🔗 Liens Utiles

- **Supabase Dashboard:** https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl
- **SQL Editor:** https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl/sql/new
- **Database Settings:** https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl/settings/database
- **Carte Interactive:** http://localhost:3000/dashboard/journey-map
- **Créer Événement:** http://localhost:3000/dashboard/create-event

---

**Créé le:** 30 Décembre 2025
**Dernière mise à jour:** 30 Décembre 2025
