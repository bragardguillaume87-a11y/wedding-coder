/**
 * 🚀 SCRIPT ULTRA-COMPLET
 *
 * Diagnostic automatique + Corrections + Insertion
 * Gère TOUS les cas possibles
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${c[color]}${message}${c.reset}`);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  log('\n❌ Variables d\'environnement manquantes !', 'red');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

async function checkAndCreateCeremony() {
  log('\n📝 ÉTAPE 1 : Vérification de la table ceremonies...', 'blue');

  // Essayer de lire la table ceremonies
  const { data: existingCeremonies, error: fetchError } = await supabase
    .from('ceremonies')
    .select('*')
    .limit(1);

  if (fetchError) {
    if (fetchError.message.includes('relation') && fetchError.message.includes('does not exist')) {
      log('❌ La table "ceremonies" n\'existe pas !', 'red');
      log('\n💡 SOLUTION :', 'yellow');
      log('   Tu dois exécuter la migration SQL pour créer cette table.', 'yellow');
      log('   1. Ouvre : https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl/sql/new', 'cyan');
      log('   2. Copie le contenu de : supabase/migrations/20251230_create_ceremonies_table.sql', 'cyan');
      log('   3. Colle et clique sur "Run"\n', 'cyan');
      return null;
    }
    log(`❌ Erreur inattendue: ${fetchError.message}`, 'red');
    return null;
  }

  if (existingCeremonies && existingCeremonies.length > 0) {
    log(`✅ Cérémonie existante trouvée : "${existingCeremonies[0].ceremony_name}" (ID: ${existingCeremonies[0].id})`, 'green');
    return existingCeremonies[0].id;
  }

  // Créer une cérémonie
  log('📋 Aucune cérémonie trouvée. Création...', 'yellow');

  const { data: newCeremony, error: createError } = await supabase
    .from('ceremonies')
    .insert({
      ceremony_name: 'Notre Mariage Itinérant',
      ceremony_date: '2025-06-15',
      description: 'Un mariage unique à travers la France',
    })
    .select()
    .single();

  if (createError) {
    log(`❌ Impossible de créer la cérémonie: ${createError.message}`, 'red');
    return null;
  }

  log(`✅ Cérémonie créée : "${newCeremony.ceremony_name}" (ID: ${newCeremony.id})`, 'green');
  return newCeremony.id;
}

async function insertEvents(ceremonyId) {
  log('\n🎯 ÉTAPE 2 : Insertion des événements de démo...', 'blue');

  if (!ceremonyId) {
    log('\n⚠️  Aucun ceremony_id disponible.', 'yellow');
    log('   Essai d\'insertion sans ceremony_id (peut échouer)...', 'yellow');
  }

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const event of DEMO_EVENTS) {
    try {
      const eventData = {
        ...event,
        geocoded_at: new Date().toISOString(),
        geocoding_source: 'manual-demo',
      };

      // Ajouter ceremony_id si disponible
      if (ceremonyId) {
        eventData.ceremony_id = ceremonyId;
      }

      const { data, error } = await supabase
        .from('local_events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        errorCount++;
        errors.push({ event: event.event_name, error: error.message });
        log(`❌ ${event.event_name}: ${error.message}`, 'red');
      } else {
        successCount++;
        log(`✅ ${event.event_name} (${event.city_name})`, 'green');
        log(`   📍 ${event.latitude}, ${event.longitude}`, 'cyan');
      }
    } catch (err) {
      errorCount++;
      errors.push({ event: event.event_name, error: err.message });
      log(`❌ ${event.event_name}: ${err.message}`, 'red');
    }
  }

  log(`\n📊 Résumé : ${successCount} succès, ${errorCount} erreurs`, successCount > 0 ? 'green' : 'red');

  // Analyser les erreurs
  if (errorCount > 0) {
    log('\n🔍 ANALYSE DES ERREURS :', 'yellow');

    const errorTypes = {};
    errors.forEach(({ error }) => {
      if (error.includes('foreign key constraint')) {
        errorTypes.foreignKey = true;
      }
      if (error.includes('not-null constraint') && error.includes('created_by')) {
        errorTypes.createdBy = true;
      }
      if (error.includes('not-null constraint') && error.includes('ceremony_id')) {
        errorTypes.ceremonyId = true;
      }
    });

    if (errorTypes.foreignKey) {
      log('\n❌ Problème : Foreign Key Constraint', 'red');
      log('💡 SOLUTION :', 'yellow');
      log('   La cérémonie ID ' + ceremonyId + ' n\'existe pas ou n\'est pas valide.', 'yellow');
      log('   Exécute ce SQL dans Supabase Dashboard :', 'cyan');
      log('', 'cyan');
      log('   SELECT * FROM ceremonies;', 'cyan');
      log('', 'cyan');
      log('   Pour voir les cérémonies existantes.', 'cyan');
    }

    if (errorTypes.createdBy) {
      log('\n❌ Problème : created_by NOT NULL', 'red');
      log('💡 SOLUTION :', 'yellow');
      log('   Exécute ce SQL dans Supabase Dashboard :', 'cyan');
      log('', 'cyan');
      log('   ALTER TABLE public.local_events', 'cyan');
      log('   ALTER COLUMN created_by DROP NOT NULL;', 'cyan');
      log('', 'cyan');
    }

    if (errorTypes.ceremonyId) {
      log('\n❌ Problème : ceremony_id NOT NULL mais aucune cérémonie', 'red');
      log('💡 SOLUTION :', 'yellow');
      log('   Crée d\'abord la table ceremonies avec la migration SQL.', 'yellow');
    }
  }

  return { successCount, errorCount, errors };
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  🚀 SETUP COMPLET AUTOMATIQUE                             ║', 'cyan');
  log('║  Diagnostic + Corrections + Insertion                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  try {
    const ceremonyId = await checkAndCreateCeremony();

    if (ceremonyId === null) {
      log('\n⚠️  Impossible de continuer sans cérémonie.', 'yellow');
      log('   Suis les instructions ci-dessus pour créer la table ceremonies.\n', 'yellow');
      process.exit(1);
    }

    const { successCount, errorCount } = await insertEvents(ceremonyId);

    if (successCount > 0) {
      log('\n╔════════════════════════════════════════════════════════════╗', 'green');
      log('║  ✅ SUCCÈS !                                              ║', 'green');
      log('╚════════════════════════════════════════════════════════════╝', 'green');

      log(`\n🎉 ${successCount} événement(s) créé(s) avec succès !`, 'green');
      log('\n🗺️  Ouvre la carte interactive :', 'cyan');
      log('   http://localhost:3000/dashboard/journey-map\n', 'cyan');
    }

    if (errorCount > 0) {
      log('\n⚠️  Certains événements n\'ont pas pu être créés.', 'yellow');
      log('   Suis les solutions ci-dessus pour corriger.\n', 'yellow');
    }

  } catch (error) {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red');
    process.exit(1);
  }
}

main().catch(console.error);
