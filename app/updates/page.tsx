'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Newspaper, AlertTriangle, MapPin, RotateCw, Loader2 } from 'lucide-react';
import { getUserLocation, type Location } from '@/lib/location-service';
import { fetchWeatherData, cacheWeatherData, getCachedWeatherData, type WeatherData } from '@/lib/weather-service';
import { fetchSouthAfricaNews, cacheNewsData, getCachedNewsData, type NewsArticle } from '@/lib/news-service';
import { fetchAllAlerts, cacheAlerts, getCachedAlerts, type Alert } from '@/lib/alerts-service';

export default function UpdatesPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Request location on mount
  useEffect(() => {
    const requestLocation = async () => {
      const loc = await getUserLocation();
      setLocation(loc);

      if (loc) {
        // Fetch weather for user's location
        const cached = getCachedWeatherData(loc.city);
        if (cached) {
          setWeather(cached);
        } else {
          const weatherData = await fetchWeatherData(loc.latitude, loc.longitude, loc.city);
          if (weatherData) {
            setWeather(weatherData);
            cacheWeatherData(weatherData);
          }
        }
      }

      setLoading(false);
    };

    requestLocation();
  }, []);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      const cached = getCachedNewsData();
      if (cached) {
        setNews(cached);
      } else {
        const newsData = await fetchSouthAfricaNews();
        setNews(newsData);
        cacheNewsData(newsData);
      }
    };

    fetchNews();
  }, []);

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      const cached = getCachedAlerts();
      if (cached) {
        setAlerts(cached);
      } else {
        const alertsData = await fetchAllAlerts();
        setAlerts(alertsData);
        cacheAlerts(alertsData);
      }
    };

    fetchAlerts();
  }, []);

  // Auto-refresh data at intervals
  useEffect(() => {
    // Refresh weather every 30 minutes
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
    }, 30 * 60 * 1000);

    // Refresh news every 1 hour
    const newsInterval = setInterval(async () => {
      const newsData = await fetchSouthAfricaNews();
      setNews(newsData);
      cacheNewsData(newsData);
      setLastUpdated(`News updated at ${new Date().toLocaleTimeString()}`);
    }, 60 * 60 * 1000);

    // Refresh alerts every 5 minutes
    const alertsInterval = setInterval(async () => {
      const alertsData = await fetchAllAlerts();
      setAlerts(alertsData);
      cacheAlerts(alertsData);
      setLastUpdated(`Alerts updated at ${new Date().toLocaleTimeString()}`);
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(newsInterval);
      clearInterval(alertsInterval);
    };
  }, [location]);

  // Manual refresh
  const handleRefresh = async () => {
    setLoading(true);

    if (location) {
      const weatherData = await fetchWeatherData(
        location.latitude,
        location.longitude,
        location.city
      );
      if (weatherData) {
        setWeather(weatherData);
        cacheWeatherData(weatherData);
      }
    }

    const newsData = await fetchSouthAfricaNews();
    setNews(newsData);
    cacheNewsData(newsData);

    const alertsData = await fetchAllAlerts();
    setAlerts(alertsData);
    cacheAlerts(alertsData);

    setLastUpdated(`Updated at ${new Date().toLocaleTimeString()}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Real-Time Community Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Stay informed with live weather, news, and infrastructure alerts for your location.
          </p>

          {/* Location Info */}
          {location && (
            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                <MapPin size={18} className="text-blue-600" />
                <span className="font-semibold">{location.city}, {location.province}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                📍 {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
              </div>
              {lastUpdated && (
                <div className="text-sm text-muted-foreground">
                  🔄 {lastUpdated}
                </div>
              )}
              <Button
                onClick={handleRefresh}
                disabled={loading}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RotateCw size={16} />
                    Refresh Now
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="weather" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <Cloud size={18} />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper size={18} />
              <span className="hidden sm:inline">News</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle size={18} />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          {/* Weather Tab */}
          <TabsContent value="weather" className="mt-0">
            <div className="bg-white dark:bg-slate-950 rounded-lg p-8 shadow-sm border">
              {weather ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{weather.location}</h2>
                    <div className="flex items-end gap-4 mb-6">
                      <div>
                        <div className="text-6xl font-bold">{weather.current.temperature}°C</div>
                        <div className="text-muted-foreground text-lg">{weather.current.condition}</div>
                        <div className="text-sm text-muted-foreground">Feels like {weather.current.feelsLike}°C</div>
                      </div>
                    </div>

                    {/* Current Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <Card className="p-4 bg-secondary/50">
                        <div className="text-sm text-muted-foreground">Humidity</div>
                        <div className="text-2xl font-semibold">{weather.current.humidity}%</div>
                      </Card>
                      <Card className="p-4 bg-secondary/50">
                        <div className="text-sm text-muted-foreground">Wind</div>
                        <div className="text-2xl font-semibold">{weather.current.windSpeed} km/h</div>
                      </Card>
                      <Card className="p-4 bg-secondary/50">
                        <div className="text-sm text-muted-foreground">Visibility</div>
                        <div className="text-2xl font-semibold">{weather.current.visibility} km</div>
                      </Card>
                      <Card className="p-4 bg-secondary/50">
                        <div className="text-sm text-muted-foreground">UV Index</div>
                        <div className="text-2xl font-semibold">{weather.current.uvIndex}</div>
                      </Card>
                    </div>
                  </div>

                  {/* Forecast */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">7-Day Forecast</h3>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                      {weather.forecast.map((day, idx) => (
                        <Card key={idx} className="p-3 text-center bg-secondary/30">
                          <div className="text-xs font-semibold mb-2">
                            {new Date(day.date).toLocaleDateString('en-ZA', { weekday: 'short' })}
                          </div>
                          <div className="text-sm font-semibold mb-2">
                            {day.tempMax}° / {day.tempMin}°
                          </div>
                          <div className="text-xs text-muted-foreground">{day.condition}</div>
                          {day.precipitation > 0 && (
                            <div className="text-xs text-blue-600 font-semibold mt-1">
                              💧 {day.precipitation}mm
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Loader2 size={32} className="animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading weather data...</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="mt-0">
            <div className="bg-white dark:bg-slate-950 rounded-lg p-8 shadow-sm border">
              {news.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">Latest South African News</h2>
                  {news.map((article) => (
                    <Card key={article.id} className="p-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="font-semibold text-lg flex-1">{article.title}</h3>
                        <Badge>{article.category}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{article.source} • {article.timestamp}</span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Read More →
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Loader2 size={32} className="animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading news...</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="mt-0">
            <div className="bg-white dark:bg-slate-950 rounded-lg p-8 shadow-sm border">
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">Infrastructure Alerts</h2>
                  {alerts.map((alert) => (
                    <Card
                      key={alert.id}
                      className={`p-4 border-l-4 ${
                        alert.severity === 'critical'
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                          : alert.severity === 'high'
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                            : alert.severity === 'medium'
                              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                              : 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="font-semibold text-lg flex-1">{alert.title}</h3>
                        <Badge className={alert.severity === 'critical' ? 'bg-red-600' : alert.severity === 'high' ? 'bg-orange-600' : 'bg-yellow-600'}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{alert.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>📍 {alert.location}</div>
                        <div>⏰ {alert.timestamp}</div>
                        {alert.affectedAreas && (
                          <div>👥 {alert.affectedAreas.toLocaleString()} affected</div>
                        )}
                        {alert.estimatedDuration && (
                          <div>⏱️ {alert.estimatedDuration}</div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-lg">✨ No active alerts - Everything looks good!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">🌡️ Live Weather</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Real-time weather updates for your location with 7-day forecast.
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">📰 Latest News</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Breaking news and updates from across South Africa updated hourly.
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2 text-red-900 dark:text-red-100">⚠️ Critical Alerts</h3>
            <p className="text-sm text-red-800 dark:text-red-200">
              Infrastructure alerts updated every 5 minutes for your area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
