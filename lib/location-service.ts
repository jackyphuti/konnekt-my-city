/**
 * Location Services - Geolocation and Municipality Detection
 * Handles getting user's coordinates and determining their municipality
 */

export interface Location {
  latitude: number;
  longitude: number;
  municipality: string;
  city: string;
  province: string;
  accuracy: number;
}

// South African municipalities with their approximate boundaries
const SA_MUNICIPALITIES: Record<
  string,
  {
    lat: number;
    lon: number;
    city: string;
    province: string;
    radius: number;
  }
> = {
  'City of Johannesburg': {
    lat: -26.2023,
    lon: 28.0436,
    city: 'Johannesburg',
    province: 'Gauteng',
    radius: 50,
  },
  'City of Cape Town': {
    lat: -33.9249,
    lon: 18.4241,
    city: 'Cape Town',
    province: 'Western Cape',
    radius: 60,
  },
  'eThekwini Municipality': {
    lat: -29.8587,
    lon: 31.0218,
    city: 'Durban',
    province: 'KwaZulu-Natal',
    radius: 50,
  },
  'City of Tshwane': {
    lat: -25.7479,
    lon: 28.2293,
    city: 'Pretoria',
    province: 'Gauteng',
    radius: 50,
  },
  'Ekurhuleni Municipality': {
    lat: -26.1392,
    lon: 28.6194,
    city: 'Ekurhuleni',
    province: 'Gauteng',
    radius: 40,
  },
  'Nelson Mandela Bay Municipality': {
    lat: -33.9616,
    lon: 25.6087,
    city: 'Port Elizabeth',
    province: 'Eastern Cape',
    radius: 35,
  },
  'Buffalo City Municipality': {
    lat: -32.6543,
    lon: 27.9105,
    city: 'East London',
    province: 'Eastern Cape',
    radius: 30,
  },
  'Mangaung Metropolitan Municipality': {
    lat: -29.1199,
    lon: 25.5267,
    city: 'Bloemfontein',
    province: 'Free State',
    radius: 40,
  },
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Determine municipality based on coordinates
 */
function determineMunicipality(lat: number, lon: number): string {
  let closestMunicipality = 'South Africa';
  let closestDistance = Infinity;

  for (const [municipality, data] of Object.entries(SA_MUNICIPALITIES)) {
    const distance = calculateDistance(lat, lon, data.lat, data.lon);
    if (distance < closestDistance && distance < data.radius) {
      closestDistance = distance;
      closestMunicipality = municipality;
    }
  }

  return closestMunicipality;
}

/**
 * Request user's geolocation
 * Returns coordinates and determines their municipality
 */
export async function getUserLocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported by this browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const municipality = determineMunicipality(latitude, longitude);
        const municipalityData =
          SA_MUNICIPALITIES[municipality] ||
          SA_MUNICIPALITIES['City of Johannesburg'];

        const location: Location = {
          latitude,
          longitude,
          municipality,
          city: municipalityData.city,
          province: municipalityData.province,
          accuracy,
        };

        // Store in localStorage for persistence
        localStorage.setItem('userLocation', JSON.stringify(location));
        resolve(location);
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Get cached location from localStorage
 */
export function getCachedLocation(): Location | null {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem('userLocation');
  return cached ? JSON.parse(cached) : null;
}

/**
 * Clear cached location
 */
export function clearCachedLocation(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userLocation');
  }
}

/**
 * Get location or use cached version
 */
export async function getOrFetchLocation(): Promise<Location | null> {
  const cached = getCachedLocation();
  if (cached) return cached;
  return getUserLocation();
}
