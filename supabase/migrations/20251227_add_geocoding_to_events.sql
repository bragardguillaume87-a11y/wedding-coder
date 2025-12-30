-- =====================================================
-- MIGRATION: Add Geocoding Columns to local_events
-- Date: 27 Décembre 2025
-- Description: Ajouter les colonnes latitude/longitude pour la carte Leaflet
-- =====================================================

-- 🗺️ CONTEXTE
-- Cette migration ajoute les colonnes nécessaires pour stocker
-- les coordonnées GPS des événements (géocodage depuis les adresses).
--
-- MÉTAPHORE :
-- Adresse = "10 Rue de Rivoli, Paris" (texte pour humains)
-- Coordonnées GPS = 48.8566, 2.3522 (nombres pour ordinateurs/cartes)
--
-- Le géocodage = Transformer l'adresse en coordonnées GPS
-- Utilise Nominatim API (OpenStreetMap) - GRATUIT


-- =====================================================
-- ÉTAPE 1 : AJOUTER LES COLONNES DE GÉOCODAGE
-- =====================================================

ALTER TABLE public.local_events
ADD COLUMN latitude DECIMAL(10, 8),          -- Coordonnée latitude (-90 à +90)
ADD COLUMN longitude DECIMAL(11, 8),         -- Coordonnée longitude (-180 à +180)
ADD COLUMN country_code VARCHAR(2) DEFAULT 'FR',  -- Code pays (FR, US, etc.)
ADD COLUMN geocoded_at TIMESTAMP WITH TIME ZONE,  -- Date du géocodage
ADD COLUMN geocoding_source VARCHAR(50) DEFAULT 'nominatim';  -- Source API utilisée

-- 💡 Explication :
-- - latitude/longitude : Stockent les coordonnées GPS exactes
--   Exemple : Paris = 48.8566° N, 2.3522° E
-- - DECIMAL(10, 8) : Permet une précision au mètre près
--   (10 chiffres au total, 8 après la virgule)
-- - country_code : Permet de grouper événements par pays
--   Utile pour les encarts DOM-TOM style carte officielle
-- - geocoded_at : Horodatage pour savoir quand ça a été géocodé
-- - geocoding_source : Permet de tracer d'où viennent les coords
--   (nominatim, google, manuel, etc.)


-- =====================================================
-- ÉTAPE 2 : INDEX POUR PERFORMANCES
-- =====================================================

-- Index pour accélérer les requêtes par coordonnées
CREATE INDEX idx_local_events_coordinates
ON public.local_events(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 💡 Explication :
-- Cet index rend ultra rapide la recherche d'événements géolocalisés
-- Le WHERE clause = index partiel (seulement les lignes avec coords)
-- → Plus petit, plus rapide, utilise moins d'espace


-- Index pour filtrer par pays
CREATE INDEX idx_local_events_country
ON public.local_events(country_code);

-- 💡 Explication :
-- Permet de récupérer rapidement tous les événements d'un pays
-- Utile pour afficher France + encarts internationaux séparément


-- =====================================================
-- ÉTAPE 3 : COMMENTAIRES SQL (DOCUMENTATION)
-- =====================================================

COMMENT ON COLUMN public.local_events.latitude IS
'Latitude GPS de l''événement (géocodé depuis location_address)';

COMMENT ON COLUMN public.local_events.longitude IS
'Longitude GPS de l''événement (géocodé depuis location_address)';

COMMENT ON COLUMN public.local_events.country_code IS
'Code pays ISO 3166-1 alpha-2 (FR, US, etc.)';

COMMENT ON COLUMN public.local_events.geocoded_at IS
'Date et heure du géocodage de l''adresse';

COMMENT ON COLUMN public.local_events.geocoding_source IS
'Source du géocodage (nominatim, google, manuel, etc.)';

-- 💡 Explication :
-- Les COMMENT permettent de documenter directement dans la BDD
-- Visible dans Supabase Dashboard et outils SQL


-- =====================================================
-- COMMENT TESTER SI ÇA MARCHE ?
-- =====================================================

-- Test 1 : Vérifie que les colonnes existent
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'local_events'
-- AND column_name IN ('latitude', 'longitude', 'country_code');

-- Test 2 : Vérifie que les index sont créés
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'local_events';

-- Test 3 : Insère un événement test
-- INSERT INTO public.local_events (event_name, location_address, latitude, longitude, country_code)
-- VALUES ('Test Event', '10 Rue de Rivoli, Paris', 48.8566, 2.3522, 'FR');


-- =====================================================
-- EN CAS DE ROLLBACK (ANNULER LA MIGRATION)
-- =====================================================

-- Si tu veux tout supprimer :
-- DROP INDEX IF EXISTS idx_local_events_coordinates;
-- DROP INDEX IF EXISTS idx_local_events_country;
-- ALTER TABLE public.local_events
--   DROP COLUMN latitude,
--   DROP COLUMN longitude,
--   DROP COLUMN country_code,
--   DROP COLUMN geocoded_at,
--   DROP COLUMN geocoding_source;


-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================
-- 🎉 Les événements peuvent maintenant être géocodés et affichés sur la carte !
-- =====================================================
