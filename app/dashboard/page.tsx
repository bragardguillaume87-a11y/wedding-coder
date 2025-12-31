"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'auth et rediriger si nécessaire
    const email = localStorage.getItem("userEmail");

    if (!email) {
      router.push("/login");
      return;
    }

    // Utiliser setTimeout pour éviter setState synchrone dans l'effet
    const timer = setTimeout(() => {
      setUserEmail(email);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white flex items-center justify-center">
        <div className="text-2xl font-semibold text-[var(--charcoal)]">⏳ Chargement...</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-[var(--beige)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">💍</span>
                <h1 className="text-4xl font-bold text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  Votre Espace Mariage
                </h1>
              </div>
              <p className="text-[var(--charcoal)] opacity-70 ml-16">
                Bienvenue, <span className="font-semibold text-[var(--terracotta)]">{userEmail}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/">
                <button className="px-6 py-2 border-2 border-[var(--beige)] text-[var(--charcoal)] rounded-lg hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition">
                  🏠 Accueil
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:shadow-lg transition"
              >
                🚪 Déconnexion
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profil Card */}
          <motion.div variants={itemVariants}>
            <Link href="/profile">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer border-2 border-[var(--beige)] hover:border-[var(--terracotta)] h-full">
                <div className="text-5xl mb-4">👤</div>
                <h2 className="text-2xl font-bold text-[var(--charcoal)] mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  Mon Profil
                </h2>
                <p className="text-[var(--charcoal)] opacity-70 mb-4">
                  Gérer mes informations personnelles
                </p>
                <div className="text-[var(--terracotta)] font-semibold">
                  Accéder →
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Notre Mariage Card */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/create-event">
              <div className="bg-gradient-to-br from-[var(--rose-powder)] to-[var(--gold)] bg-opacity-20 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer border-2 border-[var(--terracotta)] h-full">
                <div className="text-5xl mb-4">💝</div>
                <h2 className="text-2xl font-bold text-[var(--charcoal)] mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  Notre Mariage
                </h2>
                <p className="text-[var(--charcoal)] opacity-80 mb-4">
                  Créer et gérer notre événement
                </p>
                <div className="text-[var(--terracotta)] font-semibold">
                  Créer l&apos;événement →
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Carte du Parcours Card - NOUVEAU ! */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/journey-map">
              <div className="bg-gradient-to-br from-[var(--gold)] to-[var(--honey)] bg-opacity-20 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer border-2 border-[var(--gold)] h-full">
                <div className="text-5xl mb-4">🗺️</div>
                <h2 className="text-2xl font-bold text-[var(--charcoal)] mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  Carte du Parcours
                </h2>
                <p className="text-[var(--charcoal)] opacity-80 mb-4">
                  Visualisez toutes les étapes de votre voyage sur une carte interactive
                </p>
                <div className="text-[var(--terracotta)] font-semibold">
                  Voir la carte →
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Invitations Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-lg p-6 opacity-60 cursor-not-allowed border-2 border-[var(--beige)] h-full">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="text-2xl font-bold text-[var(--charcoal)] opacity-60 mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                Invitations
              </h2>
              <p className="text-[var(--charcoal)] opacity-50 mb-4">
                Envoyer des invitations personnalisées
              </p>
              <div className="text-[var(--charcoal)] opacity-50 font-semibold">
                Prochainement...
              </div>
            </div>
          </motion.div>

          {/* Photos Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-lg p-6 opacity-60 cursor-not-allowed border-2 border-[var(--beige)] h-full">
              <div className="text-5xl mb-4">📸</div>
              <h2 className="text-2xl font-bold text-[var(--charcoal)] opacity-60 mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                Galerie Photos
              </h2>
              <p className="text-[var(--charcoal)] opacity-50 mb-4">
                Partager nos souvenirs
              </p>
              <div className="text-[var(--charcoal)] opacity-50 font-semibold">
                Prochainement...
              </div>
            </div>
          </motion.div>

          {/* Messages Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-lg p-6 opacity-60 cursor-not-allowed border-2 border-[var(--beige)] h-full">
              <div className="text-5xl mb-4">💌</div>
              <h2 className="text-2xl font-bold text-[var(--charcoal)] opacity-60 mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                Messages
              </h2>
              <p className="text-[var(--charcoal)] opacity-50 mb-4">
                Recevoir les vœux des invités
              </p>
              <div className="text-[var(--charcoal)] opacity-50 font-semibold">
                Prochainement...
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-[var(--rose-powder)] to-[var(--gold)] bg-opacity-20 border-l-4 border-[var(--terracotta)] p-6 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-[var(--charcoal)]">
            <strong className="text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
              💝 Votre espace personnel
            </strong>
            <br />
            <span className="opacity-80">
              Ici, vous pouvez gérer tous les aspects de votre mariage itinérant. Commencez par créer votre événement, puis invitez vos proches à faire partie de l&apos;aventure !
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
