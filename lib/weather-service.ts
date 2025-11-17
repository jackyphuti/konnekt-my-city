/**
 * Weather Service - Real-time weather data fetching
 * Uses Open-Meteo API (free, no API key required)
 */

export interface WeatherCondition {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
  cloudCover: number;
  condition: string;
  icon: string;
}

export interface WeatherForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  precipitation: number;
  windSpeed: number;
}

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: WeatherCondition;
  forecast: WeatherForecast[];
  lastUpdated: string;
}

// Weather condition mapping
const WEATHER_CONDITION_MAP: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear sky', icon: 'sun' },
  1: { condition: 'Mainly clear', icon: 'sun' },
  2: { condition: 'Partly cloudy', icon: 'cloud' },
  3: { condition: 'Overcast', icon: 'cloud' },
  45: { condition: 'Foggy', icon: 'cloud' },
  48: { condition: 'Depositing rime fog', icon: 'cloud' },
  51: { condition: 'Light drizzle', icon: 'rain' },
  53: { condition: 'Moderate drizzle', icon: 'rain' },
  55: { condition: 'Dense drizzle', icon: 'rain' },
  61: { condition: 'Slight rain', icon: 'rain' },
  63: { condition: 'Moderate rain', icon: 'rain' },
  65: { condition: 'Heavy rain', icon: 'rain' },
  71: { condition: 'Slight snow', icon: 'snow' },
  73: { condition: 'Moderate snow', icon: 'snow' },
  75: { condition: 'Heavy snow', icon: 'snow' },
  77: { condition: 'Snow grains', icon: 'snow' },
  80: { condition: 'Slight rain showers', icon: 'rain' },
  81: { condition: 'Moderate rain showers', icon: 'rain' },
  82: { condition: 'Violent rain showers', icon: 'rain' },
  85: { condition: 'Slight snow showers', icon: 'snow' },
  86: { condition: 'Heavy snow showers', icon: 'snow' },
  95: { condition: 'Thunderstorm', icon: 'thunder' },
  96: { condition: 'Thunderstorm with hail', icon: 'thunder' },
  99: { condition: 'Thunderstorm with hail', icon: 'thunder' },
};

function getWeatherCondition(code: number): { condition: string; icon: string } {
  return WEATHER_CONDITION_MAP[code] || { condition: 'Unknown', icon: 'cloud' };
}

/**
 * Fetch real-time weather data from Open-Meteo API
 * @param latitude - User's latitude
 * @param longitude - User's longitude
 * @param locationName - Location name for display
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  locationName: string
): Promise<WeatherData | null> {
  try {
    // Open-Meteo API endpoint (free, no API key required)
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.append('latitude', latitude.toString());
    url.searchParams.append('longitude', longitude.toString());
    url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,visibility,uv_index,precipitation,cloud_cover');
    url.searchParams.append('daily', 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max');
    url.searchParams.append('timezone', 'auto');
    url.searchParams.append('forecast_days', '7');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    const current = data.current;
    const currentWeather = getWeatherCondition(current.weather_code);

    const forecast = data.daily.time.slice(0, 7).map((date: string, idx: number) => {
      const dailyWeather = getWeatherCondition(data.daily.weather_code[idx]);
      return {
        date,
        tempMax: data.daily.temperature_2m_max[idx],
        tempMin: data.daily.temperature_2m_min[idx],
        condition: dailyWeather.condition,
        icon: dailyWeather.icon,
        precipitation: data.daily.precipitation_sum[idx] || 0,
        windSpeed: data.daily.wind_speed_10m_max[idx],
      };
    });

    return {
      location: locationName,
      latitude,
      longitude,
      timezone: data.timezone,
      current: {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        visibility: Math.round(current.visibility / 1000), // Convert to km
        uvIndex: current.uv_index,
        precipitation: current.precipitation,
        cloudCover: current.cloud_cover,
        condition: currentWeather.condition,
        icon: currentWeather.icon,
      },
      forecast,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

/**
 * Fetch weather for multiple major SA cities
 */
export async function fetchMultipleCitiesWeather(): Promise<WeatherData[]> {
  const cities = [
    { name: 'Johannesburg', lat: -26.2023, lon: 28.0436 },
    { name: 'Cape Town', lat: -33.9249, lon: 18.4241 },
    { name: 'Durban', lat: -29.8587, lon: 31.0218 },
    { name: 'Pretoria', lat: -25.7479, lon: 28.2293 },
  ];

  const weatherData = await Promise.all(
    cities.map((city) =>
      fetchWeatherData(city.lat, city.lon, city.name)
    )
  );

  return weatherData.filter((data): data is WeatherData => data !== null);
}

/**
 * Cache weather data in localStorage
 */
export function cacheWeatherData(data: WeatherData): void {
  if (typeof window === 'undefined') return;

  const cache = localStorage.getItem('weatherCache');
  const allCache = cache ? JSON.parse(cache) : {};
  allCache[data.location] = data;
  localStorage.setItem('weatherCache', JSON.stringify(allCache));
}

/**
 * Get cached weather data
 */
export function getCachedWeatherData(location: string): WeatherData | null {
  if (typeof window === 'undefined') return null;

  const cache = localStorage.getItem('weatherCache');
  if (!cache) return null;

  const allCache = JSON.parse(cache);
  const data = allCache[location];

  // Check if cache is older than 30 minutes
  if (data && data.lastUpdated) {
    const cacheAge = Date.now() - new Date(data.lastUpdated).getTime();
    if (cacheAge < 30 * 60 * 1000) {
      return data;
    }
  }

  return null;
}
