# Real-Time Updates Implementation - Technical Details

## ⚡ Live Updates Flow Visualization

```
┌─────────────────────────────────────────────────────────┐
│          User Visits /updates Page                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │ Request Geolocation         │
        │ "Allow access to location?" │
        └─────────────┬───────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼ User clicks Allow     ▼ User clicks Block
    ┌──────────────┐         ┌──────────────┐
    │ Get coords   │         │ Show error   │
    │ lat, lon     │         │ Use default  │
    │ accuracy     │         │ (Joburg)     │
    └──────┬───────┘         └──────────────┘
           │
           ▼
    ┌──────────────────┐
    │ Determine City   │
    │ (by distance)    │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────────────────────────────────┐
    │ Parallel API Calls                           │
    └──────────────────────────────────────────────┘
           │
    ┌──────┼──────┬─────────────┐
    │      │      │             │
    ▼      ▼      ▼             ▼
  Weather News  Alerts    (localStorage)
  (Open-  (RSS/  (Eskom)    Cache check
   Meteo) NewsAPI)
    │      │      │
    │      │      └─────────────────────────┐
    │      └───────────────────────┐        │
    └──────────────────────────────┼────────┤
                                   ▼        ▼
                            Display Data on Page
                                   │
                                   ▼
                    Auto-Refresh Intervals Start:
                    ┌─────────────────────────────┐
                    │ Weather: 30 min interval    │
                    │ News: 1 hour interval       │
                    │ Alerts: 5 min interval      │
                    └─────────────────────────────┘
```

---

## 🔄 Real-Time Update Example - Temperature

### Scenario: Temperature Drop Over Time

**Time 14:00**
```javascript
// Page opens
fetchWeatherData(-26.2023, 28.0436, "Johannesburg")
// API returns: temperature: 24°C
setWeather({ ...weather, current: { temperature: 24 } })
// Page displays: 24°C
```

**Time 14:05** (5 minutes later)
```javascript
// Temperature actually dropped in Johannesburg
// Real world: 24°C → 22°C
// But page still shows: 24°C (cached)

// Alert: It's been 5 minutes, refresh alerts
const alertsData = await fetchAllAlerts()
// Alerts update, but weather hasn't auto-refreshed yet
```

**Time 14:30** (30 minutes later)
```javascript
// Auto-refresh interval fires for weather
fetchWeatherData(-26.2023, 28.0436, "Johannesburg")
// API returns: temperature: 22°C (current real temp)
setWeather({ ...weather, current: { temperature: 22 } })
// Page updates: 24°C → 22°C ✅
// User sees: "It's cooled down!"
```

**Or User Clicks "Refresh Now"**
```javascript
// Immediately:
const weatherData = await fetchWeatherData(...)
// Page updates instantly: 24°C → 22°C ✅
```

---

## 📡 API Integration Details

### 1. Open-Meteo Weather API

**Request:**
```typescript
const url = new URL('https://api.open-meteo.com/v1/forecast');
url.searchParams.append('latitude', '-26.2023');
url.searchParams.append('longitude', '28.0436');
url.searchParams.append('current', 'temperature_2m,humidity,wind_speed_10m,...');
url.searchParams.append('daily', 'temperature_2m_max,temperature_2m_min,...');
url.searchParams.append('timezone', 'auto');

const response = await fetch(url.toString());
const data = await response.json();
```

**Response Example:**
```json
{
  "latitude": -26.2023,
  "longitude": 28.0436,
  "timezone": "Africa/Johannesburg",
  "current": {
    "temperature_2m": 22.5,
    "relative_humidity_2m": 65,
    "wind_speed_10m": 12,
    "weather_code": 2,
    "precipitation": 0
  },
  "daily": {
    "time": ["2025-11-12", "2025-11-13", ...],
    "temperature_2m_max": [28, 27, ...],
    "temperature_2m_min": [18, 17, ...],
    "weather_code": [2, 61, ...]
  }
}
```

**Processing:**
```typescript
// Map weather code to condition
const currentWeather = getWeatherCondition(data.current.weather_code);
// Code 2 = "Partly cloudy"

// Extract temperature
const temperature = Math.round(data.current.temperature_2m);
// 22.5 → 22°C

// Build 7-day forecast
const forecast = data.daily.time.map((date, idx) => ({
  date,
  tempMax: data.daily.temperature_2m_max[idx],
  tempMin: data.daily.temperature_2m_min[idx],
  condition: getWeatherCondition(data.daily.weather_code[idx]).condition,
  precipitation: data.daily.precipitation_sum[idx],
  windSpeed: data.daily.wind_speed_10m_max[idx],
}));
```

### 2. Bing News RSS Feed

**Request:**
```typescript
const rssUrl = 'https://www.bing.com/news/search?q=South+Africa&rss';
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
const response = await fetch(proxyUrl);
const data = await response.json();
```

**Processing RSS XML:**
```typescript
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
const items = xmlDoc.querySelectorAll('item');

items.forEach((item) => {
  const title = item.querySelector('title')?.textContent;
  const description = item.querySelector('description')?.textContent;
  const pubDate = item.querySelector('pubDate')?.textContent;
  const link = item.querySelector('link')?.textContent;
  
  // Clean HTML and categorize
  const summary = description.replace(/<[^>]*>/g, '');
  const category = categorizeArticle(title);
  
  articles.push({
    title,
    summary,
    category,
    source: 'Bing News',
    timestamp: formatDate(pubDate),
    url: link,
  });
});
```

### 3. Eskom Load Shedding API

**Request:**
```typescript
const response = await fetch('https://api.eskomsepush.co.za/api/status');
const data = await response.json();
```

**Response Example:**
```json
{
  "status": {
    "stage": 4,
    "last_update": "2025-11-12T14:30:00",
    "next_stage_possible": "2025-11-12T18:00:00"
  },
  "notifications": [...],
  "events": [...]
}
```

**Processing:**
```typescript
const stage = data.status?.stage || 0;

// Determine severity
const severity = stage >= 5 ? 'critical' : 
                 stage >= 3 ? 'high' : 
                 stage >= 1 ? 'medium' : 'low';

// Create alert
const alert = {
  type: 'electricity',
  severity,
  title: `Load Shedding Stage ${stage}`,
  description: `Stage ${stage} load shedding in effect...`,
  location: 'Nationwide',
  status: 'ongoing',
  estimatedDuration: '2-4 hours per zone',
};
```

---

## 💾 Caching Strategy Implementation

### Weather Caching:
```typescript
export function cacheWeatherData(data: WeatherData): void {
  if (typeof window === 'undefined') return;

  const cache = localStorage.getItem('weatherCache');
  const allCache = cache ? JSON.parse(cache) : {};
  
  // Store by city name
  allCache[data.location] = data;
  
  localStorage.setItem('weatherCache', JSON.stringify(allCache));
}

export function getCachedWeatherData(location: string): WeatherData | null {
  if (typeof window === 'undefined') return null;

  const cache = localStorage.getItem('weatherCache');
  if (!cache) return null;

  const allCache = JSON.parse(cache);
  const data = allCache[location];

  // Check if cache is older than 30 minutes
  if (data && data.lastUpdated) {
    const cacheAge = Date.now() - new Date(data.lastUpdated).getTime();
    if (cacheAge < 30 * 60 * 1000) { // 30 minutes
      return data;
    }
  }

  return null; // Cache expired
}
```

**localStorage Structure:**
```json
{
  "weatherCache": {
    "Johannesburg": {
      "location": "Johannesburg",
      "latitude": -26.2023,
      "longitude": 28.0436,
      "current": { "temperature": 22, ... },
      "forecast": [...],
      "lastUpdated": "2025-11-12T14:30:00"
    },
    "Cape Town": { ... }
  },
  "newsCache": {
    "articles": [...],
    "timestamp": "2025-11-12T14:00:00"
  },
  "alertsCache": {
    "alerts": [...],
    "timestamp": "2025-11-12T14:30:00"
  },
  "userLocation": {
    "latitude": -26.2023,
    "longitude": 28.0436,
    "municipality": "City of Johannesburg",
    "city": "Johannesburg",
    "province": "Gauteng",
    "accuracy": 15
  }
}
```

---

## ⏰ Auto-Refresh Timer Implementation

```typescript
useEffect(() => {
  // 1. Weather refreshes every 30 minutes
  const weatherInterval = setInterval(async () => {
    if (location) {
      const weatherData = await fetchWeatherData(
        location.latitude,
        location.longitude,
        location.city
      );
      if (weatherData) {
        setWeather(weatherData);
        cacheWeatherData(weatherData);
        setLastUpdated(`Weather updated at ${new Date().toLocaleTimeString()}`);
      }
    }
  }, 30 * 60 * 1000); // 30 minutes in milliseconds

  // 2. News refreshes every 1 hour
  const newsInterval = setInterval(async () => {
    const newsData = await fetchSouthAfricaNews();
    setNews(newsData);
    cacheNewsData(newsData);
    setLastUpdated(`News updated at ${new Date().toLocaleTimeString()}`);
  }, 60 * 60 * 1000); // 1 hour

  // 3. Alerts refresh every 5 minutes (most critical)
  const alertsInterval = setInterval(async () => {
    const alertsData = await fetchAllAlerts();
    setAlerts(alertsData);
    cacheAlerts(alertsData);
    setLastUpdated(`Alerts updated at ${new Date().toLocaleTimeString()}`);
  }, 5 * 60 * 1000); // 5 minutes

  // Cleanup intervals on unmount
  return () => {
    clearInterval(weatherInterval);
    clearInterval(newsInterval);
    clearInterval(alertsInterval);
  };
}, [location]); // Re-run if location changes
```

---

## 🎬 Manual Refresh Implementation

```typescript
const handleRefresh = async () => {
  setLoading(true);

  // Parallel requests for speed
  const tasks = [];

  // Weather refresh
  if (location) {
    tasks.push(
      fetchWeatherData(location.latitude, location.longitude, location.city)
        .then(weatherData => {
          if (weatherData) {
            setWeather(weatherData);
            cacheWeatherData(weatherData);
          }
        })
    );
  }

  // News refresh
  tasks.push(
    fetchSouthAfricaNews()
      .then(newsData => {
        setNews(newsData);
        cacheNewsData(newsData);
      })
  );

  // Alerts refresh
  tasks.push(
    fetchAllAlerts()
      .then(alertsData => {
        setAlerts(alertsData);
        cacheAlerts(alertsData);
      })
  );

  // Wait for all to complete
  await Promise.all(tasks);

  setLastUpdated(`Updated at ${new Date().toLocaleTimeString()}`);
  setLoading(false);
};
```

---

## 🗺️ Geolocation to Municipality Mapping

```typescript
// Haversine formula to calculate distance between coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

// Find closest municipality
function determineMunicipality(lat: number, lon: number): string {
  let closestMunicipality = 'South Africa';
  let closestDistance = Infinity;

  for (const [municipality, data] of Object.entries(SA_MUNICIPALITIES)) {
    // Get distance to this municipality's center
    const distance = calculateDistance(lat, lon, data.lat, data.lon);
    
    // If closer and within radius, update
    if (distance < closestDistance && distance < data.radius) {
      closestDistance = distance;
      closestMunicipality = municipality;
    }
  }

  return closestMunicipality;
}

// Example: User at -26.15, 28.05 (Soweto)
// Distance to Johannesburg center (-26.20, 28.04): ~7km
// Within Johannesburg radius (50km): YES
// Result: "City of Johannesburg"
```

---

## 🔐 Geolocation Permission Flow

```typescript
export async function getUserLocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      resolve(null);
      return;
    }

    // Request permission
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Determine municipality
        const municipality = determineMunicipality(latitude, longitude);
        const municipalityData = SA_MUNICIPALITIES[municipality];

        const location = {
          latitude,
          longitude,
          municipality,
          city: municipalityData.city,
          province: municipalityData.province,
          accuracy,
        };

        // Persist to localStorage
        localStorage.setItem('userLocation', JSON.stringify(location));
        resolve(location);
      },
      // Error callback
      (error) => {
        console.error('Geolocation error:', error);
        resolve(null); // Return null on error
      },
      // Options
      {
        enableHighAccuracy: true,      // More accurate (uses GPS if available)
        timeout: 10000,                 // Wait max 10 seconds
        maximumAge: 300000,             // Use cache if <5 minutes old
      }
    );
  });
}
```

---

## 📊 Data Flow with Real Examples

### Scenario: User in Soweto (Part of Johannesburg)

```
1. Browser Geolocation Returns:
   latitude: -26.267
   longitude: 27.851

2. Distance Calculation:
   Johannesburg center: (-26.202, 28.043) distance: 18.5km ✓ (within 50km)
   Cape Town center: (-33.924, 18.424) distance: 889km ✗

3. Municipality Determined:
   "City of Johannesburg"

4. Weather Fetch:
   URL: https://api.open-meteo.com/v1/forecast?latitude=-26.267&longitude=27.851&...
   Response: Temperature: 21°C, Condition: Partly Cloudy

5. News Fetch:
   RSS feed returns 10 latest SA articles
   All categorized and displayed

6. Alerts Fetch:
   Eskom API returns: Stage 3 load shedding
   Shows: "Load Shedding Stage 3 - Nationwide"

7. Display on Page:
   📍 Johannesburg, Gauteng (-26.267, 27.851)
   🌡️ 21°C - Partly Cloudy
   📰 10 News articles
   ⚠️ Load Shedding Stage 3 (ongoing)

8. Auto-Refresh:
   - Every 30min: Check for new weather (21°C → 19°C?)
   - Every 1hr: Check for new news articles
   - Every 5min: Check for alert updates (Stage 3 → Stage 4?)
```

---

## ✅ Quality Assurance

### Testing Checklist:

- [x] Geolocation request works
- [x] Municipality detection accurate
- [x] Weather API returns real data
- [x] News API returns real articles
- [x] Alerts API returns real alerts
- [x] Caching works correctly
- [x] Cache expiration works
- [x] Auto-refresh timers function
- [x] Manual refresh updates data
- [x] Last updated timestamp accurate
- [x] Loading states display correctly
- [x] Error handling with fallbacks
- [x] Responsive on mobile
- [x] Dark mode works
- [x] Build succeeds without errors
- [x] No console errors or warnings

---

**Status:** ✅ Complete & Production Ready
**Last Updated:** November 12, 2025
**Version:** 2.0 - Real-Time Live Updates
