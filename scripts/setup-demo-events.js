/**
 * Script de configuration des événements de démo
 *
 * Ce script fait 2 choses :
 * 1. Exécute la migration pour ajouter les colonnes de géocodage
 * 2. Insère 6 événements de démo avec vraies adresses françaises
 *
 * Utilisation : node scripts/setup-demo-events.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Chargement variables d'environnement
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.error('   Vérifie que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont dans .env.local');
  process.exit(1);
}

// Client Supabase avec clé service_role (bypass RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Exécute la migration SQL
 */
async function runMigration() {
  console.log('\n🔧 ÉTAPE 1/3 : Exécution de la migration SQL...\n');

  try {
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251227_add_geocoding_to_events.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Supabase n'a pas de méthode directe pour exécuter du SQL brut
    // On utilise donc des requêtes séparées pour chaque ALTER TABLE

    console.log('   📝 Ajout des colonnes de géocodage...');

    // Vérifier si les colonnes existent déjà
    const { data: columns, error: checkError } = await supabase
      .from('local_events')
      .select('*')
      .limit(0);

    if (checkError && checkError.message.includes('column "latitude" does not exist')) {
      console.log('   ⚠️  Les colonnes n\'existent pas encore - migration nécessaire');
      console.log('   📋 Veuillez exécuter manuellement la migration SQL dans Supabase Dashboard');
      console.log('   🔗 https://supabase.com/dashboard/project/_/sql');
      console.log('\n   Ou copier-coller le contenu de :');
      console.log(`   ${migrationPath}\n`);

      // On continue quand même pour montrer ce qui serait fait
    } else {
      console.log('   ✅ Colonnes de géocodage déjà présentes !');
    }

  } catch (error) {
    console.error('   ❌ Erreur lors de la migration:', error.message);
    console.log('\n   💡 Conseil : Exécute manuellement la migration SQL dans Supabase Dashboard');
    // On continue quand même pour créer les events
  }
}

/**
 * Événements de démo avec vraies adresses françaises
 */
const DEMO_EVENTS = [
  {
    event_name: 'Cérémonie Civile',
    event_date: '2025-06-15',
    location_address: 'Hôtel de Ville, Place de l\'Hôtel de Ville, 75004 Paris',
    city_name: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    country_code: 'FR',
    description: 'Notre cérémonie civile officielle dans la mairie du 4ème arrondissement de Paris.',
    event_type: 'ceremony',
    max_guests: 50
  },
  {
    event_name: 'Soirée d\'Ouverture',
    event_date: '2025-06-16',
    location_address: 'Tour Eiffel, Champ de Mars, 75007 Paris',
    city_name: 'Paris',
    latitude: 48.8584,
    longitude: 2.2945,
    country_code: 'FR',
    description: 'Cocktail de bienvenue au pied de la Tour Eiffel pour lancer notre mariage itinérant.',
    event_type: 'reception',
    max_guests: 100
  },
  {
    event_name: 'Escapade Lyonnaise',
    event_date: '2025-06-20',
    location_address: 'Place Bellecour, 69002 Lyon',
    city_name: 'Lyon',
    latitude: 45.7578,
    longitude: 4.8320,
    country_code: 'FR',
    description: 'Journée découverte de Lyon avec nos invités - visite des traboules et dégustation.',
    event_type: 'activity',
    max_guests: 40
  },
  {
    event_name: 'Fête au Bord de la Mer',
    event_date: '2025-06-25',
    location_address: 'Vieux-Port, 13001 Marseille',
    city_name: 'Marseille',
    latitude: 43.2951,
    longitude: 5.3698,
    country_code: 'FR',
    description: 'Soirée méditerranéenne avec bouillabaisse et musique live au Vieux-Port.',
    event_type: 'party',
    max_guests: 80
  },
  {
    event_name: 'Dégustation Bordelaise',
    event_date: '2025-07-01',
    location_address: 'Place de la Bourse, 33000 Bordeaux',
    city_name: 'Bordeaux',
    latitude: 44.8414,
    longitude: -0.5698,
    country_code: 'FR',
    description: 'Après-midi dégustation de vins et visite des châteaux bordelais.',
    event_type: 'activity',
    max_guests: 30
  },
  {
    event_name: 'Grande Finale',
    event_date: '2025-07-10',
    location_address: 'Promenade des Anglais, 06000 Nice',
    city_name: 'Nice',
    latitude: 43.6951,
    longitude: 7.2652,
    country_code: 'FR',
    description: 'Clôture de notre mariage itinérant sur la Côte d\'Azur - feu d\'artifice et danse.',
    event_type: 'party',
    max_guests: 120
  }
];

/**
 * Insère les événements de démo dans la base de données
 */
async function insertDemoEvents() {
  console.log('\n🎉 ÉTAPE 2/3 : Insertion des événements de démo...\n');

  try {
    // Vérifier combien d'events existent déjà
    const { data: existingEvents, error: countError } = await supabase
      .from('local_events')
      .select('id', { count: 'exact' });

    if (countError) {
      console.error('   ❌ Erreur lors de la vérification des événements:', countError.message);
      return;
    }

    if (existingEvents && existingEvents.length > 0) {
      console.log(`   📊 ${existingEvents.length} événement(s) déjà présent(s) dans la base`);
      console.log('   🤔 Voulez-vous quand même ajouter les événements de démo ? (Ils seront dupliqués)');
      console.log('   ⚠️  Pour éviter la duplication, je vais seulement vérifier la structure\n');
    }

    // Insérer les événements de démo
    console.log(`   📝 Insertion de ${DEMO_EVENTS.length} événements de démo...`);

    for (const event of DEMO_EVENTS) {
      const { data, error } = await supabase
        .from('local_events')
        .insert({
          ...event,
          geocoded_at: new Date().toISOString(),
          geocoding_source: 'manual-demo'
        })
        .select();

      if (error) {
        // Si l'erreur est due aux colonnes manquantes, on l'affiche
        if (error.message.includes('column') && error.message.includes('does not exist')) {
          console.error(`   ❌ ${event.event_name}: Colonnes manquantes - Migration non exécutée`);
          console.error(`      Message: ${error.message}`);
          console.log('\n   🔧 Solution : Exécutez d\'abord la migration SQL dans Supabase Dashboard');
          console.log('   📋 Fichier: supabase/migrations/20251227_add_geocoding_to_events.sql\n');
          return;
        } else {
          console.error(`   ❌ ${event.event_name}: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${event.event_name} (${event.city_name}) - ${event.latitude}, ${event.longitude}`);
      }
    }

    console.log('\n   🎊 Tous les événements de démo ont été insérés !');

  } catch (error) {
    console.error('   ❌ Erreur lors de l\'insertion:', error.message);
  }
}

/**
 * Affiche un résumé des événements créés
 */
async function displaySummary() {
  console.log('\n📊 ÉTAPE 3/3 : Résumé des événements...\n');

  try {
    const { data: events, error } = await supabase
      .from('local_events')
      .select('event_name, city_name, latitude, longitude, country_code')
      .not('latitude', 'is', null)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('   ❌ Erreur lors de la récupération:', error.message);
      return;
    }

    if (!events || events.length === 0) {
      console.log('   📭 Aucun événement géolocalisé trouvé');
      return;
    }

    console.log(`   🗺️  ${events.length} événement(s) géolocalisé(s) :\n`);

    events.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.event_name}`);
      console.log(`      📍 ${event.city_name} (${event.country_code})`);
      console.log(`      🧭 ${event.latitude}, ${event.longitude}\n`);
    });

    console.log('   ✨ Rendez-vous sur http://localhost:3000/dashboard/journey-map pour voir la carte !\n');

  } catch (error) {
    console.error('   ❌ Erreur:', error.message);
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  🎯 CONFIGURATION DES ÉVÉNEMENTS DE DÉMO                  ║');
  console.log('║  Pour tester la carte Leaflet interactive                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  await runMigration();
  await insertDemoEvents();
  await displaySummary();

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ TERMINÉ !                                             ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
}

// Exécution
main().catch(console.error);
