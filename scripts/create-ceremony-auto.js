/**
 * 🚀 Script AUTOMATIQUE pour créer une cérémonie par défaut
 *
 * Version ultra-simple : crée une cérémonie sans poser de questions
 * Parfait pour démarrer rapidement !
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Variables d\'environnement manquantes !');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('\n🎉 Création automatique de la cérémonie...\n');

  // Vérifier s'il existe déjà une cérémonie
  const { data: existingCeremonies } = await supabase
    .from('ceremonies')
    .select('*')
    .limit(1);

  if (existingCeremonies && existingCeremonies.length > 0) {
    console.log('✅ Tu as déjà une cérémonie :');
    console.log(`   "${existingCeremonies[0].ceremony_name}" (ID: ${existingCeremonies[0].id})`);
    console.log('\n💡 Utilise cette cérémonie pour créer des événements !');
    console.log('   http://localhost:3000/dashboard/create-event\n');
    return;
  }

  // Créer une cérémonie par défaut
  const { data: newCeremony, error } = await supabase
    .from('ceremonies')
    .insert({
      ceremony_name: 'Notre Mariage Itinérant',
      ceremony_date: '2025-06-15',
      description: 'Un mariage unique à travers la France',
    })
    .select()
    .single();

  if (error) {
    console.error(`❌ Erreur: ${error.message}\n`);
    process.exit(1);
  }

  console.log('✅ Cérémonie créée avec succès !');
  console.log(`   Nom: ${newCeremony.ceremony_name}`);
  console.log(`   ID: ${newCeremony.id}`);
  console.log(`   Date: ${newCeremony.ceremony_date}\n`);

  console.log('🎯 Tu peux maintenant :');
  console.log('   1. Créer des événements: http://localhost:3000/dashboard/create-event');
  console.log('   2. Ou insérer les démos: node scripts/insert-demo-events-fixed.js\n');
}

main().catch(console.error);
