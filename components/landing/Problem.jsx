'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { containerVariants, itemVariants } from '@/lib/animations';
import { storyData } from '@/config/landingData';

export default function OurStory() {
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
            {storyData.title}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-[var(--charcoal)] opacity-70 max-w-2xl mx-auto">
            {storyData.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {storyData.cards.map((card, idx) => (
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
            {storyData.promise.title}
          </h3>
          <p className="text-lg text-[var(--charcoal)] opacity-90 mb-4">
            <span className="font-semibold">{storyData.promise.content}</span>
          </p>
          <p className="text-[var(--charcoal)] opacity-80 italic">
            {storyData.promise.signature}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
