# Wedding-Coder Setup Notes - 25 Dec 2025

## ✅ Complété
- Next.js 15 installé et fonctionnel
- Supabase intégré (authentification)
- Page Login/Signup créée et testée
- Dashboard créé
- Page "Créer un événement" créée
- Tailwind CSS configuré
- useUser hook créé

## ⚠️ PROBLÈME EN COURS
**INSERT INTO users retourne "Success. No rows returned"**

### Détails du bug
- Requête : `INSERT INTO users (id, email) VALUES ('333c60dd-7d61-4cd7-91a2-5976b7cca8d6', 'bragard.guillaume87@gmail.com');`
- Résultat : "Success. No rows returned" (au lieu de "1 row inserted")
- Symptôme : Les utilisateurs ne sont pas créés dans la table users
- Context: C'est systématique, même avec une requête ultra simple

### Tables créées
- users (table)
- main_ceremony (table)
- local_events (table)
- invitation_links (table)
- available_dates (table)

### Fichiers créés
app/
├── page.js (login/signup)
├── dashboard/
│ ├── page.js (dashboard)
│ └── create-event/
│ └── page.js (créer un événement)
└── middleware.js (pour sync users - À TESTER)

lib/
├── supabase.js (client Supabase)
└── useUser.js (hook authentification)

text

### UUID utilisateur testés
- User Email: bragard.guillaume87@gmail.com
- UUID (from Supabase Auth): 333c60dd-7d61-4cd7-91a2-5976b7cca8d6
- Middleware créé pour auto-sync des users

## 🚀 Prochaines étapes
1. Debugger le INSERT users
2. Tester le middleware
3. Créer une cérémonie principale
4. Tester la création d'événement
5. Carte France interactive

## 📋 Points à vérifier prochainement
- [ ] Pourquoi INSERT retourne "No rows returned" ?
- [ ] Le middleware fonctionne-t-il ?
- [ ] Les constraints de foreign key bloquent-elles ?
- [ ] Besoin de désactiver certaines contraintes ?

## 🛠️ Commandes utiles
npm run dev # Lancer le serveur
npm install @supabase/ssr # Installer SSR Supabase

text

## 💻 Environnement
- Node.js: v22.21.0
- Git: v2.52.0
- OS: Windows
- User: Guillaume Bragard (Francheville, Auvergne-Rhône-Alpes)