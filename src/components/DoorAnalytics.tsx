import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Eye, 
  Users, 
  Clock, 
  TrendUp,
  AlertTriangle,
  CheckCircle,
  Camera,
  Brain,
  Timer,
  Target
} from '@phosphor-icons/react'

interface DoorEvent {
  id: string
  trainId: string
  station: string
  timestamp: string
  passengerCount: number
  delayPrediction: number
  actionTaken: 'wait' | 'close' | 'extend'
  accuracy: number
}

interface CameraFeed {
  id: string
  location: string
  status: 'active' | 'offline' | 'maintenance'
  passengerCount: number
  riskLevel: 'low' | 'medium' | 'high'
}

export default function DoorAnalytics() {
  const [doorEvents, setDoorEvents] = useKV<DoorEvent[]>('door-events', [])
  const [cameraFeeds, setCameraFeeds] = useKV<CameraFeed[]>('camera-feeds', [])
  const [analytics, setAnalytics] = useKV('door-analytics', {
    totalPredictions: 1247,
    accuracy: 89.7,
    averageDelayReduction: 45,
    passengersSaved: 3241
  })

  useEffect(() => {
    // Simulate real-time door events for demonstration
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newEvent: DoorEvent = {
          id: `event-${Date.now()}`,
          trainId: `ICE-${Math.floor(Math.random() * 999)}`,
          station: ['Berlin Hbf', 'Hamburg Hbf', 'München Hbf', 'Frankfurt Hbf'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString(),
          passengerCount: Math.floor(Math.random() * 15) + 1,
          delayPrediction: Math.floor(Math.random() * 120),
          actionTaken: ['wait', 'close', 'extend'][Math.floor(Math.random() * 3)] as 'wait' | 'close' | 'extend',
          accuracy: 75 + Math.random() * 25
        }
        
        setDoorEvents((current) => [newEvent, ...current.slice(0, 9)])
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Initialize camera feeds if empty
    if (cameraFeeds.length === 0) {
      const initialFeeds: CameraFeed[] = [
        { id: 'cam-001', location: 'Berlin Hbf - Gleis 7', status: 'active', passengerCount: 23, riskLevel: 'medium' },
        { id: 'cam-002', location: 'Hamburg Hbf - Gleis 12', status: 'active', passengerCount: 15, riskLevel: 'low' },
        { id: 'cam-003', location: 'München Hbf - Gleis 24', status: 'active', passengerCount: 31, riskLevel: 'high' },
        { id: 'cam-004', location: 'Frankfurt Hbf - Gleis 9', status: 'active', passengerCount: 8, riskLevel: 'low' },
        { id: 'cam-005', location: 'Köln Hbf - Gleis 15', status: 'maintenance', passengerCount: 0, riskLevel: 'low' },
        { id: 'cam-006', location: 'Stuttgart Hbf - Gleis 18', status: 'active', passengerCount: 19, riskLevel: 'medium' }
      ]
      setCameraFeeds(initialFeeds)
    }

    // Update camera feeds periodically
    const interval = setInterval(() => {
      setCameraFeeds((current) => 
        current.map(feed => ({
          ...feed,
          passengerCount: feed.status === 'active' ? Math.floor(Math.random() * 35) : 0,
          riskLevel: feed.status === 'active' 
            ? (['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high')
            : 'low'
        }))
      )
    }, 12000)

    return () => clearInterval(interval)
  }, [cameraFeeds.length])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-green-600 bg-green-50'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'wait': return 'text-blue-600 bg-blue-50'
      case 'close': return 'text-red-600 bg-red-50'
      case 'extend': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'wait': return 'Warten'
      case 'close': return 'Schließen'
      case 'extend': return 'Verlängern'
      default: return action
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high': return 'Hoch'
      case 'medium': return 'Mittel'
      case 'low': return 'Niedrig'
      default: return level
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Eye size={20} className="sm:hidden text-primary" />
              <Eye size={24} className="hidden sm:block text-primary" />
            </div>
            Tür-Intelligenz-System
          </h1>
          <p className="text-muted-foreground mt-2">
            KI-gestützte Videoanalytik für optimales Türmanagement und Verspätungsreduktion
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            System Aktiv
          </Badge>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Gesamtvorhersagen</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">{analytics.totalPredictions.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Brain size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">KI-Genauigkeit</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">{analytics.accuracy}%</p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Target size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Ø Verspätungsreduktion</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-900">{analytics.averageDelayReduction}s</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Timer size={20} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Begünstigte Fahrgäste</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-900">{analytics.passengersSaved.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Live Camera Feeds */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Camera size={16} className="text-primary" />
              </div>
              <CardTitle className="text-lg">Live Kamera-Feeds</CardTitle>
            </div>
            <CardDescription>
              Echtzeit-Überwachung der Fahrgastdichte an kritischen Bahnsteigbereichen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cameraFeeds.map((feed) => (
              <div key={feed.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    feed.status === 'active' ? 'bg-green-500' : 
                    feed.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-sm">{feed.location}</p>
                    <p className="text-xs text-muted-foreground">
                      {feed.passengerCount} Fahrgäste erkannt
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`text-xs px-2 py-1 ${getRiskColor(feed.riskLevel)}`}
                    variant="outline"
                  >
                    {getRiskLabel(feed.riskLevel)}
                  </Badge>
                  <Badge 
                    variant={feed.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {feed.status === 'active' ? 'Aktiv' : 
                     feed.status === 'maintenance' ? 'Wartung' : 'Offline'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent AI Decisions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain size={16} className="text-primary" />
              </div>
              <CardTitle className="text-lg">Aktuelle KI-Entscheidungen</CardTitle>
            </div>
            <CardDescription>
              Transparente Protokollierung aller automatisierten Türmanagement-Entscheidungen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {doorEvents.length > 0 ? (
              doorEvents.map((event) => (
                <div key={event.id} className="p-4 bg-secondary/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium text-sm">{event.trainId}</span>
                      <span className="text-xs text-muted-foreground">• {event.station}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Fahrgäste: </span>
                      <span className="font-medium">{event.passengerCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Verspätungsrisiko: </span>
                      <span className="font-medium">{event.delayPrediction}s</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      className={`text-xs px-2 py-1 ${getActionColor(event.actionTaken)}`}
                      variant="outline"
                    >
                      KI-Entscheidung: {getActionLabel(event.actionTaken)}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Konfidenz: {(event?.accuracy || 0).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Brain size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Warten auf KI-Entscheidungen...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendUp size={16} className="text-primary" />
            </div>
            <CardTitle className="text-lg">Leistungsanalytik</CardTitle>
          </div>
          <CardDescription>
            Kontinuierliche Optimierung der KI-Algorithmen für maximale Effizienz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">System-Genauigkeit</span>
              <span className="text-lg font-bold text-primary">{analytics.accuracy}%</span>
            </div>
            <Progress value={analytics.accuracy} className="h-2" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Verspätungsreduktion</span>
              <span className="text-lg font-bold text-green-600">-{analytics.averageDelayReduction}s</span>
            </div>
            <Progress value={(analytics.averageDelayReduction / 120) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{((analytics?.totalPredictions || 0) / 30).toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Tägl. Entscheidungen</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">97.3%</div>
              <div className="text-xs text-muted-foreground">Verfügbarkeit</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">0.8s</div>
              <div className="text-xs text-muted-foreground">Ø Reaktionszeit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      {analytics.accuracy < 85 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warnung:</strong> KI-Genauigkeit unter Zielwert. Modell-Kalibrierung wird empfohlen.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
