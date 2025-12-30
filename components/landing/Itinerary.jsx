'use client';

import { motion } from 'framer-motion';

export default function OurJourney() {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const journeySteps = [
    {
      step: '01',
      city: 'Paris',
      subtitle: 'Le départ',
      date: 'Juin 2026',
      description: 'Tout commence ici. Famille proche, amis de toujours. Les premiers vœux, les premières larmes. Le mariage démarre.',
    },
    {
      step: '02',
      city: 'Lyon',
      subtitle: 'Les racines',
      date: 'Juin 2026',
      description: 'Retour aux sources. Les amis d\'enfance, les lieux qui nous ont construits. Une étape pleine de nostalgie.',
    },
    {
      step: '03',
      city: '[Ville 3]',
      subtitle: 'À personnaliser',
      date: '[Date]',
      description: '[Décrivez cette étape de votre itinéraire en 1-2 phrases. Qui allez-vous voir ? Pourquoi cette ville est importante ?]',
    },
    {
      step: '04',
      city: '[Ville finale]',
      subtitle: 'La boucle se ferme',
      date: '[Date]',
      description: 'On revient, changés. Plus mariés qu\'au départ. Le voyage nous a transformés, et vous avec.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[var(--cream)]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--charcoal)] mb-6" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            L&apos;itinéraire de notre mariage
          </h2>
          <p className="text-xl text-[var(--charcoal)] opacity-70 max-w-3xl mx-auto">
            De ville en ville, de cœur en cœur, notre mariage prendra forme
          </p>
        </motion.div>

        <motion.div
          className="space-y-8 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Ligne de connexion verticale */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--terracotta)] via-[var(--rose-powder)] to-[var(--gold)] hidden md:block" style={{ marginLeft: '2rem' }}></div>

          {journeySteps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col md:flex-row items-start gap-6 bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[var(--beige)] hover:border-[var(--terracotta)] relative"
              variants={itemVariants}
            >
              {/* Numéro de l'étape */}
              <div className="shrink-0 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--terracotta)] to-[var(--rose-powder)] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  {step.step}
                </div>
              </div>

              {/* Contenu de l'étape */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                  <h3 className="text-3xl font-bold text-[var(--charcoal)] mb-2 sm:mb-0" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                    {step.city}
                  </h3>
                  <span className="inline-block px-4 py-1 bg-[var(--rose-powder)] bg-opacity-30 text-[var(--terracotta)] rounded-full text-sm font-semibold">
                    {step.date}
                  </span>
                </div>
                <p className="text-xl text-[var(--terracotta)] mb-3 italic">
                  {step.subtitle}
                </p>
                <p className="text-[var(--charcoal)] opacity-80 text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Note finale */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <p className="text-lg text-[var(--charcoal)] opacity-70 italic">
            💫 L&apos;itinéraire complet sera dévoilé progressivement aux invités
          </p>
        </motion.div>
      </div>
    </section>
  );
}
