import { WalkingDirections, ParkingSpot } from '../types';

/**
 * Calculates distance between two coordinates in meters using the Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Calculates bearing from start point to end point in degrees (0 = North, 90 = East, etc.)
 */
export function calculateBearingDegrees(
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number
): number {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Converts bearing degrees to human-readable cardinal direction
 */
export function getCardinalDirection(bearing: number): string {
  const directions = [
    'north',
    'northeast',
    'east',
    'southeast',
    'south',
    'southwest',
    'west',
    'northwest',
  ];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Generates full walking directions package
 */
export function getWalkingDirections(
  userLat: number,
  userLng: number,
  carLat: number,
  carLng: number,
  streetName: string = 'Current Location'
): WalkingDirections {
  const distance = calculateDistanceMeters(userLat, userLng, carLat, carLng);
  const bearing = calculateBearingDegrees(userLat, userLng, carLat, carLng);
  const cardinal = getCardinalDirection(bearing);
  // Estimate ~80 meters per minute walking speed
  const minutes = Math.max(1, Math.round(distance / 75));

  return {
    distanceMeters: distance,
    walkingMinutes: minutes,
    bearingDegrees: bearing,
    cardinalDirection: cardinal,
    streetInstruction: distance < 15 ? 'You have arrived at your car!' : `Head ${cardinal} toward ${streetName}`,
    userLat,
    userLng,
    carLat,
    carLng,
  };
}

/**
 * Format relative time description (e.g. "Spot saved 12 min ago", "Today, 2:45 PM")
 */
export function formatRelativeSavedTime(savedAtIso: string): string {
  const date = new Date(savedAtIso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'Spot saved just now';
  if (diffMins < 60) return `Spot saved ${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Spot saved ${diffHours}h ago`;
  return `Saved on ${date.toLocaleDateString()}`;
}

export function formatHistoryDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

  if (isToday) {
    return `Today, ${timeStr}`;
  } else if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  } else {
    const month = date.toLocaleDateString([], { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}, ${timeStr}`;
  }
}

// In-memory cache for reverse geocoded locations
const geocodeCache = new Map<string, string>();

/**
 * Reverse geocode latitude and longitude to a real human-readable street address
 */
export async function reverseGeocodeLocation(lat: number, lon: number): Promise<string> {
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SpotSaverApp/1.0 (Myworkemail2023@gmail.com)',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address;
      if (addr) {
        const street = addr.road || addr.pedestrian || addr.street || addr.neighbourhood || addr.suburb;
        const houseNum = addr.house_number ? `${addr.house_number} ` : '';
        const city = addr.city || addr.town || addr.village || addr.county || '';
        
        let result = '';
        if (street) {
          result = `${houseNum}${street}${city ? `, ${city}` : ''}`;
        } else if (data.display_name) {
          result = data.display_name.split(',').slice(0, 2).join(',').trim();
        }

        if (result) {
          geocodeCache.set(cacheKey, result);
          return result;
        }
      }
    }
  } catch (err) {
    console.debug('Reverse geocode fallback:', err);
  }

  // Graceful coordinate fallback
  const fallback = `Parked Spot (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  geocodeCache.set(cacheKey, fallback);
  return fallback;
}

/**
 * Compress and convert photo file to data URL for storage
 */
export function compressImageFile(file: File, maxWidth: number = 960, quality: number = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Haptic Vibration Feedback for instant physical confirmation
 */
export function triggerHapticFeedback(type: 'light' | 'medium' | 'success' | 'warning' = 'light') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'light') {
        navigator.vibrate(18);
      } else if (type === 'medium') {
        navigator.vibrate(35);
      } else if (type === 'success') {
        navigator.vibrate([30, 40, 45]);
      } else if (type === 'warning') {
        navigator.vibrate([60, 50, 70]);
      }
    } catch (e) {
      console.debug('Haptic feedback note:', e);
    }
  }
}

/**
 * Share Parked Spot Location via WhatsApp, SMS, or Clipboard
 */
export async function shareSpotLocation(spot: ParkingSpot): Promise<boolean> {
  const mapsUrl = `https://maps.google.com/?q=${spot.latitude},${spot.longitude}`;
  const notesText = spot.levelOrSection ? ` (Floor/Section: ${spot.levelOrSection})` : '';
  const shareTitle = '📍 My Parked Car Location';
  const shareText = `I parked my car at ${spot.address || 'Saved Location'}${notesText}.\nOpen in Google Maps: ${mapsUrl}`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: mapsUrl,
      });
      return true;
    } catch (err) {
      // User cancelled share or fallback to clipboard
    }
  }

  // Fallback: Copy direct Google Maps link to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${shareText}`);
      return true;
    } catch (err) {
      console.debug('Clipboard write error:', err);
    }
  }

  return false;
}

/**
 * Play subtle sound feedback (Web Audio API)
 */
export function playNotificationTone(type: 'success' | 'warning' | 'click' | 'found') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success' || type === 'found') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'warning') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(370, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (e) {
    console.debug('Audio playback note:', e);
  }
}
