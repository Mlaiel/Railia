/**
 * SmartRail-AI - Intelligente Domino-Effekt Vorhersage
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  GitBranch, 
  AlertTriangle,
  Clock,
  Target,
  Zap,
  Workflow,
  ArrowRight,
  Network,
  Activity,
  TrendingUp,
  Eye,
  Warning,
  CheckCircle,
  XCircle,
  Timer,
  Calculator,
  ChartLine
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DominoChain {
  id: string
  originTrain: string
  originDelay: number
  affectedTrains: Array<{
    trainId: string
    route: string
    predictedDelay: number
    probability: number
    cascadeLevel: number
    timeToImpact: number
  }>
  totalImpact: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  preventable: boolean
  timestamp: string
  preventionActions: string[]
}

interface CascadeMetrics {
  totalChainsDetected: number
  averageChainLength: number
  preventedCascades: number
  totalDelayMinutesSaved: number
  networkEfficiency: number
  predictionAccuracy: number
}

const DominoEffectPredictor = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedChain, setSelectedChain] = useState<string>('')
  
  const [dominoChains, setDominoChains] = useKV<DominoChain[]>('domino-chains', [
    {
      id: 'chain-1',
      originTrain: 'ICE 571',
      originDelay: 15,
      affectedTrains: [
        {
          trainId: 'ICE 1247',
          route: 'Frankfurt → Berlin',
          predictedDelay: 8,
          probability: 89.4,
          cascadeLevel: 1,
          timeToImpact: 12
        },
        {
          trainId: 'RE 3821',
          route: 'Frankfurt → Mannheim',
          predictedDelay: 5,
          probability: 72.3,
          cascadeLevel: 1,
          timeToImpact: 18
        },
        {
          trainId: 'IC 2045',
          route: 'Mannheim → Stuttgart',
          predictedDelay: 12,
          probability: 65.7,
          cascadeLevel: 2,
          timeToImpact: 35
        }
      ],
      totalImpact: 25,
      severity: 'high',
      preventable: true,
      timestamp: new Date().toISOString(),
      preventionActions: [
        'Gleis 7 für ICE 1247 freigeben',
        'RE 3821 auf alternative Route umleiten',
        'Fahrgäste über Alternativen informieren'
      ]
    },
    {
      id: 'chain-2',
      originTrain: 'RB 4234',
      originDelay: 8,
      affectedTrains: [
        {
          trainId: 'S7',
          route: 'München → Flughafen',
          predictedDelay: 4,
          probability: 78.9,
          cascadeLevel: 1,
          timeToImpact: 8
        }
      ],
      totalImpact: 4,
      severity: 'low',
      preventable: false,
      timestamp: new Date().toISOString(),
      preventionActions: []
    }
  ])

  const [cascadeMetrics, setCascadeMetrics] = useKV<CascadeMetrics>('cascade-metrics', {
    totalChainsDetected: 47,
    averageChainLength: 2.3,
    preventedCascades: 12,
    totalDelayMinutesSaved: 1847,
    networkEfficiency: 94.2,
    predictionAccuracy: 91.7
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const analyzeDominoEffects = async () => {
    setIsAnalyzing(true)
    
    try {
      const prompt = spark.llmPrompt`
        Analysiere Domino-Effekte im deutschen Bahnnetz:
        - Identifiziere Kaskadenverspätungen
        - Berechne Wahrscheinlichkeiten
        - Entwickle Präventionsstrategien
        - Optimiere Netzwerkfluss
        Berücksichtige: Gleisbelegung, Knotenbahnhöfe, Anschlussverbindungen
      `
      
      await spark.llm(prompt)
      
      // Simuliere neue Domino-Kette
      const trainIds = ['ICE 847', 'RE 2841', 'IC 1205', 'RB 3456', 'S3', 'S7']
      const routes = [
        'Hamburg → München', 
        'Berlin → Frankfurt', 
        'Köln → Dresden', 
        'Stuttgart → Bremen',
        'München Zentrum → Flughafen',
        'Frankfurt → Darmstadt'
      ]
      
      const newChain: DominoChain = {
        id: `chain-${Date.now()}`,
        originTrain: trainIds[Math.floor(Math.random() * trainIds.length)],
        originDelay: Math.floor(Math.random() * 20) + 5,
        affectedTrains: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, i) => ({
          trainId: trainIds[Math.floor(Math.random() * trainIds.length)],
          route: routes[Math.floor(Math.random() * routes.length)],
          predictedDelay: Math.floor(Math.random() * 15) + 2,
          probability: Math.round((Math.random() * 30 + 60) * 10) / 10,
          cascadeLevel: i + 1,
          timeToImpact: Math.floor(Math.random() * 30) + 5
        })),
        totalImpact: Math.floor(Math.random() * 40) + 10,
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        preventable: Math.random() > 0.3,
        timestamp: new Date().toISOString(),
        preventionActions: [
          'Alternative Gleise bereitstellen',
          'Umleitung organisieren',
          'Fahrgäste informieren',
          'Personal verstärken'
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      }
      
      setDominoChains(current => [newChain, ...current.slice(0, 4)])
      
      // Update metrics
      setCascadeMetrics(current => ({
        ...current,
        totalChainsDetected: current.totalChainsDetected + 1,
        averageChainLength: (current.averageChainLength + newChain.affectedTrains.length) / 2,
        predictionAccuracy: Math.min(99.9, current.predictionAccuracy + (Math.random() - 0.5))
      }))
      
      toast.success('Neue Domino-Kette erkannt', {
        description: `${newChain.originTrain} könnte ${newChain.affectedTrains.length} weitere Züge beeinträchtigen`
      })
      
    } catch (error) {
      toast.error('Fehler bei der Domino-Analyse')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const preventCascade = async (chainId: string) => {
    const chain = dominoChains.find(c => c.id === chainId)
    if (!chain) return

    try {
      const prompt = spark.llmPrompt`
        Implementiere Präventionsmaßnahmen für Domino-Effekt:
        Ursprungszug: ${chain.originTrain}
        Betroffene Züge: ${chain.affectedTrains.length}
        Maßnahmen: ${chain.preventionActions.join(', ')}
      `
      
      await spark.llm(prompt)
      
      // Markiere als verhindert
      setDominoChains(current => 
        current.filter(c => c.id !== chainId)
      )
      
      setCascadeMetrics(current => ({
        ...current,
        preventedCascades: current.preventedCascades + 1,
        totalDelayMinutesSaved: current.totalDelayMinutesSaved + chain.totalImpact,
        networkEfficiency: Math.min(99.9, current.networkEfficiency + 0.1)
      }))
      
      toast.success('Domino-Effekt verhindert', {
        description: `${chain.totalImpact} Verspätungsminuten eingespart`
      })
      
    } catch (error) {
      toast.error('Fehler bei der Prävention')
    }
  }

  // Auto-refresh alle 20 Sekunden
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnalyzing && Math.random() > 0.7) {
        analyzeDominoEffects()
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [isAnalyzing])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Domino-Effekt Prädiktor
          </h1>
          <p className="text-muted-foreground">
            KI-gestützte Erkennung und Prävention von Kaskadenverspätungen
          </p>
        </div>
        
        <Button 
          onClick={analyzeDominoEffects}
          disabled={isAnalyzing}
          className="bg-primary hover:bg-primary/90"
        >
          {isAnalyzing ? (
            <>
              <Workflow size={16} className="mr-2 animate-pulse" />
              Analysiere...
            </>
          ) : (
            <>
              <Workflow size={16} className="mr-2" />
              Kaskaden-Analyse
            </>
          )}
        </Button>
      </div>

      {/* Critical Alert */}
      {dominoChains.some(chain => chain.severity === 'critical') && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            Kritische Domino-Kette erkannt! Sofortige Intervention erforderlich.
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Kaskaden</p>
                <p className="text-2xl font-bold text-blue-600">{dominoChains.length}</p>
                <p className="text-xs text-muted-foreground">Ø {cascadeMetrics.averageChainLength} Züge</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <GitBranch size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verhindert heute</p>
                <p className="text-2xl font-bold text-green-600">{cascadeMetrics.preventedCascades}</p>
                <p className="text-xs text-muted-foreground">{cascadeMetrics.totalDelayMinutesSaved}min gespart</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Netzwerk-Effizienz</p>
                <p className="text-2xl font-bold text-purple-600">{cascadeMetrics.networkEfficiency.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Optimiert</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Network size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vorhersagegenauigkeit</p>
                <p className="text-2xl font-bold text-orange-600">{cascadeMetrics.predictionAccuracy.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">ML-Qualität</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Target size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Domino Chains */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Aktive Domino-Ketten</h2>
        
        {dominoChains.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-500 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">Keine aktiven Kaskaden</h3>
              <p className="text-muted-foreground">Das Netzwerk läuft optimal ohne Domino-Effekte.</p>
            </CardContent>
          </Card>
        ) : (
          dominoChains.map((chain) => (
            <Card key={chain.id} className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch size={20} className="text-primary" />
                      Kaskade von {chain.originTrain}
                    </CardTitle>
                    <CardDescription>
                      Ursprungsverspätung: {chain.originDelay} Minuten • {chain.affectedTrains.length} betroffene Züge
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(chain.severity)}>
                      {chain.severity === 'low' && 'Niedrig'}
                      {chain.severity === 'medium' && 'Mittel'}
                      {chain.severity === 'high' && 'Hoch'}
                      {chain.severity === 'critical' && 'Kritisch'}
                    </Badge>
                    {chain.preventable ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Verhinderbar
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-700">
                        Unvermeidbar
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Impact Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gesamtauswirkung</p>
                    <p className="text-lg font-bold text-red-600">{chain.totalImpact} min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Betroffene Züge</p>
                    <p className="text-lg font-bold text-blue-600">{chain.affectedTrains.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Max. Kaskadenlevel</p>
                    <p className="text-lg font-bold text-purple-600">
                      {Math.max(...chain.affectedTrains.map(t => t.cascadeLevel))}
                    </p>
                  </div>
                </div>

                {/* Affected Trains Flow */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Kaskaden-Verlauf</h4>
                  <div className="space-y-2">
                    {chain.affectedTrains.map((train, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-border">
                        <div className="flex items-center gap-2 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                            ${train.cascadeLevel === 1 ? 'bg-orange-100 text-orange-700' :
                              train.cascadeLevel === 2 ? 'bg-red-100 text-red-700' :
                              'bg-purple-100 text-purple-700'}`}>
                            L{train.cascadeLevel}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{train.trainId}</p>
                            <p className="text-xs text-muted-foreground">{train.route}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Verzögerung</p>
                            <p className="font-bold text-orange-600">+{train.predictedDelay}min</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Wahrscheinlichkeit</p>
                            <p className="font-bold text-blue-600">{train.probability}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Zeit bis Auswirkung</p>
                            <p className="font-bold text-purple-600">{train.timeToImpact}min</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prevention Actions */}
                {chain.preventable && chain.preventionActions.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground">Präventionsmaßnahmen</h4>
                    <div className="space-y-2">
                      {chain.preventionActions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => preventCascade(chain.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={14} className="mr-2" />
                        Kaskade verhindern
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedChain(chain.id)}
                      >
                        <Eye size={14} className="mr-2" />
                        Details anzeigen
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Timestamp */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                  <span>Erkannt: {new Date(chain.timestamp).toLocaleTimeString()}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Auto-Update aktiv</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default DominoEffectPredictor