import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import {
  Wrench,
  TrendUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Cpu,
  Activity,
  Target,
  BookOpen,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Equals,
  Gauge,
  Database,
  BrainCircuit
} from '@phosphor-icons/react'

interface MaintenanceItem {
  id: string
  component: string
  componentType: 'schiene' | 'weiche' | 'signal' | 'oberleitung' | 'brücke' | 'tunnel'
  location: string
  currentCondition: number
  predictedFailureDate: string
  riskLevel: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
  maintenanceWindow: string
  estimatedCost: number
  priority: number
  lastMaintenance: string
  learningConfidence: number
  aiRecommendation: string
}

interface LearningMetrics {
  totalPredictions: number
  accuracy: number
  falsePositives: number
  preventedFailures: number
  costSavings: number
  modelVersion: string
  lastTraining: string
  dataPoints: number
}

interface ComponentHealth {
  type: string
  total: number
  healthy: number
  degrading: number
  critical: number
  avgCondition: number
  trend: 'improving' | 'stable' | 'degrading'
}

const PredictiveMaintenanceAI = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [learningMode, setLearningMode] = useState<'training' | 'inference' | 'evaluation'>('inference')

  // Persistent AI learning data
  const [maintenanceItems, setMaintenanceItems] = useKV<MaintenanceItem[]>('maintenance-items', [
    {
      id: 'rail-001',
      component: 'Schienensegment A-247',
      componentType: 'schiene',
      location: 'Strecke Berlin-Hamburg, km 47.2',
      currentCondition: 73,
      predictedFailureDate: '2024-03-15',
      riskLevel: 'mittel',
      maintenanceWindow: '2024-02-28 - 2024-03-02',
      estimatedCost: 12500,
      priority: 7,
      lastMaintenance: '2023-08-15',
      learningConfidence: 87,
      aiRecommendation: 'Präventive Schleifung empfohlen. Vibrationsmuster zeigen beginnende Materialermüdung.'
    },
    {
      id: 'switch-003',
      component: 'Weiche W-392',
      componentType: 'weiche',
      location: 'Bahnhof München Hauptbahnhof',
      currentCondition: 45,
      predictedFailureDate: '2024-02-08',
      riskLevel: 'kritisch',
      maintenanceWindow: '2024-01-30 - 2024-02-01',
      estimatedCost: 28000,
      priority: 10,
      lastMaintenance: '2023-05-12',
      learningConfidence: 94,
      aiRecommendation: 'Sofortiger Austausch erforderlich. Stellkraft-Anomalien deuten auf baldiges Versagen hin.'
    },
    {
      id: 'signal-017',
      component: 'Hauptsignal HS-847',
      componentType: 'signal',
      location: 'Strecke Frankfurt-Köln, km 15.8',
      currentCondition: 91,
      predictedFailureDate: '2024-07-22',
      riskLevel: 'niedrig',
      maintenanceWindow: '2024-07-15 - 2024-07-17',
      estimatedCost: 3200,
      priority: 3,
      lastMaintenance: '2023-11-20',
      learningConfidence: 79,
      aiRecommendation: 'Routinewartung ausreichend. LED-Module zeigen normale Alterungserscheinungen.'
    }
  ])

  const [learningMetrics, setLearningMetrics] = useKV<LearningMetrics>('ai-learning-metrics', {
    totalPredictions: 1247,
    accuracy: 94.2,
    falsePositives: 23,
    preventedFailures: 67,
    costSavings: 2340000,
    modelVersion: 'v3.2.1',
    lastTraining: new Date().toISOString(),
    dataPoints: 45780
  })

  const [componentHealth, setComponentHealth] = useKV<ComponentHealth[]>('component-health', [
    { type: 'Schienen', total: 2847, healthy: 2234, degrading: 487, critical: 126, avgCondition: 78, trend: 'stable' },
    { type: 'Weichen', total: 456, healthy: 298, degrading: 134, critical: 24, avgCondition: 71, trend: 'degrading' },
    { type: 'Signale', total: 1203, healthy: 987, degrading: 189, critical: 27, avgCondition: 83, trend: 'improving' },
    { type: 'Oberleitungen', total: 3421, healthy: 2876, degrading: 445, critical: 100, avgCondition: 80, trend: 'stable' },
    { type: 'Brücken', total: 127, healthy: 89, degrading: 32, critical: 6, avgCondition: 75, trend: 'degrading' },
    { type: 'Tunnel', total: 89, healthy: 76, degrading: 11, critical: 2, avgCondition: 85, trend: 'stable' }
  ])

  // AI Learning simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (learningMode === 'training') {
        setLearningMetrics(current => ({
          ...current,
          dataPoints: current.dataPoints + Math.floor(Math.random() * 5) + 1,
          accuracy: Math.min(99.5, current.accuracy + (Math.random() - 0.5) * 0.1)
        }))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [learningMode, setLearningMetrics])

  const startAITraining = async () => {
    setLearningMode('training')
    toast.success('KI-Training gestartet - Neue Sensordaten werden verarbeitet', {
      duration: 3000
    })

    // Simulate training process
    setTimeout(() => {
      setLearningMode('inference')
      setLearningMetrics(current => ({
        ...current,
        modelVersion: `v${parseInt(current.modelVersion.split('.')[1]) + 1}.0.0`,
        lastTraining: new Date().toISOString(),
        accuracy: Math.min(99.5, current.accuracy + 0.5)
      }))
      toast.success('KI-Training abgeschlossen - Modell-Genauigkeit verbessert!')
    }, 8000)
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 9) return 'text-red-600 bg-red-50 border-red-200'
    if (priority >= 7) return 'text-orange-600 bg-orange-50 border-orange-200'
    if (priority >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'kritisch': return 'destructive'
      case 'hoch': return 'destructive'
      case 'mittel': return 'secondary'
      case 'niedrig': return 'outline'
      default: return 'outline'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'degrading': return <ArrowDown className="w-4 h-4 text-red-600" />
      default: return <Equals className="w-4 h-4 text-gray-600" />
    }
  }

  const sortedMaintenanceItems = maintenanceItems.sort((a, b) => b.priority - a.priority)
  const criticalItems = maintenanceItems.filter(item => item.riskLevel === 'kritisch').length
  const upcomingMaintenance = maintenanceItems.filter(item => {
    const maintenanceDate = new Date(item.maintenanceWindow.split(' - ')[0])
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return maintenanceDate <= sevenDaysFromNow && maintenanceDate >= now
  }).length

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <BrainCircuit size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Selbstlernende Wartungsvorhersage-KI</h1>
            <p className="text-muted-foreground">Proaktive Infrastruktur-Optimierung durch maschinelles Lernen</p>
          </div>
        </div>

        {/* AI Status & Training Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu size={20} className="text-primary" />
                  <span className="font-medium">KI-Status</span>
                </div>
                <Badge variant={learningMode === 'training' ? 'default' : 'outline'}>
                  {learningMode === 'training' ? 'Training läuft' : 'Bereit'}
                </Badge>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Modell {learningMetrics.modelVersion} • {learningMetrics.accuracy.toFixed(1)}% Genauigkeit
                </p>
                {learningMode === 'training' && (
                  <Progress value={75} className="mt-2 h-2" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database size={20} className="text-blue-600" />
                  <span className="font-medium">Datenpunkte</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {learningMetrics.dataPoints.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Sensordaten verarbeitet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button 
                  onClick={startAITraining}
                  disabled={learningMode === 'training'}
                  className="w-full"
                  size="sm"
                >
                  <Lightbulb size={16} className="mr-2" />
                  {learningMode === 'training' ? 'Training läuft...' : 'KI neu trainieren'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Letzte Aktualisierung: {new Date(learningMetrics.lastTraining).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
            <div className="text-sm text-muted-foreground">Kritische Komponenten</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Calendar size={16} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{upcomingMaintenance}</div>
            <div className="text-sm text-muted-foreground">Wartungen diese Woche</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{learningMetrics.preventedFailures}</div>
            <div className="text-sm text-muted-foreground">Ausfälle verhindert</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendUp size={16} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {(learningMetrics.costSavings / 1000000).toFixed(1)}M€
            </div>
            <div className="text-sm text-muted-foreground">Kosteneinsparungen</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="predictions">Vorhersagen</TabsTrigger>
          <TabsTrigger value="health">Zustandsanalyse</TabsTrigger>
          <TabsTrigger value="learning">KI-Lernen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* High Priority Maintenance Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} className="text-red-600" />
                Kritische Wartungselemente
              </CardTitle>
              <CardDescription>
                Komponenten mit höchster Priorität für sofortige Aufmerksamkeit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedMaintenanceItems.slice(0, 5).map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedComponent(item.id)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{item.component}</h3>
                        <Badge variant={getRiskColor(item.riskLevel)}>
                          {item.riskLevel}
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          Priorität {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Zustand: {item.currentCondition}%</span>
                        <span>KI-Vertrauen: {item.learningConfidence}%</span>
                        <span>Geschätzte Kosten: {item.estimatedCost.toLocaleString()}€</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Wartung bis: {new Date(item.predictedFailureDate).toLocaleDateString()}
                      </div>
                      <Progress value={item.currentCondition} className="w-32 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                KI-Erkenntnisse und Empfehlungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Muster erkannt:</strong> Weichen zeigen 15% häufigere Ausfälle bei Temperaturen unter -5°C. 
                    Empfehlung: Präventive Heizungsaktivierung ab November.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <TrendUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Optimierung identifiziert:</strong> Wartungsintervalle für Schienen können um 12% verlängert werden, 
                    basierend auf aktuellen Verschleißmustern.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Risiko-Cluster:</strong> Erhöhte Ausfallwahrscheinlichkeit für Signale der Generation SIG-2019 
                    in den nächsten 3 Monaten erkannt.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detaillierte Vorhersagen</CardTitle>
              <CardDescription>
                Vollständige Liste aller KI-generierten Wartungsvorhersagen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceItems.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{item.component}</h3>
                          <p className="text-muted-foreground mb-2">{item.location}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Aktueller Zustand:</span>
                              <span className="font-medium">{item.currentCondition}%</span>
                            </div>
                            <Progress value={item.currentCondition} className="h-2" />
                            
                            <div className="flex justify-between text-sm">
                              <span>KI-Vertrauen:</span>
                              <span>{item.learningConfidence}%</span>
                            </div>
                            <Progress value={item.learningConfidence} className="h-1 opacity-50" />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={getRiskColor(item.riskLevel)}>
                              {item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)} Risiko
                            </Badge>
                            <Badge className={getPriorityColor(item.priority)}>
                              Priorität {item.priority}
                            </Badge>
                          </div>
                          
                          <div className="text-sm space-y-1">
                            <div><strong>Ausfallvorhersage:</strong> {new Date(item.predictedFailureDate).toLocaleDateString()}</div>
                            <div><strong>Wartungsfenster:</strong> {item.maintenanceWindow}</div>
                            <div><strong>Geschätzte Kosten:</strong> {item.estimatedCost.toLocaleString()}€</div>
                            <div><strong>Letzte Wartung:</strong> {new Date(item.lastMaintenance).toLocaleDateString()}</div>
                          </div>
                          
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <h4 className="font-medium text-sm mb-1">KI-Empfehlung:</h4>
                            <p className="text-sm text-muted-foreground">{item.aiRecommendation}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Infrastruktur-Zustandsanalyse</CardTitle>
              <CardDescription>
                Überblick über den Gesundheitszustand aller Komponententypen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {componentHealth.map((component) => (
                  <div key={component.type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{component.type}</h3>
                        <Badge variant="outline">{component.total} Komponenten</Badge>
                        {getTrendIcon(component.trend)}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{component.avgCondition}%</div>
                        <div className="text-sm text-muted-foreground">Ø Zustand</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{component.healthy}</div>
                        <div className="text-xs text-muted-foreground">Gesund</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-600">{component.degrading}</div>
                        <div className="text-xs text-muted-foreground">Verschleißt</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">{component.critical}</div>
                        <div className="text-xs text-muted-foreground">Kritisch</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex">
                        <div 
                          className="h-2 bg-green-500 rounded-l" 
                          style={{ width: `${(component.healthy / component.total) * 100}%` }}
                        />
                        <div 
                          className="h-2 bg-yellow-500" 
                          style={{ width: `${(component.degrading / component.total) * 100}%` }}
                        />
                        <div 
                          className="h-2 bg-red-500 rounded-r" 
                          style={{ width: `${(component.critical / component.total) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{((component.healthy / component.total) * 100).toFixed(1)}% gesund</span>
                        <span>{((component.critical / component.total) * 100).toFixed(1)}% kritisch</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} className="text-primary" />
                  KI-Lernmetriken
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Vorhersage-Genauigkeit:</span>
                    <span className="font-bold text-green-600">{learningMetrics.accuracy.toFixed(1)}%</span>
                  </div>
                  <Progress value={learningMetrics.accuracy} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span>Falsch-positive Rate:</span>
                    <span className="font-bold">{((learningMetrics.falsePositives / learningMetrics.totalPredictions) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(learningMetrics.falsePositives / learningMetrics.totalPredictions) * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold text-primary">{learningMetrics.totalPredictions}</div>
                    <div className="text-sm text-muted-foreground">Gesamte Vorhersagen</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{learningMetrics.preventedFailures}</div>
                    <div className="text-sm text-muted-foreground">Ausfälle verhindert</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge size={20} className="text-blue-600" />
                  Modell-Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Aktuelle Modell-Version:</span>
                    <Badge>{learningMetrics.modelVersion}</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Trainingsdaten:</span>
                    <span className="font-bold">{learningMetrics.dataPoints.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Letztes Training:</span>
                    <span className="text-sm">{new Date(learningMetrics.lastTraining).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Nächste Trainingszyklen:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Automatisches Update:</span>
                      <span>Täglich 02:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vollständiges Retraining:</span>
                      <span>Wöchentlich</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Modell-Validation:</span>
                      <span>Monatlich</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Lernfortschritt und Optimierungen</CardTitle>
              <CardDescription>
                Kontinuierliche Verbesserung der KI-Algorithmen durch neue Daten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <BrainCircuit className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Neues Muster erkannt:</strong> Die KI hat eine Korrelation zwischen Wetterbedingungen 
                    und Weichenverschleiß entdeckt, was die Vorhersagegenauigkeit um 3.2% verbessert hat.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <TrendUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Algorithmus-Update:</strong> Neue Sensorfusion-Techniken reduzieren falsch-positive 
                    Alarme um 18% bei gleichbleibender Empfindlichkeit.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Kosteneinsparung:</strong> Optimierte Wartungsplanung hat zu 
                    {(learningMetrics.costSavings / 1000000).toFixed(1)}M€ Einsparungen in diesem Jahr geführt.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PredictiveMaintenanceAI