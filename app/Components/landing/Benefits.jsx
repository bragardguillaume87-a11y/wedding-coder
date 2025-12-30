'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function Benefits() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const benefits = [
    {
      icon: '🌍',
      title: 'Géographiquement inclusif',
      description:
        'Chacun participe sans voyager. Région, France, étranger : tous les invités sont honorés.',
      highlight: 'Zéro contrainte géographique',
    },
    {
      icon: '🎉',
      title: 'Moments vraiment intimes',
      description:
        'Au lieu d\'une grosse réception, des moments éphémères et personnels. Les mariés peuvent réellement parler avec chacun.',
      highlight: 'Authenticité garantie',
    },
    {
      icon: '💰',
      title: 'Économique et flexible',
      description:
        'Pas de location unique gigantesque. Chaque groupe organise à son rythme. Les coûts se répartissent naturellement.',
      highlight: 'Budget maîtrisé',
    },
    {
      icon: '❤️',
      title: 'Célébrer les liens existants',
      description:
        'Au lieu de forcer un mélange, vous célébrez les vrais cercles : famille, amis proches, collègues. Chacun dans son contexte.',
      highlight: 'Respect des liens réels',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
          >
            Pourquoi le mariage itinérant ?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-2xl mx-auto">
            4 raisons qui changent tout
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {benefits.map((benefit, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="h-full p-8 border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">{benefit.title}</h3>

                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  {benefit.description}
                </p>

                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                  <span className="text-sm font-semibold text-blue-700">✓ {benefit.highlight}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 p-10 bg-slate-900 rounded-xl text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold mb-8">Mariage classique vs. Mariage itinérant</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-6 text-slate-300">❌ Classique (1 lieu)</h4>
              <ul className="space-y-3 text-slate-400">
                <li>• Certains invités manquent (trop loin)</li>
                <li>• Voyage coûteux pour beaucoup</li>
                <li>• Jour unique, moment unique</li>
                <li>• Superficie interaction par invité</li>
                <li>• Stress logistique énorme</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6 text-green-400">✓ Itinérant (5+ étapes)</h4>
              <ul className="space-y-3 text-slate-300">
                <li>• Tous les invités participent</li>
                <li>• Aucun voyage demandé</li>
                <li>• 5-10 jours de célébration</li>
                <li>• Moments vrais et personnels</li>
                <li>• Chaque étape auto-organisée</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
