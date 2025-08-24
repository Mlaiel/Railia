/**
 * SmartRail-AI - Passenger Flow Optimization mit Crowd Density Analytics
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Activity,
  Eye,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  UserX,
  Timer,
  Navigation,
  Target,
  Zap,
  TrendingDown as Stable,
  Brain,
  Calendar,
  CloudRain,
  Lightning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { usePassengerFlow } from '../hooks/usePassengerFlow'
import { usePredictiveAnalytics } from '../hooks/usePredictiveAnalytics'

const PassengerFlow = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('current')
  
  const {
    flowState,
    runFlowAnalysis,
    implementOptimization,
    removeOptimization,
    getStationRiskAnalysis,
    getPredictions,
    getNetworkHeatMap,
    criticalStationsCount,
    totalCapacityUtilization,
    isRealTimeActive
  } = usePassengerFlow()

  const {
    predictions,
    specialEvents,
    weatherImpact,
    impactAssessment,
    runPredictiveAnalysis,
    isAnalyzing: isPredictingAnalyzing,
    confidenceScore
  } = usePredictiveAnalytics()

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp size={14} className="text-orange-500" />
      case 'decreasing': return <TrendingDown size={14} className="text-green-500" />
      default: return <Stable size={14} className="text-blue-500" />
    }
  }

  const getFlowTrend = (station: any) => {
    const netFlow = station.flow.incoming - station.flow.outgoing
    if (netFlow > 5) return 'increasing'
    if (netFlow < -5) return 'decreasing'
    return 'stable'
  }

  const criticalStations = flowState.stations.filter(station => 
    station.capacity.utilization >= 85 || station.predictions.riskLevel === 'critical'
  )

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sport': return '⚽'
      case 'concert': return '🎵'
      case 'conference': return '🎓'
      case 'festival': return '🎪'
      case 'shopping': return '🛍️'
      default: return '📅'
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return '☀️'
      case 'cloudy': return '☁️'
      case 'rainy': return '🌧️'
      case 'stormy': return '⛈️'
      case 'snowy': return '❄️'
      default: return '🌤️'
    }
  }

  const upcomingEvents = specialEvents.filter(event => 
    new Date(event.startTime).getTime() > Date.now() && 
    new Date(event.startTime).getTime() < Date.now() + (24 * 60 * 60 * 1000)
  )

  const criticalPredictions = predictions.filter(pred => 
    pred.impact.level === 'high' || pred.impact.level === 'severe'
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Fahrgastfluss-Optimierung
          </h1>
          <p className="text-muted-foreground">
            KI-gestützte Crowd Density Analytics für optimalen Fahrgastfluss
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={isRealTimeActive ? "default" : "secondary"}
            className={isRealTimeActive ? "bg-green-50 text-green-700 border-green-200" : ""}
          >
            {isRealTimeActive ? 'Live-Überwachung aktiv' : 'Analysiere...'}
          </Badge>
          
          <Button 
            onClick={runFlowAnalysis}
            disabled={flowState.isAnalyzing}
            className="bg-primary hover:bg-primary/90"
          >
            {flowState.isAnalyzing ? (
              <>
                <Activity size={16} className="mr-2 animate-spin" />
                Analysiere...
              </>
            ) : (
              <>
                <BarChart3 size={16} className="mr-2" />
                Neue Analyse
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Predictive Alerts */}
      {criticalPredictions.length > 0 && (
        <Alert className="border-orange-500/50 bg-orange-500/5">
          <Brain className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 font-medium">
            KI-Vorhersage: {criticalPredictions.length} kritische Ereignisse in den nächsten 24h erwartet
            <div className="mt-2 space-y-1">
              {criticalPredictions.slice(0, 2).map((pred, index) => (
                <div key={index} className="text-sm">
                  • {pred.description} (+{pred.impact.passengerChange}% Fahrgäste)
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Critical Alerts */}
      {criticalStations.length > 0 && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            {criticalStations.length} Bahnhof{criticalStations.length !== 1 ? 'e' : ''} mit kritischer Überfüllung: {' '}
            {criticalStations.map(station => station.stationId).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Real-time Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Überwachte Bahnhöfe</p>
                <p className="text-2xl font-bold text-blue-600">{flowState.stations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Fahrgäste</p>
                <p className="text-2xl font-bold text-green-600">
                  {flowState.totalPassengers.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Durchschn. Auslastung</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(totalCapacityUtilization)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <BarChart3 size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">KI-Vorhersagen</p>
                <p className="text-2xl font-bold text-purple-600">{predictions.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Brain size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
          <TabsTrigger value="current">Aktueller Fluss</TabsTrigger>
          <TabsTrigger value="predictions">KI-Vorhersagen</TabsTrigger>
          <TabsTrigger value="events">Events & Wetter</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crowd Density Monitor */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye size={20} className="text-primary" />
                  Crowd Density Monitor
                </CardTitle>
                <CardDescription>Echtzeit-Überwachung der Fahrgastdichte</CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {flowState.stations.map((station) => {
              const trend = getFlowTrend(station)
              const riskAnalysis = getStationRiskAnalysis(station.stationId)
              const predictions = getPredictions(station.stationId)
              
              return (
                <div 
                  key={station.stationId}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedStation === station.stationId 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedStation(
                    selectedStation === station.stationId ? null : station.stationId
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{station.stationId}</h4>
                      <p className="text-sm text-muted-foreground">{station.platform}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(trend)}
                      <Badge className={getRiskColor(station.predictions.riskLevel)}>
                        {station.predictions.riskLevel === 'low' && 'Niedrig'}
                        {station.predictions.riskLevel === 'medium' && 'Mittel'}
                        {station.predictions.riskLevel === 'high' && 'Hoch'}
                        {station.predictions.riskLevel === 'critical' && 'Kritisch'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Auslastung</span>
                      <span className="font-medium">{Math.round(station.capacity.utilization)}%</span>
                    </div>
                    <Progress 
                      value={station.capacity.utilization} 
                      className="h-2"
                    />
                  </div>

                  {selectedStation === station.stationId && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-blue-500" />
                          <span className="text-muted-foreground">Wartende:</span>
                          <span className="font-medium">{station.capacity.current}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-purple-500" />
                          <span className="text-muted-foreground">Peak:</span>
                          <span className="font-medium">{station.predictions.nextPeak}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight size={14} className="text-green-500" />
                          <span className="text-muted-foreground">Einsteigen:</span>
                          <span className="font-medium">{station.flow.boarding}/min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowLeft size={14} className="text-orange-500" />
                          <span className="text-muted-foreground">Aussteigen:</span>
                          <span className="font-medium">{station.flow.alighting}/min</span>
                        </div>
                      </div>
                      
                      {riskAnalysis && riskAnalysis.recommendedActions.length > 0 && (
                        <div className="pt-2">
                          <p className="text-sm font-medium text-muted-foreground mb-2">Empfohlene Aktionen:</p>
                          <div className="space-y-1">
                            {riskAnalysis.recommendedActions.slice(0, 2).map((action, index) => (
                              <p key={index} className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded">
                                {action}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {predictions && (
                        <div className="pt-2">
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            KI-Vorhersage (Konfidenz: {predictions.confidenceLevel}%):
                          </p>
                          <p className="text-xs text-blue-700">
                            Erwartete Dichte: {Math.round(predictions.expectedDensity)}% um {predictions.nextPeakTime}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Flow Optimizations */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation size={20} className="text-primary" />
              Optimierungsmaßnahmen
            </CardTitle>
            <CardDescription>KI-generierte Vorschläge zur Flussoptimierung</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {flowState.optimizations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <p>Keine aktiven Optimierungen</p>
                <p className="text-sm">Starten Sie eine Analyse für neue Vorschläge</p>
              </div>
            ) : (
              flowState.optimizations.map((optimization) => (
                <div 
                  key={optimization.id}
                  className="p-4 rounded-lg border border-border space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={optimization.priority === 'critical' ? 'destructive' : 'outline'}
                          className={
                            optimization.priority === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            optimization.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-green-50 text-green-700 border-green-200'
                          }
                        >
                          {optimization.priority === 'critical' && 'Kritisch'}
                          {optimization.priority === 'high' && 'Hoch'}
                          {optimization.priority === 'medium' && 'Mittel'}
                          {optimization.priority === 'low' && 'Niedrig'}
                        </Badge>
                        
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {optimization.type === 'redistribute' && 'Umverteilung'}
                          {optimization.type === 'delay' && 'Verzögerung'}
                          {optimization.type === 'redirect' && 'Umleitung'}
                          {optimization.type === 'capacity_increase' && 'Kapazität↑'}
                          {optimization.type === 'emergency' && 'Notfall'}
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold text-foreground mb-1">
                        {optimization.description}
                      </h4>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        Betroffene Stationen: {optimization.targetStations.join(', ')}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Target size={12} className="text-green-600" />
                          <span className="text-green-600 font-medium">
                            {optimization.estimatedEffectiveness}% Effektivität
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer size={12} className="text-blue-600" />
                          <span className="text-blue-600">
                            {optimization.implementationTime}min Umsetzung
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => implementOptimization(optimization.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Implementieren
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeOptimization(optimization.id)}
                    >
                      <UserX size={14} className="mr-1" />
                      Ablehnen
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Predictive Timeline */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain size={20} className="text-primary" />
                      KI-Vorhersage Timeline
                    </CardTitle>
                    <CardDescription>Prädiktive Ereignisse der nächsten 24h</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {confidenceScore}% Konfidenz
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Keine KI-Vorhersagen verfügbar</p>
                    <Button
                      onClick={runPredictiveAnalysis}
                      disabled={isPredictingAnalyzing}
                      className="mt-4"
                      size="sm"
                    >
                      {isPredictingAnalyzing ? 'Analysiere...' : 'Vorhersage starten'}
                    </Button>
                  </div>
                ) : (
                  predictions.slice(0, 5).map((prediction) => (
                    <div 
                      key={prediction.id}
                      className="p-4 rounded-lg border border-border space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{prediction.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(prediction.predictedTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={prediction.impact.level === 'severe' || prediction.impact.level === 'high' ? 'destructive' : 'outline'}
                            className={
                              prediction.impact.level === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              prediction.impact.level === 'moderate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-green-50 text-green-700 border-green-200'
                            }
                          >
                            {prediction.impact.level === 'severe' && 'Schwer'}
                            {prediction.impact.level === 'high' && 'Hoch'}
                            {prediction.impact.level === 'moderate' && 'Moderat'}
                            {prediction.impact.level === 'low' && 'Niedrig'}
                            {prediction.impact.level === 'minimal' && 'Minimal'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Fahrgäste</p>
                          <p className="font-medium text-blue-600">
                            {prediction.impact.passengerChange > 0 ? '+' : ''}{prediction.impact.passengerChange}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pünktlichkeit</p>
                          <p className="font-medium text-orange-600">
                            {prediction.impact.punctualityChange > 0 ? '+' : ''}{prediction.impact.punctualityChange}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Konfidenz</p>
                          <p className="font-medium text-green-600">
                            {Math.round(prediction.confidence)}%
                          </p>
                        </div>
                      </div>

                      {prediction.recommendations && prediction.recommendations.length > 0 && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Top Empfehlung:</p>
                          <p className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                            {prediction.recommendations[0]}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Network Impact Assessment */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} className="text-primary" />
                  Netzwerk-Auswirkungen
                </CardTitle>
                <CardDescription>Gesamtnetzwerk-Vorhersage und Empfehlungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{Math.round(impactAssessment.predictedNetworkLoad)}%</p>
                    <p className="text-sm text-muted-foreground">Vorhergesagte Auslastung</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{impactAssessment.peakTime}</p>
                    <p className="text-sm text-muted-foreground">Peak-Zeit</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Netzwerk-Belastung</span>
                    <span className="font-medium">{Math.round(impactAssessment.predictedNetworkLoad)}%</span>
                  </div>
                  <Progress 
                    value={impactAssessment.predictedNetworkLoad} 
                    className="h-2"
                  />
                </div>

                {impactAssessment.criticalEvents.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Kritische Ereignisse heute:</h4>
                    {impactAssessment.criticalEvents.map((event, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{event.time}</p>
                          </div>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            +{event.expectedPassengerIncrease}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{event.mitigation}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={runPredictiveAnalysis}
                    disabled={isPredictingAnalyzing}
                    className="w-full"
                    size="sm"
                  >
                    {isPredictingAnalyzing ? (
                      <>
                        <Brain size={16} className="mr-2 animate-pulse" />
                        KI analysiert...
                      </>
                    ) : (
                      <>
                        <Brain size={16} className="mr-2" />
                        Vorhersagen aktualisieren
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Special Events Impact */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} className="text-primary" />
                  Kommende Events
                </CardTitle>
                <CardDescription>Großveranstaltungen und deren Fahrgastauswirkungen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Keine Events in den nächsten 24h</p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="p-4 rounded-lg border border-border space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getEventIcon(event.type)}</span>
                          <div>
                            <h4 className="font-semibold text-foreground">{event.name}</h4>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.startTime).toLocaleString()} • {event.attendees.toLocaleString()} Besucher
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={event.impact.level === 'severe' || event.impact.level === 'high' ? 'destructive' : 'outline'}
                          className={
                            event.impact.level === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            event.impact.level === 'moderate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-green-50 text-green-700 border-green-200'
                          }
                        >
                          +{event.impact.passengerIncrease}%
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Erwarteter Fahrgastanstieg</span>
                          <span className="font-medium">{event.impact.passengerIncrease}%</span>
                        </div>
                        <Progress value={event.impact.passengerIncrease} className="h-2" />
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-blue-500" />
                          <span>Peak: {event.peakTimes.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-green-500" />
                          <span>{event.affectedStations.length} Bahnhöfe</span>
                        </div>
                      </div>

                      {event.affectedStations.length > 0 && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Betroffene Bahnhöfe:</p>
                          <div className="flex flex-wrap gap-1">
                            {event.affectedStations.slice(0, 4).map((station, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {station}
                              </Badge>
                            ))}
                            {event.affectedStations.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{event.affectedStations.length - 4} weitere
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Weather Impact */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain size={20} className="text-primary" />
                  Wetter-Auswirkungen
                </CardTitle>
                <CardDescription>Meteorologische Einflüsse auf den Fahrgastfluss</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Aktuelles Wetter</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getWeatherIcon(weatherImpact.current.condition)}</span>
                      <span className="font-medium">{weatherImpact.current.temperature}°C</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Fahrgastverhalten</p>
                    <span className="font-medium text-orange-600">
                      {weatherImpact.passengerBehaviorChange > 0 ? '+' : ''}{weatherImpact.passengerBehaviorChange}%
                    </span>
                  </div>
                </div>

                {weatherImpact.alerts.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Aktive Wetterwarnungen:</h4>
                    {weatherImpact.alerts.slice(0, 3).map((alert) => (
                      <div 
                        key={alert.id}
                        className={`p-3 rounded-lg border ${
                          alert.severity === 'severe' ? 'border-red-200 bg-red-50' :
                          alert.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                          'border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{getWeatherIcon(alert.type)}</span>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{alert.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(alert.startTime).toLocaleString()} - 
                              {new Date(alert.endTime).toLocaleString()}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs">
                              <span>Fahrgäste: +{alert.passengerImpact}%</span>
                              <span>Pünktlichkeit: {alert.punctualityImpact}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {weatherImpact.forecast.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">3-Tage Vorhersage:</h4>
                    {weatherImpact.forecast.map((forecast, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getWeatherIcon(forecast.condition)}</span>
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(forecast.time).toLocaleDateString('de-DE', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">{forecast.condition}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{forecast.temperature}°C</p>
                          <p className="text-xs text-muted-foreground">
                            {forecast.passengerImpact > 0 ? '+' : ''}{forecast.passengerImpact}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Analytics Insights */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            KI-Analytics Erkenntnisse
          </CardTitle>
          <CardDescription>Automatisch generierte Fahrgastfluss-Erkenntnisse</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Aktuelle Trends</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <TrendingUp size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Erhöhte Aktivität erkannt</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(totalCapacityUtilization)}% durchschnittliche Auslastung - 
                    {totalCapacityUtilization > 70 ? ' über dem Normalwert' : ' im normalen Bereich'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Echtzeit-Monitoring aktiv</p>
                  <p className="text-xs text-muted-foreground">
                    {flowState.stations.length} Bahnhöfe werden kontinuierlich überwacht
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Vorhersagen & Empfehlungen</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <Timer size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Peak-Zeit Vorhersage</p>
                  <p className="text-xs text-muted-foreground">
                    Höchste Auslastung erwartet in den nächsten 30 Minuten
                  </p>
                </div>
              </div>
              
              {criticalStationsCount > 0 && (
                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                  <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Sofortige Aufmerksamkeit erforderlich</p>
                    <p className="text-xs text-muted-foreground">
                      {criticalStationsCount} Bahnhof{criticalStationsCount !== 1 ? 'e' : ''} mit kritischer Auslastung
                    </p>
                  </div>
                </div>
              )}
              
              {flowState.optimizations.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                  <Zap size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Optimierungen verfügbar</p>
                    <p className="text-xs text-muted-foreground">
                      {flowState.optimizations.length} KI-generierte Verbesserungsvorschläge bereit
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PassengerFlow