/**
 * Script pour guider l'exécution de la migration SQL
 * Ouvre automatiquement Supabase Dashboard
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  🗺️  MIGRATION: Ajouter colonnes de géocodage            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Lire le fichier SQL
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251227_add_geocoding_to_events.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('📋 Migration à exécuter :');
console.log('   ' + migrationPath);
console.log('\n📝 Contenu (extrait) :');
console.log('   - Ajout colonnes : latitude, longitude, country_code, etc.');
console.log('   - Création d\'index pour performances');
console.log('   - Documentation SQL\n');

// URL Supabase Dashboard SQL Editor
const projectRef = 'ijgwrkfvfoqllbxdjntl'; // Extrait de NEXT_PUBLIC_SUPABASE_URL
const supabaseSQLEditor = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

console.log('🚀 Étapes pour exécuter la migration :\n');
console.log('   1. Je vais ouvrir Supabase Dashboard dans ton navigateur');
console.log('   2. Connecte-toi si nécessaire');
console.log('   3. Le SQL Editor s\'ouvrira automatiquement');
console.log('   4. Copie-colle tout le contenu du fichier migration');
console.log('   5. Clique sur "Run" (ou Ctrl+Enter)');
console.log('   6. Si tu vois "Success. No rows returned", c\'est bon !');
console.log('   7. Reviens ici et appuie sur une touche pour continuer\n');

console.log('📄 Fichier SQL à copier :');
console.log(`   ${migrationPath}\n`);
console.log('🌐 Ouverture du navigateur dans 3 secondes...\n');

// Attendre 3 secondes puis ouvrir le navigateur
setTimeout(() => {
  // Ouvrir le navigateur selon l'OS
  const platform = process.platform;
  let command;

  if (platform === 'win32') {
    command = 'start';
  } else if (platform === 'darwin') {
    command = 'open';
  } else {
    command = 'xdg-open';
  }

  try {
    spawn(command, [supabaseSQLEditor], { shell: true, detached: true });
    console.log('✅ Navigateur ouvert !\n');
  } catch (error) {
    console.log('⚠️  Impossible d\'ouvrir automatiquement le navigateur');
    console.log(`   Ouvre manuellement : ${supabaseSQLEditor}\n`);
  }

  console.log('⏳ Une fois la migration exécutée, appuie sur Entrée pour continuer...');

  // Attendre que l'utilisateur appuie sur Entrée
  process.stdin.once('data', () => {
    console.log('\n✅ Migration exécutée !');
    console.log('🎉 Maintenant, lance le script pour insérer les événements de démo :\n');
    console.log('   node scripts/insert-demo-events-simple.js\n');
    process.exit(0);
  });

}, 3000);
