'use client';

import { motion } from 'framer-motion';

export default function OurValues() {
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

  const values = [
    {
      icon: '🤝',
      title: 'Personne ne reste dehors',
      description:
        'Mamie qui ne peut plus voyager. L\'ami à Tokyo. Le cousin en fauteuil. Tout le monde compte. Tout le monde est là. C\'est nous qui nous adaptons.',
    },
    {
      icon: '❤️',
      title: 'De vrais moments',
      description:
        'Pas de protocole rigide. Pas de stress logistique. Juste nous, vous, et le temps de se retrouver vraiment. Pas de faux-semblants.',
    },
    {
      icon: '☕',
      title: 'La proximité plutôt que la quantité',
      description:
        'On préfère une heure avec vous qu\'une minute avec 200 personnes. Les grands rassemblements, c\'est beau. Mais les petits moments, c\'est précieux.',
    },
    {
      icon: '🚀',
      title: 'Un mariage-épopée',
      description:
        'C\'est un peu fou ? Oui. C\'est compliqué ? Aussi. Mais c\'est notre histoire. Une aventure à travers villes et vies, pour célébrer l\'amour partout où il habite.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[var(--rose-powder)] to-[var(--cream)] bg-opacity-30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--charcoal)] mb-6" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            Pourquoi c&apos;est important pour nous
          </h2>
          <p className="text-xl text-[var(--charcoal)] opacity-70 max-w-3xl mx-auto">
            Derrière ce choix un peu fou, il y a des convictions profondes
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[var(--terracotta)]"
              variants={itemVariants}
            >
              <div className="text-6xl mb-6 text-center">{value.icon}</div>
              <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4 text-center" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                {value.title}
              </h3>
              <p className="text-[var(--charcoal)] opacity-80 leading-relaxed text-center">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Message final */}
        <motion.div
          className="mt-16 text-center p-8 bg-white rounded-2xl shadow-xl border-2 border-[var(--terracotta)]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-xl md:text-2xl text-[var(--charcoal)] mb-4" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            Ce mariage, c&apos;est notre manière à nous de dire :
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            Vous êtes importants. Chacun. Vraiment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
