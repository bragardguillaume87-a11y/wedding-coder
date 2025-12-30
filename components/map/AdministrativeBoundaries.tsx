/**
 * 🗺️ Frontières administratives style fantasy médiéval
 * Affiche les frontières de départements (zoom 7+) et pays (toujours)
 * Avec contrôle de visibilité basé sur le niveau de zoom
 */

'use client';
import { GeoJSON, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

interface BoundariesLayerProps {
  data: any; // GeoJSON FeatureCollection
  visibleAtZoom: number;
  style: {
    color: string;
    weight: number;
    opacity: number;
    dashArray: string;
    fillColor?: string;
    fillOpacity?: number;
  };
  hoverStyle?: {
    color?: string;
    weight?: number;
    opacity?: number;
    fillOpacity?: number;
  };
  name: string;
  showPopup?: boolean;
}

export default function AdministrativeBoundaries({
  data,
  visibleAtZoom,
  style,
  hoverStyle,
  name,
  showPopup = true
}: BoundariesLayerProps) {
  const [zoom, setZoom] = useState(6); // Zoom initial par défaut

  // Écouter les changements de zoom
  const map = useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
    },
    // Initialiser le zoom au montage
    load: () => {
      setZoom(map.getZoom());
    }
  });

  // Ne rien afficher si le zoom est insuffisant ou pas de données
  if (!data || zoom < visibleAtZoom) {
    return null;
  }

  return (
    <GeoJSON
      key={`${name}-z${zoom}`} // Force re-render sur changement de zoom
      data={data}
      style={style}
      onEachFeature={(feature, layer) => {
        // Récupérer le nom depuis les propriétés GeoJSON
        const properties = feature.properties;
        const displayName = properties.nom || properties.name || properties.NAME || name;

        // Effets au survol
        layer.on('mouseover', () => {
          layer.bringToFront(); // Mettre au premier plan
          layer.setStyle({
            ...style,
            ...(hoverStyle || {
              opacity: 1,
              fillOpacity: 0.3,
              color: '#D2691E' // Marron chocolat
            })
          });
        });

        layer.on('mouseout', () => {
          layer.setStyle(style); // Revenir au style normal
        });

        // Ajouter popup si activé
        if (showPopup) {
          layer.bindPopup(
            `<div class="text-center">
              <strong style="font-family: var(--font-crimson-pro), serif; color: #3D2817;">
                ${displayName}
              </strong>
            </div>`,
            {
              className: 'fantasy-popup',
              offset: [0, -10],
              maxWidth: 200
            }
          );
        }
      }}
    />
  );
}
