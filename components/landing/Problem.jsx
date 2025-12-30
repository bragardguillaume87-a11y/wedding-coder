'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function OurStory() {
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

  const storyCards = [
    {
      icon: '💫',
      title: 'Le début',
      description:
        '[À personnaliser : racontez comment vous vous êtes rencontrés en 2-3 phrases touchantes. Par exemple : "Nous nous sommes rencontrés un soir d\'automne à Paris, autour d\'un projet commun. Un regard, un sourire, et tout a commencé."]',
    },
    {
      icon: '🗺️',
      title: 'Nos vies, en pointillés',
      description:
        'Nos amis et familles sont partout. Paris, Lyon, Bruxelles, Tokyo... Comment rassembler tous ces univers en un seul endroit ? Impossible. Alors on a décidé de ne pas choisir.',
    },
    {
      icon: '💡',
      title: 'L\'idée folle',
      description:
        'Et si au lieu de vous faire voyager, on venait vous voir ? En tenue de mariage, avec nos vœux dans la poche et des étoiles dans les yeux. Un mariage itinérant. Un peu fou, complètement nous.',
    },
    {
      icon: '🏡',
      title: 'Ce qu\'on veut vraiment',
      description:
        'Pas 5 minutes dans une file de réception. De vrais moments. Vous voir dans vos espaces, partager un café, un repas, un fou rire. Célébrer avec chacun, vraiment.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[var(--cream)]">
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
            className="text-4xl sm:text-5xl font-bold text-[var(--charcoal)] mb-6"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Comment on en est arrivés là
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-[var(--charcoal)] opacity-70 max-w-2xl mx-auto">
            L&apos;histoire d&apos;un choix un peu fou, mais tellement évident
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {storyCards.map((card, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="h-full p-8 border-[var(--beige)] bg-white hover:shadow-xl hover:border-[var(--terracotta)] transition-all duration-300 group">
                <div className="flex items-start gap-6">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4 group-hover:text-[var(--terracotta)] transition-colors" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                      {card.title}
                    </h3>
                    <p className="text-[var(--charcoal)] opacity-80 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 p-10 bg-gradient-to-r from-[var(--rose-powder)] to-[var(--gold)] bg-opacity-20 rounded-xl border-2 border-[var(--terracotta)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            💝 Notre promesse
          </h3>
          <p className="text-lg text-[var(--charcoal)] opacity-90 mb-4">
            <span className="font-semibold">On préfère passer une heure avec chacun de vous</span>{' '}
            qu&apos;une minute avec 200 personnes en même temps.
          </p>
          <p className="text-[var(--charcoal)] opacity-80 italic">
            Ce mariage, c&apos;est notre façon de dire que vous comptez. Chacun. Vraiment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
