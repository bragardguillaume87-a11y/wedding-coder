/**
 * 🔊 Sound Manager pour la carte RPG
 * Gère tous les effets sonores avec Howler.js
 * Sons subtils et élégants pour l'expérience gaming
 */

import { Howl } from 'howler';

// Types de sons disponibles
export type SoundEffect =
  | 'markerHover'
  | 'markerClick'
  | 'pathDraw'
  | 'markerUnlock'
  | 'mapLoad'
  | 'celebration';

// Configuration des sons
interface SoundConfig {
  src: string;
  volume: number;
  sprite?: Record<string, [number, number]>;
}

// Singleton pour gérer les sons
class SoundManager {
  private sounds: Map<SoundEffect, Howl> = new Map();
  private muted: boolean = false;
  private initialized: boolean = false;

  /**
   * Configuration de tous les sons
   * Volume entre 0 et 1 (0.3 = 30% pour des sons subtils)
   */
  private soundConfigs: Record<SoundEffect, SoundConfig> = {
    markerHover: {
      src: '/sounds/marker-hover.mp3',
      volume: 0.2, // Très doux pour le survol
    },
    markerClick: {
      src: '/sounds/marker-click.mp3',
      volume: 0.3, // Un peu plus marqué pour le clic
    },
    pathDraw: {
      src: '/sounds/path-draw.mp3',
      volume: 0.25, // Whoosh magique subtil
    },
    markerUnlock: {
      src: '/sounds/marker-unlock.mp3',
      volume: 0.3, // Ding! pour chaque waypoint
    },
    mapLoad: {
      src: '/sounds/map-load.mp3',
      volume: 0.2, // Ambiance d'ouverture
    },
    celebration: {
      src: '/sounds/celebration.mp3',
      volume: 0.4, // Un peu plus fort pour la célébration finale
    },
  };

  /**
   * Initialise tous les sons
   * À appeler au premier clic utilisateur (requis par les navigateurs)
   */
  initialize() {
    if (this.initialized) return;

    Object.entries(this.soundConfigs).forEach(([key, config]) => {
      const sound = new Howl({
        src: [config.src],
        volume: config.volume,
        sprite: config.sprite,
        preload: true,
        html5: false, // Utiliser Web Audio API pour de meilleures performances
      });

      this.sounds.set(key as SoundEffect, sound);
    });

    // Récupérer l'état mute du localStorage
    const savedMute = localStorage.getItem('soundMuted');
    this.muted = savedMute === 'true';

    this.initialized = true;
  }

  /**
   * Joue un effet sonore
   * @param effect - Le type de son à jouer
   * @param options - Options additionnelles (volume override, etc.)
   */
  play(effect: SoundEffect, options?: { volume?: number }) {
    if (this.muted) return;

    // Initialiser si ce n'est pas déjà fait
    if (!this.initialized) {
      this.initialize();
    }

    const sound = this.sounds.get(effect);
    if (!sound) {
      console.warn(`Sound effect "${effect}" not found`);
      return;
    }

    // Override du volume si fourni
    if (options?.volume !== undefined) {
      sound.volume(options.volume);
    }

    // Jouer le son
    sound.play();
  }

  /**
   * Active/Désactive tous les sons
   */
  toggleMute(): boolean {
    this.muted = !this.muted;

    // Sauvegarder dans localStorage
    localStorage.setItem('soundMuted', this.muted.toString());

    // Stopper tous les sons en cours si on mute
    if (this.muted) {
      this.sounds.forEach(sound => sound.stop());
    }

    return this.muted;
  }

  /**
   * Obtenir l'état mute actuel
   */
  isMuted(): boolean {
    return this.muted;
  }

  /**
   * Change le volume global de tous les sons
   * @param volume - Volume entre 0 et 1
   */
  setGlobalVolume(volume: number) {
    this.sounds.forEach(sound => {
      const currentVolume = sound.volume();
      sound.volume(currentVolume * volume);
    });
  }

  /**
   * Précharge un son spécifique
   * Utile pour éviter les délais lors de la première lecture
   */
  preload(effect: SoundEffect) {
    if (!this.initialized) {
      this.initialize();
    }
    const sound = this.sounds.get(effect);
    sound?.load();
  }

  /**
   * Stoppe tous les sons en cours
   */
  stopAll() {
    this.sounds.forEach(sound => sound.stop());
  }
}

// Export du singleton
export const soundManager = new SoundManager();

/**
 * Hook React pour utiliser le Sound Manager
 * Usage: const playSound = useSoundManager();
 *        playSound('markerHover');
 */
export function useSoundManager() {
  return (effect: SoundEffect, options?: { volume?: number }) => {
    soundManager.play(effect, options);
  };
}
