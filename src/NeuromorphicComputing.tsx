import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  Brain, 
  Lightning, 
  Cpu, 
  Activity, 
  Zap, 
  Eye, 
  Target, 
  Network, 
  Battery,
  ThermometerSimple,
  ChartLine,
  Settings,
  Play,
  Pause,
  Atom,
  Microchip,
  TrendUp,
  ShieldCheck
} from '@phosphor-icons/react'

interface NeuromorphicUnit {
  id: string
  name: string
  location: string
  status: 'active' | 'standby' | 'processing' | 'maintenance'
  powerConsumption: number // in mW
  processingLoad: number
  temperature: number
  spikeRate: number // Spikes per second
  synapticActivity: number
  learningRate: number
  accuracy: number
  detectedEvents: number
  energyEfficiency: number // Operations per Joule
}

interface NeuromorphicMetrics {
  totalUnits: number
  averagePowerConsumption: number
  totalSpikesProcessed: number
  averageAccuracy: number
  energySavings: number // compared to traditional computing
  realTimeEvents: number
  adaptiveLearning: number
}

export default function NeuromorphicComputing() {
  const [isSystemActive, setIsSystemActive] = useState(true)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [neuromorphicUnits, setNeuromorphicUnits] = useKV<NeuromorphicUnit[]>('neuromorphic-units', [
    {
      id: 'neuro-001',
      name: 'Bahnhof Berlin Hbf',
      location: 'Gleis 1-8 Überwachung',
      status: 'active',
      powerConsumption: 45.2,
      processingLoad: 78,
      temperature: 32.1,
      spikeRate: 15420,
      synapticActivity: 85.3,
      learningRate: 0.023,
      accuracy: 96.8,
      detectedEvents: 847,
      energyEfficiency: 2.8e12
    },
    {
      id: 'neuro-002',
      name: 'Strecke Hamburg-Bremen',
      location: 'Mobile Drohnen-Einheit',
      status: 'processing',
      powerConsumption: 38.7,
      processingLoad: 92,
      temperature: 28.4,
      spikeRate: 18230,
      synapticActivity: 91.7,
      learningRate: 0.019,
      accuracy: 94.2,
      detectedEvents: 1203,
      energyEfficiency: 3.2e12
    },
    {
      id: 'neuro-003',
      name: 'München Süd Terminal',
      location: 'Rangier-Überwachung',
      status: 'active',
      powerConsumption: 52.1,
      processingLoad: 65,
      temperature: 35.8,
      spikeRate: 12890,
      synapticActivity: 73.4,
      learningRate: 0.031,
      accuracy: 98.1,
      detectedEvents: 672,
      energyEfficiency: 2.1e12
    },
    {
      id: 'neuro-004',
      name: 'Köln-Düsseldorf Korridor',
      location: 'Hochgeschwindigkeitsstrecke',
      status: 'standby',
      powerConsumption: 15.3,
      processingLoad: 23,
      temperature: 22.7,
      spikeRate: 4250,
      synapticActivity: 34.2,
      learningRate: 0.012,
      accuracy: 97.5,
      detectedEvents: 156,
      energyEfficiency: 4.1e12
    }
  ])

  const [systemMetrics, setSystemMetrics] = useKV<NeuromorphicMetrics>('neuromorphic-metrics', {
    totalUnits: 4,
    averagePowerConsumption: 37.8,
    totalSpikesProcessed: 50790,
    averageAccuracy: 96.7,
    energySavings: 89.3,
    realTimeEvents: 2878,
    adaptiveLearning: 87.2
  })

  const [processingEvents, setProcessingEvents] = useKV<Array<{
    id: string
    timestamp: string
    type: string
    location: string
    confidence: number
    processingTime: number
    energyUsed: number
  }>>('neuromorphic-events', [])

  // Simulate real-time neuromorphic processing
  useEffect(() => {
    if (!isSystemActive) return

    const interval = setInterval(() => {
      setNeuromorphicUnits(currentUnits => 
        currentUnits.map(unit => ({
          ...unit,
          spikeRate: unit.spikeRate + (Math.random() - 0.5) * 1000,
          synapticActivity: Math.max(20, Math.min(100, unit.synapticActivity + (Math.random() - 0.5) * 5)),
          powerConsumption: Math.max(10, unit.powerConsumption + (Math.random() - 0.5) * 2),
          temperature: Math.max(20, Math.min(45, unit.temperature + (Math.random() - 0.5) * 1)),
          processingLoad: Math.max(0, Math.min(100, unit.processingLoad + (Math.random() - 0.5) * 8)),
          detectedEvents: unit.detectedEvents + Math.floor(Math.random() * 3),
          accuracy: Math.max(90, Math.min(99.9, unit.accuracy + (Math.random() - 0.5) * 0.5))
        }))
      )

      // Simulate new processing events
      if (Math.random() < 0.3) {
        const eventTypes = [
          'Personenerkennung', 
          'Hinderniserkennung', 
          'Anomaliedetection', 
          'Türblockade-Vorhersage',
          'Menschenmenge-Analyse',
          'Wetter-Korrelation'
        ]
        
        const newEvent = {
          id: `evt-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          location: neuromorphicUnits[Math.floor(Math.random() * neuromorphicUnits.length)]?.name || 'Unbekannt',
          confidence: 85 + Math.random() * 14,
          processingTime: 0.1 + Math.random() * 2.9, // ms
          energyUsed: 0.5 + Math.random() * 3.2 // μJ
        }

        setProcessingEvents(currentEvents => [newEvent, ...currentEvents.slice(0, 19)])
      }

      // Update system metrics
      setSystemMetrics(currentMetrics => ({
        ...currentMetrics,
        totalSpikesProcessed: currentMetrics.totalSpikesProcessed + Math.floor(Math.random() * 5000),
        realTimeEvents: currentMetrics.realTimeEvents + Math.floor(Math.random() * 5),
        averagePowerConsumption: neuromorphicUnits.reduce((sum, unit) => sum + unit.powerConsumption, 0) / neuromorphicUnits.length,
        averageAccuracy: neuromorphicUnits.reduce((sum, unit) => sum + unit.accuracy, 0) / neuromorphicUnits.length
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isSystemActive, neuromorphicUnits, setNeuromorphicUnits, setSystemMetrics, setProcessingEvents])

  const toggleSystemStatus = () => {
    setIsSystemActive(!isSystemActive)
    toast(isSystemActive ? 'Neuromorphic Computing pausiert' : 'Neuromorphic Computing aktiviert', {
      duration: 2000,
      position: 'top-center'
    })
  }

  const optimizeUnit = (unitId: string) => {
    setNeuromorphicUnits(currentUnits =>
      currentUnits.map(unit =>
        unit.id === unitId
          ? {
              ...unit,
              learningRate: Math.min(0.05, unit.learningRate * 1.1),
              accuracy: Math.min(99.9, unit.accuracy + 1.2),
              energyEfficiency: unit.energyEfficiency * 1.15,
              powerConsumption: unit.powerConsumption * 0.95
            }
          : unit
      )
    )
    toast(`Neuromorphic Chip ${unitId} optimiert`, {
      duration: 2000,
      position: 'top-center'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'processing': return 'bg-blue-500'
      case 'standby': return 'bg-yellow-500'
      case 'maintenance': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv'
      case 'processing': return 'Verarbeitung'
      case 'standby': return 'Bereitschaft'
      case 'maintenance': return 'Wartung'
      default: return 'Unbekannt'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Neuromorphic Computing</h1>
            <p className="text-muted-foreground">Energieeffiziente Echtzeit-Verarbeitung in mobilen Überwachungseinheiten</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={isSystemActive ? "default" : "secondary"} className="px-3 py-1">
            {isSystemActive ? 'System Aktiv' : 'System Pausiert'}
          </Badge>
          <Button
            onClick={toggleSystemStatus}
            variant={isSystemActive ? "outline" : "default"}
            size="sm"
            className="gap-2"
          >
            {isSystemActive ? <Pause size={16} /> : <Play size={16} />}
            {isSystemActive ? 'Pausieren' : 'Aktivieren'}
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Neuromorphic Chips</CardTitle>
              <Microchip size={16} className="text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{systemMetrics.totalUnits}</div>
            <p className="text-xs text-muted-foreground mt-1">Aktive Einheiten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Energieeffizienz</CardTitle>
              <Battery size={16} className="text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemMetrics.energySavings}%</div>
            <p className="text-xs text-muted-foreground mt-1">Einsparung vs. traditionell</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Durchschn. Genauigkeit</CardTitle>
              <Target size={16} className="text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemMetrics.averageAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Erkennungsgenauigkeit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Spikes Verarbeitet</CardTitle>
              <Lightning size={16} className="text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{(systemMetrics.totalSpikesProcessed / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">In Echtzeit</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Neuromorphic Units */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Atom size={20} className="text-primary" />
                Neuromorphic Processing Units
              </CardTitle>
              <CardDescription>
                Brain-inspirierte Computing-Einheiten für energieeffiziente Echtzeit-Analyse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {neuromorphicUnits.map((unit) => (
                <div
                  key={unit.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    selectedUnit === unit.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(unit.status)}`}></div>
                      <div>
                        <h3 className="font-semibold text-sm">{unit.name}</h3>
                        <p className="text-xs text-muted-foreground">{unit.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getStatusText(unit.status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          optimizeUnit(unit.id)
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Settings size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Zap size={12} />
                        <span>Leistung</span>
                      </div>
                      <div className="font-medium">{unit.powerConsumption.toFixed(1)} mW</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Activity size={12} />
                        <span>Spikes/s</span>
                      </div>
                      <div className="font-medium">{unit.spikeRate.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Target size={12} />
                        <span>Genauigkeit</span>
                      </div>
                      <div className="font-medium">{unit.accuracy.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <ThermometerSimple size={12} />
                        <span>Temperatur</span>
                      </div>
                      <div className="font-medium">{unit.temperature.toFixed(1)}°C</div>
                    </div>
                  </div>

                  {selectedUnit === unit.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Synaptische Aktivität</span>
                            <span>{unit.synapticActivity.toFixed(1)}%</span>
                          </div>
                          <Progress value={unit.synapticActivity} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Verarbeitungslast</span>
                            <span>{unit.processingLoad}%</span>
                          </div>
                          <Progress value={unit.processingLoad} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Lernrate:</span>
                          <div className="font-medium">{unit.learningRate.toFixed(3)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Events erkannt:</span>
                          <div className="font-medium">{unit.detectedEvents}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Effizienz:</span>
                          <div className="font-medium">{(unit.energyEfficiency / 1e12).toFixed(1)} TOps/J</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Real-time Events & Monitoring */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightning size={20} className="text-yellow-600" />
                Echtzeit-Events
              </CardTitle>
              <CardDescription>
                Live-Verarbeitung neuromorpher Signale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {processingEvents.slice(0, 8).map((event) => (
                  <div key={event.id} className="p-3 bg-secondary/30 rounded-lg text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ort:</span>
                        <span className="font-medium">{event.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vertrauen:</span>
                        <span className="font-medium">{event.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zeit:</span>
                        <span className="font-medium">{event.processingTime.toFixed(1)} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Energie:</span>
                        <span className="font-medium">{event.energyUsed.toFixed(1)} μJ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={20} className="text-green-600" />
                Performance-Übersicht
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Adaptives Lernen</span>
                  <span>{systemMetrics.adaptiveLearning.toFixed(1)}%</span>
                </div>
                <Progress value={systemMetrics.adaptiveLearning} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Durchschn. Stromverbrauch</span>
                  <span>{systemMetrics.averagePowerConsumption.toFixed(1)} mW</span>
                </div>
                <Progress value={(systemMetrics.averagePowerConsumption / 100) * 100} className="h-2" />
              </div>

              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Neuromorphic Computing reduziert den Energieverbrauch um {systemMetrics.energySavings}% 
                  im Vergleich zu herkömmlichen Deep Learning Chips.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}