/**
 * 🚀 SETUP COMPLET ONE-CLICK
 *
 * Ce script exécute toutes les étapes nécessaires automatiquement:
 * 1. Diagnostic complet du système
 * 2. Migration SQL (si nécessaire)
 * 3. Insertion des événements de démo
 * 4. Vérification finale
 *
 * Usage: node scripts/setup-all.js
 */

const { execSync } = require('child_process');
const readline = require('readline');

// Couleurs
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
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
      resolve(answer.trim().toLowerCase());
    });
  });
}

function runCommand(command, description) {
  log(`\n🔄 ${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} - Terminé\n`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} - Erreur\n`, 'red');
    return false;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'magenta');
  log('║  🚀 SETUP COMPLET AUTOMATIQUE                             ║', 'magenta');
  log('║  Configuration de la carte interactive en 1 clic          ║', 'magenta');
  log('╚════════════════════════════════════════════════════════════╝\n', 'magenta');

  log('Ce script va:', 'cyan');
  log('  1️⃣  Diagnostiquer le système', 'cyan');
  log('  2️⃣  Exécuter la migration SQL (si nécessaire)', 'cyan');
  log('  3️⃣  Insérer 6 événements de démo', 'cyan');
  log('  4️⃣  Vérifier que tout fonctionne\n', 'cyan');

  const answer = await askQuestion('Continuer? (y/n): ');

  if (answer !== 'y' && answer !== 'yes' && answer !== 'o' && answer !== 'oui') {
    log('\n❌ Annulé par l\'utilisateur', 'yellow');
    process.exit(0);
  }

  // Étape 1: Diagnostic
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║  ÉTAPE 1/4: DIAGNOSTIC                                     ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  runCommand('node scripts/diagnose-system.js', 'Diagnostic du système');

  log('\n💡 Vérifier le rapport ci-dessus', 'yellow');
  const continueAfterDiag = await askQuestion('\nContinuer avec la migration? (y/n): ');

  if (continueAfterDiag !== 'y' && continueAfterDiag !== 'yes' && continueAfterDiag !== 'o' && continueAfterDiag !== 'oui') {
    log('\n⏸️  Processus interrompu', 'yellow');
    log('Tu peux relancer ce script plus tard: node scripts/setup-all.js\n', 'cyan');
    process.exit(0);
  }

  // Étape 2: Migration
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║  ÉTAPE 2/4: MIGRATION SQL                                  ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  log('\n🔧 Choix de la méthode de migration:', 'cyan');
  log('  A. Automatique (via PostgreSQL) - Nécessite le mot de passe DB', 'cyan');
  log('  B. Manuel (via Supabase Dashboard) - Tu le fais à la main', 'cyan');
  log('  S. Skip (Déjà fait)\n', 'cyan');

  const migrationChoice = await askQuestion('Choix (a/b/s): ');

  if (migrationChoice === 'a') {
    const success = runCommand('node scripts/run-migration-postgres.js', 'Migration automatique PostgreSQL');

    if (!success) {
      log('\n⚠️  La migration automatique a échoué', 'yellow');
      log('💡 Essaie la méthode manuelle:', 'cyan');
      log('   1. Ouvre: https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl/sql/new', 'cyan');
      log('   2. Copie le contenu de: supabase/migrations/20251227_add_geocoding_to_events.sql', 'cyan');
      log('   3. Colle et clique sur "Run"\n', 'cyan');

      const continueAnyway = await askQuestion('Migration faite manuellement? (y/n): ');

      if (continueAnyway !== 'y' && continueAnyway !== 'yes' && continueAnyway !== 'o' && continueAnyway !== 'oui') {
        log('\n⏸️  Processus interrompu', 'yellow');
        process.exit(0);
      }
    }
  } else if (migrationChoice === 'b') {
    log('\n📋 Instructions manuelles:', 'cyan');
    log('   1. Ouvre: https://supabase.com/dashboard/project/ijgwrkfvfoqllbxdjntl/sql/new', 'cyan');
    log('   2. Ouvre le fichier: supabase/migrations/20251227_add_geocoding_to_events.sql', 'cyan');
    log('   3. Copie TOUT le contenu (Ctrl+A puis Ctrl+C)', 'cyan');
    log('   4. Colle dans le SQL Editor de Supabase', 'cyan');
    log('   5. Clique sur "Run" (ou Ctrl+Enter)', 'cyan');
    log('   6. Si tu vois "Success. No rows returned" → C\'est bon !\n', 'cyan');

    await askQuestion('Appuie sur Entrée quand c\'est fait...');
  } else if (migrationChoice === 's') {
    log('✅ Migration skippée (déjà faite)', 'green');
  } else {
    log('\n❌ Choix invalide. Processus annulé.', 'red');
    process.exit(1);
  }

  // Étape 3: Événements de démo
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║  ÉTAPE 3/4: ÉVÉNEMENTS DE DÉMO                             ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  const insertDemo = await askQuestion('\nInsérer 6 événements de démo? (y/n): ');

  if (insertDemo === 'y' || insertDemo === 'yes' || insertDemo === 'o' || insertDemo === 'oui') {
    runCommand('node scripts/insert-demo-events-simple.js', 'Insertion des événements de démo');
  } else {
    log('⏭️  Événements de démo skippés', 'yellow');
  }

  // Étape 4: Vérification finale
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║  ÉTAPE 4/4: VÉRIFICATION FINALE                            ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  runCommand('node scripts/diagnose-system.js', 'Diagnostic final');

  // Résumé final
  log('\n╔════════════════════════════════════════════════════════════╗', 'green');
  log('║  ✅ SETUP TERMINÉ !                                       ║', 'green');
  log('╚════════════════════════════════════════════════════════════╝\n', 'green');

  log('🎉 La carte interactive est prête !', 'green');
  log('\n🚀 Prochaines étapes:\n', 'cyan');
  log('1. Ouvre la carte:', 'cyan');
  log('   http://localhost:3000/dashboard/journey-map\n', 'cyan');
  log('2. Crée un nouvel événement:', 'cyan');
  log('   http://localhost:3000/dashboard/create-event\n', 'cyan');
  log('3. Test le géocodage automatique:', 'cyan');
  log('   Remplis le champ adresse et clique ailleurs\n', 'cyan');

  log('📚 Documentation complète:', 'cyan');
  log('   Lis SOLUTIONS_COMPLETES.md pour toutes les infos\n', 'cyan');

  log('🧩 Extensions VS Code recommandées:', 'cyan');
  log('   - Continue.dev (gratuit, IA local)', 'cyan');
  log('   - Codeium (gratuit, autocomplétion)', 'cyan');
  log('   - Thunder Client (tests API)\n', 'cyan');
}

main().catch((error) => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
});
