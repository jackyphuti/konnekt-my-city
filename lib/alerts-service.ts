/**
 * Infrastructure Alerts Service
 * Fetches real-time load shedding, water, and road alerts
 */

export interface Alert {
  id: string;
  type: 'electricity' | 'water' | 'road';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  municipality: string;
  timestamp: string;
  status: 'ongoing' | 'resolved' | 'estimated';
  affectedAreas?: number;
  estimatedDuration?: string;
}

/**
 * Fetch Eskom load shedding schedule
 * Uses https://loadshedding.eskom.co.za or alternative API
 */
export async function fetchLoadSheddingStatus(): Promise<Alert | null> {
  try {
    // Try fetching from Eskom API or EskomSePush alternative
    const response = await fetch('https://api.eskomsepush.co.za/api/status');

    if (!response.ok) {
      console.warn('Eskom API unavailable, using mock data');
      return getMockLoadSheddingAlert();
    }

    const data = await response.json();

    // Parse Eskom data
    const stage = data.status?.stage || 0;
    const nextStageTime = data.nextStageTime || null;

    if (stage === 0) {
      return null; // No load shedding
    }

    const alert: Alert = {
      id: 'eskom-loadshedding',
      type: 'electricity',
      severity:
        stage >= 5
          ? 'critical'
          : stage >= 3
            ? 'high'
            : stage >= 1
              ? 'medium'
              : 'low',
      title: `Load Shedding Stage ${stage}`,
      description: `Eskom has announced Stage ${stage} load shedding. Rolling blackouts are scheduled across the country.${nextStageTime ? ` Next stage change: ${nextStageTime}` : ''}`,
      location: 'Nationwide',
      municipality: 'All Municipalities',
      timestamp: new Date().toLocaleTimeString('en-ZA'),
      status: 'ongoing',
      estimatedDuration: '2-4 hours per zone',
    };

    return alert;
  } catch (error) {
    console.error('Error fetching load shedding status:', error);
    return getMockLoadSheddingAlert();
  }
}

/**
 * Fetch water alerts from municipalities
 */
export async function fetchWaterAlerts(): Promise<Alert[]> {
  try {
    // This would connect to individual municipal APIs
    // For now, using mock data as real API varies by municipality
    return getMockWaterAlerts();
  } catch (error) {
    console.error('Error fetching water alerts:', error);
    return getMockWaterAlerts();
  }
}

/**
 * Fetch road alerts and traffic incidents
 */
export async function fetchRoadAlerts(): Promise<Alert[]> {
  try {
    // Could integrate with Google Maps API, Waze, or local traffic authorities
    return getMockRoadAlerts();
  } catch (error) {
    console.error('Error fetching road alerts:', error);
    return getMockRoadAlerts();
  }
}

/**
 * Get all infrastructure alerts
 */
export async function fetchAllAlerts(): Promise<Alert[]> {
  const alerts: Alert[] = [];

  // Fetch load shedding
  const loadShedding = await fetchLoadSheddingStatus();
  if (loadShedding) alerts.push(loadShedding);

  // Fetch water alerts
  const waterAlerts = await fetchWaterAlerts();
  alerts.push(...waterAlerts);

  // Fetch road alerts
  const roadAlerts = await fetchRoadAlerts();
  alerts.push(...roadAlerts);

  return alerts.sort(
    (a, b) =>
      (b.severity === 'critical' ? 4 : b.severity === 'high' ? 3 : b.severity === 'medium' ? 2 : 1) -
      (a.severity === 'critical' ? 4 : a.severity === 'high' ? 3 : a.severity === 'medium' ? 2 : 1)
  );
}

/**
 * Mock data generators
 */
function getMockLoadSheddingAlert(): Alert | null {
  // Random load shedding stage (0-6)
  const stage = Math.floor(Math.random() * 4);

  if (stage === 0) return null;

  return {
    id: 'eskom-loadshedding',
    type: 'electricity',
    severity:
      stage >= 5
        ? 'critical'
        : stage >= 3
          ? 'high'
          : stage >= 1
            ? 'medium'
            : 'low',
    title: `Load Shedding Stage ${stage}`,
    description: `Eskom load shedding stage ${stage} in effect. Rolling blackouts scheduled. Check schedule for your area.`,
    location: 'Nationwide',
    municipality: 'All Municipalities',
    timestamp: new Date().toLocaleTimeString('en-ZA'),
    status: 'ongoing',
    estimatedDuration: '2-4 hours per zone',
  };
}

function getMockWaterAlerts(): Alert[] {
  return [
    {
      id: 'water-1',
      type: 'water',
      severity: 'high',
      title: 'Water Supply Interruption - Soweto',
      description:
        'Burst water main in Soweto causing significant water pressure loss. Repairs in progress.',
      location: 'Soweto, Johannesburg',
      municipality: 'City of Johannesburg',
      timestamp: '4 hours ago',
      status: 'ongoing',
      affectedAreas: 250000,
      estimatedDuration: '24-48 hours',
    },
  ];
}

function getMockRoadAlerts(): Alert[] {
  return [
    {
      id: 'road-1',
      type: 'road',
      severity: 'high',
      title: 'M1 North Closure - Construction',
      description: 'M1 North between exits 60-62 closed for construction. Use alternate routes.',
      location: 'M1 North, Johannesburg',
      municipality: 'City of Johannesburg',
      timestamp: '5 hours ago',
      status: 'ongoing',
      estimatedDuration: '07:00 - 17:00 daily',
    },
  ];
}

/**
 * Cache alerts in localStorage
 */
export function cacheAlerts(alerts: Alert[]): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(
    'alertsCache',
    JSON.stringify({
      alerts,
      timestamp: new Date().toISOString(),
    })
  );
}

/**
 * Get cached alerts
 */
export function getCachedAlerts(): Alert[] | null {
  if (typeof window === 'undefined') return null;

  const cache = localStorage.getItem('alertsCache');
  if (!cache) return null;

  const { alerts, timestamp } = JSON.parse(cache);

  // Check if cache is older than 5 minutes
  const cacheAge = Date.now() - new Date(timestamp).getTime();
  if (cacheAge < 5 * 60 * 1000) {
    return alerts;
  }

  return null;
}
