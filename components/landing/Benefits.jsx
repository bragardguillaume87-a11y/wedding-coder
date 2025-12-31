'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { containerVariants, itemVariants, scaleIn } from '@/lib/animations';
import { valuesData } from '@/config/landingData';

export default function OurValues() {
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
            {valuesData.title}
          </h2>
          <p className="text-xl text-[var(--charcoal)] opacity-70 max-w-3xl mx-auto">
            {valuesData.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {valuesData.values.map((value, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 border-2 border-transparent hover:border-[var(--terracotta)] transition-all duration-300">
                <div className="text-6xl mb-6 text-center">{value.icon}</div>
                <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4 text-center" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  {value.title}
                </h3>
                <p className="text-[var(--charcoal)] opacity-80 leading-relaxed text-center">
                  {value.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center p-8 bg-white rounded-2xl shadow-xl border-2 border-[var(--terracotta)]"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-xl md:text-2xl text-[var(--charcoal)] mb-4" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            {valuesData.finalMessage.intro}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            {valuesData.finalMessage.highlight}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
