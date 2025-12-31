-- ===================================================================
-- Migration: Ajout colonne event_type à la table local_events
-- Phase 2.2 - Plan d'implémentation wedding-coder
-- ===================================================================

-- 1. Ajouter la colonne event_type avec valeur par défaut
ALTER TABLE local_events
ADD COLUMN IF NOT EXISTS event_type VARCHAR(50) DEFAULT 'ceremony';

-- 2. Créer un index pour améliorer les performances des filtres
CREATE INDEX IF NOT EXISTS idx_local_events_event_type
ON local_events(event_type);

-- 3. Ajouter une contrainte pour valider les valeurs
ALTER TABLE local_events
ADD CONSTRAINT check_event_type
CHECK (event_type IN ('ceremony', 'cocktail', 'dinner', 'brunch', 'party', 'activity'));

-- 4. Ajouter un commentaire sur la colonne
COMMENT ON COLUMN local_events.event_type IS 'Type d''événement: ceremony, cocktail, dinner, brunch, party, activity';

-- ===================================================================
-- (Optionnel) Mise à jour des événements existants
-- Vous pouvez exécuter ces requêtes pour catégoriser vos événements
-- ===================================================================

-- Exemple: Définir tous les événements contenant "cérémonie" comme type 'ceremony'
-- UPDATE local_events
-- SET event_type = 'ceremony'
-- WHERE LOWER(event_name) LIKE '%cérémonie%' OR LOWER(event_name) LIKE '%ceremony%';

-- Exemple: Définir les événements "cocktail"
-- UPDATE local_events
-- SET event_type = 'cocktail'
-- WHERE LOWER(event_name) LIKE '%cocktail%';

-- Exemple: Définir les événements "dîner"
-- UPDATE local_events
-- SET event_type = 'dinner'
-- WHERE LOWER(event_name) LIKE '%dîner%' OR LOWER(event_name) LIKE '%dinner%' OR LOWER(event_name) LIKE '%repas%';

-- Exemple: Définir les événements "brunch"
-- UPDATE local_events
-- SET event_type = 'brunch'
-- WHERE LOWER(event_name) LIKE '%brunch%';

-- Exemple: Définir les événements "soirée"
-- UPDATE local_events
-- SET event_type = 'party'
-- WHERE LOWER(event_name) LIKE '%soirée%' OR LOWER(event_name) LIKE '%party%' OR LOWER(event_name) LIKE '%fête%';

-- ===================================================================
-- Vérification
-- ===================================================================

-- Compter les événements par type
-- SELECT event_type, COUNT(*) as count
-- FROM local_events
-- GROUP BY event_type
-- ORDER BY count DESC;
