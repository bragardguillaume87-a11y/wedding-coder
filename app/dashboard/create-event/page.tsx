"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { geocodeAddress, delay } from "@/lib/geocoding";

export default function CreateEvent() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);

  // États pour le géocodage automatique
  const [geocoding, setGeocoding] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geocodingError, setGeocodingError] = useState("");

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

  // Vérification authentification via localStorage
  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      router.push("/login");
    } else {
      setUserEmail(email);
      setAuthLoading(false);
    }
  }, [router]);

  // Cleanup du timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [redirectTimeout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Géocodage automatique au blur de l'adresse
  const handleAddressBlur = async () => {
    const address = formData.location_address?.trim();

    if (!address) {
      setCoords(null);
      setGeocodingError("");
      return;
    }

    setGeocoding(true);
    setGeocodingError("");

    try {
      // Rate limiting: attendre 1 seconde (requis par Nominatim)
      await delay(1000);

      const result = await geocodeAddress(address);

      if (result) {
        setCoords({ lat: result.latitude, lng: result.longitude });
        console.log('✅ Adresse géocodée:', result.display_name);
      } else {
        setGeocodingError("Adresse introuvable. Vérifiez l'orthographe.");
        setCoords(null);
      }
    } catch (error) {
      console.error('❌ Erreur géocodage:', error);
      setGeocodingError("Erreur lors du géocodage.");
      setCoords(null);
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const eventData: Record<string, unknown> = {
        ...formData,
        budget_per_person: parseFloat(formData.budget_per_person) || null,
        max_guests: parseInt(formData.max_guests) || null,
      };

      // Ajouter les coordonnées GPS si disponibles (seulement si les colonnes existent)
      if (coords) {
        eventData.latitude = coords.lat;
        eventData.longitude = coords.lng;
        eventData.geocoded_at = new Date().toISOString();
        eventData.geocoding_source = 'nominatim';
        eventData.country_code = 'FR';
      }

      const { error } = await supabase.from("local_events").insert([eventData]);

      if (error) {
        // Si l'erreur concerne les colonnes de géocodage qui n'existent pas, on informe l'utilisateur
        if (error.message.includes('column') && (error.message.includes('latitude') || error.message.includes('country_code'))) {
          throw new Error("⚠️ Les colonnes de géocodage n'existent pas encore. Veuillez exécuter la migration SQL d'abord.");
        }
        throw error;
      }

      setMessage("✅ Événement créé avec succès !");
      const timeoutId = setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      setRedirectTimeout(timeoutId);
    } catch (error) {
      setMessage(`❌ Erreur: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Écran de chargement pendant vérification auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white flex items-center justify-center">
        <div className="text-2xl font-semibold text-[var(--charcoal)]">⏳ Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white">
      {/* Header */}
      <motion.header
        className="bg-white shadow-md border-b-2 border-[var(--beige)]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            💍 Créer un Événement
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="border-2 border-[var(--beige)] text-[var(--charcoal)] px-4 py-2 rounded-lg hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition flex items-center gap-2"
          >
            <span>←</span> Retour au Dashboard
          </button>
        </div>
      </motion.header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[var(--beige)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-2" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
              Créer un événement local
            </h2>
            <p className="text-[var(--charcoal)] opacity-70">
              Ajoutez une étape à votre mariage itinérant
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom de l'événement */}
            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                Nom de l&apos;événement *
              </label>
              <input
                type="text"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                placeholder="ex: Soirée dansante à Lyon"
                className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez l'événement..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
              />
            </div>

            {/* Date et Heure */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  title="Date de l'événement"
                  className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">Heure</label>
                <input
                  type="time"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleChange}
                  title="Heure de l'événement"
                  className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
                />
              </div>
            </div>

            {/* Lieu */}
            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                Nom du lieu
              </label>
              <input
                type="text"
                name="location_name"
                value={formData.location_name}
                onChange={handleChange}
                placeholder="ex: Salle des Fêtes"
                className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">Adresse</label>
              <input
                type="text"
                name="location_address"
                value={formData.location_address}
                onChange={handleChange}
                onBlur={handleAddressBlur}
                placeholder="ex: 123 Rue de la Fête, 69000 Lyon"
                className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
              />

              {/* Feedback géocodage */}
              {geocoding && (
                <p className="text-xs text-[var(--terracotta)] mt-2 flex items-center gap-2">
                  <span className="animate-pulse">🔍</span>
                  Recherche de l&apos;adresse...
                </p>
              )}

              {coords && !geocoding && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-2">
                  <span>✅</span>
                  Adresse trouvée ! (lat: {coords.lat.toFixed(4)}, lng: {coords.lng.toFixed(4)})
                </p>
              )}

              {geocodingError && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-2">
                  <span>⚠️</span>
                  {geocodingError}
                </p>
              )}
            </div>

            {/* Département et Ville */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                  Code département
                </label>
                <input
                  type="text"
                  name="department_code"
                  value={formData.department_code}
                  onChange={handleChange}
                  placeholder="ex: 69"
                  className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                  Département
                </label>
                <input
                  type="text"
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleChange}
                  placeholder="ex: Rhône"
                  className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">Ville</label>
                <input
                  type="text"
                  name="city_name"
                  value={formData.city_name}
                  onChange={handleChange}
                  placeholder="ex: Lyon"
                  className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
                />
              </div>
            </div>

            {/* Budget et Max invités */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                  Budget par personne (€)
                </label>
                <input
                  type="number"
                  name="budget_per_person"
                  value={formData.budget_per_person}
                  onChange={handleChange}
                  placeholder="ex: 25"
                  className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--charcoal)] mb-2">
                  Nombre max d&apos;invités
                </label>
                <input
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleChange}
                  placeholder="ex: 50"
                  className="w-full px-4 py-3 border-2 border-[var(--beige)] rounded-lg focus:outline-none focus:border-[var(--terracotta)] text-[var(--charcoal)] transition-colors"
                />
              </div>
            </div>

            {/* Bouton Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-crimson-pro)' }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? "⏳ Création..." : "Créer l'événement"}
            </motion.button>
          </form>

          {message && (
            <motion.div
              className={`mt-4 text-center text-sm font-medium p-4 rounded-lg ${
                message.includes("✅")
                  ? "bg-green-50 border-l-4 border-green-500 text-green-800"
                  : "bg-red-50 border-l-4 border-red-500 text-red-800"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.div>
          )}

          {/* Info Box */}
          <motion.div
            className="mt-8 bg-gradient-to-r from-[var(--rose-powder)] to-[var(--gold)] bg-opacity-20 border-l-4 border-[var(--terracotta)] p-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[var(--charcoal)] text-sm">
              <strong className="text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                💝 Mariage itinérant :
              </strong>
              {' '}Créez autant d&apos;événements que d&apos;étapes dans votre voyage.
              Chaque ville, chaque région peut avoir sa propre célébration !
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
