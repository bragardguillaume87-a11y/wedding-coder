/**
 * 🎮 Marqueur gaming personnalisé pour la carte MapTiler
 * Affiche un numéro d'étape avec des effets glow et animations
 * Version avec animation d'apparition staggerée RPG-style
 */

'use client';
import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { soundManager } from '@/lib/soundManager';
import { useMap } from './MapContext';
import { getCombinedIcons } from '@/lib/cityIcons';

interface GamingMarkerProps {
  position: [number, number]; // Format standard [lat, lng]
  eventNumber: number;
  event: {
    event_name: string;
    event_date: string;
    city_name: string;
    location_address: string;
    event_type?: string; // Type d'événement (ceremony, cocktail, dinner, etc.)
  };
  animationDelay?: number; // Délai d'apparition en ms
}

export default function GamingMarker({
  position,
  eventNumber,
  event,
  animationDelay = 0
}: GamingMarkerProps) {
  const { map, mapLoaded } = useMap();
  const markerRef = useRef<maptilersdk.Marker | null>(null);
  const popupRef = useRef<maptilersdk.Popup | null>(null);
  const soundPlayed = useRef(false);
  const isPinned = useRef(false); // État d'épinglage du popup

  // Créer le marqueur quand la carte est prête
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Récupérer les icônes dynamiques en fonction de la ville et du type d'événement
    const icons = getCombinedIcons(event.city_name, event.event_type);

    // Convertir position [lat, lng] standard → MapTiler [lng, lat]
    const mapTilerPosition: [number, number] = [position[1], position[0]];

    // Créer l'élément HTML du marqueur
    const el = document.createElement('div');
    el.className = 'gaming-marker-wrapper';
    // FIX: Ne PAS animer le wrapper (utilisé par MapTiler pour le positionnement)
    // L'animation sera sur l'élément enfant uniquement
    el.innerHTML = `
      <div class="gaming-marker gaming-marker-animated" style="animation-delay: ${animationDelay}ms">
        <div class="marker-glow"></div>
        <div class="marker-number">${eventNumber}</div>
        <div class="marker-ring"></div>
      </div>
    `;

    // Créer le contenu du popup avec design gaming premium + icônes dynamiques
    const popupContent = document.createElement('div');
    popupContent.className = 'gaming-popup-content';
    popupContent.innerHTML = `
      <!-- Badge étape avec gradient + icône type événement (dynamique) -->
      <div class="flex items-center gap-2 mb-3">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--terracotta)] to-[var(--rose-powder)] text-white rounded-full text-sm font-bold shadow-lg">
          <span class="text-lg">${icons.event}</span>
          <span>Étape ${eventNumber}</span>
        </div>
      </div>

      <!-- Titre avec icône ville (dynamique) -->
      <h3 class="text-2xl font-bold text-[var(--charcoal)] mb-3 flex items-center gap-2" style="font-family: var(--font-crimson-pro)">
        <span class="text-3xl">${icons.city}</span>
        ${event.event_name}
      </h3>

      <!-- Date avec icône calendrier stylisé -->
      <div class="flex items-center gap-3 mb-2 p-2 bg-gradient-to-r from-[var(--cream)] to-transparent rounded-lg">
        <div class="w-10 h-10 bg-gradient-to-br from-[var(--gold)] to-[var(--honey)] rounded-lg flex items-center justify-center shadow-md">
          <span class="text-xl">📅</span>
        </div>
        <span class="text-sm font-semibold text-[var(--charcoal)]">
          ${new Date(event.event_date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>

      <!-- Lieu avec icône ville (dynamique) + adresse postale complète -->
      <div class="flex items-start gap-3 p-2 bg-gradient-to-r from-[var(--cream)] to-transparent rounded-lg">
        <div class="w-10 h-10 bg-gradient-to-br from-[var(--terracotta)] to-[var(--rose-powder)] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
          <span class="text-xl">${icons.city}</span>
        </div>
        <div class="flex-1 min-w-0">
          <span class="text-sm font-semibold text-[var(--charcoal)] block break-words">
            ${event.location_address}
          </span>
          ${event.city_name ? `<span class="text-xs text-[var(--charcoal)] opacity-60 block mt-1">${event.city_name}</span>` : ''}
        </div>
      </div>

      <!-- Décorations RPG (coins dorés) -->
      <div class="corner-decoration corner-top-left"></div>
      <div class="corner-decoration corner-top-right"></div>
      <div class="corner-decoration corner-bottom-left"></div>
      <div class="corner-decoration corner-bottom-right"></div>
    `;

    // Créer le popup avec positionnement latéral forcé
    // TEST: Forcer 'left' pour éviter le débordement en bas
    const popup = new maptilersdk.Popup({
      offset: 48,
      className: 'gaming-popup',
      closeButton: true,
      closeOnClick: false,
      maxWidth: '400px',
      anchor: 'left', // Position fixe à gauche pour tester
    }).setDOMContent(popupContent);

    popupRef.current = popup;

    // Créer le marqueur avec anchor bottom (équivalent iconAnchor: [24, 48] de Leaflet)
    const marker = new maptilersdk.Marker({
      element: el,
      anchor: 'bottom', // Le bas du marqueur pointe vers la coordonnée
    })
      .setLngLat(mapTilerPosition)
      .setPopup(popup)
      .addTo(map);

    markerRef.current = marker;

    // Event listeners - Système tooltip + épinglage
    el.addEventListener('mouseenter', () => {
      soundManager.play('markerHover');
      // Ouvrir le popup au survol
      if (!marker.getPopup()?.isOpen()) {
        marker.togglePopup();
      }
    });

    el.addEventListener('mouseleave', () => {
      // Fermer le popup SEULEMENT s'il n'est pas épinglé
      if (!isPinned.current && marker.getPopup()?.isOpen()) {
        marker.togglePopup();
      }
    });

    el.addEventListener('click', (e) => {
      e.stopPropagation(); // Empêcher le clic de se propager à la carte
      isPinned.current = !isPinned.current; // Toggle l'épinglage
      soundManager.play('markerClick');

      // S'assurer que le popup est ouvert quand on épingle
      if (isPinned.current && !marker.getPopup()?.isOpen()) {
        marker.togglePopup();
      }

      // Ajouter classe CSS pour animation glow si épinglé
      const popupElement = marker.getPopup()?.getElement();
      if (popupElement) {
        if (isPinned.current) {
          popupElement.classList.add('pinned');
        } else {
          popupElement.classList.remove('pinned');
        }
      }
    });

    // Listener sur fermeture du popup pour réinitialiser l'épinglage
    popup.on('close', () => {
      isPinned.current = false;
      // Retirer la classe 'pinned' quand le popup se ferme
      const popupElement = marker.getPopup()?.getElement();
      if (popupElement) {
        popupElement.classList.remove('pinned');
      }
    });

    // Jouer le son "unlock" après le délai
    if (!soundPlayed.current) {
      const timer = setTimeout(() => {
        soundManager.play('markerUnlock');
        soundPlayed.current = true;
      }, animationDelay);

      return () => {
        clearTimeout(timer);
        marker.remove();
      };
    }

    return () => {
      marker.remove();
    };
  }, [map, mapLoaded, position, eventNumber, event, animationDelay]);

  return null; // Ce composant ne rend rien directement, il ajoute un marker à la carte
}
