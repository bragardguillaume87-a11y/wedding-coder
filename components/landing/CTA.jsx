'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ctaData } from '@/config/landingData';

export default function JoinOurStory() {
  return (
    <section className="py-20 bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] relative overflow-hidden">
      {/* Effet décoratif arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            {ctaData.title}
          </h2>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white border-opacity-20">
            <p className="text-xl md:text-2xl text-white leading-relaxed mb-6">
              {ctaData.message.main}
              <br />
              <span className="font-bold">{ctaData.message.highlight}</span>
            </p>
            <p className="text-lg text-white opacity-90 leading-relaxed">
              {ctaData.message.closing}
            </p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href={ctaData.buttons.primary.link}>
              <Button
                size="lg"
                className="bg-white text-[var(--terracotta)] font-semibold shadow-xl hover:bg-opacity-90 transition-all"
                style={{ fontFamily: 'var(--font-crimson-pro)' }}
              >
                {ctaData.buttons.primary.text}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10 transition-all"
              onClick={() => window.location.href = ctaData.buttons.secondary.link}
            >
              {ctaData.buttons.secondary.text}
            </Button>
          </motion.div>

          <motion.p
            className="mt-8 text-white opacity-70 italic text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {ctaData.footnote}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
