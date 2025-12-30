/**
 * Script automatique pour exécuter la migration SQL via connexion PostgreSQL directe
 *
 * Ce script se connecte directement à PostgreSQL Supabase et exécute la migration
 * sans passer par le dashboard manuel.
 *
 * Prérequis: Avoir le mot de passe de la base de données
 * (Disponible dans Supabase Dashboard > Settings > Database > Connection string)
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

require('dotenv').config({ path: '.env.local' });

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Extraire le project ref depuis l'URL Supabase
function getProjectRef() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env.local');
  }

  // Format: https://[PROJECT_REF].supabase.co
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    throw new Error('Format URL Supabase invalide');
  }

  return match[1];
}

// Demander le mot de passe de manière interactive
function askPassword() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    log('\n🔐 Mot de passe de la base de données requis', 'yellow');
    log('   Où le trouver :', 'cyan');
    log('   1. Ouvre https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl/settings/database', 'cyan');
    log('   2. Scroll jusqu\'à "Connection string"', 'cyan');
    log('   3. Clique sur "URI" puis copie le mot de passe\n', 'cyan');

    rl.question('Mot de passe PostgreSQL: ', (password) => {
      rl.close();
      resolve(password.trim());
    });
  });
}

// Vérifier si les colonnes existent déjà
async function checkColumnsExist(client) {
  const query = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'local_events'
    AND column_name IN ('latitude', 'longitude', 'country_code', 'geocoded_at', 'geocoding_source')
    ORDER BY column_name;
  `;

  const result = await client.query(query);
  return result.rows;
}

// Exécuter la migration
async function runMigration(client, migrationSQL) {
  log('\n🚀 Exécution de la migration SQL...', 'blue');

  try {
    // Supprimer les commentaires de style -- pour éviter les problèmes
    const cleanSQL = migrationSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    await client.query(cleanSQL);

    log('✅ Migration exécutée avec succès !', 'green');
    return true;
  } catch (error) {
    // Si l'erreur est "column already exists", c'est OK
    if (error.message.includes('already exists')) {
      log('⚠️  Les colonnes existent déjà (migration déjà exécutée)', 'yellow');
      return true;
    }

    throw error;
  }
}

// Vérifier le résultat
async function verifyMigration(client) {
  log('\n🔍 Vérification de la migration...', 'blue');

  const columns = await checkColumnsExist(client);

  if (columns.length === 5) {
    log('✅ Toutes les colonnes ont été créées avec succès :', 'green');
    columns.forEach(col => {
      log(`   ✓ ${col.column_name}`, 'green');
    });
    return true;
  } else {
    log(`⚠️  Seulement ${columns.length}/5 colonnes trouvées`, 'yellow');
    return false;
  }
}

// Fonction principale
async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  🗺️  MIGRATION AUTOMATIQUE - Colonnes de Géocodage       ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  try {
    // 1. Lire le fichier de migration
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251227_add_geocoding_to_events.sql');

    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Fichier migration introuvable: ${migrationPath}`);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    log('✅ Fichier de migration chargé', 'green');
    log(`   ${migrationPath}\n`, 'cyan');

    // 2. Récupérer le project ref
    const projectRef = getProjectRef();
    log(`✅ Project Ref: ${projectRef}`, 'green');

    // 3. Vérifier si le mot de passe est dans les env
    let dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.DATABASE_PASSWORD;

    if (!dbPassword) {
      dbPassword = await askPassword();

      if (!dbPassword) {
        throw new Error('Mot de passe requis pour se connecter à PostgreSQL');
      }
    }

    // 4. Construire la connection string
    const connectionString = `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;

    log('\n📡 Connexion à PostgreSQL...', 'blue');

    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    log('✅ Connecté à la base de données !', 'green');

    // 5. Vérifier si les colonnes existent déjà
    const existingColumns = await checkColumnsExist(client);

    if (existingColumns.length === 5) {
      log('\n⚠️  Les colonnes existent déjà !', 'yellow');
      log('   La migration a probablement déjà été exécutée.', 'yellow');
      log('\n💡 Tu peux maintenant insérer les événements de démo :', 'cyan');
      log('   node scripts/insert-demo-events-simple.js\n', 'cyan');
      await client.end();
      return;
    }

    if (existingColumns.length > 0) {
      log(`\n⚠️  Certaines colonnes existent déjà (${existingColumns.length}/5)`, 'yellow');
      log('   La migration va ajouter les colonnes manquantes.\n', 'yellow');
    }

    // 6. Exécuter la migration
    await runMigration(client, migrationSQL);

    // 7. Vérifier le résultat
    const success = await verifyMigration(client);

    // 8. Fermer la connexion
    await client.end();
    log('\n📡 Connexion fermée', 'blue');

    if (success) {
      log('\n╔════════════════════════════════════════════════════════════╗', 'green');
      log('║  ✅ MIGRATION RÉUSSIE !                                   ║', 'green');
      log('╚════════════════════════════════════════════════════════════╝\n', 'green');

      log('🎉 Prochaines étapes :\n', 'cyan');
      log('1️⃣  Insérer les événements de démo :', 'cyan');
      log('   node scripts/insert-demo-events-simple.js\n', 'cyan');
      log('2️⃣  Tester la carte interactive :', 'cyan');
      log('   http://localhost:3000/dashboard/journey-map\n', 'cyan');
      log('3️⃣  Créer un nouvel événement :', 'cyan');
      log('   http://localhost:3000/dashboard/create-event\n', 'cyan');
    }

  } catch (error) {
    log('\n╔════════════════════════════════════════════════════════════╗', 'red');
    log('║  ❌ ERREUR                                                 ║', 'red');
    log('╚════════════════════════════════════════════════════════════╝\n', 'red');

    log(`Erreur: ${error.message}`, 'red');

    if (error.code === 'ECONNREFUSED') {
      log('\n💡 Conseil : Vérifie que :', 'yellow');
      log('   - Tu es bien connecté à Internet', 'yellow');
      log('   - Le mot de passe est correct', 'yellow');
      log('   - Le project ref est correct\n', 'yellow');
    } else if (error.code === '28P01') {
      log('\n💡 Mot de passe incorrect !', 'yellow');
      log('   Récupère le bon mot de passe depuis :', 'yellow');
      log('   https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl/settings/database\n', 'yellow');
    } else if (error.message.includes('column')) {
      log('\n💡 Problème avec les colonnes :', 'yellow');
      log('   Tu peux essayer d\'exécuter la migration manuellement via le Dashboard\n', 'yellow');
    }

    process.exit(1);
  }
}

// Exécution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
