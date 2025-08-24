import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { 
  Brain, 
  Eye, 
  TreeStructure, 
  ChartBar, 
  FileText, 
  Clock, 
  Lightbulb,
  Warning,
  CheckCircle,
  Target,
  Activity,
  Gauge,
  Database,
  ArrowRight,
  TrendUp,
  Shield
} from '@phosphor-icons/react'

interface MLDecision {
  id: string
  timestamp: string
  module: string
  decisionType: string
  outcome: string
  confidence: number
  reasoning: string[]
  dataInputs: Record<string, any>
  alternativeOptions: Array<{
    option: string
    probability: number
    reasoning: string
  }>
  impactAssessment: {
    delayReduction: number
    safetyScore: number
    passengerImpact: number
  }
  explainabilityScore: number
}

interface FeatureImportance {
  feature: string
  importance: number
  description: string
  category: 'temporal' | 'environmental' | 'operational' | 'safety'
}

interface ModelInsight {
  modelName: string
  accuracy: number
  interpretability: number
  lastTraining: string
  dataQuality: number
  biasAssessment: {
    score: number
    issues: string[]
    mitigations: string[]
  }
}

const ExplainableAI: React.FC = () => {
  const [selectedDecision, setSelectedDecision] = useState<MLDecision | null>(null)
  const [selectedModel, setSelectedModel] = useState('tuer-intelligenz')
  const [viewMode, setViewMode] = useState<'decisions' | 'models' | 'insights'>('decisions')

  const [recentDecisions] = useKV<MLDecision[]>('explainable-ai-decisions', [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      module: 'Tür-Intelligenz',
      decisionType: 'Türschließung verzögern',
      outcome: 'Türen 3 Sekunden offen gehalten',
      confidence: 0.89,
      reasoning: [
        'Nahender Passagier in 8m Entfernung erkannt',
        'Geschätzte Ankunftszeit: 2.3 Sekunden',
        'Historische Daten zeigen 15% weniger Gesamtverspätung bei Warten',
        'Nächster Zug folgt in 4 Minuten (ausreichend Puffer)'
      ],
      dataInputs: {
        passengerDistance: 8.2,
        passengerSpeed: 1.4,
        currentDelay: 0,
        nextTrainInterval: 240,
        platformCrowding: 0.3,
        weatherConditions: 'normal'
      },
      alternativeOptions: [
        {
          option: 'Sofort schließen',
          probability: 0.11,
          reasoning: 'Würde zu 23% höherer Gesamtverspätung führen'
        }
      ],
      impactAssessment: {
        delayReduction: 45,
        safetyScore: 98,
        passengerImpact: 85
      },
      explainabilityScore: 92
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      module: 'Gleis-Überwachung',
      decisionType: 'Notfallbremsung initiiert',
      outcome: 'Automatische Bremsung bei Streckenkilometer 45.2',
      confidence: 0.97,
      reasoning: [
        'Objekt auf Gleis detektiert (Größe: 1.2m x 0.8m)',
        'KI-Klassifizierung: Umgestürzter Baum (97% Sicherheit)',
        'Sichtweite: 420m, Bremsweg: 380m',
        'Kollisionsvermeidung priorisiert'
      ],
      dataInputs: {
        objectSize: '1.2x0.8m',
        objectType: 'vegetation',
        trainSpeed: 85,
        visibility: 420,
        brakingDistance: 380,
        passengerCount: 156
      },
      alternativeOptions: [
        {
          option: 'Langsamfahrt mit visueller Prüfung',
          probability: 0.03,
          reasoning: 'Zu hohes Kollisionsrisiko bei unklarer Objektnatur'
        }
      ],
      impactAssessment: {
        delayReduction: -180,
        safetyScore: 100,
        passengerImpact: 75
      },
      explainabilityScore: 96
    }
  ])

  const [featureImportance] = useKV<FeatureImportance[]>('feature-importance', [
    { feature: 'Passagier-Entfernung', importance: 0.34, description: 'Distanz zum nächsten Passagier', category: 'operational' },
    { feature: 'Historische Verspätungsdaten', importance: 0.28, description: 'Vergangene Verspätungspattern', category: 'temporal' },
    { feature: 'Nächster Zug-Intervall', importance: 0.18, description: 'Zeit bis zum nächsten Zug', category: 'operational' },
    { feature: 'Wetterbedingungen', importance: 0.12, description: 'Aktuelle Wetterlage', category: 'environmental' },
    { feature: 'Bahnsteig-Auslastung', importance: 0.08, description: 'Anzahl wartender Passagiere', category: 'operational' }
  ])

  const [modelInsights] = useKV<ModelInsight[]>('model-insights', [
    {
      modelName: 'Tür-Intelligenz Neural Network',
      accuracy: 0.92,
      interpretability: 0.85,
      lastTraining: '2024-01-15T08:00:00Z',
      dataQuality: 0.94,
      biasAssessment: {
        score: 0.88,
        issues: ['Unterrepräsentation von Rollstuhlfahrern in Trainingsdaten'],
        mitigations: ['Erweiterte Datensammlung geplant', 'Bias-Korrektur-Algorithmus implementiert']
      }
    },
    {
      modelName: 'Gleis-Überwachung CNN',
      accuracy: 0.96,
      interpretability: 0.78,
      lastTraining: '2024-01-20T14:30:00Z',
      dataQuality: 0.91,
      biasAssessment: {
        score: 0.92,
        issues: ['Weniger Trainingsdaten für Nachtstunden'],
        mitigations: ['Infrarot-Kamera-Integration', 'Synthetische Nachtszenarien generiert']
      }
    }
  ])

  const [aiTransparencyMetrics] = useKV('ai-transparency-metrics', {
    totalDecisions: 15847,
    explainedDecisions: 14203,
    avgConfidence: 0.87,
    humanOverrides: 23,
    auditTrail: 100
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'temporal': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'environmental': return 'bg-green-100 text-green-700 border-green-200'
      case 'operational': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'safety': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const explainDecision = async (decision: MLDecision) => {
    const prompt = spark.llmPrompt`
      Erkläre diese KI-Entscheidung im SmartRail-AI System verständlich für Bahnpersonal:
      
      Modul: ${decision.module}
      Entscheidung: ${decision.decisionType}
      Ergebnis: ${decision.outcome}
      Vertrauen: ${decision.confidence}
      
      Begründung: ${decision.reasoning.join(', ')}
      
      Erstelle eine klare, nicht-technische Erklärung warum diese Entscheidung getroffen wurde.
    `
    
    try {
      const explanation = await spark.llm(prompt)
      toast.success('KI-Erklärung generiert', {
        description: explanation.substring(0, 100) + '...'
      })
      return explanation
    } catch (error) {
      toast.error('Fehler bei KI-Erklärung')
      return 'Erklärung konnte nicht generiert werden'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Explainable AI</h2>
          <p className="text-muted-foreground">Transparente ML-Entscheidungen und Algorithmus-Erklärungen</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Ansicht wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="decisions">Entscheidungen</SelectItem>
              <SelectItem value="models">Modell-Insights</SelectItem>
              <SelectItem value="insights">KI-Transparenz</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transparency Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aiTransparencyMetrics.explainedDecisions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Erklärte Entscheidungen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Gauge size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(aiTransparencyMetrics.avgConfidence * 100)}%</p>
                <p className="text-sm text-muted-foreground">Ø Vertrauen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aiTransparencyMetrics.auditTrail}%</p>
                <p className="text-sm text-muted-foreground">Audit-Abdeckung</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Warning size={16} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aiTransparencyMetrics.humanOverrides}</p>
                <p className="text-sm text-muted-foreground">Manuelle Eingriffe</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="decisions">KI-Entscheidungen</TabsTrigger>
          <TabsTrigger value="models">Modell-Analyse</TabsTrigger>
          <TabsTrigger value="insights">Transparenz-Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="decisions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Decisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={20} />
                  Aktuelle KI-Entscheidungen
                </CardTitle>
                <CardDescription>
                  Transparente Übersicht aller automatisierten Entscheidungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {recentDecisions.map((decision) => (
                      <div
                        key={decision.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedDecision?.id === decision.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedDecision(decision)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {decision.module}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(decision.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <h4 className="font-medium">{decision.decisionType}</h4>
                            <p className="text-sm text-muted-foreground">{decision.outcome}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className={`text-sm font-medium ${getConfidenceColor(decision.confidence)}`}>
                              {Math.round(decision.confidence * 100)}%
                            </div>
                            <Badge 
                              variant={decision.explainabilityScore >= 90 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              XAI: {decision.explainabilityScore}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Decision Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  Entscheidungs-Details
                </CardTitle>
                <CardDescription>
                  Detaillierte Erklärung der ausgewählten KI-Entscheidung
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDecision ? (
                  <div className="space-y-6">
                    {/* Decision Overview */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{selectedDecision.decisionType}</h4>
                        <Badge variant="outline">
                          {selectedDecision.module}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedDecision.outcome}
                      </p>
                    </div>

                    {/* Reasoning Chain */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Begründungskette:</h5>
                      <div className="space-y-2">
                        {selectedDecision.reasoning.map((reason, index) => (
                          <div key={index} className="flex items-start gap-3 text-sm">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                              {index + 1}
                            </div>
                            <p className="flex-1">{reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact Assessment */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Auswirkungsanalyse:</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {selectedDecision.impactAssessment.delayReduction > 0 ? '+' : ''}
                            {selectedDecision.impactAssessment.delayReduction}s
                          </div>
                          <div className="text-xs text-muted-foreground">Verspätung</div>
                        </div>
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {selectedDecision.impactAssessment.safetyScore}%
                          </div>
                          <div className="text-xs text-muted-foreground">Sicherheit</div>
                        </div>
                        <div className="text-center p-3 bg-secondary/30 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {selectedDecision.impactAssessment.passengerImpact}%
                          </div>
                          <div className="text-xs text-muted-foreground">Fahrgast</div>
                        </div>
                      </div>
                    </div>

                    {/* Alternative Options */}
                    {selectedDecision.alternativeOptions.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-sm">Alternative Optionen:</h5>
                        <div className="space-y-2">
                          {selectedDecision.alternativeOptions.map((option, index) => (
                            <div key={index} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{option.option}</span>
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(option.probability * 100)}%
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{option.reasoning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={() => explainDecision(selectedDecision)}
                      className="w-full"
                      variant="outline"
                    >
                      <Lightbulb size={16} className="mr-2" />
                      KI-Erklärung generieren
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Wählen Sie eine Entscheidung aus der Liste zur detaillierten Analyse
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar size={20} />
                  Modell-Performance
                </CardTitle>
                <CardDescription>
                  Leistungsmetriken und Interpretierbarkeit der KI-Modelle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {modelInsights.map((model, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{model.modelName}</h4>
                      <Badge variant="outline" className="text-xs">
                        Aktualisiert: {new Date(model.lastTraining).toLocaleDateString()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Genauigkeit</span>
                          <span className="text-sm font-medium">{Math.round(model.accuracy * 100)}%</span>
                        </div>
                        <Progress value={model.accuracy * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Interpretierbarkeit</span>
                          <span className="text-sm font-medium">{Math.round(model.interpretability * 100)}%</span>
                        </div>
                        <Progress value={model.interpretability * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Datenqualität</span>
                          <span className="text-sm font-medium">{Math.round(model.dataQuality * 100)}%</span>
                        </div>
                        <Progress value={model.dataQuality * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Bias-Score</span>
                          <span className="text-sm font-medium">{Math.round(model.biasAssessment.score * 100)}%</span>
                        </div>
                        <Progress value={model.biasAssessment.score * 100} className="h-2" />
                      </div>
                    </div>

                    {model.biasAssessment.issues.length > 0 && (
                      <Alert>
                        <Warning size={16} />
                        <AlertDescription className="text-sm">
                          <strong>Identifizierte Bias-Probleme:</strong>
                          <ul className="mt-1 list-disc list-inside space-y-1">
                            {model.biasAssessment.issues.map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Feature Importance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreeStructure size={20} />
                  Feature-Wichtigkeit
                </CardTitle>
                <CardDescription>
                  Einfluss verschiedener Faktoren auf KI-Entscheidungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featureImportance.map((feature, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{feature.feature}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCategoryColor(feature.category)}`}
                          >
                            {feature.category}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{Math.round(feature.importance * 100)}%</span>
                      </div>
                      <Progress value={feature.importance * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Transparency Score */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  KI-Transparenz-Dashboard
                </CardTitle>
                <CardDescription>
                  Gesamtbewertung der Algorithmus-Transparenz und Nachvollziehbarkeit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Transparenz-Score</h4>
                    <div className="text-4xl font-bold text-primary">89%</div>
                    <Progress value={89} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Sehr gut - Alle kritischen Entscheidungen sind nachvollziehbar
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Audit-Bereitschaft</h4>
                    <div className="text-4xl font-bold text-green-600">94%</div>
                    <Progress value={94} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Ausgezeichnet - Vollständige Dokumentation verfügbar
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Verbesserungsempfehlungen</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Lightbulb size={16} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Erweiterte Feature-Erklärungen</p>
                        <p className="text-xs text-muted-foreground">
                          Implementierung von SHAP-Werten für detailliertere Feature-Analysen
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <TrendUp size={16} className="text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Echtzeitverständlichkeit</p>
                        <p className="text-xs text-muted-foreground">
                          Benutzerfreundlichere Erklärungen für Bahnpersonal ohne KI-Kenntnisse
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Schnellaktionen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText size={16} className="mr-2" />
                  Transparenz-Bericht
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Database size={16} className="mr-2" />
                  Audit-Log exportieren
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Brain size={16} className="mr-2" />
                  Modell-Dokumentation
                </Button>
                
                <Button className="w-full justify-start" variant="outline">
                  <Shield size={16} className="mr-2" />
                  Bias-Analyse starten
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ExplainableAI