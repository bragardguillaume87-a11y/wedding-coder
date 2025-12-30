"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";

// Client Supabase côté client (avec anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  // Cleanup pour les timeouts
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      // Récupère l'utilisateur connecté depuis le localStorage
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        router.push("/");
        return;
      }

      // 🔍 Teste la RLS policy SELECT
      // Grâce à la policy, on ne peut voir QUE notre propre ligne
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", userEmail)
        .limit(1); // on limite à 1 ligne

      if (fetchError) {
        console.error("❌ Erreur de chargement:", fetchError);
        setError(`Impossible de charger le profil: ${fetchError.message}`);
        return;
      }

      if (!data || data.length === 0) {
        setError("Aucun profil trouvé pour cet utilisateur.");
        return;
      }

      const row = data[0];
      setProfile(row);
      setNewName(row.full_name || "");
      console.log("✅ Profil chargé:", row);
    } catch (err: any) {
      console.error("❌ Erreur:", err);
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setMessage("");
    setError("");
    setEditing(false);

    try {
      // 🔍 Teste la RLS policy UPDATE
      // Grâce à la policy, on ne peut modifier QUE notre propre ligne
      const { error: updateError } = await supabase
        .from("users")
        .update({ full_name: newName || null })
        .eq("id", profile.id);

      if (updateError) {
        console.error("❌ Erreur de mise à jour:", updateError);
        setError(`Impossible de mettre à jour: ${updateError.message}`);
        return;
      }

      setMessage("✅ Profil mis à jour avec succès!");
      console.log("✅ Profil mis à jour");

      // Recharge le profil pour afficher les nouvelles données
      await loadProfile();

      // Cache le message après 3 secondes (avec cleanup automatique via useEffect)
      const timeoutId = setTimeout(() => setMessage(""), 3000);
      // Le cleanup sera géré par le useEffect global
    } catch (err: any) {
      console.error("❌ Erreur:", err);
      setError(err.message || "Erreur inconnue");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white flex items-center justify-center">
        <div className="text-2xl font-semibold text-[var(--charcoal)]">⏳ Chargement du profil...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-2 border-[var(--beige)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-red-600 text-xl font-bold mb-4">❌ Erreur</div>
          <p className="text-[var(--charcoal)] mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] text-white py-2 rounded-lg hover:shadow-lg transition"
          >
            Retour au Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[var(--terracotta)] hover:text-[var(--charcoal)] font-semibold transition-colors flex items-center gap-2"
          >
            <span>←</span> Retour au Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:shadow-lg transition text-sm"
          >
            🚪 Déconnexion
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[var(--beige)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-[var(--charcoal)] mb-6" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            👤 Mon Profil
          </h1>

          {/* Messages */}
          {message && (
            <motion.div
              className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-800 rounded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-800 rounded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Profile Info */}
          <div className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full px-4 py-2 border-2 border-[var(--beige)] rounded-lg bg-gray-100 text-[var(--charcoal)] cursor-not-allowed"
              />
              <p className="text-xs text-[var(--charcoal)] opacity-60 mt-1">
                🔒 L&apos;email ne peut pas être modifié
              </p>
            </div>

            {/* Full Name (editable) */}
            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                Nom complet
              </label>
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-2 border-2 border-[var(--terracotta)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:shadow-lg transition"
                    >
                      ✅ Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setNewName(profile?.full_name || "");
                      }}
                      className="flex-1 border-2 border-[var(--beige)] text-[var(--charcoal)] py-2 rounded-lg hover:border-[var(--terracotta)] transition"
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={profile?.full_name || "Non renseigné"}
                    disabled
                    className="flex-1 px-4 py-2 border-2 border-[var(--beige)] rounded-lg bg-gray-50 text-[var(--charcoal)]"
                  />
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] text-white rounded-lg hover:shadow-lg transition"
                  >
                    ✏️ Modifier
                  </button>
                </div>
              )}
            </div>

            {/* User ID (read-only) */}
            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                ID Utilisateur
              </label>
              <input
                type="text"
                value={profile?.id || ""}
                disabled
                className="w-full px-4 py-2 border-2 border-[var(--beige)] rounded-lg bg-gray-100 text-[var(--charcoal)] cursor-not-allowed font-mono text-sm"
              />
              <p className="text-xs text-[var(--charcoal)] opacity-60 mt-1">
                🆔 Identifiant unique Supabase
              </p>
            </div>

            {/* Created At (read-only) */}
            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                Membre depuis
              </label>
              <input
                type="text"
                value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString("fr-FR") : ""}
                disabled
                className="w-full px-4 py-2 border-2 border-[var(--beige)] rounded-lg bg-gray-100 text-[var(--charcoal)] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Info Box */}
          <motion.div
            className="mt-8 bg-gradient-to-r from-[var(--rose-powder)] to-[var(--gold)] bg-opacity-20 border-l-4 border-[var(--terracotta)] p-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[var(--charcoal)] text-sm">
              <strong className="text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                🔒 Sécurité RLS :
              </strong>
              {' '}Grâce aux Row Level Security policies,
              vous ne pouvez voir et modifier que vos propres données. Les autres utilisateurs
              sont invisibles pour vous !
            </p>
          </motion.div>
        </motion.div>

        {/* Debug Info (pour tester les RLS) */}
        <motion.div
          className="mt-6 bg-[var(--charcoal)] text-gray-100 rounded-2xl p-6 font-mono text-sm border-2 border-[var(--beige)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-bold mb-3 text-[var(--gold)]">🛠️ Debug Info</h3>
          <pre className="overflow-x-auto">
            {JSON.stringify(
              {
                id: profile?.id,
                email: profile?.email,
                full_name: profile?.full_name,
                created_at: profile?.created_at,
              },
              null,
              2
            )}
          </pre>
        </motion.div>
      </div>
    </div>
  );
}
