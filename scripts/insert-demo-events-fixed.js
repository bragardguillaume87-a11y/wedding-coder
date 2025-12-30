/**
 * Script CORRIGÉ pour insérer les événements de démo
 *
 * CORRECTION : Crée d'abord une cérémonie, puis attache les événements
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Erreur : Variables d\'environnement manquantes !');
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
  console.log('\n🎉 Insertion des événements de démo (VERSION CORRIGÉE)...\n');

  try {
    // ÉTAPE 1 : Créer ou récupérer une cérémonie
    console.log('📝 Étape 1 : Vérification de la cérémonie...');

    // Vérifier s'il existe déjà une cérémonie
    const { data: existingCeremonies, error: fetchError } = await supabase
      .from('ceremonies')
      .select('id, ceremony_name')
      .limit(1);

    let ceremonyId;

    if (fetchError) {
      console.error(`❌ Erreur lors de la récupération des cérémonies: ${fetchError.message}`);

      // Si la table ceremonies n'existe pas, on essaie sans ceremony_id
      console.log('\n⚠️  La table "ceremonies" n\'existe peut-être pas.');
      console.log('💡 Essai d\'insertion des événements sans ceremony_id...\n');

      ceremonyId = null; // On va essayer sans
    } else if (existingCeremonies && existingCeremonies.length > 0) {
      // Utiliser la cérémonie existante
      ceremonyId = existingCeremonies[0].id;
      console.log(`✅ Cérémonie existante trouvée : "${existingCeremonies[0].ceremony_name}" (ID: ${ceremonyId})\n`);
    } else {
      // Créer une nouvelle cérémonie
      console.log('📋 Aucune cérémonie trouvée. Création d\'une cérémonie de démo...');

      const { data: newCeremony, error: ceremonyError } = await supabase
        .from('ceremonies')
        .insert({
          ceremony_name: 'Mariage Itinérant - Démo',
          ceremony_date: '2025-06-15',
          description: 'Cérémonie de démonstration pour tester la carte interactive',
        })
        .select()
        .single();

      if (ceremonyError) {
        console.error(`❌ Erreur lors de la création de la cérémonie: ${ceremonyError.message}`);
        console.log('\n💡 Essai d\'insertion des événements sans ceremony_id...\n');
        ceremonyId = null;
      } else {
        ceremonyId = newCeremony.id;
        console.log(`✅ Cérémonie créée : "${newCeremony.ceremony_name}" (ID: ${ceremonyId})\n`);
      }
    }

    // ÉTAPE 2 : Insérer les événements
    console.log('🎯 Étape 2 : Insertion des événements...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const event of DEMO_EVENTS) {
      try {
        const eventData = {
          ...event,
          geocoded_at: new Date().toISOString(),
          geocoding_source: 'manual-demo',
          created_by: null // Pas de créateur pour les événements de démo
        };

        // Ajouter ceremony_id seulement si on en a un
        if (ceremonyId !== null) {
          eventData.ceremony_id = ceremonyId;
        }

        const { data, error } = await supabase
          .from('local_events')
          .insert(eventData)
          .select()
          .single();

        if (error) {
          console.error(`❌ ${event.event_name}: ${error.message}`);
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
    } else {
      console.log('\n⚠️  Aucun événement n\'a été créé.');
      console.log('💡 Vérifie les erreurs ci-dessus pour plus de détails.\n');
    }

  } catch (error) {
    console.error('\n❌ Erreur fatale:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
