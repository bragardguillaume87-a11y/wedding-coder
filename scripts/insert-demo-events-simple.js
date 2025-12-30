/**
 * Script simplifié pour insérer les événements de démo
 * Version sans vérification de migration - plus direct
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Erreur : Variables d\'environnement manquantes !');
  console.error('   Ajoute SUPABASE_SERVICE_ROLE_KEY dans .env.local\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 6 événements de démo avec vraies coordonnées GPS
const DEMO_EVENTS = [
  {
    event_name: 'Cérémonie Civile 💍',
    event_date: '2025-06-15',
    location_address: 'Hôtel de Ville, Place de l\'Hôtel de Ville, 75004 Paris',
    city_name: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    country_code: 'FR',
    description: 'Notre cérémonie civile officielle dans la mairie du 4ème arrondissement de Paris.',
  },
  {
    event_name: 'Soirée d\'Ouverture 🥂',
    event_date: '2025-06-16',
    location_address: 'Tour Eiffel, Champ de Mars, 75007 Paris',
    city_name: 'Paris',
    latitude: 48.8584,
    longitude: 2.2945,
    country_code: 'FR',
    description: 'Cocktail de bienvenue au pied de la Tour Eiffel pour lancer notre mariage itinérant.',
  },
  {
    event_name: 'Escapade Lyonnaise 🍷',
    event_date: '2025-06-20',
    location_address: 'Place Bellecour, 69002 Lyon',
    city_name: 'Lyon',
    latitude: 45.7578,
    longitude: 4.8320,
    country_code: 'FR',
    description: 'Journée découverte de Lyon avec nos invités - visite des traboules et dégustation.',
  },
  {
    event_name: 'Fête au Bord de la Mer 🌊',
    event_date: '2025-06-25',
    location_address: 'Vieux-Port, 13001 Marseille',
    city_name: 'Marseille',
    latitude: 43.2951,
    longitude: 5.3698,
    country_code: 'FR',
    description: 'Soirée méditerranéenne avec bouillabaisse et musique live au Vieux-Port.',
  },
  {
    event_name: 'Dégustation Bordelaise 🍇',
    event_date: '2025-07-01',
    location_address: 'Place de la Bourse, 33000 Bordeaux',
    city_name: 'Bordeaux',
    latitude: 44.8414,
    longitude: -0.5698,
    country_code: 'FR',
    description: 'Après-midi dégustation de vins et visite des châteaux bordelais.',
  },
  {
    event_name: 'Grande Finale 🎆',
    event_date: '2025-07-10',
    location_address: 'Promenade des Anglais, 06000 Nice',
    city_name: 'Nice',
    latitude: 43.6951,
    longitude: 7.2652,
    country_code: 'FR',
    description: 'Clôture de notre mariage itinérant sur la Côte d\'Azur - feu d\'artifice et danse.',
  }
];

async function main() {
  console.log('\n🎉 Insertion des événements de démo...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const event of DEMO_EVENTS) {
    try {
      const { data, error } = await supabase
        .from('local_events')
        .insert({
          ...event,
          geocoded_at: new Date().toISOString(),
          geocoding_source: 'manual-demo'
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ ${event.event_name}: ${error.message}`);

        if (error.message.includes('column') && error.message.includes('does not exist')) {
          console.log('\n⚠️  Les colonnes de géocodage n\'existent pas encore !');
          console.log('📋 Tu dois d\'abord exécuter la migration SQL :');
          console.log('   1. Ouvre https://supabase.com/dashboard');
          console.log('   2. Va dans SQL Editor');
          console.log('   3. Copie-colle le contenu de :');
          console.log('      supabase/migrations/20251227_add_geocoding_to_events.sql\n');
          process.exit(1);
        }

        errorCount++;
      } else {
        console.log(`✅ ${event.event_name} (${event.city_name})`);
        console.log(`   📍 ${event.latitude}, ${event.longitude}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Erreur inattendue pour ${event.event_name}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Résumé : ${successCount} succès, ${errorCount} erreurs`);

  if (successCount > 0) {
    console.log('\n✨ Rendez-vous sur http://localhost:3000/dashboard/journey-map');
    console.log('   pour voir la carte interactive !\n');
  }
}

main().catch(console.error);
