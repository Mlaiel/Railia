/**
 * MaintenancePlanning - KI-gestützte automatisierte Wartungsplanung
 * 
 * Nutzt prädiktive Algorithmen zur Optimierung der Wartungszyklen
 * und Minimierung von ungeplanten Ausfällen durch vorausschauende Instandhaltung.
 */

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Wrench,
  Calendar,
  TrendUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Gauge,
  Zap,
  Shield,
  Settings,
  BarChart,
  PlayCircle,
  PauseCircle,
  Activity,
  Timer,
  Cpu,
  Battery,
  Engine
} from '@phosphor-icons/react'

interface MaintenanceTask {
  id: string
  trainId: string
  component: string
  type: 'preventive' | 'predictive' | 'corrective' | 'emergency'
  priority: 'low' | 'medium' | 'high' | 'critical'
  scheduledDate: string
  estimatedDuration: number
  predictedFailureRisk: number
  cost: number
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue'
  description: string
  aiConfidence: number
}

interface TrainHealth {
  trainId: string
  model: string
  overallHealth: number
  components: {
    engine: number
    brakes: number
    doors: number
    electrical: number
    hvac: number
    wheels: number
  }
  nextMaintenance: string
  totalOperatingHours: number
  lastMaintenance: string
  predictedIssues: string[]
}

const MaintenancePlanning = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null)

  // Wartungsaufgaben mit KV-Storage
  const [maintenanceTasks, setMaintenanceTasks] = useKV<MaintenanceTask[]>('maintenance-tasks', [
    {
      id: 'maint-001',
      trainId: 'ICE-403',
      component: 'Bremssystem',
      type: 'predictive',
      priority: 'high',
      scheduledDate: '2024-01-15T08:00:00Z',
      estimatedDuration: 4,
      predictedFailureRisk: 78,
      cost: 15600,
      status: 'scheduled',
      description: 'KI erkennt Verschleiß an Bremsbelägen - präventive Wartung empfohlen',
      aiConfidence: 94
    },
    {
      id: 'maint-002', 
      trainId: 'IC-2194',
      component: 'Klimaanlage',
      type: 'preventive',
      priority: 'medium',
      scheduledDate: '2024-01-18T14:00:00Z',
      estimatedDuration: 2,
      predictedFailureRisk: 35,
      cost: 8200,
      status: 'scheduled',
      description: 'Routinewartung des HVAC-Systems',
      aiConfidence: 87
    },
    {
      id: 'maint-003',
      trainId: 'ICE-374',
      component: 'Antriebsmotor',
      type: 'predictive',
      priority: 'critical',
      scheduledDate: '2024-01-12T06:00:00Z',
      estimatedDuration: 8,
      predictedFailureRisk: 89,
      cost: 28400,
      status: 'in-progress',
      description: 'Anomale Vibrationen erkannt - sofortige Inspektion erforderlich',
      aiConfidence: 96
    }
  ])

  // Zuggesundheitsdaten
  const [trainHealthData, setTrainHealthData] = useKV<TrainHealth[]>('train-health', [
    {
      trainId: 'ICE-403',
      model: 'ICE 4',
      overallHealth: 73,
      components: {
        engine: 85,
        brakes: 45, // Niedrig wegen vorhersagter Wartung
        doors: 92,
        electrical: 78,
        hvac: 88,
        wheels: 76
      },
      nextMaintenance: '2024-01-15T08:00:00Z',
      totalOperatingHours: 12450,
      lastMaintenance: '2023-12-20T10:00:00Z',
      predictedIssues: ['Bremsbelag-Verschleiß', 'Elektrische Spannung instabil']
    },
    {
      trainId: 'IC-2194',
      model: 'IC 2',
      overallHealth: 89,
      components: {
        engine: 91,
        brakes: 87,
        doors: 94,
        electrical: 86,
        hvac: 72, // Planmäßige Wartung fällig
        wheels: 93
      },
      nextMaintenance: '2024-01-18T14:00:00Z',
      totalOperatingHours: 8920,
      lastMaintenance: '2024-01-05T12:00:00Z',
      predictedIssues: ['HVAC-Filter Austausch erforderlich']
    },
    {
      trainId: 'ICE-374',
      model: 'ICE 3',
      overallHealth: 62,
      components: {
        engine: 38, // Kritisch - in Wartung
        brakes: 78,
        doors: 85,
        electrical: 72,
        hvac: 81,
        wheels: 69
      },
      nextMaintenance: '2024-01-12T06:00:00Z',
      totalOperatingHours: 15230,
      lastMaintenance: '2023-11-28T09:00:00Z',
      predictedIssues: ['Motor-Vibrationen kritisch', 'Lager-Überhitzung', 'Kühlsystem ineffizient']
    }
  ])

  const [aiPredictions, setAiPredictions] = useKV('maintenance-predictions', {
    totalCostSavings: 1240000,
    preventedFailures: 23,
    efficiencyImprovement: 18.4,
    uptime: 97.8,
    lastAnalysis: new Date().toISOString()
  })

  // KI-Analyse simulation
  const runAiAnalysis = async () => {
    setIsAiAnalyzing(true)
    toast.info('KI-Algorithmus analysiert Wartungsdaten...', {
      duration: 2000
    })

    // Simuliere KI-Verarbeitung
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Generiere neue Vorhersagen
    const newPredictions = {
      totalCostSavings: Math.floor(Math.random() * 500000) + 1000000,
      preventedFailures: Math.floor(Math.random() * 15) + 20,
      efficiencyImprovement: Math.round((Math.random() * 10 + 15) * 10) / 10,
      uptime: Math.round((Math.random() * 3 + 96) * 10) / 10,
      lastAnalysis: new Date().toISOString()
    }

    setAiPredictions(newPredictions)
    setIsAiAnalyzing(false)

    toast.success('KI-Analyse abgeschlossen! Neue Wartungsempfehlungen verfügbar', {
      duration: 3000
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600'
    if (health >= 60) return 'text-yellow-600'
    if (health >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-800">Geplant</Badge>
      case 'in-progress': return <Badge className="bg-yellow-100 text-yellow-800">In Arbeit</Badge>
      case 'completed': return <Badge className="bg-green-100 text-green-800">Abgeschlossen</Badge>
      case 'overdue': return <Badge className="bg-red-100 text-red-800">Überfällig</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            KI-Wartungsplanung
          </h1>
          <p className="text-muted-foreground mt-1">
            Automatisierte Wartungsoptimierung durch prädiktive Algorithmen
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={runAiAnalysis}
            disabled={isAiAnalyzing}
            className="bg-primary hover:bg-primary/90"
          >
            {isAiAnalyzing ? (
              <>
                <Cpu className="h-4 w-4 mr-2 animate-spin" />
                Analysiert...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                KI-Analyse starten
              </>
            )}
          </Button>
        </div>
      </div>

      {/* KI-Metriken Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kosteneinsparungen</p>
                <p className="text-2xl font-bold text-green-600">
                  €{(aiPredictions.totalCostSavings / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verfügbarkeit</p>
                <p className="text-2xl font-bold text-blue-600">{aiPredictions.uptime}%</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gauge className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verhinderte Ausfälle</p>
                <p className="text-2xl font-bold text-orange-600">{aiPredictions.preventedFailures}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Effizienz-Steigerung</p>
                <p className="text-2xl font-bold text-purple-600">+{aiPredictions.efficiencyImprovement}%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Übersicht</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Aufgaben</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Zugzustand</span>
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">KI-Vorhersagen</span>
          </TabsTrigger>
        </TabsList>

        {/* Übersicht Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wartungskalender */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Wartungskalender
                </CardTitle>
                <CardDescription>
                  Anstehende Wartungen in den nächsten 7 Tagen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {maintenanceTasks
                  .filter(task => task.status === 'scheduled' || task.status === 'in-progress')
                  .slice(0, 5)
                  .map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <div>
                          <p className="font-medium">{task.trainId}</p>
                          <p className="text-sm text-muted-foreground">{task.component}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(task.scheduledDate).toLocaleDateString('de-DE')}
                        </p>
                        <p className="text-xs text-muted-foreground">{task.estimatedDuration}h</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Kritische Züge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Kritische Züge
                </CardTitle>
                <CardDescription>
                  Züge mit erhöhtem Wartungsbedarf
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainHealthData
                  .filter(train => train.overallHealth < 75)
                  .map((train) => (
                    <div key={train.trainId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <div>
                        <p className="font-medium">{train.trainId}</p>
                        <p className="text-sm text-muted-foreground">{train.model}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getHealthColor(train.overallHealth)}`}>
                          {train.overallHealth}%
                        </p>
                        <p className="text-xs text-red-600">Aufmerksamkeit erforderlich</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* KI-Analyse Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                KI-Analyse Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Letzte Analyse</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(aiPredictions.lastAnalysis).toLocaleString('de-DE')}
                  </p>
                </div>
                {isAiAnalyzing ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Cpu className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Analysiert...</span>
                  </div>
                ) : (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Abgeschlossen
                  </Badge>
                )}
              </div>
              
              {isAiAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Verarbeitung...</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wartungsaufgaben Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alle Wartungsaufgaben</CardTitle>
              <CardDescription>
                KI-generierte und geplante Wartungsarbeiten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceTasks.map((task) => (
                  <div key={task.id} className="border border-border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                          <h3 className="font-semibold">{task.trainId} - {task.component}</h3>
                          {getStatusBadge(task.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedDuration}h
                          </span>
                          <span className="flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            {task.aiConfidence}% KI-Vertrauen
                          </span>
                          <span>€{task.cost.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Date(task.scheduledDate).toLocaleDateString('de-DE')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(task.scheduledDate).toLocaleTimeString('de-DE', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        {task.predictedFailureRisk > 70 && (
                          <Badge className="bg-red-100 text-red-800 mt-1">
                            {task.predictedFailureRisk}% Ausfallrisiko
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zugzustand Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {trainHealthData.map((train) => (
              <Card key={train.trainId} className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTrain === train.trainId ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTrain(selectedTrain === train.trainId ? null : train.trainId)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{train.trainId}</CardTitle>
                      <CardDescription>{train.model}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getHealthColor(train.overallHealth)}`}>
                        {train.overallHealth}%
                      </p>
                      <p className="text-xs text-muted-foreground">Gesamtzustand</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Komponenten-Status */}
                  <div className="space-y-3">
                    {Object.entries(train.components).map(([component, health]) => (
                      <div key={component} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {component === 'engine' && <Engine className="h-4 w-4" />}
                          {component === 'brakes' && <Shield className="h-4 w-4" />}
                          {component === 'doors' && <Activity className="h-4 w-4" />}
                          {component === 'electrical' && <Zap className="h-4 w-4" />}
                          {component === 'hvac' && <Settings className="h-4 w-4" />}
                          {component === 'wheels' && <Timer className="h-4 w-4" />}
                          <span className="text-sm capitalize">{component}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={health} className="w-16 h-2" />
                          <span className={`text-sm font-medium ${getHealthColor(health)}`}>
                            {health}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vorhersagen */}
                  {train.predictedIssues.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm font-medium text-yellow-800 mb-2">KI-Vorhersagen:</p>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        {train.predictedIssues.map((issue, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Wartungsinfo */}
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Nächste Wartung:</span>
                      <span>{new Date(train.nextMaintenance).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Betriebsstunden:</span>
                      <span>{train.totalOperatingHours.toLocaleString()}h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* KI-Vorhersagen Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                KI-Vorhersage-Engine
              </CardTitle>
              <CardDescription>
                Erweiterte Algorithmen für prädiktive Wartung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Algorithmus Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-green-800">Modell Trainiert</p>
                  <p className="text-sm text-green-600">99.2% Genauigkeit</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-blue-800">Live-Monitoring</p>
                  <p className="text-sm text-blue-600">24/7 Überwachung</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium text-purple-800">Optimierung</p>
                  <p className="text-sm text-purple-600">Kontinuierlich</p>
                </div>
              </div>

              {/* Vorhersage-Metriken */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vorhersage-Performance</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Ausfallvorhersage-Genauigkeit</span>
                      <span className="text-sm font-bold text-green-600">96.8%</span>
                    </div>
                    <Progress value={96.8} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Kostenoptimierung</span>
                      <span className="text-sm font-bold text-blue-600">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Zeitplan-Optimierung</span>
                      <span className="text-sm font-bold text-purple-600">91.5%</span>
                    </div>
                    <Progress value={91.5} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Ressourcen-Effizienz</span>
                      <span className="text-sm font-bold text-orange-600">88.7%</span>
                    </div>
                    <Progress value={88.7} className="h-3" />
                  </div>
                </div>
              </div>

              {/* Algorithmus-Details */}
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>KI-Algorithmus-Stack:</strong> Random Forest, LSTM Neural Networks, 
                  Gradient Boosting für multi-dimensionale Wartungsvorhersagen. 
                  Trainiert auf über 2.5 Millionen Wartungsdatensätzen mit kontinuierlichem 
                  Transfer Learning für optimale Anpassung an neue Zugmodelle.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MaintenancePlanning