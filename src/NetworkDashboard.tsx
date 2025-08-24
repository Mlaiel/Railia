import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Train, 
  MapPin, 
  Clock, 
  TrendUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause
} from '@phosphor-icons/react'

interface Train {
  id: string
  line: string
  currentStation: string
  nextStation: string
  status: 'on-time' | 'delayed' | 'cancelled'
  delay: number
  passengers: number
  estimatedArrival: string
}

interface NetworkStats {
  totalTrains: number
  onTimePercentage: number
  averageDelay: number
  totalPassengers: number
  criticalIncidents: number
}

export default function NetworkDashboard() {
  const [trains, setTrains] = useKV<Train[]>('network-trains', [])
  const [networkStats, setNetworkStats] = useKV<NetworkStats>('network-stats', {
    totalTrains: 247,
    onTimePercentage: 94.2,
    averageDelay: 2.8,
    totalPassengers: 156789,
    criticalIncidents: 0
  })
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    if (trains.length === 0) {
      // Initialize with sample trains
      const initialTrains: Train[] = [
        {
          id: 'ICE-001',
          line: 'ICE 1',
          currentStation: 'Berlin Hbf',
          nextStation: 'Hamburg Hbf',
          status: 'on-time',
          delay: 0,
          passengers: 412,
          estimatedArrival: new Date(Date.now() + 7200000).toISOString()
        },
        {
          id: 'ICE-025',
          line: 'ICE 25',
          currentStation: 'München Hbf',
          nextStation: 'Nürnberg Hbf',
          status: 'delayed',
          delay: 8,
          passengers: 385,
          estimatedArrival: new Date(Date.now() + 5400000).toISOString()
        },
        {
          id: 'IC-118',
          line: 'IC 118',
          currentStation: 'Frankfurt Hbf',
          nextStation: 'Mainz Hbf',
          status: 'on-time',
          delay: 0,
          passengers: 234,
          estimatedArrival: new Date(Date.now() + 3600000).toISOString()
        },
        {
          id: 'RE-4215',
          line: 'RE 4215',
          currentStation: 'Köln Hbf',
          nextStation: 'Düsseldorf Hbf',
          status: 'delayed',
          delay: 12,
          passengers: 156,
          estimatedArrival: new Date(Date.now() + 2700000).toISOString()
        },
        {
          id: 'ICE-075',
          line: 'ICE 75',
          currentStation: 'Stuttgart Hbf',
          nextStation: 'Karlsruhe Hbf',
          status: 'on-time',
          delay: 0,
          passengers: 467,
          estimatedArrival: new Date(Date.now() + 4500000).toISOString()
        }
      ]
      setTrains(initialTrains)
    }
  }, [trains.length])

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isSimulating) {
      interval = setInterval(() => {
        // Update train positions and delays randomly
        setTrains(currentTrains => 
          currentTrains.map(train => ({
            ...train,
            delay: Math.max(0, train.delay + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0)),
            passengers: Math.max(50, train.passengers + Math.floor(Math.random() * 20) - 10),
            status: train.delay > 5 ? 'delayed' : 'on-time'
          }))
        )

        // Update network stats
        setNetworkStats(current => ({
          ...current,
          onTimePercentage: Math.max(85, Math.min(99, current.onTimePercentage + (Math.random() - 0.5) * 2)),
          averageDelay: Math.max(0, Math.min(15, current.averageDelay + (Math.random() - 0.5) * 0.5)),
          totalPassengers: current.totalPassengers + Math.floor(Math.random() * 100) - 50
        }))
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSimulating])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'text-green-600 bg-green-50'
      case 'delayed': return 'text-yellow-600 bg-yellow-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-time': return 'Pünktlich'
      case 'delayed': return 'Verspätet'
      case 'cancelled': return 'Ausgefallen'
      default: return status
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Train size={20} className="sm:hidden text-primary" />
              <Train size={24} className="hidden sm:block text-primary" />
            </div>
            Netzwerk-Optimierungs-Engine
          </h1>
          <p className="text-muted-foreground mt-2">
            Echtzeit-Simulation und Optimierung des gesamten Bahnbetriebs zur Minimierung von Verspätungen
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsSimulating(!isSimulating)}
            variant={isSimulating ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isSimulating ? <Pause size={16} /> : <Play size={16} />}
            {isSimulating ? 'Stoppen' : 'Simulation Starten'}
          </Button>
        </div>
      </div>

      {/* Network KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Aktive Züge</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">{networkStats.totalTrains}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Train size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Pünktlichkeitsrate</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">{(networkStats?.onTimePercentage || 0).toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 mb-1">Ø Verspätung</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-900">{(networkStats?.averageDelay || 0).toFixed(1)} min</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">Fahrgäste</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-900">{networkStats.totalPassengers.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Kritische Vorfälle</p>
                <p className="text-xl sm:text-2xl font-bold text-red-900">{networkStats.criticalIncidents}</p>
              </div>
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Live Train Status */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Train size={16} className="text-primary" />
              </div>
              <CardTitle className="text-lg">Live Zug-Status</CardTitle>
            </div>
            <CardDescription>
              Echtzeit-Überwachung und KI-gestützte Verspätungsvorhersage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trains.map((train) => (
              <div key={train.id} className="p-4 bg-secondary/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium">{train.id}</span>
                    <span className="text-sm text-muted-foreground">• {train.line}</span>
                  </div>
                  <Badge 
                    className={`text-xs px-2 py-1 ${getStatusColor(train.status)}`}
                    variant="outline"
                  >
                    {getStatusLabel(train.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>📍 {train.currentStation}</span>
                  <span>→ {train.nextStation}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Verspätung: </span>
                    <span className={`font-medium ${train.delay > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {train.delay > 0 ? `+${train.delay} min` : 'Pünktlich'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fahrgäste: </span>
                    <span className="font-medium">{train.passengers}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ankunft: </span>
                    <span className="font-medium">
                      {new Date(train.estimatedArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Network Performance Analytics */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendUp size={16} className="text-primary" />
              </div>
              <CardTitle className="text-lg">Netzwerk-Performance</CardTitle>
            </div>
            <CardDescription>
              KI-gestützte Optimierung und prädiktive Verspätungsanalyse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pünktlichkeitsrate</span>
                <span className="text-lg font-bold text-primary">{(networkStats?.onTimePercentage || 0).toFixed(1)}%</span>
              </div>
              <Progress value={networkStats.onTimePercentage} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Verspätungsreduktion (vs. traditionell)</span>
                <span className="text-lg font-bold text-green-600">-37%</span>
              </div>
              <Progress value={37} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">KI-Optimierungsrate</span>
                <span className="text-lg font-bold text-blue-600">94.8%</span>
              </div>
              <Progress value={94.8} className="h-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">1,247</div>
                <div className="text-xs text-muted-foreground">Tägl. KI-Entscheidungen</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">€2.3M</div>
                <div className="text-xs text-muted-foreground">Monatl. Kosteneinsparung</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendUp size={16} className="text-primary" />
            </div>
            <CardTitle className="text-lg">KI-Empfehlungen</CardTitle>
          </div>
          <CardDescription>
            Proaktive Optimierungsvorschläge zur Verspätungsminimierung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Umleitung ICE 25 empfohlen</h4>
                <p className="text-sm text-blue-700">
                  Alternative Route über Würzburg kann 8 Minuten Verspätung kompensieren. 
                  Geschätzte Ankunftszeit: 14:23 statt 14:31.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">Gleis 7 Berlin Hbf priorisieren</h4>
                <p className="text-sm text-green-700">
                  Einfahrts-Priorität für ICE 1 kann Domino-Effekt auf nachfolgende Züge verhindern.
                  Potential: 15 Züge vor Verspätung schützen.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Fahrgast-Information aktivieren</h4>
                <p className="text-sm text-yellow-700">
                  Proaktive Benachrichtigung über alternative Verbindungen kann Fahrgastfluss 
                  um 23% verbessern und Türblockaden reduzieren.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
