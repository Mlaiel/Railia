/**
 * SmartRail-AI - Predictive Analytics für Events und Wetter
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Train, 
  Users, 
  Calendar, 
  Target, 
  Brain, 
  Eye, 
  MapPin, 
  Clock,
  ThermometerSimple,
  CloudRain,
  Warning,
  CheckCircle,
  XCircle,
  TrendUp,
  Camera,
  Cpu,
  Network,
  WifiHigh,
  Lightning,
  CaretRight,
  ChartBar,
  Activity,
  Heart,
  ShieldCheck,
  CircleDashed,
  CaretDown,
  CaretUp,
  Sun,
  Snowflake,
  Wind,
  MusicNotes,
  Student,
  Ticket,
  ShoppingBag
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { usePredictiveAnalytics } from '../hooks/usePredictiveAnalytics'

const PredictiveAnalytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [activeFilter, setActiveFilter] = useState('all')
  
  const {
    predictions,
    weatherImpact,
    specialEvents,
    impactAssessment,
    runPredictiveAnalysis,
    isAnalyzing,
    confidenceScore,
    lastUpdate
  } = usePredictiveAnalytics()

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'text-green-600 bg-green-50 border-green-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'severe': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun size={16} className="text-yellow-500" />
      case 'cloudy': return <CloudRain size={16} className="text-gray-500" />
      case 'rainy': return <CloudRain size={16} className="text-blue-500" />
      case 'stormy': return <Lightning size={16} className="text-purple-500" />
      case 'snowy': return <Snowflake size={16} className="text-blue-300" />
      case 'windy': return <Wind size={16} className="text-gray-600" />
      default: return <ThermometerSimple size={16} className="text-orange-500" />
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sport': return <CircleDashed size={16} className="text-green-600" />
      case 'concert': return <MusicNotes size={16} className="text-purple-600" />
      case 'conference': return <Student size={16} className="text-blue-600" />
      case 'festival': return <Ticket size={16} className="text-orange-600" />
      case 'shopping': return <ShoppingBag size={16} className="text-pink-600" />
      default: return <Calendar size={16} className="text-gray-600" />
    }
  }

  const filteredPredictions = predictions.filter(prediction => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'events') return prediction.type === 'event'
    if (activeFilter === 'weather') return prediction.type === 'weather'
    return prediction.impact.level === activeFilter
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Prädiktive Analytik
          </h1>
          <p className="text-muted-foreground">
            KI-Vorhersagen für Events und Wetter-Auswirkungen
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {confidenceScore}% Vertrauen
          </Badge>
          
          <Button 
            onClick={runPredictiveAnalysis}
            disabled={isAnalyzing}
            className="bg-primary hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <Brain size={16} className="mr-2 animate-pulse" />
                Analysiere...
              </>
            ) : (
              <>
                <Brain size={16} className="mr-2" />
                Vorhersage aktualisieren
              </>
            )}
          </Button>
        </div>
      </div>

      {/* High-impact alerts */}
      {impactAssessment.criticalEvents.length > 0 && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <Warning className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            {impactAssessment.criticalEvents.length} kritische Ereignisse in den nächsten 24h erwartet:
            <div className="mt-2 space-y-1">
              {impactAssessment.criticalEvents.map((event, index) => (
                <div key={index} className="text-sm">
                  • {event.name} - {event.expectedPassengerIncrease}% mehr Fahrgäste
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Vorhersagen</p>
                <p className="text-2xl font-bold text-blue-600">{predictions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kommende Events</p>
                <p className="text-2xl font-bold text-purple-600">{specialEvents.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wetter-Warnungen</p>
                <p className="text-2xl font-bold text-orange-600">
                  {weatherImpact.alerts.filter(a => a.severity === 'high' || a.severity === 'severe').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CloudRain size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Netzwerk-Auslastung</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(impactAssessment.predictedNetworkLoad)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTimeRange} onValueChange={setSelectedTimeRange} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="6h">6h</TabsTrigger>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7 Tage</TabsTrigger>
            <TabsTrigger value="30d">30 Tage</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 flex-wrap">
            {['all', 'events', 'weather', 'high', 'severe'].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="capitalize"
              >
                {filter === 'all' && 'Alle'}
                {filter === 'events' && 'Events'}
                {filter === 'weather' && 'Wetter'}
                {filter === 'high' && 'Hoch'}
                {filter === 'severe' && 'Schwer'}
              </Button>
            ))}
          </div>
        </div>

        <TabsContent value={selectedTimeRange} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Impact Predictions */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} className="text-primary" />
                  Event-Auswirkungen
                </CardTitle>
                <CardDescription>
                  Vorhersagen für Großveranstaltungen und deren Fahrgastauswirkungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {specialEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Keine Events in diesem Zeitraum</p>
                  </div>
                ) : (
                  specialEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="p-4 rounded-lg border border-border space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{event.name}</h4>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.startTime).toLocaleDateString()} • {event.attendees.toLocaleString()} Besucher
                            </p>
                          </div>
                        </div>
                        <Badge className={getImpactColor(event.impact.level)}>
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
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Betroffene Bahnhöfe:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {event.affectedStations.map((station, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {station}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Weather Impact Analysis */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain size={20} className="text-primary" />
                  Wetter-Auswirkungen
                </CardTitle>
                <CardDescription>
                  Meteorologische Vorhersagen und Fahrgastverhalten
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Aktuelles Wetter</p>
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(weatherImpact.current.condition)}
                      <span className="font-medium">{weatherImpact.current.temperature}°C</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Fahrgasteinfluss</p>
                    <span className="font-medium text-orange-600">
                      {weatherImpact.passengerBehaviorChange > 0 ? '+' : ''}{weatherImpact.passengerBehaviorChange}%
                    </span>
                  </div>
                </div>

                {weatherImpact.alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.severity === 'severe' ? 'border-red-200 bg-red-50' :
                      alert.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                      'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getWeatherIcon(alert.type)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.startTime).toLocaleString()} - 
                          {new Date(alert.endTime).toLocaleString()}
                        </p>
                      </div>
                      <Badge 
                        variant={alert.severity === 'severe' ? 'destructive' : 'outline'}
                        className="text-xs capitalize"
                      >
                        {alert.severity === 'severe' && 'Schwer'}
                        {alert.severity === 'high' && 'Hoch'}
                        {alert.severity === 'moderate' && 'Mittel'}
                        {alert.severity === 'low' && 'Niedrig'}
                      </Badge>
                    </div>
                    
                    {alert.affectedStations && alert.affectedStations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Betroffene Stationen:</p>
                        <div className="flex flex-wrap gap-1">
                          {alert.affectedStations.map((station, index) => (
                            <span key={index} className="text-xs bg-white px-2 py-0.5 rounded">
                              {station}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {weatherImpact.forecast.map((forecast, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(forecast.condition)}
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(forecast.time).toLocaleDateString('de-DE', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">{forecast.condition}</p>
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
              </CardContent>
            </Card>
          </div>

          {/* AI Predictions Timeline */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar size={20} className="text-primary" />
                KI-Vorhersage Timeline
              </CardTitle>
              <CardDescription>
                Chronologische Auflistung aller prädiktiven Ereignisse
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPredictions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Keine Vorhersagen für die gewählten Filter</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredPredictions.map((prediction) => (
                    <div 
                      key={prediction.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {prediction.type === 'event' ? (
                          <Calendar size={16} className="text-primary" />
                        ) : (
                          <CloudRain size={16} className="text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{prediction.description}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(prediction.predictedTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getImpactColor(prediction.impact.level)}>
                              {prediction.impact.level === 'minimal' && 'Minimal'}
                              {prediction.impact.level === 'low' && 'Niedrig'}
                              {prediction.impact.level === 'moderate' && 'Moderat'}
                              {prediction.impact.level === 'high' && 'Hoch'}
                              {prediction.impact.level === 'severe' && 'Schwer'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(prediction.confidence)}% sicher
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
                            <p className="text-muted-foreground">Kapazität</p>
                            <p className="font-medium text-green-600">
                              {Math.round(prediction.impact.capacityUtilization)}%
                            </p>
                          </div>
                        </div>

                        {prediction.recommendations && prediction.recommendations.length > 0 && (
                          <div className="pt-2 border-t border-border">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Empfehlungen:</p>
                            <div className="space-y-1">
                              {prediction.recommendations.slice(0, 2).map((rec, index) => (
                                <p key={index} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                                  {rec}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights Summary */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={20} className="text-primary" />
            KI-Erkenntnisse Zusammenfassung
          </CardTitle>
          <CardDescription>
            Automatisch generierte Einblicke und Handlungsempfehlungen
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Wichtigste Vorhersagen</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <TrendUp size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Peak-Zeit Vorhersage</p>
                  <p className="text-xs text-muted-foreground">
                    Höchste Netzwerkauslastung um {impactAssessment.peakTime} erwartet
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <Warning size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Kritische Zeitfenster</p>
                  <p className="text-xs text-muted-foreground">
                    {impactAssessment.criticalEvents.length} Events mit hoher Auswirkung identifiziert
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <Target size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Vorhersagegenauigkeit</p>
                  <p className="text-xs text-muted-foreground">
                    {confidenceScore}% durchschnittliche Konfidenz basierend auf historischen Daten
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Empfohlene Maßnahmen</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <Lightning size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Kapazitätsplanung</p>
                    <p className="text-xs text-muted-foreground">
                      Zusätzliche Züge für Events mit {'>'}2000 Besuchern einplanen
                    </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <Activity size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Personal-Deployment</p>
                  <p className="text-xs text-muted-foreground">
                    Verstärkung in Hauptbahnhöfen 30min vor Event-Ende
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                <Users size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Fahrgast-Information</p>
                  <p className="text-xs text-muted-foreground">
                    Vorzeitige Warnungen bei Wetter-bedingten Verzögerungen senden
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PredictiveAnalytics