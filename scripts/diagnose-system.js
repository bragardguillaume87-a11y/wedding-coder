/**
 * Script de diagnostic complet du système
 *
 * Vérifie tous les aspects de l'application pour anticiper les problèmes:
 * - Dépendances installées
 * - Variables d'environnement
 * - Structure de la base de données
 * - Fichiers requis
 * - Configuration Next.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

require('dotenv').config({ path: '.env.local' });

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

const issues = [];
const warnings = [];
const successes = [];

function log(message, color = 'reset') {
  console.log(`${c[color]}${message}${c.reset}`);
}

function addIssue(category, message, fix) {
  issues.push({ category, message, fix });
}

function addWarning(category, message) {
  warnings.push({ category, message });
}

function addSuccess(category, message) {
  successes.push({ category, message });
}

// 1. Vérifier les variables d'environnement
function checkEnvironment() {
  log('\n🔍 1. Vérification des variables d\'environnement...', 'blue');

  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const optional = [
    'SUPABASE_DB_PASSWORD',
    'DATABASE_PASSWORD',
  ];

  required.forEach(varName => {
    if (process.env[varName]) {
      addSuccess('ENV', `${varName} ✓`);
    } else {
      addIssue('ENV', `${varName} manquant`, 'Ajoute cette variable dans .env.local');
    }
  });

  optional.forEach(varName => {
    if (!process.env[varName]) {
      addWarning('ENV', `${varName} absent (optionnel pour migration auto)`);
    }
  });
}

// 2. Vérifier les dépendances npm
function checkDependencies() {
  log('\n🔍 2. Vérification des dépendances npm...', 'blue');

  const packageJsonPath = path.join(__dirname, '..', 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    addIssue('NPM', 'package.json introuvable', 'Vérifie que tu es dans le bon dossier');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const required = [
    'leaflet',
    'react-leaflet',
    '@types/leaflet',
    'framer-motion',
    '@supabase/supabase-js',
    'dotenv',
  ];

  const recommended = ['pg', 'prettier', 'eslint'];

  required.forEach(dep => {
    if (allDeps[dep]) {
      addSuccess('NPM', `${dep} v${allDeps[dep]} ✓`);
    } else {
      addIssue('NPM', `${dep} non installé`, `npm install ${dep}`);
    }
  });

  recommended.forEach(dep => {
    if (!allDeps[dep]) {
      addWarning('NPM', `${dep} non installé (recommandé)`);
    }
  });
}

// 3. Vérifier les fichiers requis
function checkFiles() {
  log('\n🔍 3. Vérification des fichiers requis...', 'blue');

  const requiredFiles = [
    'lib/geocoding.ts',
    'lib/mapHelpers.ts',
    'components/map/BaseMap.tsx',
    'components/map/GamingMarker.tsx',
    'components/map/JourneyPath.tsx',
    'app/dashboard/journey-map/page.tsx',
    'supabase/migrations/20251227_add_geocoding_to_events.sql',
  ];

  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      addSuccess('FILES', `${file} ✓`);
    } else {
      addIssue('FILES', `${file} manquant`, 'Crée ce fichier selon la documentation');
    }
  });
}

// 4. Vérifier la connexion Supabase
async function checkSupabase() {
  log('\n🔍 4. Vérification de la connexion Supabase...', 'blue');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      addIssue('SUPABASE', 'Credentials manquants', 'Vérifie .env.local');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test de connexion basique
    const { data, error } = await supabase.from('local_events').select('id').limit(0);

    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        addIssue('SUPABASE', 'Table local_events inexistante', 'Crée la table dans Supabase Dashboard');
      } else {
        addWarning('SUPABASE', `Erreur connexion: ${error.message}`);
      }
    } else {
      addSuccess('SUPABASE', 'Connexion réussie ✓');
    }
  } catch (error) {
    addIssue('SUPABASE', `Erreur: ${error.message}`, 'Vérifie les credentials Supabase');
  }
}

// 5. Vérifier la structure de la table
async function checkTableStructure() {
  log('\n🔍 5. Vérification de la structure de la table local_events...', 'blue');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      addWarning('TABLE', 'Impossible de vérifier (credentials manquants)');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Tester si les colonnes de géocodage existent
    const { data, error } = await supabase
      .from('local_events')
      .select('id, latitude, longitude, country_code')
      .limit(0);

    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        addIssue(
          'TABLE',
          'Colonnes de géocodage manquantes (latitude, longitude, etc.)',
          'Exécute: node scripts/run-migration-postgres.js'
        );
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        addIssue('TABLE', 'Table local_events inexistante', 'Crée la table dans Supabase Dashboard');
      } else {
        addWarning('TABLE', `Erreur: ${error.message}`);
      }
    } else {
      addSuccess('TABLE', 'Colonnes de géocodage présentes ✓');
    }
  } catch (error) {
    addWarning('TABLE', `Impossible de vérifier: ${error.message}`);
  }
}

// 6. Vérifier la configuration Next.js
function checkNextConfig() {
  log('\n🔍 6. Vérification de la configuration Next.js...', 'blue');

  const configPath = path.join(__dirname, '..', 'next.config.ts');

  if (!fs.existsSync(configPath)) {
    addWarning('NEXT', 'next.config.ts introuvable');
    return;
  }

  const config = fs.readFileSync(configPath, 'utf8');

  if (config.includes('turbopack: undefined') || config.includes('--webpack')) {
    addSuccess('NEXT', 'Webpack activé (pas de Turbopack) ✓');
  } else if (config.includes('turbopack')) {
    addWarning('NEXT', 'Turbopack activé (peut causer fuites mémoire)');
  }

  if (config.includes('webpackMemoryOptimizations: true')) {
    addSuccess('NEXT', 'Optimisations mémoire activées ✓');
  }
}

// 7. Vérifier les CSS Leaflet
function checkLeafletCSS() {
  log('\n🔍 7. Vérification de l\'import CSS Leaflet...', 'blue');

  const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx');

  if (!fs.existsSync(layoutPath)) {
    addWarning('CSS', 'app/layout.tsx introuvable');
    return;
  }

  const layout = fs.readFileSync(layoutPath, 'utf8');

  if (layout.includes("import 'leaflet/dist/leaflet.css'") || layout.includes('leaflet.css')) {
    addSuccess('CSS', 'Import CSS Leaflet présent ✓');
  } else {
    addIssue('CSS', 'Import CSS Leaflet manquant', "Ajoute: import 'leaflet/dist/leaflet.css' dans app/layout.tsx");
  }
}

// Afficher le rapport
function displayReport() {
  log('\n\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║            📊 RAPPORT DE DIAGNOSTIC COMPLET                ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  // Résumé
  const total = issues.length + warnings.length + successes.length;
  log(`✅ Réussites: ${successes.length}`, 'green');
  log(`⚠️  Avertissements: ${warnings.length}`, 'yellow');
  log(`❌ Problèmes: ${issues.length}`, 'red');
  log(`📊 Total vérifié: ${total} points\n`);

  // Afficher les problèmes critiques
  if (issues.length > 0) {
    log('╔════════════════════════════════════════════════════════════╗', 'red');
    log('║  ❌ PROBLÈMES CRITIQUES À RÉSOUDRE                        ║', 'red');
    log('╚════════════════════════════════════════════════════════════╝\n', 'red');

    issues.forEach((issue, i) => {
      log(`${i + 1}. [${issue.category}] ${issue.message}`, 'red');
      log(`   💡 Solution: ${issue.fix}\n`, 'yellow');
    });
  }

  // Afficher les avertissements
  if (warnings.length > 0) {
    log('╔════════════════════════════════════════════════════════════╗', 'yellow');
    log('║  ⚠️  AVERTISSEMENTS (NON BLOQUANTS)                       ║', 'yellow');
    log('╚════════════════════════════════════════════════════════════╝\n', 'yellow');

    warnings.forEach((warning, i) => {
      log(`${i + 1}. [${warning.category}] ${warning.message}`, 'yellow');
    });
    log('');
  }

  // Plan d'action
  if (issues.length > 0) {
    log('╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║  🚀 PLAN D\'ACTION RECOMMANDÉ                              ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

    const hasTableIssue = issues.some(i => i.category === 'TABLE');
    const hasEnvIssue = issues.some(i => i.category === 'ENV');
    const hasNpmIssue = issues.some(i => i.category === 'NPM');

    let step = 1;

    if (hasEnvIssue) {
      log(`${step}. Corriger les variables d'environnement (.env.local)`, 'cyan');
      step++;
    }

    if (hasNpmIssue) {
      log(`${step}. Installer les dépendances manquantes:`, 'cyan');
      const npmIssues = issues.filter(i => i.category === 'NPM');
      npmIssues.forEach(issue => {
        log(`   ${issue.fix}`, 'cyan');
      });
      step++;
    }

    if (hasTableIssue) {
      log(`${step}. Exécuter la migration SQL:`, 'cyan');
      log(`   Option A: node scripts/run-migration-postgres.js (automatique)`, 'cyan');
      log(`   Option B: Copier-coller dans Supabase Dashboard (manuel)`, 'cyan');
      step++;
    }

    log(`${step}. Insérer les événements de démo:`, 'cyan');
    log(`   node scripts/insert-demo-events-simple.js`, 'cyan');
    step++;

    log(`${step}. Tester la carte:`, 'cyan');
    log(`   http://localhost:3000/dashboard/journey-map\n`, 'cyan');
  } else {
    log('╔════════════════════════════════════════════════════════════╗', 'green');
    log('║  ✅ SYSTÈME PRÊT !                                        ║', 'green');
    log('╚════════════════════════════════════════════════════════════╝\n', 'green');

    log('🎉 Tous les composants sont en place !', 'green');
    log('\n🚀 Prochaines étapes:\n', 'cyan');
    log('1. Insérer les événements de démo:', 'cyan');
    log('   node scripts/insert-demo-events-simple.js\n', 'cyan');
    log('2. Ouvrir la carte:', 'cyan');
    log('   http://localhost:3000/dashboard/journey-map\n', 'cyan');
  }
}

// Fonction principale
async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'magenta');
  log('║  🔍 DIAGNOSTIC COMPLET DU SYSTÈME                         ║', 'magenta');
  log('║  Analyse de tous les composants...                        ║', 'magenta');
  log('╚════════════════════════════════════════════════════════════╝', 'magenta');

  checkEnvironment();
  checkDependencies();
  checkFiles();
  await checkSupabase();
  await checkTableStructure();
  checkNextConfig();
  checkLeafletCSS();

  displayReport();
}

// Exécution
main().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
});
