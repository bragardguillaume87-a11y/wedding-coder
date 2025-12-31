/**
 * 🔢 Compteur animé RPG
 * Compte progressivement de 0 à la valeur finale
 * Utilisé pour afficher la distance totale du parcours
 */

'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { soundManager } from '@/lib/soundManager';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // Durée de l'animation en secondes
  delay?: number; // Délai avant de commencer en ms
  suffix?: string; // Suffixe (ex: " km")
  onComplete?: () => void;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  suffix = '',
  onComplete
}: AnimatedCounterProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Ne pas réanimer si déjà fait
    if (hasAnimated || value === 0) {
      const initTimer = setTimeout(() => setDisplayValue(value), 0);
      return () => clearTimeout(initTimer);
    }

    const timer = setTimeout(() => {
      const controls = animate(count, value, {
        duration,
        ease: 'easeOut',
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
        onComplete: () => {
          setDisplayValue(value);
          setHasAnimated(true);

          // Jouer le son de célébration
          soundManager.play('celebration');

          // Callback si fourni
          if (onComplete) {
            onComplete();
          }
        }
      });

      return () => controls.stop();
    }, delay);

    return () => clearTimeout(timer);
  }, [value, duration, delay, hasAnimated, count, onComplete]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000 }}
      className="inline-block"
    >
      <span className="font-bold text-[var(--terracotta)]">
        {displayValue.toLocaleString('fr-FR')}
      </span>
      {suffix && <span>{suffix}</span>}
    </motion.span>
  );
}
