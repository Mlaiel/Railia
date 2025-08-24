import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  CloudRain, 
  Lightning, 
  Wind,
  ThermometerSimple,
  Snowflake,
  Sun,
  AlertTriangle,
  MapPin,
  Clock,
  Satellite,
  Activity,
  Target,
  ArrowClockwise,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  WarningCircle,
  Drone,
  Train,
  Wrench,
  ShieldCheck,
  Eye,
  CircleNotch
} from '@phosphor-icons/react'

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  visibility: number
  precipitation: number
  cloudCover: number
  uvIndex: number
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog'
  timestamp: string
}

interface MissionAdjustment {
  id: string
  type: 'route_change' | 'speed_limit' | 'service_suspension' | 'drone_deployment' | 'maintenance_alert' | 'passenger_notification'
  priority: 'low' | 'medium' | 'high' | 'critical'
  weatherTrigger: string
  affectedLines: string[]
  description: string
  originalPlan: string
  adjustedPlan: string
  estimatedDelay: number
  implementation: 'automatic' | 'manual' | 'pending'
  status: 'active' | 'completed' | 'cancelled' | 'scheduled'
  createdAt: string
  executedAt?: string
}

interface WeatherForecast {
  timestamp: string
  temperature: number
  condition: string
  precipitation: number
  windSpeed: number
  confidence: number
  alerts: string[]
}

interface MissionTemplate {
  id: string
  name: string
  trigger: {
    condition: string
    threshold: number
    operator: '>' | '<' | '=' | '>=' | '<='
  }
  actions: {
    type: string
    parameters: Record<string, any>
    delay: number
  }[]
  enabled: boolean
}

export default function RealTimeWeatherMissions() {
  const [currentWeather, setCurrentWeather] = useKV<WeatherData[]>('current-weather', [])
  const [weatherForecast, setWeatherForecast] = useKV<WeatherForecast[]>('weather-forecast', [])
  const [missionAdjustments, setMissionAdjustments] = useKV<MissionAdjustment[]>('mission-adjustments', [])
  const [missionTemplates, setMissionTemplates] = useKV<MissionTemplate[]>('mission-templates', [])
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())

  const [systemStats] = useKV('weather-mission-stats', {
    activeAdjustments: 0,
    automatedResponses: 247,
    averageResponseTime: 2.3,
    weatherStations: 89,
    forecastAccuracy: 94.7,
    missionsOptimized: 1847
  })

  useEffect(() => {
    // Initialize with realistic weather data
    if (currentWeather.length === 0) {
      const mockWeatherData: WeatherData[] = [
        {
          location: 'Hauptbahnhof Region',
          temperature: 14,
          humidity: 78,
          windSpeed: 23,
          windDirection: 240,
          pressure: 1013.2,
          visibility: 8.5,
          precipitation: 2.3,
          cloudCover: 75,
          uvIndex: 3,
          condition: 'rain',
          timestamp: new Date().toISOString()
        },
        {
          location: 'Bergstrecke Nord',
          temperature: 8,
          humidity: 85,
          windSpeed: 45,
          windDirection: 270,
          pressure: 995.8,
          visibility: 4.2,
          precipitation: 8.7,
          cloudCover: 95,
          uvIndex: 1,
          condition: 'storm',
          timestamp: new Date().toISOString()
        },
        {
          location: 'Küstenlinie Ost',
          temperature: 12,
          humidity: 82,
          windSpeed: 38,
          windDirection: 315,
          pressure: 1008.1,
          visibility: 6.8,
          precipitation: 0.5,
          cloudCover: 60,
          uvIndex: 2,
          condition: 'cloudy',
          timestamp: new Date().toISOString()
        }
      ]
      setCurrentWeather(mockWeatherData)
    }

    if (weatherForecast.length === 0) {
      const mockForecast: WeatherForecast[] = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() + i * 3600000).toISOString(),
        temperature: 14 + Math.sin(i / 4) * 6 + Math.random() * 3,
        condition: i < 6 ? 'storm' : i < 12 ? 'rain' : 'cloudy',
        precipitation: i < 6 ? 8 + Math.random() * 4 : i < 12 ? 2 + Math.random() * 3 : Math.random(),
        windSpeed: i < 6 ? 40 + Math.random() * 10 : 20 + Math.random() * 15,
        confidence: 95 - i * 2,
        alerts: i < 6 ? ['Sturm', 'Starkregen'] : i < 12 ? ['Regen'] : []
      }))
      setWeatherForecast(mockForecast)
    }

    if (missionAdjustments.length === 0) {
      const mockAdjustments: MissionAdjustment[] = [
        {
          id: 'MA001',
          type: 'speed_limit',
          priority: 'high',
          weatherTrigger: 'Windgeschwindigkeit > 40 km/h',
          affectedLines: ['RE45', 'IC78'],
          description: 'Geschwindigkeitsbegrenzung aufgrund starker Winde',
          originalPlan: 'Normale Geschwindigkeit 160 km/h',
          adjustedPlan: 'Reduzierte Geschwindigkeit 80 km/h',
          estimatedDelay: 12,
          implementation: 'automatic',
          status: 'active',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          executedAt: new Date(Date.now() - 1500000).toISOString()
        },
        {
          id: 'MA002',
          type: 'drone_deployment',
          priority: 'critical',
          weatherTrigger: 'Niederschlag > 5mm/h + Wind > 35 km/h',
          affectedLines: ['Bergstrecke Nord'],
          description: 'Drohnen-Inspektion für Sturmschäden',
          originalPlan: 'Routinekontrolle alle 4 Stunden',
          adjustedPlan: 'Kontinuierliche Überwachung alle 30 Minuten',
          estimatedDelay: 0,
          implementation: 'automatic',
          status: 'active',
          createdAt: new Date(Date.now() - 900000).toISOString(),
          executedAt: new Date(Date.now() - 600000).toISOString()
        },
        {
          id: 'MA003',
          type: 'route_change',
          priority: 'medium',
          weatherTrigger: 'Sichtweite < 5 km',
          affectedLines: ['RB23', 'RE67'],
          description: 'Umleitung über alternative Route',
          originalPlan: 'Direktroute durch Bergpass',
          adjustedPlan: 'Umleitung über Tal-Route',
          estimatedDelay: 18,
          implementation: 'pending',
          status: 'scheduled',
          createdAt: new Date(Date.now() - 300000).toISOString()
        }
      ]
      setMissionAdjustments(mockAdjustments)
    }

    if (missionTemplates.length === 0) {
      const mockTemplates: MissionTemplate[] = [
        {
          id: 'MT001',
          name: 'Sturm-Protokoll',
          trigger: {
            condition: 'windSpeed',
            threshold: 50,
            operator: '>='
          },
          actions: [
            {
              type: 'speed_limit',
              parameters: { maxSpeed: 60, duration: 'until_clear' },
              delay: 0
            },
            {
              type: 'drone_deployment',
              parameters: { frequency: 15, priority: 'high' },
              delay: 300
            },
            {
              type: 'passenger_notification',
              parameters: { message: 'Wetterbedingte Verspätungen möglich' },
              delay: 600
            }
          ],
          enabled: true
        },
        {
          id: 'MT002',
          name: 'Starkregen-Reaktion',
          trigger: {
            condition: 'precipitation',
            threshold: 10,
            operator: '>='
          },
          actions: [
            {
              type: 'maintenance_alert',
              parameters: { type: 'drainage_check', priority: 'high' },
              delay: 0
            },
            {
              type: 'speed_limit',
              parameters: { maxSpeed: 100, affected_sections: 'low_lying' },
              delay: 180
            }
          ],
          enabled: true
        }
      ]
      setMissionTemplates(mockTemplates)
    }
  }, [])

  const simulateWeatherUpdate = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate fetching real-time weather data
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const updatedWeather = currentWeather.map(location => ({
        ...location,
        temperature: location.temperature + (Math.random() - 0.5) * 2,
        windSpeed: Math.max(0, location.windSpeed + (Math.random() - 0.5) * 10),
        precipitation: Math.max(0, location.precipitation + (Math.random() - 0.5) * 3),
        timestamp: new Date().toISOString()
      }))
      
      setCurrentWeather(updatedWeather)
      setLastUpdate(new Date().toISOString())
      
      // Check for mission adjustments
      const criticalWeather = updatedWeather.find(w => w.windSpeed > 40 || w.precipitation > 5)
      if (criticalWeather) {
        const newAdjustment: MissionAdjustment = {
          id: `MA${Date.now()}`,
          type: 'speed_limit',
          priority: 'high',
          weatherTrigger: `${criticalWeather.location}: Wind ${criticalWeather.windSpeed}km/h`,
          affectedLines: ['Auto-Route'],
          description: 'Automatische Geschwindigkeitsanpassung',
          originalPlan: 'Standard-Geschwindigkeit',
          adjustedPlan: 'Reduzierte Geschwindigkeit aufgrund Wetter',
          estimatedDelay: Math.round(criticalWeather.windSpeed / 10),
          implementation: 'automatic',
          status: 'active',
          createdAt: new Date().toISOString(),
          executedAt: new Date().toISOString()
        }
        
        setMissionAdjustments(prev => [newAdjustment, ...prev].slice(0, 10))
        toast.success(`Automatische Missionsanpassung aktiviert: ${criticalWeather.location}`)
      }
      
      toast.success('Wetterdaten aktualisiert')
    } finally {
      setIsProcessing(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return <Sun size={20} className="text-yellow-500" />
      case 'cloudy': return <CloudRain size={20} className="text-gray-500" />
      case 'rain': return <CloudRain size={20} className="text-blue-500" />
      case 'storm': return <Lightning size={20} className="text-purple-600" />
      case 'snow': return <Snowflake size={20} className="text-blue-300" />
      case 'fog': return <Eye size={20} className="text-gray-400" />
      default: return <Sun size={20} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'default'
      case 'medium': return 'secondary'
      case 'high': return 'destructive'
      case 'critical': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'completed': return 'text-blue-600'
      case 'cancelled': return 'text-red-600'
      case 'scheduled': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getMissionTypeIcon = (type: string) => {
    switch (type) {
      case 'route_change': return <Target size={16} />
      case 'speed_limit': return <Train size={16} />
      case 'service_suspension': return <Pause size={16} />
      case 'drone_deployment': return <Drone size={16} />
      case 'maintenance_alert': return <Wrench size={16} />
      case 'passenger_notification': return <Activity size={16} />
      default: return <ShieldCheck size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity size={20} className="text-blue-600" />
              <div>
                <p className="text-xl font-bold">{systemStats.activeAdjustments}</p>
                <p className="text-xs text-muted-foreground">Aktive Anpassungen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowClockwise size={20} className="text-green-600" />
              <div>
                <p className="text-xl font-bold">{systemStats.automatedResponses}</p>
                <p className="text-xs text-muted-foreground">Auto-Reaktionen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-purple-600" />
              <div>
                <p className="text-xl font-bold">{systemStats.averageResponseTime}m</p>
                <p className="text-xs text-muted-foreground">Ø Reaktionszeit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Satellite size={20} className="text-orange-600" />
              <div>
                <p className="text-xl font-bold">{systemStats.weatherStations}</p>
                <p className="text-xs text-muted-foreground">Wetterstationen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target size={20} className="text-indigo-600" />
              <div>
                <p className="text-xl font-bold">{systemStats.forecastAccuracy}%</p>
                <p className="text-xs text-muted-foreground">Genauigkeit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-emerald-600" />
              <div>
                <p className="text-xl font-bold">{systemStats.missionsOptimized}</p>
                <p className="text-xs text-muted-foreground">Optimiert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Weather Critical Alert */}
      {currentWeather.some(w => w.condition === 'storm' || w.windSpeed > 40) && (
        <Alert className="border-destructive bg-destructive/10">
          <Lightning className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            KRITISCHES WETTER: Sturmbedingungen erkannt - Automatische Missionsanpassungen werden durchgeführt
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Aktuelles Wetter</TabsTrigger>
          <TabsTrigger value="forecast">Vorhersage</TabsTrigger>
          <TabsTrigger value="adjustments">Missionsanpassungen</TabsTrigger>
          <TabsTrigger value="templates">Automatisierung</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Current Weather Conditions */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Aktuelle Wetterbedingungen</h3>
            <Button 
              onClick={simulateWeatherUpdate} 
              disabled={isProcessing}
              size="sm"
              className="gap-2"
            >
              {isProcessing ? (
                <CircleNotch size={16} className="animate-spin" />
              ) : (
                <ArrowClockwise size={16} />
              )}
              Aktualisieren
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentWeather.map((weather, idx) => (
              <Card key={idx} className={`${weather.condition === 'storm' ? 'border-destructive bg-destructive/5' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{weather.location}</CardTitle>
                    {getWeatherIcon(weather.condition)}
                  </div>
                  <CardDescription className="capitalize">
                    {weather.condition === 'storm' ? 'Sturm' : 
                     weather.condition === 'rain' ? 'Regen' :
                     weather.condition === 'cloudy' ? 'Bewölkt' : 'Klar'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Temperatur</span>
                        <span className="font-medium">{Math.round(weather.temperature)}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Feuchtigkeit</span>
                        <span className="font-medium">{weather.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Niederschlag</span>
                        <span className="font-medium">{weather.precipitation.toFixed(1)}mm</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Wind</span>
                        <span className={`font-medium ${weather.windSpeed > 40 ? 'text-destructive' : ''}`}>
                          {Math.round(weather.windSpeed)}km/h
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sicht</span>
                        <span className={`font-medium ${weather.visibility < 5 ? 'text-destructive' : ''}`}>
                          {weather.visibility.toFixed(1)}km
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Druck</span>
                        <span className="font-medium">{weather.pressure.toFixed(1)}hPa</span>
                      </div>
                    </div>
                  </div>

                  {(weather.windSpeed > 40 || weather.precipitation > 5 || weather.visibility < 5) && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <WarningCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 text-sm">
                        Kritische Wetterbedingungen - Automatische Anpassungen aktiviert
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="text-xs text-muted-foreground border-t pt-2">
                    Letzte Aktualisierung: {new Date(weather.timestamp).toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          {/* Weather Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>24-Stunden Wettervorhersage</CardTitle>
              <CardDescription>Präzise Vorhersagen für proaktive Missionsplanung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Hourly forecast chart simulation */}
                <div className="grid grid-cols-12 gap-2 text-xs">
                  {weatherForecast.slice(0, 12).map((forecast, idx) => (
                    <div key={idx} className="text-center space-y-2 p-2 rounded border">
                      <div className="font-medium">
                        {new Date(forecast.timestamp).getHours()}:00
                      </div>
                      <div className="flex justify-center">
                        {getWeatherIcon(forecast.condition)}
                      </div>
                      <div className="space-y-1">
                        <div>{Math.round(forecast.temperature)}°</div>
                        <div className="text-blue-600">{Math.round(forecast.windSpeed)}km/h</div>
                        <div className="text-indigo-600">{forecast.precipitation.toFixed(1)}mm</div>
                      </div>
                      {forecast.alerts.length > 0 && (
                        <div className="text-destructive">
                          <AlertTriangle size={12} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Critical weather periods */}
                <div className="space-y-3">
                  <h4 className="font-medium">Kritische Wetterperioden</h4>
                  {weatherForecast
                    .filter(f => f.alerts.length > 0)
                    .slice(0, 3)
                    .map((forecast, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                        <div className="flex items-center space-x-3">
                          <Lightning size={16} className="text-destructive" />
                          <div>
                            <p className="font-medium">
                              {new Date(forecast.timestamp).toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {forecast.alerts.join(', ')} - Konfidenz: {forecast.confidence}%
                            </p>
                          </div>
                        </div>
                        <Badge variant="destructive">
                          Kritisch
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments" className="space-y-6">
          {/* Mission Adjustments */}
          <Card>
            <CardHeader>
              <CardTitle>Aktive Missionsanpassungen</CardTitle>
              <CardDescription>Wetterbedingte automatische und manuelle Anpassungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missionAdjustments.map(adjustment => (
                  <div key={adjustment.id} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getMissionTypeIcon(adjustment.type)}
                        <div>
                          <h4 className="font-medium">{adjustment.description}</h4>
                          <p className="text-sm text-muted-foreground">{adjustment.weatherTrigger}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityColor(adjustment.priority)}>
                          {adjustment.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(adjustment.status)}>
                          {adjustment.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">URSPRÜNGLICH</p>
                        <p>{adjustment.originalPlan}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">ANGEPASST</p>
                        <p className="text-primary">{adjustment.adjustedPlan}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span>Betroffene Linien: 
                          {adjustment.affectedLines.map(line => (
                            <Badge key={line} variant="outline" className="ml-1 text-xs">
                              {line}
                            </Badge>
                          ))}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span>Verspätung: {adjustment.estimatedDelay}min</span>
                        <span className="text-muted-foreground">
                          {adjustment.implementation === 'automatic' ? 'Automatisch' : 'Manuell'}
                        </span>
                      </div>
                    </div>

                    {adjustment.executedAt && (
                      <div className="text-xs text-muted-foreground border-t pt-2">
                        Ausgeführt: {new Date(adjustment.executedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Mission Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Automatisierungs-Templates</CardTitle>
              <CardDescription>Vordefinierte Reaktionen auf Wetterbedingungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missionTemplates.map(template => (
                  <div key={template.id} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ShieldCheck size={20} className="text-primary" />
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Trigger: {template.trigger.condition} {template.trigger.operator} {template.trigger.threshold}
                          </p>
                        </div>
                      </div>
                      <Badge variant={template.enabled ? "default" : "secondary"}>
                        {template.enabled ? 'AKTIV' : 'INAKTIV'}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">AKTIONEN</p>
                      {template.actions.map((action, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded text-sm">
                          <div className="flex items-center space-x-2">
                            {getMissionTypeIcon(action.type)}
                            <span className="capitalize">{action.type.replace('_', ' ')}</span>
                          </div>
                          <span className="text-muted-foreground">
                            Verzögerung: {action.delay}s
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last Update Info */}
      <div className="text-center text-sm text-muted-foreground">
        System-Status: Aktiv • Letzte Aktualisierung: {new Date(lastUpdate).toLocaleString()}
      </div>
    </div>
  )
}