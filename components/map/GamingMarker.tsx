/**
 * 🎮 Marqueur gaming personnalisé pour la carte
 * Affiche un numéro d'étape avec des effets glow et animations
 * Version avec animation d'apparition staggerée RPG-style
 */

'use client';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { soundManager } from '@/lib/soundManager';

// Création de l'icône HTML personnalisée avec effet glow
const createGamingIcon = (number: number, animationDelay: number) => {
  return L.divIcon({
    html: `
      <div class="gaming-marker-wrapper" style="animation-delay: ${animationDelay}ms">
        <div class="gaming-marker">
          <div class="marker-glow"></div>
          <div class="marker-number">${number}</div>
          <div class="marker-ring"></div>
        </div>
      </div>
    `,
    className: '', // Pas de className par défaut
    iconSize: [48, 48],
    iconAnchor: [24, 48], // Point d'ancrage en bas du marqueur
    popupAnchor: [0, -48], // Popup au-dessus du marqueur
  });
};

interface GamingMarkerProps {
  position: [number, number];
  eventNumber: number;
  event: {
    event_name: string;
    event_date: string;
    city_name: string;
    location_address: string;
  };
  animationDelay?: number; // Délai d'apparition en ms
}

export default function GamingMarker({
  position,
  eventNumber,
  event,
  animationDelay = 0
}: GamingMarkerProps) {
  const soundPlayed = useRef(false);

  // Jouer le son "unlock" après le délai
  useEffect(() => {
    if (soundPlayed.current) return;

    const timer = setTimeout(() => {
      soundManager.play('markerUnlock');
      soundPlayed.current = true;
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <Marker
      position={position}
      icon={createGamingIcon(eventNumber, animationDelay)}
      eventHandlers={{
        // Sons et effets au survol
        mouseover: (e) => {
          e.target.openPopup();
          soundManager.play('markerHover');
        },
        // Son au clic
        click: () => {
          soundManager.play('markerClick');
        },
      }}
    >
      <Popup className="gaming-popup">
        <div className="p-4 min-w-[250px]">
          {/* Badge numéro d'étape */}
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] text-white rounded-full text-xs font-bold mb-3">
            Étape {eventNumber}
          </div>

          {/* Nom de l'événement */}
          <h3
            className="text-xl font-bold text-[var(--charcoal)] mb-2"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            {event.event_name}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-[var(--charcoal)] opacity-70 mb-2">
            <span>📅</span>
            <span>{new Date(event.event_date).toLocaleDateString('fr-FR')}</span>
          </div>

          {/* Ville */}
          <div className="flex items-center gap-2 text-sm text-[var(--charcoal)] opacity-70">
            <span>📍</span>
            <span>{event.city_name || event.location_address}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
