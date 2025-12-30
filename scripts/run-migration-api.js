/**
 * 🚀 Migration SQL via Supabase Management API
 *
 * Utilise l'API Management de Supabase pour exécuter la migration programmatiquement
 * Endpoint: POST /v1/projects/{ref}/database/migrations
 *
 * Documentation:
 * https://supabase.com/docs/reference/api/run-sql-query
 * https://supabase.com/blog/supabase-cli-v1-and-admin-api-beta
 *
 * Note: Cet endpoint nécessite un access token Management API
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

require('dotenv').config({ path: '.env.local' });

// Couleurs
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

function askQuestion(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Extraire le project ref depuis l'URL Supabase
function getProjectRef() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env.local');
  }

  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    throw new Error('Format URL Supabase invalide');
  }

  return match[1];
}

async function runMigrationViaAPI(projectRef, accessToken, migrationSQL) {
  const url = `https://api.supabase.com/v1/projects/${projectRef}/database/migrations`;

  log('\n📡 Envoi de la requête à l\'API Management...', 'blue');
  log(`   URL: ${url}`, 'cyan');

  // Nettoyer le SQL (enlever les commentaires -- qui peuvent poser problème)
  const cleanSQL = migrationSQL
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('--');
    })
    .join('\n');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: cleanSQL,
      }),
    });

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { raw: responseText };
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('❌ Token invalide ou expiré');
      } else if (response.status === 403) {
        throw new Error('❌ Accès refusé - Cet endpoint nécessite un accès spécial');
      } else if (response.status === 404) {
        throw new Error('❌ Projet introuvable ou endpoint non disponible');
      } else {
        throw new Error(`❌ Erreur HTTP ${response.status}: ${JSON.stringify(data)}`);
      }
    }

    return { success: true, data };
  } catch (error) {
    throw error;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  🚀 MIGRATION VIA SUPABASE MANAGEMENT API                 ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  try {
    // 1. Récupérer le project ref
    const projectRef = getProjectRef();
    log(`✅ Project Ref: ${projectRef}`, 'green');

    // 2. Lire le fichier de migration
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251227_add_geocoding_to_events.sql');

    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Fichier migration introuvable: ${migrationPath}`);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    log('✅ Fichier de migration chargé', 'green');

    // 3. Demander l'access token Management API
    log('\n🔑 Access Token Management API requis', 'yellow');
    log('   Où le trouver :', 'cyan');
    log('   1. Ouvre https://supabase.com/dashboard/account/tokens', 'cyan');
    log('   2. Clique sur "Generate new token"', 'cyan');
    log('   3. Donne un nom (ex: "Migration Script")', 'cyan');
    log('   4. Copie le token généré\n', 'cyan');

    log('   ⚠️  Note: Cet endpoint nécessite un accès spécial', 'yellow');
    log('   Si tu n\'as pas accès, utilise plutôt:', 'yellow');
    log('   - node scripts/run-migration-postgres.js (avec mot de passe DB)', 'yellow');
    log('   - OU copier-coller dans Supabase Dashboard SQL Editor\n', 'yellow');

    const accessToken = await askQuestion('Access Token Management API (ou "skip" pour annuler): ');

    if (!accessToken || accessToken.toLowerCase() === 'skip') {
      log('\n⏸️  Migration annulée', 'yellow');
      log('\n💡 Alternatives:', 'cyan');
      log('   1. Migration automatique PostgreSQL:', 'cyan');
      log('      node scripts/run-migration-postgres.js', 'cyan');
      log('   2. Migration manuelle Dashboard:', 'cyan');
      log('      https://supabase.com/dashboard/project/' + projectRef + '/sql/new\n', 'cyan');
      process.exit(0);
    }

    // 4. Exécuter la migration via l'API
    const result = await runMigrationViaAPI(projectRef, accessToken, migrationSQL);

    log('\n✅ Migration exécutée avec succès !', 'green');
    log(`   Résultat: ${JSON.stringify(result.data, null, 2)}`, 'cyan');

    log('\n╔════════════════════════════════════════════════════════════╗', 'green');
    log('║  ✅ MIGRATION RÉUSSIE !                                   ║', 'green');
    log('╚════════════════════════════════════════════════════════════╝\n', 'green');

    log('🎉 Prochaines étapes :\n', 'cyan');
    log('1️⃣  Insérer les événements de démo :', 'cyan');
    log('   node scripts/insert-demo-events-simple.js\n', 'cyan');
    log('2️⃣  Tester la carte interactive :', 'cyan');
    log('   http://localhost:3000/dashboard/journey-map\n', 'cyan');

  } catch (error) {
    log('\n╔════════════════════════════════════════════════════════════╗', 'red');
    log('║  ❌ ERREUR                                                 ║', 'red');
    log('╚════════════════════════════════════════════════════════════╝\n', 'red');

    log(`Erreur: ${error.message}`, 'red');

    if (error.message.includes('Accès refusé') || error.message.includes('403')) {
      log('\n💡 Cet endpoint Management API nécessite un accès spécial', 'yellow');
      log('   Seuls certains clients Supabase y ont accès', 'yellow');
      log('\n📋 Solutions alternatives:\n', 'cyan');

      log('   Option A - Migration PostgreSQL (automatique):', 'cyan');
      log('   node scripts/run-migration-postgres.js', 'cyan');
      log('   Nécessite: Mot de passe DB (trouvable dans Dashboard > Database Settings)\n', 'cyan');

      log('   Option B - Dashboard manuel:', 'cyan');
      log('   1. Ouvre: https://supabase.com/dashboard/project/' + getProjectRef() + '/sql/new', 'cyan');
      log('   2. Copie le contenu de: supabase/migrations/20251227_add_geocoding_to_events.sql', 'cyan');
      log('   3. Colle et clique sur "Run"\n', 'cyan');

      log('   Option C - Supabase CLI (si installé):', 'cyan');
      log('   supabase db push\n', 'cyan');
    } else if (error.message.includes('Token invalide')) {
      log('\n💡 Le token Management API est invalide ou expiré', 'yellow');
      log('   Génère un nouveau token ici:', 'cyan');
      log('   https://supabase.com/dashboard/account/tokens\n', 'cyan');
    }

    process.exit(1);
  }
}

main().catch(console.error);
