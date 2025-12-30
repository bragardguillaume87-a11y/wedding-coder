'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function Problem() {
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

  const challenges = [
    {
      icon: '🗺️',
      title: 'Géographiquement dispersé',
      description:
        'Vos proches sont partout : région, France, étranger. Rassembler tout le monde en un lieu est impossible.',
    },
    {
      icon: '✈️',
      title: 'Contraintes de voyage',
      description:
        'Faire voyager 200+ personnes coûte cher, prend du temps, et exclut les plus fragiles ou occupés.',
    },
    {
      icon: '😔',
      title: 'Moments superficiels',
      description:
        'Un mariage classique = quelques heures. Les mariés ne voient pas tout le monde. Les bonds manquent.',
    },
    {
      icon: '💔',
      title: 'Certains sacrifient',
      description:
        'Ceux qui sont loin choisissent souvent de ne pas venir. Ils manquent le moment important.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            Le défi des mariages modernes
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-2xl mx-auto">
            Les invités sont éparpillés. Un seul lieu ne suffit pas. Comment honorer chacun sans
            demander l&apos;impossible ?
          </motion.p>
        </motion.div>

        {/* Challenge Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {challenges.map((challenge, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="h-full p-8 border-slate-200 hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{challenge.title}</h3>
                <p className="text-slate-600 leading-relaxed">{challenge.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Transition */}
        <motion.div
          className="mt-16 p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        >
          <p className="text-center text-lg text-slate-800">
            <span className="font-semibold">Le résultat ?</span> Beaucoup d&apos;invités hésitent à
            venir. Les mariés se sentent coupables. Le mariage perd en inclusion et en
            authenticité.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
