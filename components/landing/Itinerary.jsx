'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { containerVariants, itemVariantsHorizontal, fadeIn } from '@/lib/animations';
import { journeyData } from '@/config/landingData';

export default function OurJourney() {
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
            {journeyData.title}
          </h2>
          <p className="text-xl text-[var(--charcoal)] opacity-70 max-w-3xl mx-auto">
            {journeyData.subtitle}
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

          {journeyData.steps.map((step, index) => (
            <motion.div key={index} variants={itemVariantsHorizontal}>
              <Card className="flex flex-col md:flex-row items-start gap-6 p-8 border-2 border-[var(--beige)] hover:border-[var(--terracotta)] transition-all duration-300 relative">
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
                    <Badge className="bg-[var(--rose-powder)] bg-opacity-30 text-[var(--terracotta)] border-transparent">
                      {step.date}
                    </Badge>
                  </div>
                  <p className="text-xl text-[var(--terracotta)] mb-3 italic">
                    {step.subtitle}
                  </p>
                  <p className="text-[var(--charcoal)] opacity-80 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-lg text-[var(--charcoal)] opacity-70 italic">
            {journeyData.footnote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
