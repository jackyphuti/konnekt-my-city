'use client';

import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeatherData {
  region: string;
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    feelsLike: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitation: number;
  }>;
}

const SA_WEATHER_DATA: WeatherData[] = [
  {
    region: 'Johannesburg',
    current: {
      temperature: 24,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      feelsLike: 23,
    },
    forecast: [
      { day: 'Tomorrow', high: 28, low: 18, condition: 'Sunny', icon: 'sun', precipitation: 0 },
      { day: 'Thursday', high: 25, low: 16, condition: 'Rainy', icon: 'rain', precipitation: 40 },
      { day: 'Friday', high: 22, low: 14, condition: 'Cloudy', icon: 'cloud', precipitation: 10 },
    ],
  },
  {
    region: 'Cape Town',
    current: {
      temperature: 20,
      condition: 'Windy',
      humidity: 72,
      windSpeed: 28,
      visibility: 9,
      feelsLike: 17,
    },
    forecast: [
      { day: 'Tomorrow', high: 22, low: 15, condition: 'Windy', icon: 'wind', precipitation: 5 },
      { day: 'Thursday', high: 21, low: 14, condition: 'Cloudy', icon: 'cloud', precipitation: 15 },
      { day: 'Friday', high: 23, low: 16, condition: 'Sunny', icon: 'sun', precipitation: 0 },
    ],
  },
  {
    region: 'Durban',
    current: {
      temperature: 26,
      condition: 'Humid',
      humidity: 78,
      windSpeed: 15,
      visibility: 8,
      feelsLike: 28,
    },
    forecast: [
      { day: 'Tomorrow', high: 27, low: 21, condition: 'Rainy', icon: 'rain', precipitation: 60 },
      { day: 'Thursday', high: 25, low: 20, condition: 'Rainy', icon: 'rain', precipitation: 50 },
      { day: 'Friday', high: 26, low: 19, condition: 'Cloudy', icon: 'cloud', precipitation: 20 },
    ],
  },
  {
    region: 'Pretoria',
    current: {
      temperature: 25,
      condition: 'Clear',
      humidity: 58,
      windSpeed: 10,
      visibility: 10,
      feelsLike: 24,
    },
    forecast: [
      { day: 'Tomorrow', high: 29, low: 17, condition: 'Sunny', icon: 'sun', precipitation: 0 },
      { day: 'Thursday', high: 26, low: 15, condition: 'Partly Cloudy', icon: 'cloud', precipitation: 5 },
      { day: 'Friday', high: 24, low: 14, condition: 'Cloudy', icon: 'cloud', precipitation: 15 },
    ],
  },
];

const getWeatherIcon = (icon: string, size: number = 24) => {
  switch (icon) {
    case 'sun':
      return <Sun size={size} className="text-yellow-500" />;
    case 'rain':
      return <CloudRain size={size} className="text-blue-500" />;
    case 'cloud':
      return <Cloud size={size} className="text-gray-400" />;
    case 'wind':
      return <Wind size={size} className="text-gray-500" />;
    default:
      return <Sun size={size} className="text-yellow-500" />;
  }
};

export function WeatherWidget() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Weather Across South Africa</h2>
        <p className="text-muted-foreground mb-6">
          Current conditions and 3-day forecast for major cities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SA_WEATHER_DATA.map((region) => (
          <Card key={region.region} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-xl font-semibold">{region.region}</h3>
            </div>

            {/* Current Weather */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold">{region.current.temperature}°C</div>
                  <div className="text-muted-foreground">{region.current.condition}</div>
                  <div className="text-sm text-muted-foreground">
                    Feels like {region.current.feelsLike}°C
                  </div>
                </div>
                <div className="text-center">
                  {getWeatherIcon(region.current.condition.toLowerCase().includes('rain') ? 'rain' : 'sun', 48)}
                </div>
              </div>

              {/* Current Details */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-secondary/50 p-2 rounded flex items-center gap-1">
                  <Droplets size={16} className="text-blue-500" />
                  <span>{region.current.humidity}%</span>
                </div>
                <div className="bg-secondary/50 p-2 rounded flex items-center gap-1">
                  <Wind size={16} className="text-gray-500" />
                  <span>{region.current.windSpeed}km/h</span>
                </div>
                <div className="bg-secondary/50 p-2 rounded flex items-center gap-1">
                  <Eye size={16} className="text-gray-500" />
                  <span>{region.current.visibility}km</span>
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">3-Day Forecast</h4>
              {region.forecast.map((day, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-secondary/30 rounded text-sm"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {getWeatherIcon(day.icon, 18)}
                    <div>
                      <div className="font-medium">{day.day}</div>
                      <div className="text-xs text-muted-foreground">{day.condition}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {day.high}° / {day.low}°
                    </div>
                    {day.precipitation > 0 && (
                      <div className="text-xs text-blue-600">{day.precipitation}% rain</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
