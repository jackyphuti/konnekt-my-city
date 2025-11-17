'use client';

import {
  AlertTriangle,
  AlertCircle,
  Zap,
  Droplet,
  Trello,
  Clock,
  MapPin,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Alert {
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

const INFRASTRUCTURE_ALERTS: Alert[] = [
  // Electricity alerts
  {
    id: 'e1',
    type: 'electricity',
    severity: 'critical',
    title: 'Load Shedding Stage 6',
    description:
      'Eskom has announced Stage 6 load shedding due to inadequate generation capacity. Rolling blackouts scheduled until further notice.',
    location: 'Nationwide',
    municipality: 'All Municipalities',
    timestamp: '30 minutes ago',
    status: 'ongoing',
    estimatedDuration: '2-3 hours per zone',
  },
  {
    id: 'e2',
    type: 'electricity',
    severity: 'high',
    title: 'Power Lines Down - Hillbrow Area',
    description:
      'Downed power lines affecting the Hillbrow and surrounding areas due to high winds. Repair teams on site.',
    location: 'Hillbrow, Johannesburg',
    municipality: 'City of Johannesburg',
    timestamp: '2 hours ago',
    status: 'ongoing',
    affectedAreas: 15000,
    estimatedDuration: '4-6 hours',
  },
  {
    id: 'e3',
    type: 'electricity',
    severity: 'medium',
    title: 'Scheduled Maintenance - Sandton',
    description:
      'Planned maintenance on electrical infrastructure in Sandton business district. Some areas may experience brief outages.',
    location: 'Sandton, Johannesburg',
    municipality: 'City of Johannesburg',
    timestamp: '22 hours ago',
    status: 'estimated',
    estimatedDuration: '08:00 - 16:00 (Thursday)',
  },

  // Water alerts
  {
    id: 'w1',
    type: 'water',
    severity: 'high',
    title: 'Water Supply Interruption - Soweto',
    description:
      'Burst water main in Soweto has caused significant water pressure loss. Repairs in progress. Boil water notice issued.',
    location: 'Soweto, Johannesburg',
    municipality: 'City of Johannesburg',
    timestamp: '4 hours ago',
    status: 'ongoing',
    affectedAreas: 250000,
    estimatedDuration: '24-48 hours',
  },
  {
    id: 'w2',
    type: 'water',
    severity: 'medium',
    title: 'Water Treatment Facility Maintenance',
    description:
      'Planned maintenance at Rand Water treatment facility may cause reduced water pressure in some areas of Gauteng.',
    location: 'Gauteng Province',
    municipality: 'Multiple',
    timestamp: '1 day ago',
    status: 'estimated',
    estimatedDuration: 'Saturday 22:00 - Sunday 06:00',
  },
  {
    id: 'w3',
    type: 'water',
    severity: 'low',
    title: 'Water Pressure Testing',
    description:
      'Minor water pressure fluctuations expected during routine system testing in central Cape Town.',
    location: 'Central Cape Town',
    municipality: 'City of Cape Town',
    timestamp: '6 hours ago',
    status: 'estimated',
    estimatedDuration: '1-2 hours',
  },

  // Road alerts
  {
    id: 'r1',
    type: 'road',
    severity: 'high',
    title: 'M1 North Closure - Construction',
    description:
      'M1 North between exits 60-62 closed for construction work. Heavy traffic expected. Use alternate routes.',
    location: 'M1 North, Johannesburg',
    municipality: 'City of Johannesburg',
    timestamp: '5 hours ago',
    status: 'ongoing',
    estimatedDuration: '07:00 - 17:00 daily',
  },
  {
    id: 'r2',
    type: 'road',
    severity: 'medium',
    title: 'Pothole Repairs - De Villiers Street',
    description:
      'De Villiers Street undergoing pothole filling and road surface repairs. Single lane traffic.',
    location: 'De Villiers Street, Johannesburg',
    municipality: 'City of Johannesburg',
    timestamp: '8 hours ago',
    status: 'ongoing',
    estimatedDuration: '3-5 days',
  },
  {
    id: 'r3',
    type: 'road',
    severity: 'high',
    title: 'N3 Accident - Traffic Delays',
    description:
      'Vehicle accident on N3 near Midrand causing significant traffic congestion. Emergency services on scene.',
    location: 'N3 Midrand',
    municipality: 'City of Johannesburg',
    timestamp: '1 hour ago',
    status: 'ongoing',
    estimatedDuration: '1-2 hours',
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500 text-white';
    case 'high':
      return 'bg-orange-500 text-white';
    case 'medium':
      return 'bg-yellow-500 text-white';
    case 'low':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'electricity':
      return <Zap size={20} className="text-yellow-600" />;
    case 'water':
      return <Droplet size={20} className="text-blue-600" />;
    case 'road':
      return <Trello size={20} className="text-red-600" />;
    default:
      return <AlertCircle size={20} />;
  }
};

interface AlertsWidgetProps {
  defaultTab?: string;
}

export function InfrastructureAlertsWidget({ defaultTab = 'electricity' }: AlertsWidgetProps) {
  const electricityAlerts = INFRASTRUCTURE_ALERTS.filter((a) => a.type === 'electricity');
  const waterAlerts = INFRASTRUCTURE_ALERTS.filter((a) => a.type === 'water');
  const roadAlerts = INFRASTRUCTURE_ALERTS.filter((a) => a.type === 'road');

  const AlertCard = ({ alert }: { alert: Alert }) => (
    <Card className={`p-4 border-l-4 ${
      alert.severity === 'critical'
        ? 'border-red-500'
        : alert.severity === 'high'
          ? 'border-orange-500'
          : alert.severity === 'medium'
            ? 'border-yellow-500'
            : 'border-blue-500'
    }`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
          {getTypeIcon(alert.type)}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-base">{alert.title}</h3>
            <Badge className={getSeverityColor(alert.severity)}>
              {alert.severity.toUpperCase()}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>

          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin size={14} />
              <span>{alert.location}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock size={14} />
              <span>{alert.timestamp}</span>
            </div>
            {alert.affectedAreas && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <AlertCircle size={14} />
                <span>{alert.affectedAreas.toLocaleString()} people affected</span>
              </div>
            )}
            {alert.estimatedDuration && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock size={14} />
                <span>{alert.estimatedDuration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {alert.status === 'ongoing' && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                🔴 Ongoing
              </Badge>
            )}
            {alert.status === 'resolved' && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ✓ Resolved
              </Badge>
            )}
            {alert.status === 'estimated' && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                📅 Scheduled
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <AlertTriangle className="text-red-600" />
          Infrastructure & Service Alerts
        </h2>
        <p className="text-muted-foreground">
          Real-time updates on electricity, water, and road infrastructure
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="electricity" className="flex items-center gap-2">
            <Zap size={16} />
            <span className="hidden sm:inline">Electricity</span>
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-2">
            <Droplet size={16} />
            <span className="hidden sm:inline">Water</span>
          </TabsTrigger>
          <TabsTrigger value="road" className="flex items-center gap-2">
            <Trello size={16} />
            <span className="hidden sm:inline">Roads</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="electricity" className="space-y-3 mt-4">
          {electricityAlerts.length > 0 ? (
            electricityAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No electricity alerts at this time</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="water" className="space-y-3 mt-4">
          {waterAlerts.length > 0 ? (
            waterAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No water alerts at this time</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="road" className="space-y-3 mt-4">
          {roadAlerts.length > 0 ? (
            roadAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No road alerts at this time</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
