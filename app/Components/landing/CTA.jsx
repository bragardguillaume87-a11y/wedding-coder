'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function CTA() {
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
      title: 'Décrivez votre mariage',
      description: 'Qui êtes-vous ? Où sont vos invités ? Quelles sont vos priorités ?',
    },
    {
      number: '2',
      title: 'Planifiez les étapes',
      description: 'Créez votre itinéraire : 5, 7, ou 10 étapes dans différentes régions.',
    },
    {
      number: '3',
      title: 'Invitez vos proches',
      description: 'Chacun choisit son étape. Les RSVP s\'accumulent automatiquement.',
    },
    {
      number: '4',
      title: 'Vivez votre mariage',
      description: 'Passez de ville en ville. Célébrez avec chacun. Créez des souvenirs vrais.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="relative mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-10 blur-3xl" />

          <Card className="relative p-12 border-0 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30" />

            <div className="relative z-10 text-center">
              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
              >
                Prêt à réinventer votre mariage ?
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto"
              >
                Wedding-Coder fait la coordination. Vous vivez les moments. Vos invités sont
                heureux.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-8"
                  >
                    Commencer maintenant
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-900 hover:bg-slate-50 px-8"
                >
                  Voir la démo
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h3
            variants={itemVariants}
            className="text-3xl font-bold text-slate-900 mb-12"
          >
            4 étapes simples pour démarrer
          </motion.h3>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            {steps.map((step, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <div className="h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6">
                    <span className="text-white text-2xl font-bold">{step.number}</span>
                  </div>

                  <h4 className="text-lg font-semibold text-slate-900 mb-3">{step.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>

                  {idx < steps.length - 1 && (
                    <motion.div
                      className="mt-8 hidden lg:block text-2xl text-slate-300"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 p-8 bg-slate-50 rounded-xl border border-slate-200 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        >
          <p className="text-slate-700 mb-4">
            <span className="font-semibold">Pas d&apos;engagement</span> – Explorez gratuitement.
            <br />
            Payez seulement si vous lancez votre mariage.
          </p>
          <p className="text-sm text-slate-600">
            Wedding-Coder gère la complexité. Vous savourez chaque moment. 🎉
          </p>
        </motion.div>
      </div>
    </section>
  );
}
