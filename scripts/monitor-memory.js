#!/usr/bin/env node

const process = require('process');

const MAX_MEMORY_MB = 2000; // 2 GB limit
const CHECK_INTERVAL_MS = 10000; // Check every 10s

function getMemoryUsage() {
  const used = process.memoryUsage();
  return {
    rss: Math.round(used.rss / 1024 / 1024), // MB
    heapTotal: Math.round(used.heapTotal / 1024 / 1024),
    heapUsed: Math.round(used.heapUsed / 1024 / 1024),
    external: Math.round(used.external / 1024 / 1024),
  };
}

function formatTime() {
  return new Date().toLocaleTimeString('fr-FR');
}

console.log('🔍 Monitoring mémoire Next.js démarré...\n');
console.log(`⚠️  Limite d'alerte: ${MAX_MEMORY_MB} MB\n`);

let checkCount = 0;

setInterval(() => {
  checkCount++;
  const mem = getMemoryUsage();
  const totalMem = mem.rss;

  const status = totalMem > MAX_MEMORY_MB ? '🔴' : '🟢';

  console.log(`[${formatTime()}] ${status} RSS: ${totalMem} MB | Heap: ${mem.heapUsed}/${mem.heapTotal} MB | Check #${checkCount}`);

  if (totalMem > MAX_MEMORY_MB) {
    console.log(`\n⚠️⚠️⚠️ ALERTE: Mémoire dépassée (${totalMem} MB > ${MAX_MEMORY_MB} MB)!\n`);
  }

  // Afficher un résumé toutes les minutes
  if (checkCount % 6 === 0) {
    console.log(`\n📊 Résumé ${checkCount/6} min: RSS ${totalMem} MB\n`);
  }
}, CHECK_INTERVAL_MS);
