/**
 * 🗺️ Ligne de parcours style Tour de France + RPG
 * Relie tous les points chronologiquement avec animation progressive
 * Version avec Framer Motion pour des animations ultra-smooth
 */

'use client';
import { Polyline } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { soundManager } from '@/lib/soundManager';

interface JourneyPathProps {
  positions: [number, number][];
  animated?: boolean;
  onComplete?: () => void;
}

export default function JourneyPath({
  positions,
  animated = true,
  onComplete
}: JourneyPathProps) {
  const [animatedPositions, setAnimatedPositions] = useState<[number, number][]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);

  // Motion value pour l'animation progressive (0 à 1)
  const progress = useMotionValue(0);

  // Animation progressive du tracé
  useEffect(() => {
    // Validation robuste: vérifier qu'on a au moins 2 positions VALIDES
    if (positions.length < 2 || !positions[0] || !positions[1]) {
      setAnimatedPositions([]);
      return;
    }

    if (!animated) {
      setAnimatedPositions(positions);
      return;
    }

    // Initialiser avec les 2 premiers points
    if (positions[0] && positions[1]) {
      setAnimatedPositions([positions[0], positions[1]]);
    } else {
      setAnimatedPositions([]);
      return;
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

    return () => clearTimeout(startDelay);
  }, [positions, animated, onComplete, progress]);

  // Triple sécurité: vérifier la longueur ET que chaque position existe
  if (animatedPositions.length < 2 ||
      !animatedPositions.every(pos => pos && pos[0] != null && pos[1] != null)) {
    return null;
  }

  return (
    <>
      {/* Couche 1 : Ombre pour effet 3D */}
      <Polyline
        key={`shadow-${positions.length}`}
        positions={animatedPositions}
        pathOptions={{
          color: '#3D3838', // charcoal
          weight: 10,
          opacity: 0.2,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />

      {/* Couche 2 : Ligne principale - Route de caravane */}
      <Polyline
        key={`main-${positions.length}`}
        positions={animatedPositions}
        pathOptions={{
          color: '#8B6F47', // marron chemin de terre
          weight: 6,
          opacity: 0.7,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: '10, 5', // Pointillés pour effet "route tracée"
        }}
        className="journey-path"
      />

      {/* Couche 3 : Lueur dorée (uniquement pendant l'animation) */}
      {isAnimating && (
        <Polyline
          key={`glow-${positions.length}`}
          positions={animatedPositions}
          pathOptions={{
            color: '#F2CC8F', // gold
            weight: 8,
            opacity: 0.3 + (glowIntensity * 0.2), // Pulse entre 0.3 et 0.5
            lineCap: 'round',
            lineJoin: 'round',
          }}
          className="journey-path-glow"
        />
      )}
    </>
  );
}
