/**
 * 🎉 Script pour créer ta cérémonie principale (mariage)
 *
 * Ce script crée une cérémonie dans la base de données
 * Ensuite, tu pourras créer des événements attachés à cette cérémonie
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Variables d\'environnement manquantes !');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  💍 CRÉATION DE TA CÉRÉMONIE PRINCIPALE          ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log('📋 Je vais te poser quelques questions simples...\n');

  // Vérifier s'il existe déjà une cérémonie
  console.log('🔍 Vérification des cérémonies existantes...');
  const { data: existingCeremonies, error: fetchError } = await supabase
    .from('ceremonies')
    .select('*');

  if (fetchError) {
    console.error(`\n❌ Erreur : ${fetchError.message}`);
    console.log('\n💡 La table "ceremonies" n\'existe peut-être pas dans ta base de données.');
    console.log('   Contacte-moi si tu vois ce message.\n');
    rl.close();
    process.exit(1);
  }

  if (existingCeremonies && existingCeremonies.length > 0) {
    console.log('\n✅ Tu as déjà une cérémonie :');
    existingCeremonies.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.ceremony_name} (Date: ${c.ceremony_date})`);
    });

    const createNew = await ask('\n🤔 Veux-tu quand même créer une nouvelle cérémonie ? (oui/non): ');

    if (createNew.toLowerCase() !== 'oui' && createNew.toLowerCase() !== 'o' && createNew.toLowerCase() !== 'yes' && createNew.toLowerCase() !== 'y') {
      console.log('\n✅ OK ! Tu peux maintenant créer des événements avec la cérémonie existante.');
      console.log('   Rendez-vous sur : http://localhost:3000/dashboard/create-event\n');
      rl.close();
      process.exit(0);
    }
  } else {
    console.log('✅ Aucune cérémonie trouvée. On va en créer une !\n');
  }

  // Poser les questions
  const ceremonyName = await ask('💍 Nom de la cérémonie (ex: "Notre Mariage Itinérant"): ');
  const ceremonyDate = await ask('📅 Date de la cérémonie (format: YYYY-MM-DD, ex: 2025-06-15): ');
  const description = await ask('📝 Description (optionnel, appuie sur Entrée pour passer): ');

  console.log('\n📝 Récapitulatif:');
  console.log(`   Nom: ${ceremonyName || 'Notre Mariage'}`);
  console.log(`   Date: ${ceremonyDate}`);
  console.log(`   Description: ${description || '(aucune)'}\n`);

  const confirm = await ask('✅ Confirmer la création ? (oui/non): ');

  if (confirm.toLowerCase() !== 'oui' && confirm.toLowerCase() !== 'o' && confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('\n❌ Annulé.\n');
    rl.close();
    process.exit(0);
  }

  // Créer la cérémonie
  console.log('\n🎉 Création de la cérémonie...');

  const { data: newCeremony, error: createError } = await supabase
    .from('ceremonies')
    .insert({
      ceremony_name: ceremonyName || 'Notre Mariage',
      ceremony_date: ceremonyDate,
      description: description || null,
    })
    .select()
    .single();

  if (createError) {
    console.error(`\n❌ Erreur lors de la création: ${createError.message}\n`);
    rl.close();
    process.exit(1);
  }

  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  ✅ CÉRÉMONIE CRÉÉE AVEC SUCCÈS !                 ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log(`🎊 Ta cérémonie "${newCeremony.ceremony_name}" a été créée !`);
  console.log(`   ID: ${newCeremony.id}`);
  console.log(`   Date: ${newCeremony.ceremony_date}\n`);

  console.log('🎯 Prochaines étapes:\n');
  console.log('1️⃣  Crée des événements depuis l\'interface web:');
  console.log('   http://localhost:3000/dashboard/create-event\n');
  console.log('2️⃣  Ou insère les événements de démo:');
  console.log('   node scripts/insert-demo-events-fixed.js\n');
  console.log('3️⃣  Puis visualise la carte:');
  console.log('   http://localhost:3000/dashboard/journey-map\n');

  rl.close();
}

main().catch((error) => {
  console.error('\n❌ Erreur:', error.message);
  rl.close();
  process.exit(1);
});
