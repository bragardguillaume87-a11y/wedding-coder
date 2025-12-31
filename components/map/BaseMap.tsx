/**
 * Carte MapTiler de base avec style Watercolor natif
 * Migré de Leaflet vers MapTiler SDK pour de meilleures performances
 */

'use client';
import { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { MapContext } from './MapContext';

interface BaseMapProps {
  center: [number, number]; // Format standard [lat, lng] (converti en [lng, lat] pour MapTiler)
  zoom: number;
  children?: React.ReactNode;
  showRegions?: boolean; // Afficher les régions au lieu des départements
  showCountries?: boolean;
}

export default function BaseMap({
  center,
  zoom,
  children,
  showRegions = true,
  showCountries = true
}: BaseMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const [map, setMap] = useState<maptilersdk.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // ⚡ OPTIMISATION: Cache GeoJSON dans refs (survit aux re-renders)
  const countriesCache = useRef<GeoJSON.FeatureCollection | null>(null);
  const regionsCache = useRef<GeoJSON.FeatureCollection | null>(null);
  const dataLoadingRef = useRef(false);
  const [geoDataReady, setGeoDataReady] = useState(false);

  // ⚡ OPTIMISATION: Charger GeoJSON UNE SEULE FOIS avec module-level cache
  useEffect(() => {
    if (dataLoadingRef.current || geoDataReady) return;

    dataLoadingRef.current = true;

    const loadBoundaries = async () => {
      try {
        console.time('GeoJSON Load');

        // Utilise le cache module - ne télécharge que si pas en cache
        const { loadGeoJSON } = await import('@/lib/geoJsonCache');
        const [countries, regions] = await Promise.all([
          loadGeoJSON('/geojson/countries.geojson'),
          loadGeoJSON('/geojson/regions.geojson')
        ]);

        // Stocker dans refs (pas de re-render)
        countriesCache.current = countries;
        regionsCache.current = regions;
        setGeoDataReady(true);

        console.timeEnd('GeoJSON Load');
        console.log('✓ GeoJSON cachés dans refs');
      } catch (error) {
        console.error('Erreur chargement frontières:', error);
        dataLoadingRef.current = false;
      }
    };

    loadBoundaries();
  }, []); // ✓ Vide = charge UNE SEULE FOIS

  // Initialiser la carte MapTiler
  useEffect(() => {
    if (mapRef.current) return; // Éviter de réinitialiser si déjà créée
    if (!mapContainer.current) return;

    // Configurer la clé API MapTiler pour éviter les erreurs 403
    // Même si on utilise un style custom, MapTiler SDK a besoin d'une clé valide
    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || '';

    // IMPORTANT: Convertir [lat, lng] standard → [lng, lat] MapTiler
    const mapTilerCenter: [number, number] = [center[1], center[0]];

    const mapInstance = new maptilersdk.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'stamen-watercolor': {
            type: 'raster',
            // Utiliser notre proxy Next.js au lieu de l'URL directe
            // Avantages: rate limiting, caching serveur, pas d'exposition de clé
            tiles: ['/api/maptiler-proxy?z={z}&x={x}&y={y}'],
            tileSize: 256,
            maxzoom: 16,
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com">Stamen Design</a>'
          }
        },
        layers: [
          {
            id: 'stamen-watercolor-layer',
            type: 'raster',
            source: 'stamen-watercolor',
            paint: {
              'raster-opacity': 1
            }
          }
        ]
      },
      center: mapTilerCenter,
      zoom: zoom,
      navigationControl: 'bottom-right',
    });

    mapRef.current = mapInstance;
    setMap(mapInstance);

    // FIX: Utiliser 'style.load' au lieu de 'load' pour les styles custom
    mapInstance.on('style.load', () => {
      setMapLoaded(true);
    });

    // Fallback de sécurité au cas où l'événement ne se déclenche pas
    const checkStyleLoaded = () => {
      if (mapRef.current?.isStyleLoaded()) {
        setMapLoaded(true);
      } else {
        setTimeout(checkStyleLoaded, 100);
      }
    };
    setTimeout(checkStyleLoaded, 500);

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMap(null);
      }
    };
  }, [center, zoom]);

  // Ajouter les frontières des pays quand les données sont chargées
  useEffect(() => {
    if (!map || !mapLoaded || !geoDataReady || !countriesCache.current) return;

    // ⚡ Si showCountries est false, retirer la couche
    if (!showCountries) {
      if (map.getLayer('countries-fill')) {
        map.removeLayer('countries-fill');
        map.removeLayer('countries-line');
        map.removeSource('countries-source');
      }
      return;
    }

    // IMPORTANT: Attendre que le style soit vraiment chargé avec retry
    const addCountriesBoundaries = () => {
      if (!map || !map.isStyleLoaded()) {
        // Réessayer après 100ms si le style n'est pas prêt
        setTimeout(addCountriesBoundaries, 100);
        return;
      }

      // ⚡ Utiliser les données du cache ref (pas de re-téléchargement!)
      const data = countriesCache.current!;

      // Mettre à jour ou ajouter la source
      if (map.getSource('countries-source')) {
        (map.getSource('countries-source') as maptilersdk.GeoJSONSource).setData(data);
      } else {
        // Ajouter la source GeoJSON
        map.addSource('countries-source', {
          type: 'geojson',
          data: data
        });

        // Couche de remplissage (fill)
        map.addLayer({
          id: 'countries-fill',
          type: 'fill',
          source: 'countries-source',
          paint: {
            'fill-color': '#F5DEB3',
            'fill-opacity': 0.05
          }
        });

        // Couche de contour (line)
        map.addLayer({
          id: 'countries-line',
          type: 'line',
          source: 'countries-source',
          paint: {
            'line-color': '#654321', // Marron foncé
            'line-width': 3,
            'line-opacity': 0.8,
            'line-dasharray': [8, 4] // Pointillés longs
          }
        });

        // Effets au survol
        map.on('mouseenter', 'countries-fill', () => {
          if (map) {
            map.getCanvas().style.cursor = 'pointer';
          }
        });

        map.on('mouseleave', 'countries-fill', () => {
          if (map) {
            map.getCanvas().style.cursor = '';
          }
        });

        // Popup au clic
        map.on('click', 'countries-fill', (e) => {
          if (!e.features || !e.features[0]) return;

          const properties = e.features[0].properties;
          const name = properties?.nom || properties?.name || properties?.NAME || 'Pays';

          new maptilersdk.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<div style="font-family: var(--font-crimson-pro), serif; color: #3D2817; text-align: center;"><strong>${name}</strong></div>`)
            .addTo(map);
        });
      }
    };

    // Lancer l'ajout des frontières
    addCountriesBoundaries();
  }, [map, mapLoaded, geoDataReady, showCountries]); // ⚡ Dépendances mises à jour

  // Ajouter les frontières des régions quand les données sont chargées
  useEffect(() => {
    if (!map || !mapLoaded || !geoDataReady || !regionsCache.current) return;

    // ⚡ Si showRegions est false, retirer la couche
    if (!showRegions) {
      if (map.getLayer('regions-fill')) {
        map.removeLayer('regions-fill');
        map.removeLayer('regions-line');
        map.removeSource('regions-source');
      }
      return;
    }

    // IMPORTANT: Attendre que le style soit vraiment chargé avec retry
    const addRegionsBoundaries = () => {
      if (!map || !map.isStyleLoaded()) {
        // Réessayer après 100ms si le style n'est pas prêt
        setTimeout(addRegionsBoundaries, 100);
        return;
      }

      // ⚡ Utiliser les données du cache ref (pas de re-téléchargement!)
      const data = regionsCache.current!;

      // Mettre à jour ou ajouter la source
      if (map.getSource('regions-source')) {
        (map.getSource('regions-source') as maptilersdk.GeoJSONSource).setData(data);
      } else {
        // Ajouter la source GeoJSON
        map.addSource('regions-source', {
          type: 'geojson',
          data: data
        });

        // Couche de remplissage (fill)
        map.addLayer({
          id: 'regions-fill',
          type: 'fill',
          source: 'regions-source',
          paint: {
            'fill-color': '#F5DEB3',
            'fill-opacity': 0.15
          }
        });

        // Couche de contour (line)
        map.addLayer({
          id: 'regions-line',
          type: 'line',
          source: 'regions-source',
          paint: {
            'line-color': '#8B4513', // Marron/brun
            'line-width': 3,
            'line-opacity': 0.7,
            'line-dasharray': [6, 4] // Pointillés moyens
          }
        });

        // Effets au survol
        map.on('mouseenter', 'regions-fill', () => {
          if (map) {
            map.getCanvas().style.cursor = 'pointer';
          }
        });

        map.on('mouseleave', 'regions-fill', () => {
          if (map) {
            map.getCanvas().style.cursor = '';
          }
        });

        // Popup au clic
        map.on('click', 'regions-fill', (e) => {
          if (!e.features || !e.features[0]) return;

          const properties = e.features[0].properties;
          const name = properties?.nom || properties?.name || properties?.NAME || 'Région';

          new maptilersdk.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<div style="font-family: var(--font-crimson-pro), serif; color: #3D2817; text-align: center;"><strong>${name}</strong></div>`)
            .addTo(map);
        });
      }
    };

    // Lancer l'ajout des frontières
    addRegionsBoundaries();
  }, [map, mapLoaded, geoDataReady, showRegions]); // ⚡ Dépendances mises à jour

  return (
    <MapContext.Provider value={{ map, mapLoaded }}>
      <div
        ref={mapContainer}
        className="rounded-2xl overflow-hidden border-2 border-[var(--beige)] shadow-2xl fantasy-map-container"
        style={{ height: '600px', width: '100%' }}
      >
        {/* Composants enfants (JourneyPath, GamingMarker) peuvent maintenant accéder à la carte via useMap() */}
        {mapLoaded && children}
      </div>
    </MapContext.Provider>
  );
}
