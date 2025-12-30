/**
 * 🔊 Bouton de contrôle du son
 * Toggle mute/unmute pour tous les effets sonores
 * Style RPG élégant avec animations
 */

'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '@/lib/soundManager';

export default function SoundToggle() {
  const [muted, setMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Récupérer l'état initial depuis le soundManager
    setMuted(soundManager.isMuted());
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const newMuted = soundManager.toggleMute();
    setMuted(newMuted);

    // Feedback visuel + sonore (seulement si on démute)
    if (!newMuted) {
      soundManager.play('markerClick', { volume: 0.2 });
    }
  };

  // Ne rien afficher pendant l'hydratation
  if (!mounted) return null;

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 z-[1000] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95"
      style={{
        background: muted
          ? 'linear-gradient(135deg, #3D3838 0%, #5A5454 100%)'
          : 'linear-gradient(135deg, #E07A5F 0%, #F4ACB7 100%)',
        border: '2px solid',
        borderColor: muted ? '#5A5454' : '#F2CC8F',
      }}
      whileHover={{
        boxShadow: muted
          ? '0 8px 20px rgba(61, 56, 56, 0.4)'
          : '0 8px 20px rgba(224, 122, 95, 0.5)',
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      title={muted ? 'Activer les sons' : 'Désactiver les sons'}
      aria-label={muted ? 'Activer les sons' : 'Désactiver les sons'}
    >
      <motion.span
        className="text-2xl"
        animate={{
          rotate: muted ? 0 : [0, -10, 10, -10, 0],
        }}
        transition={{
          duration: 0.5,
        }}
      >
        {muted ? '🔇' : '🔊'}
      </motion.span>

      {/* Onde sonore animée quand unmuted */}
      {!muted && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: '#F2CC8F',
          }}
          animate={{
            scale: [1, 1.5, 1.8],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}
    </motion.button>
  );
}
