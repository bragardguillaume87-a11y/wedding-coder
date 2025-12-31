"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      if (isLogin) {
        // Connexion réussie
        localStorage.setItem("userEmail", email);
        setMessage("✅ Connexion réussie !");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        // Inscription réussie
        setMessage("✅ Compte créé ! Vous pouvez maintenant vous connecter.");
        setTimeout(() => {
          setIsLogin(true);
          setPassword("");
        }, 2000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Décoration arrière-plan */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[var(--rose-powder)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--gold)] rounded-full blur-3xl" />
      </div>

      {/* Bouton retour */}
      <Link href="/" className="absolute top-8 left-8 z-20">
        <motion.button
          className="flex items-center gap-2 text-[var(--charcoal)] hover:text-[var(--terracotta)] transition-colors"
          whileHover={{ x: -5 }}
        >
          <span className="text-2xl">←</span>
          <span className="font-semibold">Retour à l&apos;accueil</span>
        </motion.button>
      </Link>

      {/* Carte de connexion */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-[var(--beige)]">
          {/* Logo/Titre */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💍</div>
            <h1 className="text-3xl font-bold text-[var(--charcoal)] mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
              {isLogin ? "Bon retour !" : "Rejoignez-nous"}
            </h1>
            <p className="text-[var(--charcoal)] opacity-70">
              {isLogin
                ? "Connectez-vous pour accéder à votre espace"
                : "Créez votre compte pour commencer"}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-semibold">❌ Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] transition-colors text-[var(--charcoal)]"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] transition-colors text-[var(--charcoal)]"
                placeholder="••••••••"
              />
              {!isLogin && (
                <p className="text-xs text-[var(--charcoal)] opacity-60 mt-1">
                  Minimum 6 caractères
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-crimson-pro)' }}
            >
              {loading
                ? "⏳ Chargement..."
                : isLogin
                  ? "Se connecter"
                  : "Créer mon compte"}
            </button>
          </form>

          {/* Basculer entre login et signup */}
          <div className="mt-6 text-center">
            <p className="text-[var(--charcoal)] opacity-70 text-sm">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setMessage("");
              }}
              className="text-[var(--terracotta)] font-semibold hover:underline mt-1"
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </button>
          </div>

          {/* Note pour les invités */}
          {isLogin && (
            <div className="mt-8 p-4 bg-[var(--cream)] rounded-lg border border-[var(--beige)]">
              <p className="text-xs text-[var(--charcoal)] opacity-70 text-center italic">
                💝 Cette page est réservée aux mariés pour gérer leur événement.
                <br />
                Les invités recevront un lien personnel par email.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
