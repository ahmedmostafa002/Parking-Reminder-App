import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ParkingSpot, UserLocation, MapViewType } from '../types';

interface MapViewProps {
  userLocation: UserLocation | null;
  savedSpot: ParkingSpot | null;
  showRoute?: boolean;
  mapViewType?: MapViewType;
  onCenterUser?: () => void;
  className?: string;
  interactive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  userLocation,
  savedSpot,
  showRoute = false,
  mapViewType = 'flat',
  className = 'h-full w-full',
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const spotMarkerRef = useRef<L.Marker | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = userLocation?.latitude || savedSpot?.latitude || 37.7749;
    const initialLng = userLocation?.longitude || savedSpot?.longitude || -122.4194;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer based on map view type
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let maxZoom = 19;

    if (mapViewType === 'flat') {
      // Light minimalist clean map
      tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    } else if (mapViewType === 'satellite') {
      // Esri Satellite
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 18;
    } else {
      // Voyager street map
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;
  }, [mapViewType]);

  // Update User Location Marker (Blue Ring Puck)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    const userIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-blue-500/25 animate-ping"></div>
        <div class="absolute w-6 h-6 rounded-full bg-blue-500/40"></div>
        <div class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
      </div>
    `;

    const customUserIcon = L.divIcon({
      html: userIconHtml,
      className: 'custom-user-puck',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.latitude, userLocation.longitude]);
      userMarkerRef.current.setIcon(customUserIcon);
    } else {
      userMarkerRef.current = L.marker([userLocation.latitude, userLocation.longitude], {
        icon: customUserIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    }
  }, [userLocation]);

  // Update Saved Spot Marker (Warm Coral Car Pin)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!savedSpot) {
      if (spotMarkerRef.current) {
        map.removeLayer(spotMarkerRef.current);
        spotMarkerRef.current = null;
      }
      return;
    }

    const spotIconHtml = `
      <div class="relative flex flex-col items-center justify-center -translate-y-2">
        <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#FF5A36] text-white shadow-lg border-2 border-white animate-bounce-short">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
            <circle cx="7.5" cy="14.5" r="1.5"/>
            <circle cx="16.5" cy="14.5" r="1.5"/>
          </svg>
        </div>
        <div class="w-2 h-2 -mt-1 bg-[#FF5A36] rotate-45 border-r border-b border-white"></div>
      </div>
    `;

    const customSpotIcon = L.divIcon({
      html: spotIconHtml,
      className: 'custom-spot-marker',
      iconSize: [40, 48],
      iconAnchor: [20, 48],
    });

    if (spotMarkerRef.current) {
      spotMarkerRef.current.setLatLng([savedSpot.latitude, savedSpot.longitude]);
      spotMarkerRef.current.setIcon(customSpotIcon);
    } else {
      spotMarkerRef.current = L.marker([savedSpot.latitude, savedSpot.longitude], {
        icon: customSpotIcon,
        zIndexOffset: 900,
      }).addTo(map);
    }
  }, [savedSpot]);

  // Update Route / Trajectory Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (showRoute && userLocation && savedSpot) {
      // Create a slight curved path for realistic natural walking visual
      const p1 = [userLocation.latitude, userLocation.longitude] as [number, number];
      const p2 = [savedSpot.latitude, savedSpot.longitude] as [number, number];

      const midLat = (p1[0] + p2[0]) / 2 + (p2[1] - p1[1]) * 0.15;
      const midLng = (p1[1] + p2[1]) / 2 - (p2[0] - p1[0]) * 0.15;

      const pathPoints: [number, number][] = [
        p1,
        [midLat, midLng],
        p2,
      ];

      const polyline = L.polyline(pathPoints, {
        color: '#FF5A36',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      routeLayerRef.current = polyline;

      // Fit map bounds to show both user and car
      const bounds = L.latLngBounds([p1, p2]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17 });
    }
  }, [showRoute, userLocation, savedSpot]);

  return (
    <div className={`relative ${className} overflow-hidden`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
