-- =====================================================
-- MIGRATION: Add RLS Policies for public.users
-- Date: 26 Décembre 2025
-- Description: Sécuriser la table users avec Row Level Security
-- =====================================================

-- 🔒 CONTEXTE
-- RLS (Row Level Security) = Sécurité au niveau des lignes
-- Cela empêche un user A de voir/modifier les données du user B
--
-- MÉTAPHORE :
-- Sans RLS = Un immeuble sans serrures, tout le monde entre partout 🚪❌
-- Avec RLS = Chaque appart a sa clé, tu entres que chez toi 🔑✅


-- =====================================================
-- ÉTAPE 1 : ACTIVER RLS SUR LA TABLE USERS
-- =====================================================

-- Active la sécurité au niveau des lignes
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 💡 Explication :
-- Sans cette ligne, les policies ne serviraient à rien.
-- C'est comme installer des serrures : il faut d'abord activer le système.


-- =====================================================
-- ÉTAPE 2 : POLICY "SELECT" (LECTURE)
-- =====================================================

-- Crée une policy pour LIRE ses propres données
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT                    -- Cette policy concerne la LECTURE (SELECT)
  TO authenticated              -- S'applique aux utilisateurs CONNECTÉS
  USING (auth.uid() = auth_id); -- CONDITION : ton ID auth = l'auth_id de la ligne

-- 💡 Explication :
-- auth.uid() = ton ID Supabase Auth (qui tu es)
-- auth_id = la colonne dans la table qui dit "à qui appartient cette ligne"
-- Si les deux matchent → tu peux voir cette ligne
-- Sinon → cette ligne est invisible pour toi
--
-- EXEMPLE :
-- User A (ID: 123) essaie de lire la table users
-- → Il voit SEULEMENT les lignes où auth_id = 123
-- → Il ne voit PAS les lignes des autres users


-- =====================================================
-- ÉTAPE 3 : POLICY "UPDATE" (MODIFICATION)
-- =====================================================

-- Crée une policy pour MODIFIER ses propres données
CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE                    -- Cette policy concerne la MODIFICATION (UPDATE)
  TO authenticated              -- S'applique aux utilisateurs CONNECTÉS
  USING (auth.uid() = auth_id)  -- Tu peux modifier SEULEMENT si c'est ta ligne
  WITH CHECK (auth.uid() = auth_id); -- Après modif, vérifie que c'est toujours ta ligne

-- 💡 Explication :
-- USING = Condition AVANT la modification ("Ai-je le droit de toucher à cette ligne ?")
-- WITH CHECK = Condition APRÈS la modification ("Après ma modif, est-ce toujours valide ?")
--
-- EXEMPLE :
-- User A (ID: 123) essaie de faire :
--   UPDATE users SET email = 'new@email.com' WHERE id = 456
-- → ❌ REFUSÉ car auth_id de cette ligne = 456, pas 123
--
-- User A essaie de faire :
--   UPDATE users SET email = 'new@email.com' WHERE id = 123
-- → ✅ ACCEPTÉ car c'est sa propre ligne


-- =====================================================
-- ÉTAPE 4 : POLICY "INSERT" (CRÉATION)
-- =====================================================

-- Crée une policy pour INTERDIRE les INSERTs directs depuis le client
CREATE POLICY "Prevent direct inserts from client"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (false); -- false = JAMAIS autorisé depuis le client

-- 💡 Explication :
-- On veut que SEUL le serveur (via /api/auth/signup) puisse créer des users
-- Pourquoi ? Parce que la création doit être atomique (Auth + DB)
--
-- Si un user pouvait faire INSERT directement :
--   → Il pourrait créer des lignes sans passer par Auth
--   → Risque de données incohérentes
--
-- Le service_role (utilisé par notre API) IGNORE cette policy
-- et peut quand même insérer (c'est voulu).


-- =====================================================
-- ÉTAPE 5 : POLICY "DELETE" (SUPPRESSION)
-- =====================================================

-- Crée une policy pour INTERDIRE les suppressions depuis le client
CREATE POLICY "Prevent direct deletes from client"
  ON public.users
  FOR DELETE
  TO authenticated
  USING (false); -- false = JAMAIS autorisé depuis le client

-- 💡 Explication :
-- On ne veut PAS que les users puissent se supprimer directement
-- Pourquoi ? Parce que :
--   1. Il faut aussi supprimer le user Auth (atomicité)
--   2. Il faut peut-être supprimer des données liées (events, invitations, etc.)
--   3. C'est mieux de passer par une API qui gère tout ça
--
-- Si tu veux permettre aux users de se supprimer plus tard,
-- tu créeras une API /api/auth/delete-account qui fait tout proprement.


-- =====================================================
-- RÉCAPITULATIF DES POLICIES
-- =====================================================

-- ✅ SELECT (lecture) : Autorisé pour ses propres données
-- ✅ UPDATE (modification) : Autorisé pour ses propres données
-- ❌ INSERT (création) : INTERDIT depuis le client (seulement via API)
-- ❌ DELETE (suppression) : INTERDIT depuis le client (seulement via API)
--
-- Le service_role (nos APIs) peut TOUT faire car il bypass les RLS.


-- =====================================================
-- COMMENT TESTER SI ÇA MARCHE ?
-- =====================================================

-- Test 1 : Vérifie que RLS est activé
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';
-- → rowsecurity doit être TRUE

-- Test 2 : Affiche toutes les policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename = 'users'
-- ORDER BY policyname;
-- → Tu dois voir les 4 policies ci-dessus

-- Test 3 : Essaie de lire depuis ton app
-- Dans ton app Next.js, après connexion :
--   const { data } = await supabase.from('users').select('*')
-- → Tu dois voir SEULEMENT ta ligne, pas celles des autres


-- =====================================================
-- EN CAS DE PROBLÈME
-- =====================================================

-- Si tu veux TOUT supprimer et recommencer :
-- DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
-- DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
-- DROP POLICY IF EXISTS "Prevent direct inserts from client" ON public.users;
-- DROP POLICY IF EXISTS "Prevent direct deletes from client" ON public.users;
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;


-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================
-- 🎉 Bravo ! Ta table users est maintenant sécurisée !
-- Les users ne peuvent voir/modifier QUE leurs propres données.
-- =====================================================