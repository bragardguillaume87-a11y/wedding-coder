"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

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
        .single();

      if (fetchError) {
        console.error("❌ Erreur de chargement:", fetchError);
        setError(`Impossible de charger le profil: ${fetchError.message}`);
        return;
      }

      setProfile(data);
      setNewName(data.full_name || "");
      console.log("✅ Profil chargé:", data);
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

      // Cache le message après 3 secondes
      setTimeout(() => setMessage(""), 3000);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-indigo-900">⏳ Chargement du profil...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-red-600 text-xl font-bold mb-4">❌ Erreur</div>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            ← Retour au Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
          >
            🚪 Déconnexion
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-6">
            👤 Mon Profil
          </h1>

          {/* Messages */}
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded">
              {error}
            </div>
          )}

          {/* Profile Info */}
          <div className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                🔒 L'email ne peut pas être modifié
              </p>
            </div>

            {/* Full Name (editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      ✅ Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setNewName(profile?.full_name || "");
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                  />
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    ✏️ Modifier
                  </button>
                </div>
              )}
            </div>

            {/* User ID (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Utilisateur
              </label>
              <input
                type="text"
                value={profile?.id || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                🆔 Identifiant unique Supabase
              </p>
            </div>

            {/* Created At (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membre depuis
              </label>
              <input
                type="text"
                value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString("fr-FR") : ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800 text-sm">
              <strong>🔒 Sécurité RLS :</strong> Grâce aux Row Level Security policies,
              tu ne peux voir et modifier QUE tes propres données. Les autres utilisateurs
              sont invisibles pour toi !
            </p>
          </div>
        </div>

        {/* Debug Info (pour tester les RLS) */}
        <div className="mt-6 bg-gray-800 text-gray-100 rounded-lg p-6 font-mono text-sm">
          <h3 className="text-lg font-bold mb-3">🛠️ Debug Info</h3>
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
        </div>
      </div>
    </div>
  );
}
