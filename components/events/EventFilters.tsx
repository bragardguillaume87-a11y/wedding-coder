/**
 * 🎯 Composant de filtres d'événements
 * Filtrage multi-critères : type, recherche, tri
 *
 * Phase 2.2 - Plan d'implémentation wedding-coder
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MapEvent } from '@/lib/mapHelpers';

export type FilterType = 'all' | 'ceremony' | 'cocktail' | 'dinner' | 'brunch' | 'party' | 'activity';
export type SortType = 'date' | 'location' | 'name';

interface EventFiltersProps {
  events: MapEvent[];
  onFilterChange: (filtered: MapEvent[]) => void;
}

export function EventFilters({ events, onFilterChange }: EventFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculer les événements filtrés et triés
  const filteredEvents = useMemo(() => {
    let result = events;

    // 1. Filtre par type d'événement
    if (activeFilter !== 'all') {
      result = result.filter(e => e.event_type === activeFilter);
    }

    // 2. Filtre par recherche (nom ou ville)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.event_name.toLowerCase().includes(query) ||
        e.city_name?.toLowerCase().includes(query) ||
        e.location_address.toLowerCase().includes(query)
      );
    }

    // 3. Tri
    result = [...result].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      } else if (sortBy === 'location') {
        return (a.city_name || a.location_address).localeCompare(b.city_name || b.location_address);
      } else {
        // sort by name
        return a.event_name.localeCompare(b.event_name);
      }
    });

    return result;
  }, [events, activeFilter, sortBy, searchQuery]);

  // Notifier le parent quand les filtres changent
  useEffect(() => {
    onFilterChange(filteredEvents);
  }, [filteredEvents, onFilterChange]);

  // Configuration des filtres disponibles
  const filters: { type: FilterType; label: string; icon: string }[] = [
    { type: 'all', label: 'Tous', icon: '📅' },
    { type: 'ceremony', label: 'Cérémonie', icon: '💒' },
    { type: 'cocktail', label: 'Cocktail', icon: '🍸' },
    { type: 'dinner', label: 'Dîner', icon: '🍽️' },
    { type: 'brunch', label: 'Brunch', icon: '🥐' },
    { type: 'party', label: 'Soirée', icon: '🎉' },
    { type: 'activity', label: 'Activité', icon: '🎯' },
  ];

  // Compter les événements par type
  const eventCounts = useMemo(() => {
    const counts: Record<FilterType, number> = {
      all: events.length,
      ceremony: 0,
      cocktail: 0,
      dinner: 0,
      brunch: 0,
      party: 0,
      activity: 0,
    };

    events.forEach(event => {
      const type = event.event_type as FilterType;
      if (type && counts[type] !== undefined) {
        counts[type]++;
      }
    });

    return counts;
  }, [events]);

  return (
    <div className="space-y-4 bg-white rounded-2xl border-2 border-beige p-6 shadow-lg">
      {/* Barre de recherche */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un événement ou une ville..."
          className="w-full px-4 py-3 pl-12 bg-white border-2 border-beige rounded-xl
                   focus:outline-none focus:border-terracotta transition-colors
                   text-charcoal placeholder:text-charcoal placeholder:opacity-50"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>

        {/* Bouton clear search */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal opacity-50
                     hover:opacity-100 transition-opacity"
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtres par type */}
      <div>
        <h3 className="text-sm font-semibold text-charcoal mb-2 opacity-75">
          Type d'événement
        </h3>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const count = eventCounts[filter.type];
            const isActive = activeFilter === filter.type;

            return (
              <motion.button
                key={filter.type}
                onClick={() => setActiveFilter(filter.type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 rounded-full border-2 transition-all font-medium text-sm
                  ${isActive
                    ? 'bg-terracotta border-terracotta text-white shadow-md'
                    : 'bg-white border-beige text-charcoal hover:border-terracotta'
                  }
                `}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
                {filter.type !== 'all' && count > 0 && (
                  <span className={`ml-2 text-xs ${isActive ? 'opacity-90' : 'opacity-60'}`}>
                    ({count})
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tri */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-sm text-charcoal font-medium opacity-75">Trier par:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('date')}
            className={`
              px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium
              ${sortBy === 'date'
                ? 'bg-terracotta border-terracotta text-white'
                : 'bg-white border-beige text-charcoal hover:border-terracotta'
              }
            `}
          >
            📅 Date
          </button>
          <button
            onClick={() => setSortBy('location')}
            className={`
              px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium
              ${sortBy === 'location'
                ? 'bg-terracotta border-terracotta text-white'
                : 'bg-white border-beige text-charcoal hover:border-terracotta'
              }
            `}
          >
            📍 Lieu
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`
              px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium
              ${sortBy === 'name'
                ? 'bg-terracotta border-terracotta text-white'
                : 'bg-white border-beige text-charcoal hover:border-terracotta'
              }
            `}
          >
            ✍️ Nom
          </button>
        </div>
      </div>

      {/* Résultats */}
      <div className="pt-2 border-t-2 border-beige">
        <p className="text-sm text-charcoal font-medium">
          <span className="text-terracotta font-bold text-lg">{filteredEvents.length}</span>
          {' '}événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
          {searchQuery && (
            <span className="ml-2 opacity-75">
              pour "{searchQuery}"
            </span>
          )}
        </p>

        {/* Message si aucun résultat */}
        {filteredEvents.length === 0 && events.length > 0 && (
          <p className="mt-2 text-sm text-charcoal opacity-60 italic">
            Aucun événement ne correspond à vos critères. Essayez de modifier les filtres.
          </p>
        )}
      </div>
    </div>
  );
}
