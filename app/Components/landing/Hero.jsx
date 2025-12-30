'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Décoration de fond */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-100 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline Principal */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            ✨ Une nouvelle façon de se marier
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6"
        >
          Un mariage qui honore
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            chacun
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed"
        >
          Les invités restent chez eux. Les mariés les visitent en tenue de cérémonie.
          <br />
          Chacun s&apos;approprie le mariage à sa manière.
        </motion.p>

        {/* Sous-headline */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto"
        >
          Wedding-Coder organise votre mariage itinérant pour que personne n&apos;ait besoin de
          voyager, et que chaque moment partagé soit authentique.
        </motion.p>

        {/* Boutons CTA */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Commencer un mariage
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-300 text-slate-900 hover:bg-slate-50 px-8"
          >
            Voir comment ça marche
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-slate-200"
        >
          {[
            { number: '∞', label: 'Invités possibles' },
            { number: '100%', label: 'Inclusif' },
            { number: '5+', label: 'Étapes itinérantes' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
