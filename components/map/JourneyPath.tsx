/**
 * 🗺️ Ligne de parcours style Tour de France + RPG
 * Relie tous les points chronologiquement avec animation progressive
 * Version MapTiler avec Framer Motion pour des animations ultra-smooth
 */

'use client';
import { useEffect, useState } from 'react';
import { useMotionValue, animate } from 'framer-motion';
import * as maptilersdk from '@maptiler/sdk';
import { soundManager } from '@/lib/soundManager';
import { useMap } from './MapContext';

interface JourneyPathProps {
  positions: [number, number][]; // Format standard [lat, lng]
  animated?: boolean;
  onComplete?: () => void;
}

export default function JourneyPath({
  positions,
  animated = true,
  onComplete
}: JourneyPathProps) {
  const { map, mapLoaded } = useMap();
  const [animatedPositions, setAnimatedPositions] = useState<[number, number][]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);

  // Motion value pour l'animation progressive (0 à 1)
  const progress = useMotionValue(0);

  // Convertir positions standard [lat, lng] vers GeoJSON [lng, lat]
  const convertToGeoJSON = (positions: [number, number][]) => {
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: positions.map(([lat, lng]) => [lng, lat])
      }
    };
  };

  // Animation progressive du tracé
  useEffect(() => {
    // Validation robuste: vérifier qu'on a au moins 2 positions VALIDES
    if (positions.length < 2 || !positions[0] || !positions[1]) {
      const timer = setTimeout(() => setAnimatedPositions([]), 0);
      return () => clearTimeout(timer);
    }

    if (!animated) {
      const timer = setTimeout(() => setAnimatedPositions(positions), 0);
      return () => clearTimeout(timer);
    }

    // Initialiser avec les 2 premiers points
    let initTimer: NodeJS.Timeout;
    if (positions[0] && positions[1]) {
      initTimer = setTimeout(() => setAnimatedPositions([positions[0], positions[1]]), 0);
    } else {
      initTimer = setTimeout(() => setAnimatedPositions([]), 0);
      return () => clearTimeout(initTimer);
    }

    // Commencer l'animation après un court délai
    const startDelay = setTimeout(() => {
      setIsAnimating(true);

      // Jouer le son de tracé
      soundManager.play('pathDraw');

      // Animation de la lueur (pulse pendant le tracé)
      const glowInterval = setInterval(() => {
        setGlowIntensity(prev => (prev + 0.1) % 1);
      }, 100);

      // Calculer la durée totale (300ms par segment)
      const totalDuration = (positions.length - 2) * 300;

      // Animer le progress de 0 à 1
      const controls = animate(progress, 1, {
        duration: totalDuration / 1000, // Convertir en secondes
        ease: "easeInOut",
        onUpdate: (latest) => {
          // Calculer combien de points afficher basé sur le progress
          const targetIndex = Math.floor(2 + (latest * (positions.length - 2)));

          // Ajouter progressivement les points
          setAnimatedPositions(positions.slice(0, Math.max(2, targetIndex + 1)));
        },
        onComplete: () => {
          // S'assurer que tous les points sont affichés
          setAnimatedPositions(positions);
          setIsAnimating(false);
          clearInterval(glowInterval);
          setGlowIntensity(0);

          // Callback quand terminé
          if (onComplete) {
            onComplete();
          }
        }
      });

      return () => {
        controls.stop();
        clearInterval(glowInterval);
      };
    }, 400); // Délai de 400ms avant de commencer le tracé

    return () => {
      clearTimeout(startDelay);
      clearTimeout(initTimer);
    };
  }, [positions, animated, onComplete, progress]);

  // Ajouter/mettre à jour les layers MapTiler quand animatedPositions change
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Triple sécurité: vérifier la longueur ET que chaque position existe
    if (animatedPositions.length < 2 ||
        !animatedPositions.every(pos => pos && pos[0] != null && pos[1] != null)) {
      return;
    }

    const geojsonData = convertToGeoJSON(animatedPositions);

    // ===== COUCHE 1 : OMBRE =====
    if (map.getSource('journey-shadow-source')) {
      (map.getSource('journey-shadow-source') as maptilersdk.GeoJSONSource).setData(geojsonData);
    } else {
      map.addSource('journey-shadow-source', {
        type: 'geojson',
        data: geojsonData
      });

      map.addLayer({
        id: 'journey-shadow',
        type: 'line',
        source: 'journey-shadow-source',
        paint: {
          'line-color': '#3D3838', // charcoal
          'line-width': 10,
          'line-opacity': 0.2,
          'line-blur': 2,
        },
      });
    }

    // ===== COUCHE 2 : LIGNE PRINCIPALE =====
    if (map.getSource('journey-main-source')) {
      (map.getSource('journey-main-source') as maptilersdk.GeoJSONSource).setData(geojsonData);
    } else{
      map.addSource('journey-main-source', {
        type: 'geojson',
        data: geojsonData
      });

      map.addLayer({
        id: 'journey-main',
        type: 'line',
        source: 'journey-main-source',
        paint: {
          'line-color': '#8B6F47', // marron chemin de terre
          'line-width': 6,
          'line-opacity': 0.7,
          'line-dasharray': [2, 1], // Pointillés pour effet "route tracée"
        },
      });
    }

    // ===== COUCHE 3 : LUEUR DORÉE (uniquement pendant l'animation) =====
    if (isAnimating) {
      const glowOpacity = 0.3 + (glowIntensity * 0.2); // Pulse entre 0.3 et 0.5

      if (map.getSource('journey-glow-source')) {
        (map.getSource('journey-glow-source') as maptilersdk.GeoJSONSource).setData(geojsonData);
        map.setPaintProperty('journey-glow', 'line-opacity', glowOpacity);
      } else {
        map.addSource('journey-glow-source', {
          type: 'geojson',
          data: geojsonData
        });

        map.addLayer({
          id: 'journey-glow',
          type: 'line',
          source: 'journey-glow-source',
          paint: {
            'line-color': '#F2CC8F', // gold
            'line-width': 8,
            'line-opacity': glowOpacity,
            'line-blur': 4,
          },
        });
      }
    } else {
      // Supprimer la couche glow quand l'animation est terminée
      if (map.getLayer('journey-glow')) {
        map.removeLayer('journey-glow');
        map.removeSource('journey-glow-source');
      }
    }
  }, [map, mapLoaded, animatedPositions, isAnimating, glowIntensity]);

  // Cleanup: supprimer les layers quand le composant est démonté
  useEffect(() => {
    return () => {
      if (!map) return;

      const layers = ['journey-shadow', 'journey-main', 'journey-glow'];
      const sources = ['journey-shadow-source', 'journey-main-source', 'journey-glow-source'];

      layers.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });

      sources.forEach(sourceId => {
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });
    };
  }, [map]);

  return null; // Ce composant ne rend rien directement, il ajoute des layers à la carte
}
