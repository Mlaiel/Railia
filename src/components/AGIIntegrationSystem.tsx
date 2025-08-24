/**
 * @fileoverview AGI-Integration: Allgemeine Künstliche Intelligenz für komplexeste Szenarien
 * @author SmartRail-AI System
 * @version 2.0.0
 * 
 * Fortschrittliche Allgemeine Künstliche Intelligenz für autonome Entscheidungsfindung
 * bei komplexesten Bahnbetriebsszenarien mit menschenähnlicher Problemlösungsfähigkeit
 */

import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Brain, 
  Lightning, 
  Robot, 
  Target, 
  Database,
  Activity,
  Globe,
  Sparkle,
  Eye,
  Gear,
  Graph,
  Network,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Monitor,
  Pulse,
  Settings,
  TrendUp,
  FlowArrow
} from '@phosphor-icons/react'

interface AGIModule {
  id: string
  name: string
  type: 'reasoning' | 'prediction' | 'optimization' | 'learning' | 'communication' | 'creative'
  intelligenceLevel: number // IQ-äquivalent
  processingPower: number // TFLOPS
  status: 'active' | 'learning' | 'reasoning' | 'optimizing' | 'idle' | 'error'
  currentTask: {
    description: string
    complexity: number
    progress: number
    estimatedCompletion: string
  } | null
  capabilities: string[]
  learningRate: number
  memoryUsage: number // Petabytes
  problemsSolved: number
}

interface ComplexScenario {
  id: string
  title: string
  description: string
  complexity: number // 1-10 Skala
  type: 'multi_crisis' | 'network_optimization' | 'passenger_flow' | 'weather_adaptation' | 'emergency_coordination'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedAGI: string[]
  status: 'analyzing' | 'solving' | 'implementing' | 'completed' | 'failed'
  solution: {
    approach: string
    confidence: number
    implementationSteps: string[]
    expectedOutcome: string
  } | null
  startTime: string
  solutionTime?: string
}

const AGIIntegrationSystem: React.FC = () => {
  const [agiModules, setAGIModules] = useKV<AGIModule[]>('agi-modules', [])
  const [complexScenarios, setComplexScenarios] = useKV<ComplexScenario[]>('complex-scenarios', [])
  const [systemMetrics, setSystemMetrics] = useKV('agi-metrics', {
    totalIntelligence: 0,
    problemsSolved: 0,
    avgSolutionTime: 0,
    learningProgress: 0,
    creativeSolutions: 0
  })

  const [realTimeData, setRealTimeData] = useState({
    activeAGI: 0,
    currentIQ: 0,
    processingPower: 0,
    activeTasks: 0,
    solutionAccuracy: 0,
    emergencyResponseTime: 0
  })

  // Simulation der AGI-Module
  useEffect(() => {
    if (agiModules.length === 0) {
      const mockAGIModules: AGIModule[] = [
        {
          id: 'agi-reasoning-001',
          name: 'ARIA (Advanced Reasoning Intelligence Agent)',
          type: 'reasoning',
          intelligenceLevel: 287,
          processingPower: 45.7,
          status: 'reasoning',
          currentTask: {
            description: 'Analyse komplexer Mehrkrisen-Szenario: Sturm + Streik + Technikausfall',
            complexity: 9,
            progress: 73,
            estimatedCompletion: new Date(Date.now() + 1800000).toISOString()
          },
          capabilities: [
            'causal_reasoning', 'multi_domain_analysis', 'ethical_decision_making',
            'uncertainty_handling', 'meta_cognitive_awareness'
          ],
          learningRate: 94.7,
          memoryUsage: 47.3,
          problemsSolved: 2847
        },
        {
          id: 'agi-prediction-002',
          name: 'PROPHET (Predictive Reasoning Optimization for Planning and Handling Emergencies)',
          type: 'prediction',
          intelligenceLevel: 312,
          processingPower: 62.1,
          status: 'active',
          currentTask: {
            description: 'Vorhersage Passagierströme für nächste 48h mit Wetterintegration',
            complexity: 7,
            progress: 45,
            estimatedCompletion: new Date(Date.now() + 3600000).toISOString()
          },
          capabilities: [
            'temporal_modeling', 'probabilistic_inference', 'pattern_recognition',
            'scenario_simulation', 'risk_assessment'
          ],
          learningRate: 89.2,
          memoryUsage: 52.8,
          problemsSolved: 3156
        },
        {
          id: 'agi-optimization-003',
          name: 'OPTIMUS (Operational Planning and Traffic Intelligence Management Unified System)',
          type: 'optimization',
          intelligenceLevel: 298,
          processingPower: 51.4,
          status: 'optimizing',
          currentTask: {
            description: 'Netzwerk-weite Fahrplan-Optimierung für 15.000+ Züge gleichzeitig',
            complexity: 10,
            progress: 82,
            estimatedCompletion: new Date(Date.now() + 2700000).toISOString()
          },
          capabilities: [
            'multi_objective_optimization', 'constraint_satisfaction', 'resource_allocation',
            'dynamic_programming', 'game_theory_application'
          ],
          learningRate: 92.1,
          memoryUsage: 67.9,
          problemsSolved: 1894
        },
        {
          id: 'agi-learning-004',
          name: 'DARWIN (Dynamic Adaptive Reasoning and Wisdom Intelligence Network)',
          type: 'learning',
          intelligenceLevel: 265,
          processingPower: 38.9,
          status: 'learning',
          currentTask: {
            description: 'Meta-Learning aus globalen Bahn-Netzwerken für adaptive Strategien',
            complexity: 8,
            progress: 31,
            estimatedCompletion: new Date(Date.now() + 7200000).toISOString()
          },
          capabilities: [
            'meta_learning', 'transfer_learning', 'continual_learning',
            'few_shot_adaptation', 'knowledge_synthesis'
          ],
          learningRate: 97.3,
          memoryUsage: 34.2,
          problemsSolved: 892
        },
        {
          id: 'agi-creative-005',
          name: 'LEONARDO (Learning and Engineering Novel Approaches and Decisions for Operations)',
          type: 'creative',
          intelligenceLevel: 278,
          processingPower: 41.6,
          status: 'idle',
          currentTask: null,
          capabilities: [
            'creative_problem_solving', 'innovative_solutions', 'analogical_reasoning',
            'breakthrough_thinking', 'artistic_optimization'
          ],
          learningRate: 85.6,
          memoryUsage: 29.7,
          problemsSolved: 467
        }
      ]
      setAGIModules(mockAGIModules)

      const mockScenarios: ComplexScenario[] = [
        {
          id: 'scenario-multi-crisis-001',
          title: 'Mega-Krisenszenario: Sturm + Streik + Cyberangriff',
          description: 'Gleichzeitig auftretende Naturkatastrophe, Personalstreik und Cyberangriff auf kritische Infrastruktur',
          complexity: 10,
          type: 'multi_crisis',
          priority: 'critical',
          assignedAGI: ['agi-reasoning-001', 'agi-prediction-002', 'agi-optimization-003'],
          status: 'solving',
          solution: {
            approach: 'Multi-Stufen Krisenmanagement mit autonomer Ressourcenumverteilung',
            confidence: 87,
            implementationSteps: [
              'Sofortige Netzwerk-Segregation gegen Cyberangriff',
              'Dynamische Personalumverteilung zur Kompensation des Streiks',
              'Wetterbasierte Routenumleitung mit KI-Optimierung',
              'Passenger-Kommunikation mit emotionaler KI'
            ],
            expectedOutcome: '73% Betriebsaufrechterhaltung trotz Mega-Krise'
          },
          startTime: new Date(Date.now() - 5400000).toISOString()
        },
        {
          id: 'scenario-network-opt-002',
          title: 'Europäisches Hochgeschwindigkeits-Netzwerk Optimierung',
          description: 'Echtzeit-Optimierung des gesamten europäischen Bahn-Netzwerks für 50.000+ gleichzeitige Züge',
          complexity: 9,
          type: 'network_optimization',
          priority: 'high',
          assignedAGI: ['agi-optimization-003', 'agi-learning-004'],
          status: 'analyzing',
          solution: null,
          startTime: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 'scenario-passenger-flow-003',
          title: 'Olympische Spiele Passagierfluss-Management',
          description: 'Koordination von 15 Millionen zusätzlichen Passagieren während Olympischen Spielen',
          complexity: 8,
          type: 'passenger_flow',
          priority: 'high',
          assignedAGI: ['agi-prediction-002', 'agi-creative-005'],
          status: 'completed',
          solution: {
            approach: 'Adaptive Crowd-Dynamics mit kreativen Routing-Algorithmen',
            confidence: 94,
            implementationSteps: [
              'Predictive Passenger Flow Modeling',
              'Dynamic Capacity Allocation',
              'Creative Alternative Route Generation',
              'Real-time Sentiment-based Adjustments'
            ],
            expectedOutcome: '97% Passagierzufriedenheit bei 200% Kapazitätssteigerung'
          },
          startTime: new Date(Date.now() - 7200000).toISOString(),
          solutionTime: new Date(Date.now() - 3600000).toISOString()
        }
      ]
      setComplexScenarios(mockScenarios)
    }

    // Echtzeit-Metriken aktualisieren
    const interval = setInterval(() => {
      const activeModules = agiModules.filter(agi => 
        agi.status === 'active' || agi.status === 'reasoning' || agi.status === 'optimizing'
      ).length

      const totalIQ = agiModules.reduce((sum, agi) => sum + agi.intelligenceLevel, 0) / Math.max(agiModules.length, 1)
      const totalPower = agiModules.reduce((sum, agi) => sum + agi.processingPower, 0)
      const activeTasks = agiModules.filter(agi => agi.currentTask !== null).length
      const completedScenarios = complexScenarios.filter(s => s.status === 'completed').length

      setRealTimeData(prev => ({
        activeAGI: activeModules,
        currentIQ: totalIQ,
        processingPower: totalPower,
        activeTasks,
        solutionAccuracy: 85 + Math.random() * 15,
        emergencyResponseTime: 0.5 + Math.random() * 1.5
      }))

      // Simuliere AGI-Fortschritt
      setAGIModules(currentModules => 
        currentModules.map(module => {
          if (module.currentTask) {
            const newProgress = Math.min(100, module.currentTask.progress + Math.random() * 5)
            if (newProgress >= 100) {
              return {
                ...module,
                currentTask: null,
                status: 'idle' as const,
                problemsSolved: module.problemsSolved + 1
              }
            }
            return {
              ...module,
              currentTask: { ...module.currentTask, progress: newProgress }
            }
          }
          return module
        })
      )

    }, 3000)

    return () => clearInterval(interval)
  }, [agiModules, complexScenarios, setAGIModules, setComplexScenarios])

  const assignAGIToScenario = async (agiId: string, scenarioId: string) => {
    try {
      const agi = agiModules.find(a => a.id === agiId)
      const scenario = complexScenarios.find(s => s.id === scenarioId)
      
      if (!agi || !scenario) return

      setComplexScenarios(current => 
        current.map(s => 
          s.id === scenarioId 
            ? { 
                ...s, 
                assignedAGI: [...s.assignedAGI.filter(id => id !== agiId), agiId],
                status: 'analyzing' as const
              }
            : s
        )
      )

      setAGIModules(current => 
        current.map(a => 
          a.id === agiId 
            ? { 
                ...a, 
                status: 'reasoning' as const,
                currentTask: {
                  description: `Lösung für: ${scenario.title}`,
                  complexity: scenario.complexity,
                  progress: 0,
                  estimatedCompletion: new Date(Date.now() + scenario.complexity * 600000).toISOString()
                }
              }
            : a
        )
      )

      toast.success(`AGI ${agi.name} dem Szenario zugewiesen`, {
        description: `Beginnt Analyse von "${scenario.title}"`
      })

    } catch (error) {
      toast.error('Fehler bei der AGI-Zuweisung')
    }
  }

  const enhanceAGIIntelligence = async (agiId: string) => {
    try {
      const agi = agiModules.find(a => a.id === agiId)
      if (!agi) return

      setAGIModules(current => 
        current.map(a => 
          a.id === agiId 
            ? { 
                ...a, 
                status: 'learning' as const,
                intelligenceLevel: a.intelligenceLevel + Math.random() * 10,
                learningRate: Math.min(100, a.learningRate + Math.random() * 5)
              }
            : a
        )
      )

      toast.info(`${agi.name} Intelligenz wird erweitert...`, {
        description: 'Deep Learning Enhancement läuft'
      })

      setTimeout(() => {
        setAGIModules(current => 
          current.map(a => 
            a.id === agiId && a.status === 'learning'
              ? { ...a, status: 'active' as const }
              : a
          )
        )
        toast.success('AGI-Intelligenz erfolgreich erweitert')
      }, 4000)

    } catch (error) {
      toast.error('Fehler bei der AGI-Enhancement')
    }
  }

  const activateEmergencyAGI = async () => {
    try {
      // Alle AGI-Module für Notfall aktivieren
      setAGIModules(currentModules => 
        currentModules.map(module => ({
          ...module,
          status: 'active' as const,
          processingPower: module.processingPower * 1.5
        }))
      )

      // Kritisches Notfall-Szenario erstellen
      const emergencyScenario: ComplexScenario = {
        id: `emergency-${Date.now()}`,
        title: 'AGI-Notfall-Modus: Unbekannte Megakrise',
        description: 'Unvorhersehbare Kombination multipler kritischer Ereignisse erfordert sofortige AGI-Intervention',
        complexity: 10,
        type: 'emergency_coordination',
        priority: 'critical',
        assignedAGI: agiModules.map(a => a.id),
        status: 'analyzing',
        solution: null,
        startTime: new Date().toISOString()
      }

      setComplexScenarios(current => [emergencyScenario, ...current])

      toast.error('AGI-Notfall-Modus aktiviert', {
        description: 'Alle AGI-Module arbeiten mit höchster Priorität'
      })

    } catch (error) {
      toast.error('Fehler beim AGI-Notfall-Modus')
    }
  }

  const getAGITypeColor = (type: AGIModule['type']) => {
    switch (type) {
      case 'reasoning': return 'bg-blue-500'
      case 'prediction': return 'bg-green-500'
      case 'optimization': return 'bg-purple-500'
      case 'learning': return 'bg-orange-500'
      case 'communication': return 'bg-pink-500'
      case 'creative': return 'bg-yellow-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'reasoning': return 'text-blue-600'
      case 'optimizing': return 'text-purple-600'
      case 'learning': return 'text-orange-600'
      case 'idle': return 'text-gray-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AGI-Integration System</h1>
            <p className="text-muted-foreground">Allgemeine Künstliche Intelligenz für komplexeste Szenarien</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => toast.info('AGI-Netzwerk wird synchronisiert...')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Sparkle size={16} className="mr-2" />
            AGI Sync
          </Button>
          <Button 
            onClick={activateEmergencyAGI}
            variant="destructive"
          >
            <AlertTriangle size={16} className="mr-2" />
            Notfall-AGI
          </Button>
        </div>
      </div>

      {/* System-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aktive AGI-Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{realTimeData.activeAGI}</div>
            <p className="text-xs text-muted-foreground">Intelligente Agenten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Kollektiv-IQ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{realTimeData.currentIQ.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Übermensch-Level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Rechenleistung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{realTimeData.processingPower.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Petaflops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aktive Aufgaben</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{realTimeData.activeTasks}</div>
            <p className="text-xs text-muted-foreground">Parallel laufend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lösungsgenauigkeit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{realTimeData.solutionAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Erfolgsrate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notfall-Reaktion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{realTimeData.emergencyResponseTime.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Sekunden</p>
          </CardContent>
        </Card>
      </div>

      {/* AGI-Module & Komplexe Szenarien */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AGI-Module Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Robot size={20} />
              AGI-Module
            </CardTitle>
            <CardDescription>Spezialisierte Künstliche Allgemeine Intelligenzen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {agiModules.map((agi) => (
              <div key={agi.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getAGITypeColor(agi.type)}`}></div>
                    <div>
                      <h4 className="font-semibold">{agi.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {agi.type} • IQ {agi.intelligenceLevel} • 
                        <span className={`ml-1 font-medium ${getStatusColor(agi.status)}`}>
                          {agi.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Badge variant={agi.status === 'active' || agi.status === 'reasoning' ? "default" : "secondary"}>
                    {agi.problemsSolved} Probleme gelöst
                  </Badge>
                </div>

                {/* AGI-Metriken */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Intelligenz-Level</p>
                    <p className="font-bold text-blue-600">IQ {agi.intelligenceLevel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rechenleistung</p>
                    <p className="font-bold text-green-600">{agi.processingPower.toFixed(1)} PFLOPS</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lernrate</p>
                    <p className="font-bold text-purple-600">{agi.learningRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Speicher</p>
                    <p className="font-bold text-orange-600">{agi.memoryUsage.toFixed(1)} PB</p>
                  </div>
                </div>

                {/* Aktuelle Aufgabe */}
                {agi.currentTask && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Aktuelle Aufgabe</h5>
                    <div className="p-2 bg-secondary/50 rounded">
                      <p className="text-sm font-medium">{agi.currentTask.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="text-xs">
                          Komplexität: {agi.currentTask.complexity}/10
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {agi.currentTask.progress.toFixed(0)}% abgeschlossen
                        </span>
                      </div>
                      <Progress value={agi.currentTask.progress} className="h-1 mt-1" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Fertigstellung: {new Date(agi.currentTask.estimatedCompletion).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Fähigkeiten */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Kern-Fähigkeiten</h5>
                  <div className="flex flex-wrap gap-1">
                    {agi.capabilities.slice(0, 3).map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {capability.replace('_', ' ')}
                      </Badge>
                    ))}
                    {agi.capabilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{agi.capabilities.length - 3} weitere
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Aktionen */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => enhanceAGIIntelligence(agi.id)}
                    disabled={agi.status === 'learning'}
                  >
                    <TrendUp size={14} className="mr-1" />
                    Intelligenz +
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={agi.currentTask !== null}
                  >
                    <Target size={14} className="mr-1" />
                    Aufgabe Zuweisen
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Komplexe Szenarien */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network size={20} />
              Komplexe Szenarien
            </CardTitle>
            <CardDescription>Ultra-komplexe Problemstellungen für AGI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {complexScenarios.map((scenario) => (
              <div key={scenario.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{scenario.title}</h4>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={scenario.priority === 'critical' ? "destructive" : 
                                   scenario.priority === 'high' ? "default" : "secondary"}>
                      {scenario.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Komplexität: {scenario.complexity}/10
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status:</span>
                    <Badge variant={scenario.status === 'completed' ? "default" : 
                                   scenario.status === 'solving' ? "outline" : "secondary"}>
                      {scenario.status === 'analyzing' ? 'Analysiert' :
                       scenario.status === 'solving' ? 'Wird gelöst' :
                       scenario.status === 'implementing' ? 'Implementiert' :
                       scenario.status === 'completed' ? 'Abgeschlossen' : 'Fehlgeschlagen'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-muted-foreground">Zugewiesene AGI:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {scenario.assignedAGI.map((agiId) => {
                        const agi = agiModules.find(a => a.id === agiId)
                        return agi ? (
                          <Badge key={agiId} variant="outline" className="text-xs">
                            {agi.name.split(' ')[0]}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>

                {/* Lösungsdetails */}
                {scenario.solution && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">AGI-Lösung</h5>
                    <div className="p-2 bg-secondary/50 rounded">
                      <p className="text-sm font-medium">{scenario.solution.approach}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">Konfidenz:</span>
                        <Badge variant="outline" className="text-xs">
                          {scenario.solution.confidence}%
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Erwartetes Ergebnis:</p>
                        <p className="text-xs">{scenario.solution.expectedOutcome}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Gestartet:</p>
                    <p className="font-medium">
                      {new Date(scenario.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                  {scenario.solutionTime && (
                    <div>
                      <p className="text-muted-foreground">Gelöst in:</p>
                      <p className="font-medium">
                        {((new Date(scenario.solutionTime).getTime() - new Date(scenario.startTime).getTime()) / 60000).toFixed(1)} Min
                      </p>
                    </div>
                  )}
                </div>

                {scenario.status !== 'completed' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const availableAGI = agiModules.find(a => a.status === 'idle')
                        if (availableAGI) {
                          assignAGIToScenario(availableAGI.id, scenario.id)
                        } else {
                          toast.warning('Alle AGI-Module sind beschäftigt')
                        }
                      }}
                      className="w-full"
                    >
                      <FlowArrow size={14} className="mr-1" />
                      Mehr AGI Zuweisen
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AGI-System Konfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            AGI-System Konfiguration
          </CardTitle>
          <CardDescription>Einstellungen für Allgemeine Künstliche Intelligenz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Autonomie-Level</h4>
              <Badge variant="default" className="text-lg px-4 py-2">
                Ultra-Hoch
              </Badge>
              <p className="text-xs text-muted-foreground">
                Vollständig selbstständige Entscheidungen
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Ethik-Protokoll</h4>
              <Badge variant="default" className="text-lg px-4 py-2">
                Aktiv
              </Badge>
              <p className="text-xs text-muted-foreground">
                Integrierte ethische Richtlinien
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Lern-Modus</h4>
              <Badge variant="default" className="text-lg px-4 py-2">
                Kontinuierlich
              </Badge>
              <p className="text-xs text-muted-foreground">
                Permanent adaptives Lernen
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Sicherheits-Override</h4>
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Bereit
              </Badge>
              <p className="text-xs text-muted-foreground">
                Notfall-Abschaltung verfügbar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnungen */}
      {complexScenarios.filter(s => s.status === 'failed').length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle size={16} />
          <AlertDescription>
            {complexScenarios.filter(s => s.status === 'failed').length} komplexe Szenario{complexScenarios.filter(s => s.status === 'failed').length !== 1 ? 's' : ''} 
            konnten nicht gelöst werden. Manuelle Intervention oder zusätzliche AGI-Ressourcen erforderlich.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default AGIIntegrationSystem