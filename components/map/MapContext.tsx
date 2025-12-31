/**
 * Context React pour partager l'instance de la carte MapTiler
 * Permet aux composants enfants (JourneyPath, GamingMarker) d'accéder à la carte
 */

'use client';
import { createContext, useContext } from 'react';
import type * as maptilersdk from '@maptiler/sdk';

interface MapContextType {
  map: maptilersdk.Map | null;
  mapLoaded: boolean;
}

export const MapContext = createContext<MapContextType>({
  map: null,
  mapLoaded: false
});

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within MapContext.Provider');
  }
  return context;
};
