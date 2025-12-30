# 🗺️ Guide de Configuration de la Carte Interactive

## Étape 1 : Exécuter la Migration SQL ⚙️

**Pourquoi ?** Ajouter les colonnes `latitude`, `longitude` et autres infos de géocodage à la table `local_events`.

### Option A : Via Supabase Dashboard (Recommandé)

1. Ouvre Supabase Dashboard : https://supabase.com/dashboard
2. Sélectionne ton projet
3. Va dans **SQL Editor** (menu de gauche)
4. Clique sur **+ New query**
5. Copie-colle tout le contenu du fichier :
   ```
   supabase/migrations/20251227_add_geocoding_to_events.sql
   ```
6. Clique sur **Run** (ou appuie sur `Ctrl+Enter`)
7. ✅ Si tu vois "Success. No rows returned", c'est bon !

### Option B : Via Supabase CLI (Si installé)

```bash
# Si tu as Supabase CLI installé
supabase db push
```

---

## Étape 2 : Insérer les Événements de Démo 🎉

Une fois la migration exécutée, lance le script Node.js :

```bash
node scripts/setup-demo-events.js
```

Ce script va :
- ✅ Vérifier que la migration a bien été exécutée
- ✅ Insérer 6 événements de démo avec vraies adresses françaises :
  - Paris (Tour Eiffel, Hôtel de Ville)
  - Lyon (Place Bellecour)
  - Marseille (Vieux-Port)
  - Bordeaux (Place de la Bourse)
  - Nice (Promenade des Anglais)
- ✅ Afficher un résumé des événements créés

---

## Étape 3 : Tester la Carte 🗺️

1. Ouvre ton navigateur : http://localhost:3000/dashboard
2. Clique sur **"Carte du Parcours"** (carte dorée)
3. Tu devrais voir les 6 événements affichés sur la carte de France !

---

## Dépannage 🔧

### Erreur : "column 'latitude' does not exist"
→ La migration n'a pas été exécutée. Retourne à l'Étape 1.

### Erreur : "SUPABASE_SERVICE_ROLE_KEY is not defined"
→ Vérifie que tu as bien `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`
→ Tu peux la trouver dans Supabase Dashboard > Project Settings > API

### Les événements sont dupliqués
→ C'est normal si tu exécutes le script plusieurs fois
→ Supprime les doublons via Supabase Dashboard > Table Editor > local_events

---

## Prochaines Étapes 🚀

Une fois que la carte fonctionne avec les données de démo :
1. **Teste le géocodage automatique** : Crée un nouvel événement depuis `/dashboard/create-event`
2. **Vérifie la carte** : L'événement doit apparaître automatiquement
3. **Explore les animations** : Survole les marqueurs, zoome, dézoome
4. **Supprime les démos** : Quand tu es prêt, supprime les événements de démo depuis Supabase

---

**Besoin d'aide ?** Relis les instructions ou vérifie les logs dans la console !
