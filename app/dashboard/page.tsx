"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupère l'email depuis le localStorage (simple pour le moment)
    // TODO: Remplacer par une vraie gestion de session avec Supabase
    const email = localStorage.getItem("userEmail");
    
    if (!email) {
      // Si pas d'email stocké, redirige vers la page de connexion
      router.push("/");
    } else {
      setUserEmail(email);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-indigo-900">⏳ Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-indigo-900 mb-2">
                💍 Wedding-Coder Dashboard
              </h1>
              <p className="text-gray-600">
                Bienvenue, <span className="font-semibold">{userEmail}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profil Card */}
          <Link href="/profile">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">
                Mon Profil
              </h2>
              <p className="text-gray-600">
                Voir et modifier mes informations personnelles
              </p>
              <div className="mt-4 text-indigo-600 font-semibold">
                Accéder →
              </div>
            </div>
          </Link>

          {/* Événements Card (à venir) */}
          <div className="bg-gray-100 rounded-lg shadow-lg p-6 opacity-50 cursor-not-allowed">
            <div className="text-5xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Mes Événements
            </h2>
            <p className="text-gray-500">
              Gérer mes événements de mariage
            </p>
            <div className="mt-4 text-gray-500 font-semibold">
              Prochainement...
            </div>
          </div>

          {/* Invitations Card (à venir) */}
          <div className="bg-gray-100 rounded-lg shadow-lg p-6 opacity-50 cursor-not-allowed">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Invitations
            </h2>
            <p className="text-gray-500">
              Créer et envoyer des invitations
            </p>
            <div className="mt-4 text-gray-500 font-semibold">
              Prochainement...
            </div>
          </div>

          {/* Carte Interactive Card (à venir) */}
          <div className="bg-gray-100 rounded-lg shadow-lg p-6 opacity-50 cursor-not-allowed">
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              Carte Interactive
            </h2>
            <p className="text-gray-500">
              Visualiser les lieux du mariage
            </p>
            <div className="mt-4 text-gray-500 font-semibold">
              Prochainement...
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-800">
            <strong>🎯 Note :</strong> Cette page dashboard évoluera avec de nouvelles fonctionnalités.
            Pour l'instant, tu peux accéder à ton profil pour tester les RLS policies !
          </p>
        </div>
      </div>
    </div>
  );
}
