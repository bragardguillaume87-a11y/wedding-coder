'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[var(--cream)] to-white flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Arrière-plan décoratif chaleureux */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--rose-powder)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[var(--gold)] rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-2 bg-[var(--rose-powder)] bg-opacity-30 text-[var(--terracotta)] rounded-full text-sm font-semibold mb-4">
            💍 Été 2026
          </span>
        </motion.div>

        {/* Photo du couple - Placeholder pour l'instant */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[var(--terracotta)] to-[var(--rose-powder)] flex items-center justify-center shadow-lg">
            <span className="text-white text-5xl">👰🤵</span>
          </div>
        </motion.div>

        {/* Titre principal avec font serif */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--charcoal)] mb-6"
          style={{ fontFamily: 'var(--font-crimson-pro)' }}
        >
          Guillaume & [Nom]
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] mt-2">
            se marient
          </span>
        </motion.h1>

        {/* Sous-titre poétique */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-[var(--charcoal)] opacity-80 mb-6 leading-relaxed"
        >
          Plutôt que de vous faire venir à nous,
          <br />
          nous viendrons à vous.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-[var(--charcoal)] opacity-70 mb-8 leading-relaxed max-w-2xl mx-auto"
        >
          En tenue de cérémonie, avec nos rires et nos maladresses,
          <br />
          pour célébrer l&apos;amour dans vos salons, vos jardins, vos cuisines.
        </motion.p>

        {/* Paragraphe explicatif */}
        <motion.p
          variants={itemVariants}
          className="text-base text-[var(--charcoal)] opacity-60 mb-12 max-w-2xl mx-auto italic"
        >
          Un mariage itinérant à travers villes et pays,
          <br />
          pour que personne ne reste dehors,
          <br />
          et que chaque moment soit vraiment partagé.
        </motion.p>

        {/* Boutons CTA */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-[var(--terracotta)] hover:bg-[var(--primary)] text-white px-8 shadow-lg hover:shadow-xl transition-all"
            >
              Confirmer votre présence
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-[var(--terracotta)] text-[var(--terracotta)] hover:bg-[var(--rose-powder)] hover:bg-opacity-20 px-8 transition-all"
          >
            Voir le parcours
          </Button>
        </motion.div>

        {/* Statistiques personnelles */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-16 border-t border-[var(--beige)]"
        >
          {[
            { number: '12', label: 'villes' },
            { number: '3', label: 'pays' },
            { number: '1', label: 'promesse' },
            { number: '∞', label: 'souvenirs' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[var(--terracotta)] mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                {stat.number}
              </div>
              <div className="text-sm text-[var(--charcoal)] opacity-60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
