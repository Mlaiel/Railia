import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useWeatherMissions } from '../services/weatherMissionService'
import { 
  CloudRain, 
  Lightning, 
  Wind,
  ThermometerSimple,
  Activity,
  AlertTriangle,
  MapPin,
  Clock,
  Target,
  Brain,
  Shield,
  ArrowClockwise,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Gauge,
  Users,
  Drone,
  Route,
  Calendar,
  TrendUp,
  Eye,
  Satellite
} from '@phosphor-icons/react'

export default function WeatherMissionCoordination() {
  const {
    weatherData,
    activeMissions,
    updateWeatherForLocation,
    initializeService,
    getPredictedImpacts,
    getOptimizationRecommendations
  } = useWeatherMissions()

  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [missionFilter, setMissionFilter] = useState<'all' | 'active' | 'critical'>('all')

  useEffect(() => {
    // Initialize the service on component mount
    initializeService()
  }, [])

  const handleWeatherUpdate = async (location?: string) => {
    setIsUpdating(true)
    
    try {
      if (location) {
        await updateWeatherForLocation(location)
        toast.success(`Wetterdaten für ${location} aktualisiert`)
      } else {
        // Update all locations
        const locations = weatherData.map(w => w.location)
        for (const loc of locations) {
          await updateWeatherForLocation(loc)
        }
        toast.success('Alle Wetterdaten aktualisiert')
      }
    } catch (error) {
      toast.error('Fehler beim Aktualisieren der Wetterdaten')
    } finally {
      setIsUpdating(false)
    }
  }

  const getWeatherIcon = (condition: string, size: number = 20) => {
    const iconProps = { size, className: getWeatherIconColor(condition) }
    
    switch (condition) {
      case 'clear': return <ThermometerSimple {...iconProps} />
      case 'cloudy': return <CloudRain {...iconProps} />
      case 'rain': return <CloudRain {...iconProps} />
      case 'storm': return <Lightning {...iconProps} />
      case 'snow': return <CloudRain {...iconProps} />
      case 'fog': return <Eye {...iconProps} />
      default: return <ThermometerSimple {...iconProps} />
    }
  }

  const getWeatherIconColor = (condition: string) => {
    switch (condition) {
      case 'clear': return 'text-yellow-500'
      case 'cloudy': return 'text-gray-500'
      case 'rain': return 'text-blue-500'
      case 'storm': return 'text-purple-600'
      case 'snow': return 'text-blue-300'
      case 'fog': return 'text-gray-400'
      default: return 'text-gray-500'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'extreme': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMissionTypeColor = (type: string) => {
    switch (type) {
      case 'speed_limit': return 'text-orange-600'
      case 'route_change': return 'text-blue-600'
      case 'service_suspension': return 'text-red-600'
      case 'resource_deployment': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const filteredMissions = activeMissions.filter(mission => {
    if (missionFilter === 'all') return true
    if (missionFilter === 'active') return mission.implementation === 'automatic' && mission.executedAt
    if (missionFilter === 'critical') return mission.priority === 'critical' || mission.priority === 'high'
    return true
  })

  const criticalWeatherConditions = weatherData.filter(w => 
    w.current.windSpeed > 45 || 
    w.current.precipitation > 8 || 
    w.current.condition === 'storm' ||
    w.current.visibility < 3
  )

  const predictedImpacts = getPredictedImpacts(12) // Next 12 hours
  const optimizationRecommendations = getOptimizationRecommendations()

  return (
    <div className="space-y-6">
      {/* Critical Weather Alert */}
      {criticalWeatherConditions.length > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <Lightning className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            KRITISCHE WETTERBEDINGUNGEN: {criticalWeatherConditions.length} Standorte mit extremen Bedingungen - 
            Automatische Missionsanpassungen sind aktiv
          </AlertDescription>
        </Alert>
      )}

      {/* System Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Satellite size={20} className="text-blue-600" />
              <div>
                <p className="text-xl font-bold">{weatherData.length}</p>
                <p className="text-xs text-muted-foreground">Wetterstationen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity size={20} className="text-green-600" />
              <div>
                <p className="text-xl font-bold">{activeMissions.length}</p>
                <p className="text-xs text-muted-foreground">Aktive Missionen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={20} className="text-orange-600" />
              <div>
                <p className="text-xl font-bold">{criticalWeatherConditions.length}</p>
                <p className="text-xs text-muted-foreground">Kritische Bereiche</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain size={20} className="text-purple-600" />
              <div>
                <p className="text-xl font-bold">{predictedImpacts.length}</p>
                <p className="text-xs text-muted-foreground">Vorhersagen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendUp size={20} className="text-indigo-600" />
              <div>
                <p className="text-xl font-bold">{optimizationRecommendations.length}</p>
                <p className="text-xs text-muted-foreground">Optimierungen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coordination" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="coordination">Mission Control</TabsTrigger>
          <TabsTrigger value="weather">Wetter-Matrix</TabsTrigger>
          <TabsTrigger value="predictions">KI-Vorhersagen</TabsTrigger>
          <TabsTrigger value="optimization">Optimierung</TabsTrigger>
        </TabsList>

        <TabsContent value="coordination" className="space-y-6">
          {/* Mission Coordination Dashboard */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Echtzeit-Missionskoordination</CardTitle>
                  <CardDescription>Zentrale Steuerung wetterbasierter Missionsanpassungen</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={missionFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMissionFilter('all')}
                    >
                      Alle
                    </Button>
                    <Button
                      variant={missionFilter === 'active' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMissionFilter('active')}
                    >
                      Aktiv
                    </Button>
                    <Button
                      variant={missionFilter === 'critical' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMissionFilter('critical')}
                    >
                      Kritisch
                    </Button>
                  </div>
                  <Button 
                    onClick={() => handleWeatherUpdate()} 
                    disabled={isUpdating}
                    size="sm"
                    className="gap-2"
                  >
                    {isUpdating ? (
                      <ArrowClockwise size={16} className="animate-spin" />
                    ) : (
                      <ArrowClockwise size={16} />
                    )}
                    Update
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMissions.map(mission => (
                  <div key={mission.id} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${getMissionTypeColor(mission.type)}`}>
                          {mission.type === 'speed_limit' && <Gauge size={16} />}
                          {mission.type === 'route_change' && <Route size={16} />}
                          {mission.type === 'service_suspension' && <Pause size={16} />}
                          {mission.type === 'resource_deployment' && <Drone size={16} />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{mission.description}</h4>
                          <p className="text-sm text-muted-foreground">{mission.triggeredBy}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(mission.priority)}>
                          {mission.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {mission.implementation === 'automatic' ? 'AUTO' : 'MANUELL'}
                        </Badge>
                        {mission.executedAt && (
                          <CheckCircle size={16} className="text-green-600" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Verspätung</p>
                        <p className="font-medium">{mission.estimatedDelay} min</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Kosten-Impact</p>
                        <p className="font-medium">€{mission.costImpact.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium">
                          {mission.executedAt ? 'Ausgeführt' : 'Ausstehend'}
                        </p>
                      </div>
                    </div>

                    {mission.executedAt && (
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        Ausgeführt: {new Date(mission.executedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}

                {filteredMissions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Keine Missionen für den gewählten Filter</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="space-y-6">
          {/* Weather Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Wetter-Überwachungsmatrix</CardTitle>
              <CardDescription>Echtzeit-Wetterdaten aller überwachten Standorte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {weatherData.map((weather, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${
                    criticalWeatherConditions.includes(weather) ? 'border-red-300 bg-red-50' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getWeatherIcon(weather.current.condition)}
                        <h4 className="font-semibold">{weather.location}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWeatherUpdate(weather.location)}
                        disabled={isUpdating}
                      >
                        <ArrowClockwise size={14} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temperatur:</span>
                          <span>{Math.round(weather.current.temperature)}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wind:</span>
                          <span className={weather.current.windSpeed > 45 ? 'text-red-600 font-medium' : ''}>
                            {Math.round(weather.current.windSpeed)} km/h
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Regen:</span>
                          <span className={weather.current.precipitation > 8 ? 'text-red-600 font-medium' : ''}>
                            {weather.current.precipitation.toFixed(1)} mm/h
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sicht:</span>
                          <span className={weather.current.visibility < 3 ? 'text-red-600 font-medium' : ''}>
                            {weather.current.visibility.toFixed(1)} km
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Druck:</span>
                          <span>{weather.current.pressure.toFixed(0)} hPa</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Feuchtigkeit:</span>
                          <span>{weather.current.humidity}%</span>
                        </div>
                      </div>
                    </div>

                    {weather.alerts.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {weather.alerts.map((alert, alertIdx) => (
                          <div key={alertIdx} className="text-xs p-2 rounded bg-red-100 text-red-800">
                            <strong>{alert.type}:</strong> {alert.message}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground mt-3 border-t pt-2">
                      Letzte Aktualisierung: {new Date(weather.lastUpdate).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* AI Predictions */}
          <Card>
            <CardHeader>
              <CardTitle>KI-Vorhersagen & Impact-Analyse</CardTitle>
              <CardDescription>Vorausschauende Risikoanalyse für die nächsten 12 Stunden</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictedImpacts.map((impact, idx) => (
                  <div key={idx} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Brain size={20} className="text-purple-600" />
                        <div>
                          <h4 className="font-semibold">{impact.timeframe}</h4>
                          <p className="text-sm text-muted-foreground">
                            Konfidenz: {impact.confidence}%
                          </p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(impact.impactLevel)}>
                        {impact.impactLevel.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">BETROFFENE SYSTEME</p>
                        <div className="flex flex-wrap gap-1">
                          {impact.affectedSystems.map(system => (
                            <Badge key={system} variant="outline" className="text-xs">
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">EMPFOHLENE MASSNAHMEN</p>
                        <ul className="text-sm space-y-1">
                          {impact.recommendedActions.map((action, actionIdx) => (
                            <li key={actionIdx} className="flex items-center space-x-2">
                              <Target size={12} className="text-blue-600" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <Progress value={impact.confidence} className="h-1" />
                    </div>
                  </div>
                ))}

                {predictedImpacts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Keine kritischen Vorhersagen für die nächsten 12 Stunden</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Optimization Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Optimierungsempfehlungen</CardTitle>
              <CardDescription>KI-basierte Verbesserungsvorschläge für Effizienz und Kostenreduktion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationRecommendations.map((recommendation, idx) => (
                  <div key={idx} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TrendUp size={20} className="text-green-600" />
                        <div>
                          <h4 className="font-semibold">{recommendation.type}</h4>
                          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(recommendation.priority)}>
                        {recommendation.priority.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Geschätzte Einsparungen</p>
                        <p className="text-xl font-bold text-green-600">
                          €{recommendation.estimatedSavings.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Implementierung</p>
                        <p className="text-sm">{recommendation.implementation}</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">
                        Details anzeigen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Status Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Echtzeit-Wetterkoordination aktiv • KI-Optimierung läuft • 
        Nächste automatische Aktualisierung in {Math.floor(Math.random() * 5) + 1} Minuten
      </div>
    </div>
  )
}