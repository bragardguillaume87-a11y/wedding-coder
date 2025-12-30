/**
 * Page de la carte interactive du parcours de mariage
 * Affiche tous les événements sur une carte Leaflet avec animations gaming
 */

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import { sortEventsByDate, calculateCenter, calculateTotalDistance, FRANCE_CENTER, DEFAULT_ZOOM } from '@/lib/mapHelpers';
import type { MapEvent } from '@/lib/mapHelpers';
import { motion } from 'framer-motion';

// Dynamic imports pour Leaflet (incompatible avec SSR)
const BaseMap = dynamic(() => import('@/components/map/BaseMap'), { ssr: false });
const GamingMarker = dynamic(() => import('@/components/map/GamingMarker'), { ssr: false });
const JourneyPath = dynamic(() => import('@/components/map/JourneyPath'), { ssr: false });
const SoundToggle = dynamic(() => import('@/components/ui/SoundToggle'), { ssr: false });
const AnimatedCounter = dynamic(() => import('@/components/ui/AnimatedCounter'), { ssr: false });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function JourneyMapPage() {
  const router = useRouter();
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    // Vérifier l'authentification
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      router.push('/login');
      return;
    }

    try {
      // Charger tous les événements géocodés
      const { data, error } = await supabase
        .from('local_events')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('event_date', { ascending: true });

      if (error) throw error;

      setEvents(data || []);
      console.log(`✅ ${data?.length || 0} événement(s) chargé(s)`);
    } catch (error) {
      console.error('❌ Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--cream)] to-white">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-4 animate-pulse">🗺️</div>
          <p className="text-2xl font-bold text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            Chargement de la carte...
          </p>
        </motion.div>
      </div>
    );
  }

  // Filtrer pour être 100% sûr qu'on a des coordonnées valides
  const validEvents = events.filter(
    (e) => e.latitude != null && e.longitude != null && !isNaN(e.latitude) && !isNaN(e.longitude)
  );

  const sortedEvents = sortEventsByDate(validEvents);
  const mapCenter = validEvents.length > 0 ? calculateCenter(validEvents) : FRANCE_CENTER;
  const positions: [number, number][] = sortedEvents.map((e) => [e.latitude, e.longitude]);
  const totalDistance = calculateTotalDistance(sortedEvents);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="text-[var(--terracotta)] hover:text-[var(--charcoal)] font-semibold mb-4 flex items-center gap-2 transition-colors"
          >
            <span>←</span> Retour au Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🗺️</span>
              <div>
                <h1
                  className="text-4xl md:text-5xl font-bold text-[var(--charcoal)]"
                  style={{ fontFamily: 'var(--font-crimson-pro)' }}
                >
                  Carte du Parcours
                </h1>
                <p className="text-lg text-[var(--charcoal)] opacity-70 mt-1">
                  {validEvents.length} étape{validEvents.length > 1 ? 's' : ''}
                  {totalDistance > 0 && (
                    <>
                      {' • '}
                      <AnimatedCounter
                        value={totalDistance}
                        duration={2}
                        delay={
                          // Démarrer après que tous les waypoints soient apparus
                          400 + // Délai initial ligne
                          (validEvents.length - 2) * 300 + // Durée ligne
                          validEvents.length * 200 + // Tous les waypoints
                          300 // Petit délai supplémentaire
                        }
                        suffix=" km au total"
                      />
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* État vide */}
        {validEvents.length === 0 ? (
          <motion.div
            className="bg-white rounded-2xl p-12 text-center border-2 border-[var(--beige)] shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-4">📍</div>
            <h2
              className="text-2xl font-bold text-[var(--charcoal)] mb-3"
              style={{ fontFamily: 'var(--font-crimson-pro)' }}
            >
              Aucun événement géolocalisé
            </h2>
            <p className="text-[var(--charcoal)] opacity-70 mb-6">
              Créez un événement avec une adresse pour le voir apparaître sur la carte.
            </p>
            <button
              onClick={() => router.push('/dashboard/create-event')}
              className="bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Créer un événement
            </button>
          </motion.div>
        ) : (
          <>
            {/* Carte interactive */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BaseMap center={mapCenter} zoom={DEFAULT_ZOOM}>
                {/* Ligne de parcours style Tour de France */}
                <JourneyPath positions={positions} animated={true} />

                {/* Marqueurs gaming pour chaque événement */}
                {sortedEvents.map((event, index) => {
                  // Calculer le délai d'apparition du marqueur
                  // La ligne se dessine d'abord, puis les marqueurs apparaissent un par un
                  const lineAnimationDuration = (sortedEvents.length - 2) * 300; // Durée totale de la ligne
                  const baseDelay = 400; // Délai avant que la ligne commence
                  const markerStagger = 200; // Délai entre chaque marqueur
                  const animationDelay = baseDelay + lineAnimationDuration + (index * markerStagger);

                  return (
                    <GamingMarker
                      key={event.id}
                      position={[event.latitude, event.longitude]}
                      eventNumber={index + 1}
                      event={event}
                      animationDelay={animationDelay}
                    />
                  );
                })}
              </BaseMap>
            </motion.div>

            {/* Liste chronologique des étapes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2
                className="text-2xl font-bold text-[var(--charcoal)] mb-4"
                style={{ fontFamily: 'var(--font-crimson-pro)' }}
              >
                📅 Chronologie du parcours
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="bg-white rounded-xl p-4 border-2 border-[var(--beige)] hover:border-[var(--terracotta)] transition-all cursor-pointer hover:shadow-lg"
                    whileHover={{ y: -4 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Numéro d'étape */}
                      <div className="w-10 h-10 bg-gradient-to-br from-[var(--terracotta)] to-[var(--rose-powder)] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-[var(--charcoal)] mb-1">
                          {event.event_name}
                        </h3>
                        <p className="text-sm text-[var(--charcoal)] opacity-70">
                          📅 {new Date(event.event_date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-[var(--charcoal)] opacity-70">
                          📍 {event.city_name || 'Lieu'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Info parcours */}
            <motion.div
              className="mt-8 bg-gradient-to-r from-[var(--rose-powder)] to-[var(--gold)] bg-opacity-20 border-l-4 border-[var(--terracotta)] p-6 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-[var(--charcoal)]">
                <strong className="text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                  🚗 Votre parcours itinérant
                </strong>
                <br />
                <span className="opacity-80">
                  Les événements sont affichés dans l&apos;ordre chronologique. La ligne relie chaque étape
                  pour visualiser votre voyage à travers la France et au-delà !
                </span>
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* Bouton de contrôle du son (position fixe en bas à droite) */}
      <SoundToggle />
    </div>
  );
}
