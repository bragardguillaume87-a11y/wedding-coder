"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    event_date: "",
    event_time: "",
    location_name: "",
    location_address: "",
    department_code: "",
    department_name: "",
    city_name: "",
    budget_per_person: "",
    max_guests: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // On va créer une cérémonie par défaut si elle n'existe pas
      const ceremonyId = 1; // Pour l'instant on suppose qu'il y en a une

      const { error } = await supabase.from("local_events").insert([
        {
          ceremony_id: ceremonyId,
          created_by: user!.id,
          ...formData,
          budget_per_person: parseFloat(formData.budget_per_person) || null,
          max_guests: parseInt(formData.max_guests) || null,
        },
      ]);

      if (error) throw error;

      setMessage("✅ Événement créé avec succès !");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      setMessage(`❌ Erreur: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-900">
            💍 Wedding-Coder
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ← Retour au Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Créer un événement local
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom de l'événement */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom de l&apos;événement *
              </label>
              <input
                type="text"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                placeholder="ex: Soirée dansante à Lyon"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez l'événement..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
              />
            </div>

            {/* Date et Heure */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  title="Date de l'événement"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Heure</label>
                <input
                  type="time"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleChange}
                  title="Heure de l'événement"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                />
              </div>
            </div>

            {/* Lieu */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom du lieu
              </label>
              <input
                type="text"
                name="location_name"
                value={formData.location_name}
                onChange={handleChange}
                placeholder="ex: Salle des Fêtes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adresse</label>
              <input
                type="text"
                name="location_address"
                value={formData.location_address}
                onChange={handleChange}
                placeholder="ex: 123 Rue de la Fête, 69000 Lyon"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
              />
            </div>

            {/* Département et Ville */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Code département
                </label>
                <input
                  type="text"
                  name="department_code"
                  value={formData.department_code}
                  onChange={handleChange}
                  placeholder="ex: 69"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Département
                </label>
                <input
                  type="text"
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleChange}
                  placeholder="ex: Rhône"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ville</label>
                <input
                  type="text"
                  name="city_name"
                  value={formData.city_name}
                  onChange={handleChange}
                  placeholder="ex: Lyon"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                />
              </div>
            </div>

            {/* Budget et Max invités */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget par personne (€)
                </label>
                <input
                  type="number"
                  name="budget_per_person"
                  value={formData.budget_per_person}
                  onChange={handleChange}
                  placeholder="ex: 25"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre max d&apos;invités
                </label>
                <input
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleChange}
                  placeholder="ex: 50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
                />
              </div>
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "⏳ Création..." : "Créer l'événement"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm font-medium text-gray-700 bg-gray-100 p-3 rounded">
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}