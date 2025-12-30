-- =====================================================
-- MIGRATION: Create ceremonies table
-- Date: 30 Décembre 2025
-- Description: Créer la table pour stocker les cérémonies (mariages)
-- =====================================================

-- 💍 CONTEXTE
-- Cette migration crée la table "ceremonies" qui représente le mariage principal
-- Chaque événement (local_events) doit être attaché à une cérémonie
--
-- MÉTAPHORE :
-- ceremonies = Le livre (le mariage principal)
-- local_events = Les chapitres (les différentes étapes : Paris, Lyon, etc.)


-- =====================================================
-- ÉTAPE 1 : CRÉER LA TABLE CEREMONIES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ceremonies (
  id BIGSERIAL PRIMARY KEY,
  ceremony_name VARCHAR(255) NOT NULL,
  ceremony_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 💡 Explication :
-- - id : Identifiant unique auto-incrémenté
-- - ceremony_name : Nom de la cérémonie (ex: "Notre Mariage Itinérant")
-- - ceremony_date : Date du mariage
-- - description : Description optionnelle
-- - created_at : Date de création de l'enregistrement
-- - updated_at : Date de dernière modification


-- =====================================================
-- ÉTAPE 2 : ACTIVER ROW LEVEL SECURITY (SÉCURITÉ)
-- =====================================================

ALTER TABLE public.ceremonies ENABLE ROW LEVEL SECURITY;

-- 💡 Explication :
-- Active la sécurité au niveau des lignes
-- Empêche l'accès non autorisé aux données


-- =====================================================
-- ÉTAPE 3 : CRÉER LES POLICIES (RÈGLES D'ACCÈS)
-- =====================================================

-- Policy SELECT : Tout le monde peut voir les cérémonies
CREATE POLICY "Anyone can view ceremonies"
  ON public.ceremonies
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policy INSERT : Seulement les utilisateurs authentifiés peuvent créer
CREATE POLICY "Authenticated users can create ceremonies"
  ON public.ceremonies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy UPDATE : Seulement les utilisateurs authentifiés peuvent modifier
CREATE POLICY "Authenticated users can update ceremonies"
  ON public.ceremonies
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy DELETE : Seulement les utilisateurs authentifiés peuvent supprimer
CREATE POLICY "Authenticated users can delete ceremonies"
  ON public.ceremonies
  FOR DELETE
  TO authenticated
  USING (true);

-- 💡 Explication :
-- - SELECT : Tout le monde (auth + anon) peut lire → pour affichage public
-- - INSERT/UPDATE/DELETE : Seulement les users authentifiés → sécurité


-- =====================================================
-- ÉTAPE 4 : AJOUTER DES COMMENTAIRES (DOCUMENTATION)
-- =====================================================

COMMENT ON TABLE public.ceremonies IS
'Table principale stockant les cérémonies (mariages)';

COMMENT ON COLUMN public.ceremonies.id IS
'Identifiant unique de la cérémonie';

COMMENT ON COLUMN public.ceremonies.ceremony_name IS
'Nom de la cérémonie (ex: "Notre Mariage Itinérant")';

COMMENT ON COLUMN public.ceremonies.ceremony_date IS
'Date de la cérémonie principale';

COMMENT ON COLUMN public.ceremonies.description IS
'Description optionnelle de la cérémonie';


-- =====================================================
-- ÉTAPE 5 : CRÉER UNE CÉRÉMONIE PAR DÉFAUT
-- =====================================================

-- Insérer une cérémonie par défaut si aucune n'existe
INSERT INTO public.ceremonies (ceremony_name, ceremony_date, description)
SELECT
  'Notre Mariage Itinérant',
  '2025-06-15',
  'Un mariage unique à travers la France'
WHERE NOT EXISTS (
  SELECT 1 FROM public.ceremonies LIMIT 1
);

-- 💡 Explication :
-- On crée automatiquement une cérémonie par défaut
-- Uniquement si la table est vide (WHERE NOT EXISTS)
-- Comme ça, tu peux créer des événements immédiatement !


-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================
-- 🎉 La table ceremonies est prête !
-- Tu peux maintenant créer des événements sans erreur "ceremony_id"
-- =====================================================
