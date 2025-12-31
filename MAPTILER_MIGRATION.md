# MapTiler Migration Documentation

## 📋 Table of Contents
1. [Migration Overview](#migration-overview)
2. [Why MapTiler Instead of Leaflet](#why-maptiler-instead-of-leaflet)
3. [Complete List of Changes](#complete-list-of-changes)
4. [Bugs Encountered and Solutions](#bugs-encountered-and-solutions)
5. [Why More Bugs Than Leaflet](#why-more-bugs-than-leaflet)
6. [Key Technical Differences](#key-technical-differences)
7. [Files Modified](#files-modified)

---

## 🎯 Migration Overview

**Date**: December 2025
**Objective**: Migrate interactive wedding journey map from Leaflet to MapTiler SDK
**Reason**: Better performance and native support for modern mapping features

**Initial Stack**:
- Leaflet 1.9.4
- React-Leaflet 5.0.0
- Stamen Watercolor tiles via raster layer
- Gaming/RPG styled markers and popups
- Animated journey path (Tour de France style)
- Administrative boundaries (countries + French departments)
- Framer Motion animations
- Howler.js sound effects

**Final Stack**:
- MapTiler SDK 3.9.0
- Stamen Watercolor tiles via custom raster source
- Same visual features preserved
- Enhanced popup UX (tooltip + pinning behavior)
- Premium gaming/RPG popup design

---

## 🚀 Why MapTiler Instead of Leaflet

1. **Performance**: MapTiler SDK is built on MapLibre GL, offering GPU-accelerated rendering
2. **Modern Architecture**: Better support for vector tiles and dynamic styling
3. **Active Development**: More actively maintained than Leaflet
4. **Scalability**: Handles larger datasets more efficiently
5. **Native Features**: Built-in features that required plugins in Leaflet

---

## 📝 Complete List of Changes

### 1. Dependency Changes (`package.json`)

**Removed**:
```json
"leaflet": "^1.9.4"
"react-leaflet": "^5.0.0"
"@types/leaflet": "^1.9.21"
```

**Added**:
```json
"@maptiler/sdk": "^3.9.0"
"@types/maplibre-gl": "^1.13.2"
```

### 2. Base Map Migration (`components/map/BaseMap.tsx`)

**Before (Leaflet)**:
```typescript
import { MapContainer, TileLayer } from 'react-leaflet';

<MapContainer center={center} zoom={zoom}>
  <TileLayer
    url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
    attribution="..."
  />
  {children}
</MapContainer>
```

**After (MapTiler)**:
```typescript
import * as maptilersdk from '@maptiler/sdk';

// Initialize API key
maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

// Convert [lat, lng] → [lng, lat] for MapTiler
const mapTilerCenter: [number, number] = [center[1], center[0]];

map.current = new maptilersdk.Map({
  container: mapContainer.current,
  style: {
    version: 8,
    sources: {
      'stamen-watercolor': {
        type: 'raster',
        tiles: ['https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg'],
        tileSize: 256,
        maxzoom: 16,
      }
    },
    layers: [
      {
        id: 'stamen-watercolor-layer',
        type: 'raster',
        source: 'stamen-watercolor',
      }
    ]
  },
  center: mapTilerCenter,
  zoom: zoom,
});
```

**Key Changes**:
- Created MapContext for sharing map instance
- Custom style object instead of TileLayer
- Coordinate conversion: [lat, lng] → [lng, lat]
- Used `style.load` event instead of `load` for custom styles

### 3. Marker Migration (`components/map/GamingMarker.tsx`)

**Before (Leaflet)**:
```typescript
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const customIcon = L.divIcon({
  html: markerHTML,
  className: 'gaming-marker',
  iconSize: [48, 48],
  iconAnchor: [24, 48], // Bottom center
});

<Marker position={position} icon={customIcon}>
  <Popup>{content}</Popup>
</Marker>
```

**After (MapTiler)**:
```typescript
import * as maptilersdk from '@maptiler/sdk';

// Create DOM element
const el = document.createElement('div');
el.innerHTML = markerHTML;

// Create popup
const popup = new maptilersdk.Popup({
  offset: 48,
  className: 'gaming-popup',
  closeButton: true,
  closeOnClick: false,
}).setDOMContent(popupContent);

// Create marker with bottom anchor
const marker = new maptilersdk.Marker({
  element: el,
  anchor: 'bottom', // Equivalent to iconAnchor: [24, 48]
})
  .setLngLat([position[1], position[0]]) // Convert [lat, lng] → [lng, lat]
  .setPopup(popup)
  .addTo(map);

// Event listeners for tooltip + pinning behavior
el.addEventListener('mouseenter', () => {
  if (!marker.getPopup()?.isOpen()) {
    marker.togglePopup();
  }
});

el.addEventListener('mouseleave', () => {
  if (!isPinned.current && marker.getPopup()?.isOpen()) {
    marker.togglePopup();
  }
});

el.addEventListener('click', (e) => {
  e.stopPropagation();
  isPinned.current = !isPinned.current;

  if (isPinned.current && !marker.getPopup()?.isOpen()) {
    marker.togglePopup();
  }

  const popupElement = marker.getPopup()?.getElement();
  if (popupElement) {
    popupElement.classList.toggle('pinned', isPinned.current);
  }
});

popup.on('close', () => {
  isPinned.current = false;
});
```

**Key Changes**:
- Manual DOM element creation instead of React components
- Coordinate conversion for `setLngLat()`
- Used `anchor: 'bottom'` instead of `iconAnchor`
- Imperative API instead of declarative React API
- Manual event listener management
- Added isPinned ref for state management

### 4. Journey Path Migration (`components/map/JourneyPath.tsx`)

**Before (Leaflet)**:
```typescript
import { Polyline } from 'react-leaflet';

<Polyline
  positions={positions}
  pathOptions={{
    color: '#E07A5F',
    weight: 4,
    opacity: 0.8,
  }}
/>
```

**After (MapTiler)**:
```typescript
// Add GeoJSON source
map.addSource('journey-path-source', {
  type: 'geojson',
  data: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: positions.map(pos => [pos[1], pos[0]]), // [lat,lng] → [lng,lat]
    }
  }
});

// Add line layer with gradient
map.addLayer({
  id: 'journey-path-line',
  type: 'line',
  source: 'journey-path-source',
  paint: {
    'line-color': [
      'interpolate',
      ['linear'],
      ['line-progress'],
      0, '#E07A5F',
      1, '#F4ACB7'
    ],
    'line-width': 4,
    'line-opacity': 0.8,
  }
});
```

**Key Changes**:
- GeoJSON instead of Polyline component
- Coordinate conversion for all positions
- More powerful styling options (gradients, expressions)

### 5. Administrative Boundaries (`components/map/BaseMap.tsx`)

**Before (Leaflet)**:
```typescript
<GeoJSON
  data={countriesData}
  style={{
    color: '#654321',
    weight: 3,
    fillOpacity: 0.05,
  }}
/>
```

**After (MapTiler)**:
```typescript
// Add source
map.addSource('countries-source', {
  type: 'geojson',
  data: countriesData
});

// Add fill layer
map.addLayer({
  id: 'countries-fill',
  type: 'fill',
  source: 'countries-source',
  paint: {
    'fill-color': '#F5DEB3',
    'fill-opacity': 0.05
  }
});

// Add line layer
map.addLayer({
  id: 'countries-line',
  type: 'line',
  source: 'countries-source',
  paint: {
    'line-color': '#654321',
    'line-width': 3,
    'line-opacity': 0.8,
    'line-dasharray': [8, 4]
  }
});

// Add interactivity
map.on('click', 'countries-fill', (e) => {
  new maptilersdk.Popup()
    .setLngLat(e.lngLat)
    .setHTML(`<strong>${e.features[0].properties.name}</strong>`)
    .addTo(map);
});
```

**Key Changes**:
- Separate fill and line layers
- More control over styling
- Event listeners for interactivity

---

## 🐛 Bugs Encountered and Solutions

### Bug #1: Markers in Top-Left Corner

**Symptoms**: All markers appeared in top-left corner (0,0) instead of correct positions

**Root Cause**: Incorrect anchor configuration + coordinate system confusion

**Attempts**:
1. ❌ Used `anchor: 'center'` with `offset: [0, 24]` → didn't work
2. ❌ Tried adjusting offset values → still wrong
3. ✅ Changed to `anchor: 'bottom'` without offset → FIXED

**Solution**:
```typescript
const marker = new maptilersdk.Marker({
  element: el,
  anchor: 'bottom', // Bottom of marker points to coordinate
})
```

**Explanation**: MapTiler's anchor system works differently than Leaflet's iconAnchor. The `bottom` anchor means the bottom center of the element points to the coordinate, which is what we wanted.

---

### Bug #2: Markers Jumping After Animation

**Symptoms**: Markers appeared at correct positions initially, then jumped to top-left after CSS animations completed

**Root Cause**: CSS `transform` animations on marker wrapper element conflicted with MapTiler's internal positioning

**Detection**: Console logs showed correct coordinates being set, but visual position was wrong after animation

**Solution**: Move animations from wrapper to child element
```html
<!-- BEFORE (broken) -->
<div class="gaming-marker-wrapper"> <!-- Animated wrapper - MapTiler uses this for positioning -->
  <div class="marker-glow"></div>
  <div class="marker-number">1</div>
</div>

<!-- AFTER (working) -->
<div class="gaming-marker-wrapper"> <!-- No animation - MapTiler can position this -->
  <div class="gaming-marker gaming-marker-animated"> <!-- Animation here instead -->
    <div class="marker-glow"></div>
    <div class="marker-number">1</div>
  </div>
</div>
```

```css
/* BEFORE (broken) */
.gaming-marker-wrapper {
  animation: markerUnlock 0.6s, markerFloat 3s infinite;
  transform: scale(0);
}

/* AFTER (working) */
.gaming-marker-wrapper {
  /* No transform/animation */
}

.gaming-marker-animated {
  animation: markerUnlock 0.6s, markerFloat 3s infinite;
  transform: scale(0);
}
```

**Explanation**: MapTiler applies CSS transforms to the wrapper element for positioning. Our animations also used transforms, causing conflicts. By moving animations to a child element, MapTiler can control the wrapper while we animate the visual content.

---

### Bug #3: Boundaries Not Displaying

**Symptoms**: Map loaded but GeoJSON boundaries (countries/departments) didn't appear

**Root Cause**: Used `map.on('load')` event which doesn't fire for custom style objects

**Console Errors**: None - event simply never fired

**Solution**: Use `style.load` event with fallback
```typescript
// BEFORE (broken)
map.current.on('load', () => {
  setMapLoaded(true);
});

// AFTER (working)
map.current.on('style.load', () => {
  setMapLoaded(true);
});

// Fallback in case event doesn't fire
const checkStyleLoaded = () => {
  if (map.current?.isStyleLoaded()) {
    setMapLoaded(true);
  } else {
    setTimeout(checkStyleLoaded, 100);
  }
};
setTimeout(checkStyleLoaded, 500);
```

**Explanation**: When using a custom style object (instead of a MapTiler/Mapbox style URL), the `load` event doesn't fire. The `style.load` event is the correct event for custom styles.

---

### Bug #4: Popup Not Closing on Hover Leave

**Symptoms**: Popup appeared on hover but didn't disappear when mouse left marker

**Root Cause**: No mouseleave event listener implemented

**Solution**: Add mouseleave listener
```typescript
el.addEventListener('mouseleave', () => {
  if (!isPinned.current && marker.getPopup()?.isOpen()) {
    marker.togglePopup();
  }
});
```

**Explanation**: Needed to manually implement tooltip behavior with event listeners. Only close popup if not pinned.

---

### Bug #5: Close Button Not Working

**Symptoms**: Clicking X button on pinned popup didn't close it

**Root Cause**: Z-index stacking context issue - corner decorations were blocking the close button

**Detection Process**:
1. User reported: "impossible de le supprimer en appuyant sur la croix"
2. Used claude-code-guide agent to analyze popup CSS
3. Used Explore agent to search for z-index conflicts
4. Found: Corner decorations had `z-index: 2`, close button had no z-index
5. Discovered: Decorations positioned at `top: 8px, right: 8px` were covering button at `top: 12px, right: 12px`

**Solution**: Add high z-index to close button
```css
/* BEFORE (broken) */
.maplibregl-popup-close-button {
  /* ...other styles... */
  /* No z-index */
}

.corner-decoration {
  position: absolute;
  z-index: 2; /* Blocking the button */
}

/* AFTER (working) */
.maplibregl-popup-close-button {
  /* ...other styles... */
  z-index: 10 !important; /* Above decorations */
}

.corner-decoration {
  position: absolute;
  z-index: 2;
}
```

**Explanation**: CSS stacking context caused decorative elements to appear above the functional close button. The `!important` flag ensures this takes precedence over MapTiler's default styles.

---

### Bug #6: Popup Not Resetting State After Close

**Symptoms**: After closing pinned popup with X, reopening it showed stale pinned state

**Root Cause**: `isPinned` ref not being reset when popup closed via close button

**Solution**: Add close event listener
```typescript
popup.on('close', () => {
  isPinned.current = false;
  const popupElement = marker.getPopup()?.getElement();
  if (popupElement) {
    popupElement.classList.remove('pinned');
  }
});
```

**Explanation**: MapTiler's popup can be closed multiple ways (close button, clicking elsewhere). Need to listen to the `close` event to reset state regardless of how it was closed.

---

## 🤔 Why More Bugs Than Leaflet

### 1. **Coordinate System Differences**

**Leaflet**: Uses standard GIS format `[latitude, longitude]`
```typescript
<Marker position={[48.8566, 2.3522]} /> // Paris
```

**MapTiler**: Uses GeoJSON format `[longitude, latitude]`
```typescript
marker.setLngLat([2.3522, 48.8566]); // Paris - swapped!
```

**Impact**: Required conversion at every point where coordinates are used. Easy to forget, causing markers to appear in wrong locations.

---

### 2. **Declarative vs Imperative API**

**Leaflet (with React-Leaflet)**: Declarative React components
```typescript
<MapContainer>
  <Marker position={pos}>
    <Popup>{content}</Popup>
  </Marker>
</MapContainer>
```
- React manages lifecycle
- Props drive behavior
- Familiar to React developers

**MapTiler**: Imperative JavaScript API
```typescript
const marker = new maptilersdk.Marker(options);
marker.setLngLat(pos);
marker.setPopup(popup);
marker.addTo(map);
```
- Manual lifecycle management
- Method calls drive behavior
- Requires more boilerplate

**Impact**: More code to write, more places for bugs, need to manage cleanup manually.

---

### 3. **Marker Positioning System**

**Leaflet**: Simple iconAnchor
```typescript
iconAnchor: [24, 48] // X offset, Y offset from top-left
```

**MapTiler**: Anchor presets + element transforms
```typescript
anchor: 'bottom' // or 'center', 'top', 'left', 'right', etc.
```

**Impact**:
- Different mental model
- CSS transforms on marker elements interfere with positioning
- Required understanding of how MapTiler internally positions markers

---

### 4. **Event System Complexity**

**Leaflet**: Standard DOM events + Leaflet events
```typescript
marker.on('click', handler);
marker.on('mouseover', handler);
```

**MapTiler**: Mix of DOM events and MapTiler events
```typescript
// Some events on marker element
markerElement.addEventListener('click', handler);

// Some events on popup object
popup.on('close', handler);

// Some events on map
map.on('click', 'layer-id', handler);
```

**Impact**: Confusion about which events go where, need to understand three different event systems.

---

### 5. **Style Loading Lifecycle**

**Leaflet**: Simple ready state
```typescript
<MapContainer whenCreated={setMap}>
  {/* Children render when map ready */}
</MapContainer>
```

**MapTiler**: Complex style loading
```typescript
// Different events for different style types
map.on('load', handler);         // For style URLs
map.on('style.load', handler);   // For custom style objects

// May need fallback
const checkLoaded = () => {
  if (map.isStyleLoaded()) {
    // Ready
  }
};
```

**Impact**: Boundaries and layers didn't appear because wrong event was used.

---

### 6. **CSS Stacking Context**

**Leaflet**: Simpler DOM structure
```html
<div class="leaflet-marker">
  <div class="marker-content"></div>
</div>
<div class="leaflet-popup">
  <button class="close">×</button>
  <div class="content"></div>
</div>
```

**MapTiler**: More complex structure with more z-index management needed
```html
<div class="maplibregl-marker">
  <div class="marker-wrapper">
    <div class="marker-content">
      <div class="decorations"></div> <!-- Can block interactions -->
    </div>
  </div>
</div>
<div class="maplibregl-popup">
  <button class="close"></button> <!-- Needs explicit z-index -->
  <div class="content">
    <div class="decorations"></div> <!-- More elements = more complexity -->
  </div>
</div>
```

**Impact**: Close button was blocked by decorative elements due to z-index conflicts.

---

### 7. **Learning Curve & Documentation**

**Leaflet**:
- 13+ years old (released 2011)
- Extensive documentation
- Huge community
- Many Stack Overflow answers
- Simple API

**MapTiler SDK**:
- Newer (based on MapLibre GL)
- Documentation less comprehensive for edge cases
- Smaller community
- Fewer examples for advanced use cases
- More complex API (Mapbox GL Style Spec)

**Impact**: Harder to find solutions to problems, more trial and error.

---

### 8. **Transform Conflicts**

**Leaflet**: Handles CSS transforms gracefully
```css
.leaflet-marker {
  transform: scale(1.5) rotate(45deg); /* Works fine */
}
```

**MapTiler**: Uses transforms internally for positioning
```css
.maplibregl-marker {
  transform: translate(100px, 200px); /* MapTiler's positioning */
}

/* Adding our own transforms breaks positioning */
.custom-marker {
  transform: scale(1.5); /* Overwrites MapTiler's transform! */
}
```

**Impact**: Animations using transforms caused markers to jump to wrong positions.

---

### 9. **Migration Complexity Summary**

| Aspect | Leaflet | MapTiler | Difficulty |
|--------|---------|----------|------------|
| Coordinate format | [lat, lng] | [lng, lat] | 🟡 Medium |
| API style | Declarative | Imperative | 🔴 Hard |
| Marker positioning | iconAnchor | anchor + transforms | 🟡 Medium |
| Event handling | Unified | Split across systems | 🟡 Medium |
| Style loading | Simple | Complex | 🟡 Medium |
| CSS transforms | Compatible | Conflicts | 🔴 Hard |
| Documentation | Excellent | Good | 🟢 Easy |
| Community support | Huge | Growing | 🟡 Medium |

---

## 🔑 Key Technical Differences

### Coordinate Conversion Pattern

**Always convert when passing to MapTiler**:
```typescript
// User provides [lat, lng]
const position: [number, number] = [48.8566, 2.3522];

// Convert to [lng, lat] for MapTiler
const mapTilerPosition: [number, number] = [position[1], position[0]];

marker.setLngLat(mapTilerPosition);
```

**Always convert when receiving from MapTiler**:
```typescript
map.on('click', (e) => {
  const lngLat = e.lngLat; // MapTiler gives [lng, lat]
  const standardFormat = [lngLat.lat, lngLat.lng]; // Convert to [lat, lng]
});
```

---

### Transform Animation Pattern

**DON'T animate the wrapper element**:
```html
<!-- ❌ WRONG - Breaks positioning -->
<div class="marker-wrapper" style="animation: markerPop 0.3s">
  <div class="content">...</div>
</div>
```

**DO animate child elements**:
```html
<!-- ✅ CORRECT - Works properly -->
<div class="marker-wrapper">
  <div class="content" style="animation: markerPop 0.3s">...</div>
</div>
```

---

### Z-Index Management Pattern

**Popup element layers** (from bottom to top):
```
z-index: -1  → Background texture
z-index: 1   → Base content (.gaming-popup-content)
z-index: 2   → Corner decorations
z-index: 10  → Close button (must be highest)
```

**Rule**: Interactive elements (buttons) must have higher z-index than decorative elements.

---

### Event Listener Cleanup Pattern

```typescript
useEffect(() => {
  if (!map) return;

  // Create marker
  const marker = new maptilersdk.Marker(...);

  // Add event listeners
  const handleClick = () => { /* ... */ };
  element.addEventListener('click', handleClick);

  // CRITICAL: Clean up on unmount
  return () => {
    element.removeEventListener('click', handleClick);
    marker.remove();
  };
}, [map, dependencies]);
```

---

## 📁 Files Modified

### Created
- `components/map/MapContext.tsx` - React Context for sharing map instance

### Modified
1. `package.json` - Updated dependencies
2. `components/map/BaseMap.tsx` - Complete rewrite for MapTiler
3. `components/map/GamingMarker.tsx` - Complete rewrite for MapTiler
4. `components/map/JourneyPath.tsx` - Complete rewrite for MapTiler
5. `app/globals.css` - Enhanced popup styles, fixed z-index issues
6. `app/dashboard/journey-map/page.tsx` - Updated comments

### Deleted
- `components/map/AdministrativeBoundaries.tsx` - Functionality moved to BaseMap

---

## ✅ Migration Checklist

For future migrations or similar projects:

- [ ] Set up MapTiler API key in environment variables
- [ ] Install `@maptiler/sdk` and `@types/maplibre-gl`
- [ ] Create MapContext for sharing map instance
- [ ] Convert all coordinates from [lat, lng] to [lng, lat]
- [ ] Use `anchor: 'bottom'` for markers (equivalent to iconAnchor bottom center)
- [ ] Never apply transform animations to marker wrapper elements
- [ ] Use `style.load` event for custom style objects
- [ ] Add event listeners with proper cleanup
- [ ] Manage z-index carefully for interactive elements
- [ ] Test popup interactions thoroughly (open, close, pin, unpin)
- [ ] Verify all GeoJSON layers load properly
- [ ] Clean up old dependencies (Leaflet, react-leaflet, @types/leaflet)

---

## 🎓 Lessons Learned

1. **Read the docs carefully**: MapTiler and Leaflet have different conventions
2. **Test incrementally**: Migrate one component at a time
3. **Use console.log extensively**: Track coordinate conversions and state changes
4. **Understand the positioning system**: How the library positions elements affects what you can do with CSS
5. **Z-index matters**: Always consider stacking context in complex UIs
6. **Event cleanup is critical**: Prevent memory leaks in React
7. **Fallbacks are good**: Use polling as backup when events are unreliable
8. **Transform animations require special care**: Understand what the library is doing under the hood

---

## 📞 Support

For issues or questions about this migration:
- Check MapTiler SDK docs: https://docs.maptiler.com/sdk-js/
- Check MapLibre GL JS docs: https://maplibre.org/maplibre-gl-js-docs/
- Review this document for common issues and solutions

---

**Last Updated**: December 30, 2025
**Migration Status**: ✅ Complete
**All Tests Passing**: ✅ Yes
