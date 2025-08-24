import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Target,
  Route,
  Clock,
  MapPin,
  Lightning,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  ArrowClockwise,
  Brain,
  Activity,
  AlertTriangle,
  Gauge,
  Calendar,
  Users,
  Train
} from '@phosphor-icons/react'

interface DynamicMission {
  id: string
  name: string
  type: 'preventive' | 'reactive' | 'optimization' | 'emergency'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled'
  weatherDependency: boolean
  triggers: {
    weather: string[]
    operational: string[]
    time: string
  }
  objectives: {
    primary: string
    secondary: string[]
    kpi: Record<string, number>
  }
  resources: {
    drones: number
    personnel: number
    estimatedDuration: number
    costEstimate: number
  }
  execution: {
    startTime?: string
    endTime?: string
    progress: number
    currentPhase: string
    completedTasks: number
    totalTasks: number
  }
  adaptation: {
    originalPlan: string
    currentPlan: string
    adaptationCount: number
    lastAdaptation?: string
    adaptationReason?: string
  }
  results?: {
    delaysPrevented: number
    efficiencyGain: number
    costSavings: number
    safetyIncidents: number
  }
}

interface MissionTemplate {
  id: string
  name: string
  description: string
  category: 'weather' | 'maintenance' | 'capacity' | 'safety'
  triggers: string[]
  estimatedDuration: number
  resources: {
    drones: number
    personnel: number
  }
  expectedOutcome: string
}

interface WeatherImpact {
  condition: string
  severity: 'low' | 'medium' | 'high' | 'extreme'
  affectedOperations: string[]
  recommendedActions: string[]
  timeWindow: string
  confidence: number
}

export default function DynamicMissionPlanning() {
  const [activeMissions, setActiveMissions] = useKV<DynamicMission[]>('dynamic-missions', [])
  const [missionTemplates, setMissionTemplates] = useKV<MissionTemplate[]>('mission-templates-dynamic', [])
  const [weatherImpacts, setWeatherImpacts] = useKV<WeatherImpact[]>('weather-impacts', [])
  const [isOptimizing, setIsOptimizing] = useState(false)

  const [missionStats] = useKV('mission-stats', {
    totalMissions: 1247,
    activeMissions: 8,
    successRate: 94.2,
    averageAdaptations: 2.3,
    delaysPrevented: 342,
    efficiencyGain: 18.7
  })

  useEffect(() => {
    // Initialize with sample missions
    if (activeMissions.length === 0) {
      const sampleMissions: DynamicMission[] = [
        {
          id: 'DM001',
          name: 'Sturm-Präventions-Mission Alpha',
          type: 'preventive',
          priority: 'high',
          status: 'active',
          weatherDependency: true,
          triggers: {
            weather: ['Windgeschwindigkeit > 45 km/h', 'Niederschlag > 10mm/h'],
            operational: ['Verspätungsrisiko > 75%'],
            time: '6 Stunden vor Sturm'
          },
          objectives: {
            primary: 'Infrastruktursicherung vor Sturmankunft',
            secondary: ['Drohnen-Vorab-Inspektion', 'Personal-Positionierung', 'Alternativrouten aktivieren'],
            kpi: { targetDelay: 5, currentDelay: 3.2, efficiencyTarget: 95 }
          },
          resources: {
            drones: 6,
            personnel: 12,
            estimatedDuration: 180,
            costEstimate: 8500
          },
          execution: {
            startTime: new Date(Date.now() - 3600000).toISOString(),
            progress: 67,
            currentPhase: 'Drohnen-Inspektion Abschnitt C',
            completedTasks: 8,
            totalTasks: 12
          },
          adaptation: {
            originalPlan: 'Standard Sturmprotokoll',
            currentPlan: 'Erweiterte Überwachung mit zusätzlichen Drohnen',
            adaptationCount: 2,
            lastAdaptation: new Date(Date.now() - 900000).toISOString(),
            adaptationReason: 'Windgeschwindigkeit höher als erwartet'
          },
          results: {
            delaysPrevented: 23,
            efficiencyGain: 12.3,
            costSavings: 15600,
            safetyIncidents: 0
          }
        },
        {
          id: 'DM002',
          name: 'Kapazitäts-Optimierung Peak-Zeit',
          type: 'optimization',
          priority: 'medium',
          status: 'active',
          weatherDependency: false,
          triggers: {
            weather: [],
            operational: ['Passagieraufkommen > 85%', 'Durchschnittsgeschwindigkeit < 80%'],
            time: 'Täglich 07:00-09:00, 17:00-19:00'
          },
          objectives: {
            primary: 'Fahrgastfluss-Optimierung während Stoßzeiten',
            secondary: ['Dynamische Taktanpassung', 'Alternativrouten', 'Echtzeit-Information'],
            kpi: { targetDelay: 3, currentDelay: 4.1, efficiencyTarget: 90 }
          },
          resources: {
            drones: 2,
            personnel: 8,
            estimatedDuration: 120,
            costEstimate: 3200
          },
          execution: {
            startTime: new Date(Date.now() - 7200000).toISOString(),
            progress: 45,
            currentPhase: 'Verkehrsfluss-Analyse',
            completedTasks: 5,
            totalTasks: 11
          },
          adaptation: {
            originalPlan: 'Standard Peak-Zeit Protokoll',
            currentPlan: 'Standard Peak-Zeit Protokoll',
            adaptationCount: 0
          }
        },
        {
          id: 'DM003',
          name: 'Notfall-Reaktion Gleisschaden',
          type: 'emergency',
          priority: 'critical',
          status: 'planned',
          weatherDependency: true,
          triggers: {
            weather: ['Starkregen', 'Überschwemmungsgefahr'],
            operational: ['Gleisschaden gemeldet', 'Sicherheitsrisiko'],
            time: 'Sofort nach Alarmierung'
          },
          objectives: {
            primary: 'Schnelle Schadensbewertung und Alternativrouting',
            secondary: ['Passagier-Evakuierung', 'Reparatur-Koordination', 'Medien-Information'],
            kpi: { targetDelay: 0, currentDelay: 0, efficiencyTarget: 100 }
          },
          resources: {
            drones: 4,
            personnel: 15,
            estimatedDuration: 240,
            costEstimate: 12000
          },
          execution: {
            progress: 0,
            currentPhase: 'Bereitschaft',
            completedTasks: 0,
            totalTasks: 15
          },
          adaptation: {
            originalPlan: 'Standard Notfall-Protokoll',
            currentPlan: 'Standard Notfall-Protokoll',
            adaptationCount: 0
          }
        }
      ]
      setActiveMissions(sampleMissions)
    }

    if (missionTemplates.length === 0) {
      const sampleTemplates: MissionTemplate[] = [
        {
          id: 'MT001',
          name: 'Wetterbasierte Präventivinspektion',
          description: 'Automatische Drohneninspektion bei kritischen Wetterbedingungen',
          category: 'weather',
          triggers: ['Sturm vorhergesagt', 'Starkregen', 'Schneesturm'],
          estimatedDuration: 120,
          resources: { drones: 4, personnel: 6 },
          expectedOutcome: 'Früherkennung von Schäden, 80% weniger reaktive Maßnahmen'
        },
        {
          id: 'MT002',
          name: 'Kapazitäts-Boost Rush Hour',
          description: 'Dynamische Takterhöhung und Alternativrouting',
          category: 'capacity',
          triggers: ['Passagieraufkommen > 90%', 'Verspätungen > 5min'],
          estimatedDuration: 180,
          resources: { drones: 2, personnel: 10 },
          expectedOutcome: '25% weniger Verspätungen, 15% höhere Kapazität'
        },
        {
          id: 'MT003',
          name: 'Präventive Wartungsoptimierung',
          description: 'KI-basierte Wartungsplanung vor kritischen Ausfällen',
          category: 'maintenance',
          triggers: ['Verschleiß > 85%', 'Anomalie erkannt'],
          estimatedDuration: 300,
          resources: { drones: 3, personnel: 8 },
          expectedOutcome: '60% weniger ungeplante Ausfälle'
        }
      ]
      setMissionTemplates(sampleTemplates)
    }

    if (weatherImpacts.length === 0) {
      const sampleImpacts: WeatherImpact[] = [
        {
          condition: 'Starker Südwestwind',
          severity: 'high',
          affectedOperations: ['Bergstrecke Nord', 'Brücken-Netzwerk', 'Waldabschnitte'],
          recommendedActions: ['Geschwindigkeitsbegrenzung', 'Verstärkte Überwachung', 'Bereitschaftsteams'],
          timeWindow: 'Nächste 4-6 Stunden',
          confidence: 87
        },
        {
          condition: 'Dichte Nebelbänke',
          severity: 'medium',
          affectedOperations: ['Tal-Routen', 'Flughafenanbindung'],
          recommendedActions: ['Sichtfahrt-Protokoll', 'Verlängerte Halte'],
          timeWindow: 'Morgen 06:00-10:00',
          confidence: 92
        }
      ]
      setWeatherImpacts(sampleImpacts)
    }
  }, [])

  const optimizeMissions = async () => {
    setIsOptimizing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate AI optimization
      const optimizedMissions = activeMissions.map(mission => {
        if (mission.status === 'active') {
          return {
            ...mission,
            adaptation: {
              ...mission.adaptation,
              adaptationCount: mission.adaptation.adaptationCount + 1,
              lastAdaptation: new Date().toISOString(),
              adaptationReason: 'KI-Optimierung basierend auf aktuellen Wetterdaten'
            }
          }
        }
        return mission
      })
      
      setActiveMissions(optimizedMissions)
      toast.success('Missionen erfolgreich optimiert')
    } finally {
      setIsOptimizing(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'text-blue-600'
      case 'active': return 'text-green-600'
      case 'paused': return 'text-yellow-600'
      case 'completed': return 'text-purple-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'preventive': return <ShieldCheck size={16} className="text-blue-600" />
      case 'reactive': return <Lightning size={16} className="text-yellow-600" />
      case 'optimization': return <Target size={16} className="text-green-600" />
      case 'emergency': return <AlertTriangle size={16} className="text-red-600" />
      default: return <Activity size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Mission Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity size={20} className="text-blue-600" />
              <div>
                <p className="text-xl font-bold">{missionStats.activeMissions}</p>
                <p className="text-xs text-muted-foreground">Aktive Missionen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-xl font-bold">{missionStats.successRate}%</p>
                <p className="text-xs text-muted-foreground">Erfolgsquote</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowClockwise size={20} className="text-purple-600" />
              <div>
                <p className="text-xl font-bold">{missionStats.averageAdaptations}</p>
                <p className="text-xs text-muted-foreground">Ø Anpassungen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-orange-600" />
              <div>
                <p className="text-xl font-bold">{missionStats.delaysPrevented}</p>
                <p className="text-xs text-muted-foreground">Verspätungen verhindert</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gauge size={20} className="text-indigo-600" />
              <div>
                <p className="text-xl font-bold">{missionStats.efficiencyGain}%</p>
                <p className="text-xs text-muted-foreground">Effizienzsteigerung</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target size={20} className="text-emerald-600" />
              <div>
                <p className="text-xl font-bold">{missionStats.totalMissions}</p>
                <p className="text-xs text-muted-foreground">Gesamt durchgeführt</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Weather Alert */}
      {weatherImpacts.some(impact => impact.severity === 'high' || impact.severity === 'extreme') && (
        <Alert className="border-destructive bg-destructive/10">
          <Lightning className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            WETTER-ALARM: Kritische Bedingungen erkannt - Dynamische Missionsanpassung wird durchgeführt
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Missions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Aktive Missionen</CardTitle>
                  <CardDescription>Wetterbasierte dynamische Missionsanpassung</CardDescription>
                </div>
                <Button 
                  onClick={optimizeMissions} 
                  disabled={isOptimizing}
                  size="sm"
                  className="gap-2"
                >
                  {isOptimizing ? (
                    <ArrowClockwise size={16} className="animate-spin" />
                  ) : (
                    <Brain size={16} />
                  )}
                  KI-Optimierung
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeMissions.map(mission => (
                  <div key={mission.id} className="p-4 rounded-lg border space-y-4">
                    {/* Mission Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(mission.type)}
                        <div>
                          <h4 className="font-semibold">{mission.name}</h4>
                          <p className="text-sm text-muted-foreground">{mission.objectives.primary}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(mission.priority)}>
                          {mission.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(mission.status)}>
                          {mission.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {mission.status === 'active' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Fortschritt: {mission.execution.currentPhase}</span>
                          <span>{mission.execution.progress}%</span>
                        </div>
                        <Progress value={mission.execution.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Aufgaben: {mission.execution.completedTasks}/{mission.execution.totalTasks}</span>
                          {mission.execution.startTime && (
                            <span>Gestartet: {new Date(mission.execution.startTime).toLocaleTimeString()}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Resources and KPIs */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="font-medium text-muted-foreground">RESSOURCEN</p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Drohnen:</span>
                            <span>{mission.resources.drones}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Personal:</span>
                            <span>{mission.resources.personnel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dauer:</span>
                            <span>{mission.resources.estimatedDuration}min</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-muted-foreground">LEISTUNG</p>
                        {mission.objectives.kpi && (
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Ziel-Verspätung:</span>
                              <span>{mission.objectives.kpi.targetDelay}min</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Aktuell:</span>
                              <span className={mission.objectives.kpi.currentDelay <= mission.objectives.kpi.targetDelay ? 'text-green-600' : 'text-red-600'}>
                                {mission.objectives.kpi.currentDelay}min
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Effizienz:</span>
                              <span>{mission.objectives.kpi.efficiencyTarget}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Adaptations */}
                    {mission.adaptation.adaptationCount > 0 && (
                      <div className="p-3 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-blue-800">DYNAMISCHE ANPASSUNG</p>
                          <Badge variant="outline" className="text-blue-700 border-blue-300">
                            {mission.adaptation.adaptationCount}x angepasst
                          </Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="text-muted-foreground">Original: </span>
                            <span>{mission.adaptation.originalPlan}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Angepasst: </span>
                            <span className="text-blue-700">{mission.adaptation.currentPlan}</span>
                          </div>
                          {mission.adaptation.adaptationReason && (
                            <div>
                              <span className="text-muted-foreground">Grund: </span>
                              <span className="text-blue-700">{mission.adaptation.adaptationReason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    {mission.results && mission.status === 'completed' && (
                      <div className="grid grid-cols-4 gap-4 p-3 bg-green-50 rounded border border-green-200">
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-700">{mission.results.delaysPrevented}</p>
                          <p className="text-xs text-green-600">Verspätungen verhindert</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-700">{mission.results.efficiencyGain}%</p>
                          <p className="text-xs text-green-600">Effizienzgewinn</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-700">€{mission.results.costSavings}</p>
                          <p className="text-xs text-green-600">Kosteneinsparung</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-700">{mission.results.safetyIncidents}</p>
                          <p className="text-xs text-green-600">Sicherheitsvorfälle</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Impacts & Templates */}
        <div className="space-y-6">
          {/* Weather Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Wetter-Auswirkungsanalyse</CardTitle>
              <CardDescription>KI-basierte Vorhersage operationeller Impacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherImpacts.map((impact, idx) => (
                  <div key={idx} className="p-3 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{impact.condition}</h4>
                      <Badge variant={impact.severity === 'high' ? 'destructive' : 'secondary'}>
                        {impact.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Betroffene Bereiche:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {impact.affectedOperations.map(op => (
                            <Badge key={op} variant="outline" className="text-xs">
                              {op}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Empfohlene Maßnahmen:</p>
                        <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                          {impact.recommendedActions.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-xs text-muted-foreground">{impact.timeWindow}</span>
                        <span className="text-xs font-medium">Konfidenz: {impact.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mission Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Missions-Templates</CardTitle>
              <CardDescription>Vordefinierte Reaktionsmuster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {missionTemplates.map(template => (
                  <div key={template.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span>⏱️ {template.estimatedDuration}min</span>
                      <span>🚁 {template.resources.drones} Drohnen</span>
                      <span>👥 {template.resources.personnel} Personal</span>
                    </div>
                    
                    <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                      {template.expectedOutcome}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}