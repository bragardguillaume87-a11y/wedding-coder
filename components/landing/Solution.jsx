'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { containerVariants, itemVariants, fadeIn } from '@/lib/animations';
import { dreamData } from '@/config/landingData';

export default function OurDream() {
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
            {dreamData.title}
          </h2>
          <p className="text-xl text-[var(--charcoal)] opacity-70 max-w-3xl mx-auto">
            {dreamData.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {dreamData.scenes.map((scene, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-gradient-to-br from-[var(--cream)] to-[var(--beige)] p-8 border border-[var(--beige)] hover:border-[var(--terracotta)] transition-all duration-300">
                <div className="text-6xl mb-4">{scene.icon}</div>
                <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-4" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  {scene.title}
                </h3>
                <p className="text-[var(--charcoal)] opacity-80 leading-relaxed">
                  {scene.description}
                </p>
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
          <p className="text-2xl md:text-3xl text-[var(--terracotta)] italic font-light" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            &ldquo;{dreamData.quote}&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
