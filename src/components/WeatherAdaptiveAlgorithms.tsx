import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  CloudRain, 
  Sun, 
  Snow, 
  Wind, 
  Eye,
  Brain,
  Settings,
  TrendUp,
  ThermometerSimple,
  Drop,
  Activity,
  Zap,
  Shield,
  Gauge,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle
} from '@phosphor-icons/react'

interface WeatherCondition {
  id: string
  type: 'sunny' | 'rain' | 'snow' | 'fog' | 'wind' | 'storm'
  severity: 'low' | 'medium' | 'high' | 'extreme'
  temperature: number
  humidity: number
  windSpeed: number
  visibility: number
  precipitation: number
}

interface AlgorithmConfiguration {
  id: string
  name: string
  weatherType: string
  parameters: {
    doorSensitivity: number
    visionAccuracy: number
    responseTime: number
    safetyMargin: number
    trackingRange: number
  }
  performance: {
    accuracy: number
    responseTime: number
    reliability: number
  }
  isActive: boolean
}

interface WeatherAdaptation {
  timestamp: string
  previousConfig: string
  newConfig: string
  weatherCondition: WeatherCondition
  performanceImprovement: number
  reason: string
}

const WeatherAdaptiveAlgorithms: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useKV<WeatherCondition>('current-weather-condition', {
    id: 'current',
    type: 'sunny',
    severity: 'low',
    temperature: 18,
    humidity: 65,
    windSpeed: 12,
    visibility: 10000,
    precipitation: 0
  })

  const [algorithmConfigs, setAlgorithmConfigs] = useKV<AlgorithmConfiguration[]>('weather-algorithm-configs', [
    {
      id: 'sunny-optimal',
      name: 'Sonnenschein Optimierung',
      weatherType: 'sunny',
      parameters: {
        doorSensitivity: 85,
        visionAccuracy: 95,
        responseTime: 150,
        safetyMargin: 90,
        trackingRange: 100
      },
      performance: { accuracy: 96, responseTime: 145, reliability: 98 },
      isActive: true
    },
    {
      id: 'rain-adapted',
      name: 'Regen-Anpassung',
      weatherType: 'rain',
      parameters: {
        doorSensitivity: 75,
        visionAccuracy: 82,
        responseTime: 200,
        safetyMargin: 110,
        trackingRange: 80
      },
      performance: { accuracy: 89, responseTime: 195, reliability: 94 },
      isActive: false
    },
    {
      id: 'fog-enhanced',
      name: 'Nebel-Verstärkung',
      weatherType: 'fog',
      parameters: {
        doorSensitivity: 65,
        visionAccuracy: 70,
        responseTime: 250,
        safetyMargin: 130,
        trackingRange: 60
      },
      performance: { accuracy: 78, responseTime: 240, reliability: 88 },
      isActive: false
    },
    {
      id: 'snow-winter',
      name: 'Schnee-Modus',
      weatherType: 'snow',
      parameters: {
        doorSensitivity: 70,
        visionAccuracy: 75,
        responseTime: 220,
        safetyMargin: 120,
        trackingRange: 70
      },
      performance: { accuracy: 82, responseTime: 215, reliability: 90 },
      isActive: false
    },
    {
      id: 'storm-emergency',
      name: 'Sturm-Notfallmodus',
      weatherType: 'storm',
      parameters: {
        doorSensitivity: 50,
        visionAccuracy: 60,
        responseTime: 300,
        safetyMargin: 150,
        trackingRange: 50
      },
      performance: { accuracy: 71, responseTime: 290, reliability: 85 },
      isActive: false
    }
  ])

  const [adaptationHistory, setAdaptationHistory] = useKV<WeatherAdaptation[]>('weather-adaptations', [])

  const [systemMetrics, setSystemMetrics] = useKV('weather-adaptive-metrics', {
    totalAdaptations: 42,
    performanceImprovement: 23.5,
    accuracyGain: 18.2,
    responseTimeReduction: 15.8,
    lastOptimization: new Date().toISOString()
  })

  const [autoAdaptationEnabled, setAutoAdaptationEnabled] = useKV('auto-weather-adaptation', true)

  // Simulated weather condition updates
  useEffect(() => {
    const weatherSimulation = setInterval(() => {
      const weatherTypes: WeatherCondition['type'][] = ['sunny', 'rain', 'snow', 'fog', 'wind', 'storm']
      const severities: WeatherCondition['severity'][] = ['low', 'medium', 'high', 'extreme']
      
      const newWeather: WeatherCondition = {
        id: `weather-${Date.now()}`,
        type: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        temperature: Math.floor(Math.random() * 40) - 10,
        humidity: Math.floor(Math.random() * 100),
        windSpeed: Math.floor(Math.random() * 80),
        visibility: Math.floor(Math.random() * 10000) + 100,
        precipitation: Math.floor(Math.random() * 50)
      }
      
      setCurrentWeather(newWeather)
      
      // Auto-adapt algorithms if enabled
      if (autoAdaptationEnabled) {
        adaptToWeatherCondition(newWeather)
      }
    }, 15000) // Update every 15 seconds

    return () => clearInterval(weatherSimulation)
  }, [autoAdaptationEnabled])

  const adaptToWeatherCondition = (weather: WeatherCondition) => {
    const suitableConfig = algorithmConfigs.find(config => 
      config.weatherType === weather.type || 
      (weather.type === 'wind' && config.weatherType === 'sunny') ||
      (weather.severity === 'extreme' && config.weatherType === 'storm')
    )

    if (suitableConfig && !suitableConfig.isActive) {
      // Deactivate current config
      const updatedConfigs = algorithmConfigs.map(config => ({
        ...config,
        isActive: config.id === suitableConfig.id
      }))
      
      setAlgorithmConfigs(updatedConfigs)

      // Log adaptation
      const adaptation: WeatherAdaptation = {
        timestamp: new Date().toISOString(),
        previousConfig: algorithmConfigs.find(c => c.isActive)?.name || 'Unbekannt',
        newConfig: suitableConfig.name,
        weatherCondition: weather,
        performanceImprovement: Math.floor(Math.random() * 25) + 5,
        reason: `Automatische Anpassung an ${getWeatherTypeLabel(weather.type)} (${getSeverityLabel(weather.severity)})`
      }
      
      setAdaptationHistory(prev => [adaptation, ...prev.slice(0, 9)])
      
      // Update metrics
      setSystemMetrics(prev => ({
        ...prev,
        totalAdaptations: prev.totalAdaptations + 1,
        lastOptimization: new Date().toISOString()
      }))

      toast.success(`Algorithmus angepasst an ${getWeatherTypeLabel(weather.type)}`, {
        description: `${suitableConfig.name} aktiviert`,
        duration: 3000
      })
    }
  }

  const manuallyActivateConfig = (configId: string) => {
    const updatedConfigs = algorithmConfigs.map(config => ({
      ...config,
      isActive: config.id === configId
    }))
    
    setAlgorithmConfigs(updatedConfigs)
    
    const activatedConfig = algorithmConfigs.find(c => c.id === configId)
    if (activatedConfig) {
      toast.success(`${activatedConfig.name} manuell aktiviert`)
    }
  }

  const getWeatherIcon = (type: WeatherCondition['type']) => {
    const icons = {
      sunny: Sun,
      rain: CloudRain,
      snow: Snow,
      fog: Eye,
      wind: Wind,
      storm: CloudRain
    }
    return icons[type] || Sun
  }

  const getWeatherTypeLabel = (type: WeatherCondition['type']): string => {
    const labels = {
      sunny: 'Sonnenschein',
      rain: 'Regen',
      snow: 'Schnee',
      fog: 'Nebel',
      wind: 'Wind',
      storm: 'Sturm'
    }
    return labels[type] || 'Unbekannt'
  }

  const getSeverityLabel = (severity: WeatherCondition['severity']): string => {
    const labels = {
      low: 'Gering',
      medium: 'Mittel',
      high: 'Hoch',
      extreme: 'Extrem'
    }
    return labels[severity] || 'Unbekannt'
  }

  const getSeverityColor = (severity: WeatherCondition['severity']): string => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      extreme: 'bg-red-500'
    }
    return colors[severity] || 'bg-gray-500'
  }

  const activeConfig = algorithmConfigs.find(config => config.isActive)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wetterbasierte Algorithmus-Anpassung</h1>
          <p className="text-muted-foreground mt-1">
            Intelligente KI-Anpassung für optimale Performance unter verschiedenen Umweltbedingungen
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={autoAdaptationEnabled ? "default" : "outline"}
            onClick={() => setAutoAdaptationEnabled(!autoAdaptationEnabled)}
            className="gap-2"
          >
            <Zap size={16} />
            Auto-Anpassung {autoAdaptationEnabled ? 'EIN' : 'AUS'}
          </Button>
        </div>
      </div>

      {/* Current Weather Status */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-card to-card/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                {(() => {
                  const IconComponent = getWeatherIcon(currentWeather.type)
                  return <IconComponent size={20} className="text-primary" />
                })()}
              </div>
              <div>
                <CardTitle className="text-lg">Aktuelle Wetterbedingungen</CardTitle>
                <CardDescription>
                  {getWeatherTypeLabel(currentWeather.type)} • {getSeverityLabel(currentWeather.severity)}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getSeverityColor(currentWeather.severity)}`}></div>
              <Badge variant={currentWeather.severity === 'extreme' ? 'destructive' : 'default'}>
                {getSeverityLabel(currentWeather.severity)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <ThermometerSimple size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{currentWeather.temperature}°C</div>
                <div className="text-xs text-muted-foreground">Temperatur</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Drop size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{currentWeather.humidity}%</div>
                <div className="text-xs text-muted-foreground">Luftfeuchtigkeit</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{currentWeather.windSpeed} km/h</div>
                <div className="text-xs text-muted-foreground">Windgeschw.</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{(currentWeather.visibility / 1000).toFixed(1)} km</div>
                <div className="text-xs text-muted-foreground">Sichtweite</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CloudRain size={16} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{currentWeather.precipitation} mm</div>
                <div className="text-xs text-muted-foreground">Niederschlag</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="configurations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configurations">Konfigurationen</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">Anpassungshistorie</TabsTrigger>
        </TabsList>

        <TabsContent value="configurations" className="space-y-4">
          {/* Active Configuration */}
          {activeConfig && (
            <Alert className="border-primary/20 bg-primary/5">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertDescription>
                <strong>{activeConfig.name}</strong> ist derzeit aktiv und an {getWeatherTypeLabel(currentWeather.type)} angepasst.
              </AlertDescription>
            </Alert>
          )}

          {/* Algorithm Configurations */}
          <div className="grid gap-4">
            {algorithmConfigs.map((config) => (
              <Card key={config.id} className={`transition-all duration-200 ${config.isActive ? 'border-primary shadow-sm bg-primary/5' : 'hover:shadow-sm'}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        <Brain size={16} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{config.name}</CardTitle>
                        <CardDescription>
                          Optimiert für {getWeatherTypeLabel(config.weatherType as WeatherCondition['type'])}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {config.isActive && (
                        <Badge className="bg-primary text-primary-foreground">
                          AKTIV
                        </Badge>
                      )}
                      
                      {!config.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => manuallyActivateConfig(config.id)}
                          className="gap-2"
                        >
                          <Settings size={14} />
                          Aktivieren
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Tür-Sensitivität</div>
                      <Progress value={config.parameters.doorSensitivity} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">{config.parameters.doorSensitivity}%</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Vision-Genauigkeit</div>
                      <Progress value={config.parameters.visionAccuracy} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">{config.parameters.visionAccuracy}%</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Reaktionszeit</div>
                      <div className="text-sm">{config.parameters.responseTime}ms</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Sicherheitsmarge</div>
                      <Progress value={config.parameters.safetyMargin} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">{config.parameters.safetyMargin}%</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Erfassungsbereich</div>
                      <Progress value={config.parameters.trackingRange} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">{config.parameters.trackingRange}%</div>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">{config.performance.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">Genauigkeit</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">{config.performance.responseTime}ms</div>
                        <div className="text-xs text-muted-foreground">Reaktionszeit</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">{config.performance.reliability}%</div>
                        <div className="text-xs text-muted-foreground">Zuverlässigkeit</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendUp size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{systemMetrics.totalAdaptations}</div>
                    <div className="text-sm text-muted-foreground">Anpassungen</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Gauge size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">+{systemMetrics.performanceImprovement}%</div>
                    <div className="text-sm text-muted-foreground">Leistungssteigerung</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">+{systemMetrics.accuracyGain}%</div>
                    <div className="text-sm text-muted-foreground">Genauigkeitssteigerung</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">-{systemMetrics.responseTimeReduction}%</div>
                    <div className="text-sm text-muted-foreground">Zeitreduktion</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Wetterbedingte Performance-Vergleiche</CardTitle>
              <CardDescription>
                Algorithmus-Leistung unter verschiedenen Wetterbedingungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {algorithmConfigs.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const IconComponent = getWeatherIcon(config.weatherType as WeatherCondition['type'])
                        return <IconComponent size={20} className="text-muted-foreground" />
                      })()}
                      <span className="font-medium">{config.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Activity size={14} />
                        <span>{config.performance.accuracy}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={14} />
                        <span>{config.performance.responseTime}ms</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield size={14} />
                        <span>{config.performance.reliability}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anpassungshistorie</CardTitle>
              <CardDescription>
                Chronologie der automatischen Algorithmus-Anpassungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adaptationHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Noch keine Anpassungen durchgeführt</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {adaptationHistory.map((adaptation, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                        {(() => {
                          const IconComponent = getWeatherIcon(adaptation.weatherCondition.type)
                          return <IconComponent size={16} className="text-primary" />
                        })()}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">
                            {adaptation.previousConfig} → {adaptation.newConfig}
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <ArrowUp size={14} />
                            <span className="text-sm font-medium">+{adaptation.performanceImprovement}%</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {adaptation.reason}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(adaptation.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span>
                            {getWeatherTypeLabel(adaptation.weatherCondition.type)} 
                            ({getSeverityLabel(adaptation.weatherCondition.severity)})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WeatherAdaptiveAlgorithms;