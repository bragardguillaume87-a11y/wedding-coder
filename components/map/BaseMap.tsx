/**
 * Carte Leaflet de base
 * Affiche le fond de carte avec les tuiles OpenStreetMap
 */

'use client';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { useState, useEffect } from 'react';
import AdministrativeBoundaries from './AdministrativeBoundaries';
import 'leaflet/dist/leaflet.css';

interface BaseMapProps {
  center: [number, number];
  zoom: number;
  children: React.ReactNode;
  showDepartments?: boolean;
  showCountries?: boolean;
}

export default function BaseMap({
  center,
  zoom,
  children,
  showDepartments = true,
  showCountries = true
}: BaseMapProps) {
  // États pour stocker les données GeoJSON
  const [countriesData, setCountriesData] = useState<any>(null);
  const [departmentsData, setDepartmentsData] = useState<any>(null);

  // Charger les données GeoJSON au montage
  useEffect(() => {
    const loadBoundaries = async () => {
      try {
        const promises = [];

        if (showCountries) {
          promises.push(
            fetch('/geojson/countries.geojson')
              .then(r => r.json())
              .then(setCountriesData)
          );
        }

        if (showDepartments) {
          promises.push(
            fetch('/geojson/departments.geojson')
              .then(r => r.json())
              .then(setDepartmentsData)
          );
        }

        await Promise.all(promises);
      } catch (error) {
        console.error('Erreur chargement frontières:', error);
      }
    };

    loadBoundaries();
  }, [showCountries, showDepartments]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false} // On utilise notre propre contrôle
      style={{ height: '600px', width: '100%' }}
      className="rounded-2xl overflow-hidden border-2 border-[var(--beige)] shadow-2xl fantasy-map-container"
    >
      {/* Tuiles Stamen Watercolor - Style aquarelle artistique */}
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com">Stamen Design</a>'
        maxZoom={16}
      />

      {/* ===== FRONTIÈRES ADMINISTRATIVES ===== */}

      {/* Frontières internationales - Toujours visibles */}
      {countriesData && (
        <AdministrativeBoundaries
          data={countriesData}
          visibleAtZoom={0}
          name="countries"
          style={{
            color: '#654321',       // Marron foncé
            weight: 3,
            opacity: 0.8,
            dashArray: '8, 4',      // Pointillés longs
            fillColor: '#F5DEB3',
            fillOpacity: 0.05
          }}
          hoverStyle={{
            color: '#D2691E',
            opacity: 1,
            fillOpacity: 0.2
          }}
          showPopup={true}
        />
      )}

      {/* Frontières de départements - Visibles à partir de zoom 7 */}
      {departmentsData && (
        <AdministrativeBoundaries
          data={departmentsData}
          visibleAtZoom={7}
          name="departments"
          style={{
            color: '#8B6F47',       // Marron terre (même que ligne parcours)
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 3',      // Pointillés courts
            fillColor: '#F5DEB3',
            fillOpacity: 0.1
          }}
          hoverStyle={{
            color: '#D2691E',
            opacity: 1,
            fillOpacity: 0.3
          }}
          showPopup={true}
        />
      )}

      {/* Contrôles de zoom en bas à droite (style gaming) */}
      <ZoomControl position="bottomright" />

      {/* Contenu de la carte (marqueurs, lignes, etc.) */}
      {children}
    </MapContainer>
  );
}
