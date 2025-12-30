'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

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
            Venez faire partie de notre histoire
          </h2>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white border-opacity-20">
            <p className="text-xl md:text-2xl text-white leading-relaxed mb-6">
              Ce mariage itinérant, c&apos;est notre façon de dire :
              <br />
              <span className="font-bold">vous comptez. Chacun. Vraiment.</span>
            </p>
            <p className="text-lg text-white opacity-90 leading-relaxed">
              Alors ouvrez-nous votre porte, et faites partie de l&apos;aventure.
            </p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href="/login">
              <motion.button
                className="bg-white text-[var(--terracotta)] font-semibold py-4 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: 'var(--font-crimson-pro)' }}
              >
                Confirmer ma présence
              </motion.button>
            </Link>
            <motion.button
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg text-lg hover:bg-white hover:bg-opacity-10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Questions fréquentes
            </motion.button>
          </motion.div>

          {/* Petite touche d'humour */}
          <motion.p
            className="mt-8 text-white opacity-70 italic text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            (Préparez le café, on arrive. Et peut-être des mouchoirs, on ne promet rien.)
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
