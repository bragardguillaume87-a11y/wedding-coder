'use client';

import { motion } from 'framer-motion';

export default function OurDream() {
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

  const dreamScenes = [
    {
      icon: '🌅',
      title: 'Le réveil en tenue de cérémonie',
      description:
        'On se réveille dans une ville. On enfile nos habits de mariés. Et on part frapper à votre porte, comme si c\'était la première fois.',
    },
    {
      icon: '☕',
      title: 'Chez vous, simplement',
      description:
        'Votre salon, votre jardin, votre cuisine. On s\'installe. On partage. On rit. On pleure peut-être. Le temps s\'arrête. C\'est notre mariage, chez vous.',
    },
    {
      icon: '💍',
      title: 'Autant de cérémonies que d\'étapes',
      description:
        'Chaque visite est unique. Un gâteau ici, des vœux là-bas, une chanson ailleurs. Le mariage se construit, morceau par morceau, avec vous.',
    },
    {
      icon: '✨',
      title: 'Des souvenirs gravés',
      description:
        'Pas de photo de groupe géante où on ne vous voit pas. Mais des moments vrais, capturés, partagés. Votre regard. Notre rire. Cette lumière dans votre salon.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--charcoal)] mb-6" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            À quoi ça ressemble, ce mariage ?
          </h2>
          <p className="text-xl text-[var(--charcoal)] opacity-70 max-w-3xl mx-auto">
            Un mariage qui voyage plutôt qu&apos;un mariage qui rassemble
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {dreamScenes.map((scene, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-[var(--cream)] to-[var(--beige)] p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--beige)] hover:border-[var(--terracotta)]"
              variants={itemVariants}
            >
              <div className="text-6xl mb-4">{scene.icon}</div>
              <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                {scene.title}
              </h3>
              <p className="text-[var(--charcoal)] opacity-80 leading-relaxed">
                {scene.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Citation poétique */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-2xl md:text-3xl text-[var(--terracotta)] italic font-light" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            &ldquo;Le mariage n&apos;est pas un lieu, c&apos;est un voyage.&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
