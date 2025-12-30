'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold text-white mb-4">Wedding-Coder</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Réinventer les mariages en les rendant inclusifs et authentiques.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">
                🐦
              </a>
              <a href="#" className="hover:text-white transition">
                📘
              </a>
              <a href="#" className="hover:text-white transition">
                📷
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-4">Produit</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="hover:text-white transition">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white transition">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-white transition">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-4">Ressources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#guides" className="hover:text-white transition">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#support" className="hover:text-white transition">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition">
                  Gestion des cookies
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-slate-800 my-12" />

        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Wedding-Coder. Tous droits réservés.
            </p>
          </div>

          <div className="flex gap-8">
            <Link href="/login" className="font-semibold text-white hover:text-blue-400 transition">
              Accès Platform
            </Link>
            <Link href="#contact" className="font-semibold text-white hover:text-blue-400 transition">
              Nous Contacter
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-white font-semibold mb-4">
            Prêt à transformer votre mariage ? 🎉
          </p>
          <Link href="/login">
            <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transition">
              Commencer Gratuitement
            </button>
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}
