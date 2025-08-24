/**
 * DronePatrol - Autonome Drohnen-Streckeninspektion
 * 
 * Demonstriert KI-gesteuerte Drohnen-Flotten für 24/7 Gleisüberwachung
 * Schwerpunkt: Proaktive Schadenserkennung und Blockaden-Identifikation
 */

import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Drone, 
  MapPin, 
  Battery, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Pause,
  Eye,
  Clock,
  Gauge,
  CloudArrowDown
} from '@phosphor-icons/react'

export default function DronePatrol() {
  const [isPatrolling, setIsPatrolling] = useState(true)
  
  const [droneFleet] = useKV('drone-fleet', [
    {
      id: 'DRONE-001',
      name: 'Hamburg-Altona Sektor',
      status: 'patrolling',
      battery: 87,
      altitude: 120,
      speed: 25,
      position: { lat: 53.5511, lng: 9.9937 },
      route: 'Strecke 1200: Hamburg-Bremen',
      kmCovered: 47.2,
      totalKm: 89.5,
      lastAlert: null,
      detectedIssues: 0
    },
    {
      id: 'DRONE-002', 
      name: 'Frankfurt Hauptstrecke',
      status: 'investigating',
      battery: 65,
      altitude: 95,
      speed: 8,
      position: { lat: 50.1109, lng: 8.6821 },
      route: 'Strecke 3600: Frankfurt-Köln',
      kmCovered: 23.8,
      totalKm: 180.3,
      lastAlert: 'Vegetation detected - Track km 234.7',
      detectedIssues: 1
    },
    {
      id: 'DRONE-003',
      name: 'München-Süd Patrol',
      status: 'charging',
      battery: 23,
      altitude: 0,
      speed: 0,
      position: { lat: 48.1351, lng: 11.5820 },
      route: 'Strecke 5500: München-Salzburg',
      kmCovered: 156.4,
      totalKm: 156.4,
      lastAlert: null,
      detectedIssues: 2
    },
    {
      id: 'DRONE-004',
      name: 'Berlin-Brandenburg',
      status: 'patrolling',
      battery: 91,
      altitude: 110,
      speed: 30,
      position: { lat: 52.5200, lng: 13.4050 },
      route: 'Strecke 6000: Berlin-Hamburg',
      kmCovered: 78.9,
      totalKm: 286.8,
      lastAlert: null,
      detectedIssues: 0
    }
  ])

  const [patrolStats] = useKV('drone-patrol-stats', {
    dailyKmCovered: 2847.3,
    activePatrols: 24,
    totalIssuesDetected: 17,
    criticalIssuesPrevented: 5,
    avgResponseTime: '3.2min',
    aiAccuracy: 99.2,
    costSavingsToday: 180000 // Euro
  })

  const [recentDetections] = useKV('drone-detections', [
    {
      time: '14:23',
      drone: 'DRONE-002',
      type: 'Vegetation Overgrowth',
      severity: 'medium',
      location: 'Track km 234.7',
      action: 'Maintenance scheduled',
      confidence: 94
    },
    {
      time: '13:45',
      drone: 'DRONE-001',
      type: 'Foreign Object',
      severity: 'high',
      location: 'Track km 156.2',
      action: 'Emergency cleared',
      confidence: 98
    },
    {
      time: '12:18',
      drone: 'DRONE-004',
      type: 'Track Crack',
      severity: 'low',
      location: 'Track km 89.4',
      action: 'Inspection requested',
      confidence: 87
    },
    {
      time: '11:52',
      drone: 'DRONE-003',
      type: 'Signal malfunction',
      severity: 'critical',
      location: 'Track km 67.1',
      action: 'Technician dispatched',
      confidence: 99
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'patrolling': return 'bg-green-500'
      case 'investigating': return 'bg-yellow-500'
      case 'charging': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'patrolling': return 'Patroulliert'
      case 'investigating': return 'Untersucht'
      case 'charging': return 'Lädt'
      default: return 'Offline'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Drone size={24} className="text-primary" />
            </div>
            Autonome Drohnen-Streckeninspektion
          </h1>
          <p className="text-muted-foreground">
            KI-gesteuerte 24/7 Gleisüberwachung für proaktive Schadenserkennung
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={isPatrolling ? "destructive" : "default"}
            onClick={() => setIsPatrolling(!isPatrolling)}
            className="gap-2"
          >
            {isPatrolling ? <Pause size={16} /> : <Play size={16} />}
            {isPatrolling ? 'Pause' : 'Start'} Patrouillen
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Heute abgedeckt</p>
                <p className="text-2xl font-bold">{patrolStats.dailyKmCovered.toLocaleString()}km</p>
              </div>
              <MapPin size={24} className="text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Drohnen</p>
                <p className="text-2xl font-bold">{patrolStats.activePatrols}</p>
              </div>
              <Drone size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Erkannte Probleme</p>
                <p className="text-2xl font-bold text-yellow-600">{patrolStats.totalIssuesDetected}</p>
              </div>
              <Eye size={24} className="text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">KI-Genauigkeit</p>
                <p className="text-2xl font-bold text-green-600">{patrolStats.aiAccuracy}%</p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Savings Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Kosteneinsparung heute:</strong> €{patrolStats.costSavingsToday.toLocaleString()} durch {patrolStats.criticalIssuesPrevented} verhinderte kritische Vorfälle
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Drone Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Drone size={20} />
              Live Drohnen-Status
            </CardTitle>
            <CardDescription>
              Echtzeit-Überwachung der gesamten Drohnen-Flotte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {droneFleet.map((drone) => (
              <div key={drone.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(drone.status)}`}></div>
                    <div>
                      <h4 className="font-medium">{drone.name}</h4>
                      <p className="text-sm text-muted-foreground">{drone.id}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {getStatusText(drone.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Battery size={16} className="text-muted-foreground" />
                      <span>Batterie: {drone.battery}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge size={16} className="text-muted-foreground" />
                      <span>Geschw.: {drone.speed} km/h</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>Höhe: {drone.altitude}m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-muted-foreground" />
                      <span>Probleme: {drone.detectedIssues}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Route: {drone.route}</span>
                    <span>{drone.kmCovered}/{drone.totalKm} km</span>
                  </div>
                  <Progress 
                    value={(drone.kmCovered / drone.totalKm) * 100} 
                    className="h-2"
                  />
                </div>

                {drone.lastAlert && (
                  <Alert className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {drone.lastAlert}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent AI Detections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={20} />
              KI-Erkennungen (Live)
            </CardTitle>
            <CardDescription>
              Automatisch erkannte Probleme und eingeleitete Maßnahmen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDetections.map((detection, index) => (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(detection.severity)}>
                          {detection.type}
                        </Badge>
                        <span className="text-sm font-medium">{detection.confidence}% Sicherheit</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>{detection.drone}</strong> • {detection.location}
                      </p>
                      <p className="text-sm">
                        <strong>Maßnahme:</strong> {detection.action}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock size={14} />
                        {detection.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <CloudArrowDown size={16} className="text-primary" />
                <span className="font-medium">Automatische KI-Verarbeitung:</span>
                <span className="text-muted-foreground">
                  Durchschnittliche Reaktionszeit {patrolStats.avgResponseTime}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}