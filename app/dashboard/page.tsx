"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading } = useUser();
  const router = useRouter();
interface Event {
  id: string;
  event_name: string;
  description?: string;
  event_date: string;
  department_name?: string;
  city_name?: string;
  budget_per_person?: number;
  status?: string;
}

  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("local_events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl">⏳ Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-900">
            💍 Wedding-Coder
          </h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={() => router.push("/dashboard/create-event")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              ➕ Créer un événement
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Événements locaux
        </h2>

        {loadingEvents ? (
          <p className="text-center text-gray-600">⏳ Chargement des événements...</p>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              Aucun événement créé pour le moment.
            </p>
            <button
              onClick={() => router.push("/dashboard/create-event")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Créer le premier événement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/dashboard/event/${event.id}`)}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.event_name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {event.description?.substring(0, 100)}...
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    📅 {new Date(event.event_date).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-gray-700">
                    📍 {event.department_name || event.city_name}
                  </p>
                  {event.budget_per_person && (
                    <p className="text-gray-700">
                      💰 {event.budget_per_person}€/personne
                    </p>
                  )}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {event.status === "confirmed" ? "Confirmé" : "En planning"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}