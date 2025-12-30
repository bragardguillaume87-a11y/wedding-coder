'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function Solution() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const steps = [
    {
      number: '1',
      title: 'Planifiez vos étapes',
      description: 'Identifiez les groupes d\'invités par région ou lieu. Définissez 5-10 étapes itinérantes.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '2',
      title: 'Les invités s\'enregistrent',
      description: 'Chaque invité choisit l\'étape la plus proche. Wedding-Coder gère les RSVP et les détails.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      number: '3',
      title: 'Les mariés se préparent',
      description: 'Tenue de cérémonie, documents, timeline : tout est synchronisé pour chaque étape.',
      color: 'from-pink-500 to-pink-600',
    },
    {
      number: '4',
      title: 'Chaque groupe organise',
      description: 'Petit apéro, repas, mini-cérémonie ? Chacun s\'approprie son moment avec les mariés.',
      color: 'from-green-500 to-green-600',
    },
    {
      number: '5',
      title: 'Les mariés visitent',
      description: 'Circuit à travers le territoire. 1h-2h par étape. Moments intimes et vrais.',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
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
            La solution : le mariage itinérant
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-2xl mx-auto">
            Les mariés viennent à vous. Pas l&apos;inverse. Chacun participe sans contrainte.
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {steps.map((step, idx) => (
            <motion.div key={idx} variants={itemVariants} className="relative">
              <div className="flex gap-8">
                <div
                  className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}
                >
                  <span className="text-white text-2xl font-bold">{step.number}</span>
                </div>

                <Card className="flex-1 p-8 border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{step.description}</p>

                  {idx < steps.length - 1 && (
                    <div className="absolute -bottom-8 left-10">
                      <motion.div
                        className="text-3xl text-slate-300"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ↓
                      </motion.div>
                    </div>
                  )}
                </Card>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 p-10 bg-blue-50 rounded-xl border border-blue-200"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">💡 La clé du succès</h3>
          <p className="text-lg text-slate-700 mb-4">
            Wedding-Coder <span className="font-semibold">synchronise tout</span> :
          </p>
          <ul className="space-y-2 text-slate-700">
            <li>✓ Coordination des étapes (dates, lieux, timing)</li>
            <li>✓ Invitations et RSVP par groupe</li>
            <li>✓ Planning des mariés et timeline de cérémonie</li>
            <li>✓ Documents et informations pratiques par étape</li>
            <li>✓ Photos/vidéos et souvenirs partagés</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
