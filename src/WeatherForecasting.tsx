import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  CloudRain, 
  Lightning, 
  Wind,
  Tree,
  ThermometerSimple,
  Snowflake,
  Sun,
  AlertTriangle,
  MapPin,
  Clock,
  Satellite,
  Activity
} from '@phosphor-icons/react'

interface WeatherAlert {
  id: string
  type: 'storm' | 'flood' | 'ice' | 'wind' | 'snow' | 'heat'
  severity: 'watch' | 'warning' | 'critical'
  location: string
  affectedLines: string[]
  startTime: string
  endTime: string
  description: string
  impact: 'low' | 'medium' | 'high'
}

interface TrackCondition {
  id: string
  section: string
  condition: 'clear' | 'wet' | 'ice' | 'debris' | 'flooded'
  visibility: number
  temperature: number
  windSpeed: number
  lastUpdate: string
  riskLevel: 'low' | 'medium' | 'high'
}

interface DisasterPrediction {
  type: string
  location: string
  probability: number
  timeframe: string
  potentialImpact: string
  recommendedAction: string
}

export default function WeatherForecasting() {
  const [weatherAlerts, setWeatherAlerts] = useKV<WeatherAlert[]>('weather-alerts', [])
  const [trackConditions, setTrackConditions] = useKV<TrackCondition[]>('track-conditions', [])
  const [predictions, setPredictions] = useKV<DisasterPrediction[]>('disaster-predictions', [])
  const [weatherStats, setWeatherStats] = useKV('weather-stats', {
    activeAlerts: 2,
    predictionsAccuracy: 92.3,
    sectionsMonitored: 156,
    averageResponseTime: 3.7
  })

  useEffect(() => {
    if (weatherAlerts.length === 0) {
      const mockAlerts: WeatherAlert[] = [
        {
          id: 'WA001',
          type: 'storm',
          severity: 'warning',
          location: 'Northern Rail Corridor',
          affectedLines: ['RE45', 'IC78', 'RB23'],
          startTime: new Date(Date.now() + 3600000).toISOString(),
          endTime: new Date(Date.now() + 10800000).toISOString(),
          description: 'Severe thunderstorm with heavy rain and strong winds expected',
          impact: 'high'
        },
        {
          id: 'WA002',
          type: 'wind',
          severity: 'watch',
          location: 'Forest Section 12-18',
          affectedLines: ['RB34', 'RE67'],
          startTime: new Date(Date.now() + 7200000).toISOString(),
          endTime: new Date(Date.now() + 14400000).toISOString(),
          description: 'High winds may cause tree falls across tracks',
          impact: 'medium'
        }
      ]
      setWeatherAlerts(mockAlerts)
    }

    if (trackConditions.length === 0) {
      const mockConditions: TrackCondition[] = [
        {
          id: 'TC001',
          section: 'Main Line A (km 45-67)',
          condition: 'wet',
          visibility: 8.5,
          temperature: 12,
          windSpeed: 25,
          lastUpdate: new Date(Date.now() - 300000).toISOString(),
          riskLevel: 'medium'
        },
        {
          id: 'TC002',
          section: 'Bridge Network B',
          condition: 'clear',
          visibility: 10,
          temperature: 15,
          windSpeed: 12,
          lastUpdate: new Date(Date.now() - 180000).toISOString(),
          riskLevel: 'low'
        },
        {
          id: 'TC003',
          section: 'Mountain Pass C',
          condition: 'debris',
          visibility: 6.2,
          temperature: 8,
          windSpeed: 45,
          lastUpdate: new Date(Date.now() - 120000).toISOString(),
          riskLevel: 'high'
        },
        {
          id: 'TC004',
          section: 'Suburban Line D',
          condition: 'clear',
          visibility: 9.8,
          temperature: 18,
          windSpeed: 8,
          lastUpdate: new Date(Date.now() - 240000).toISOString(),
          riskLevel: 'low'
        }
      ]
      setTrackConditions(mockConditions)
    }

    if (predictions.length === 0) {
      const mockPredictions: DisasterPrediction[] = [
        {
          type: 'Tree Fall Risk',
          location: 'Forest Section 15',
          probability: 73,
          timeframe: 'Next 4 hours',
          potentialImpact: 'Line closure 2-6 hours',
          recommendedAction: 'Deploy drone patrol'
        },
        {
          type: 'Flash Flood',
          location: 'Valley Route km 89-93',
          probability: 45,
          timeframe: 'Next 6 hours',
          potentialImpact: 'Speed restrictions',
          recommendedAction: 'Monitor water levels'
        },
        {
          type: 'Track Icing',
          location: 'Mountain Pass',
          probability: 89,
          timeframe: 'Tonight 22:00-06:00',
          potentialImpact: 'Service suspension',
          recommendedAction: 'Preposition heating systems'
        }
      ]
      setPredictions(mockPredictions)
    }
  }, [weatherAlerts, setWeatherAlerts, trackConditions, setTrackConditions, predictions, setPredictions])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'watch': return 'secondary'
      case 'warning': return 'destructive'
      case 'critical': return 'destructive'
      default: return 'default'
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return <Sun size={16} className="text-yellow-500" />
      case 'wet': return <CloudRain size={16} className="text-blue-500" />
      case 'ice': return <Snowflake size={16} className="text-cyan-500" />
      case 'debris': return <Tree size={16} className="text-amber-600" />
      case 'flooded': return <CloudRain size={16} className="text-blue-700" />
      default: return <Sun size={16} />
    }
  }

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'storm': return <Lightning size={16} className="text-purple-600" />
      case 'flood': return <CloudRain size={16} className="text-blue-600" />
      case 'ice': return <Snowflake size={16} className="text-cyan-600" />
      case 'wind': return <Wind size={16} className="text-gray-600" />
      case 'snow': return <Snowflake size={16} className="text-blue-200" />
      case 'heat': return <ThermometerSimple size={16} className="text-red-600" />
      default: return <CloudRain size={16} />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'default'
      case 'medium': return 'secondary'
      case 'high': return 'destructive'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Weather Stats Overview with Satellite Integration */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={20} className="text-destructive" />
              <div>
                <p className="text-2xl font-bold">{weatherStats.activeAlerts}</p>
                <p className="text-sm text-muted-foreground">Aktive Alarme</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">{weatherStats.predictionsAccuracy}%</p>
                <p className="text-sm text-muted-foreground">Vorhersage-Genauigkeit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Satellite size={20} className="text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{weatherStats.sectionsMonitored}</p>
                <p className="text-sm text-muted-foreground">Überwachte Abschnitte</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{weatherStats.averageResponseTime}m</p>
                <p className="text-sm text-muted-foreground">Ø Reaktionszeit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Weather Alert with Satellite Data */}
      {weatherAlerts.some(a => a.severity === 'critical' || a.severity === 'warning') && (
        <Alert className="border-destructive bg-destructive/10">
          <Lightning className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            WETTER-WARNUNG: Schwere Unwetter nähern sich dem Nordkorridor - Satellitendaten bestätigen Sturmsystem mit 95% Sicherheit - Betriebsanpassungen empfohlen
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Enhanced Weather Alerts with Satellite Verification */}
        <Card>
          <CardHeader>
            <CardTitle>Aktive Wetter-Alarme</CardTitle>
            <CardDescription>Echtzeit-Wetterbedrohungen mit Satellitenverifikation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherAlerts.map(alert => (
                <div key={alert.id} className="p-3 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getWeatherIcon(alert.type)}
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium capitalize">{alert.type}</span>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        <Satellite size={12} className="mr-1" />
                        Satelliten-verifiziert
                      </Badge>
                    </div>
                    <Badge variant="outline" className={`${
                      alert.impact === 'high' ? 'border-destructive text-destructive' : 
                      alert.impact === 'medium' ? 'border-amber-500 text-amber-700' : ''
                    }`}>
                      {alert.impact.toUpperCase()} AUSWIRKUNG
                    </Badge>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span>{alert.location}</span>
                    </div>
                    <p className="text-muted-foreground mb-2">{alert.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {alert.affectedLines.map(line => (
                          <Badge key={line} variant="outline" className="text-xs">
                            {line}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.startTime).toLocaleTimeString()} - {new Date(alert.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Satellite Confirmation */}
                  <div className="pt-2 border-t bg-blue-50/50 rounded p-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-700 font-medium">Satelliten-Bestätigung:</span>
                      <span className="text-blue-600">Sentinel-2 | Confidence: 94%</span>
                    </div>
                    <p className="text-blue-600 text-xs mt-1">
                      Infrarot- und Radaraufnahmen bestätigen Sturmsystem-Entwicklung
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Track Conditions with Satellite Data */}
        <Card>
          <CardHeader>
            <CardTitle>Echtzeit-Gleiskonditionen</CardTitle>
            <CardDescription>IoT-Sensordaten und Satelliten-Umweltüberwachung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackConditions.map(condition => (
                <div key={condition.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getConditionIcon(condition.condition)}
                      <span className="font-medium">{condition.section}</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        <Satellite size={12} className="mr-1" />
                        Satelliten-überwacht
                      </Badge>
                    </div>
                    <Badge variant={getRiskColor(condition.riskLevel)}>
                      {condition.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{condition.visibility}km</p>
                      <p className="text-muted-foreground">Sichtweite</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{condition.temperature}°C</p>
                      <p className="text-muted-foreground">Temperatur</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{condition.windSpeed}km/h</p>
                      <p className="text-muted-foreground">Wind</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium capitalize">{condition.condition}</p>
                      <p className="text-muted-foreground">Zustand</p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Letztes Update: {new Date(condition.lastUpdate).toLocaleTimeString()}</span>
                    <span className="text-green-600">Satelliten-Verifikation: OK</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced AI Disaster Predictions with Satellite Integration */}
      <Card>
        <CardHeader>
          <CardTitle>KI-Katastrophenvorhersagen mit Satellitenintegration</CardTitle>
          <CardDescription>Prädiktive Modellierung mit Echtzeit-Satellitendaten für proaktiven Infrastrukturschutz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictions.map((prediction, idx) => (
              <div key={idx} className="p-4 rounded-lg border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{prediction.type}</h4>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{prediction.probability}%</p>
                    <p className="text-xs text-muted-foreground">Wahrscheinlichkeit</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span>{prediction.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-muted-foreground" />
                    <span>{prediction.timeframe}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">POTENTIELLE AUSWIRKUNG</p>
                    <p className="text-sm">{prediction.potentialImpact}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">EMPFOHLENE MASSNAHME</p>
                    <p className="text-sm text-primary">{prediction.recommendedAction}</p>
                  </div>
                </div>

                <Progress value={prediction.probability} className="h-2" />

                {/* Satellite Data Confidence */}
                <div className="pt-2 border-t bg-blue-50/50 rounded p-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-700 font-medium flex items-center gap-1">
                      <Satellite size={12} />
                      Satelliten-Validierung:
                    </span>
                    <span className="text-blue-600 font-medium">
                      {idx === 0 ? '96%' : idx === 1 ? '87%' : '91%'} Konfidenz
                    </span>
                  </div>
                  <p className="text-blue-600 text-xs mt-1">
                    {idx === 0 ? 'Infrarot-Aufnahmen zeigen Bodensättigung' : 
                     idx === 1 ? 'Radar-Daten bestätigen Niederschlagsmuster' :
                     'Thermische Bilder zeigen Temperaturgradienten'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-3">Vorhersagemodell-Leistung mit Satellitenintegration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Sturmvorhersage (mit Satelliten)</span>
                  <span>96.8%</span>
                </div>
                <Progress value={96.8} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">+2.6% durch Satellitendaten</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Hochwasserprognose (mit Satelliten)</span>
                  <span>94.2%</span>
                </div>
                <Progress value={94.2} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">+2.4% durch Satellitendaten</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Gleishindernisse (mit Satelliten)</span>
                  <span>92.1%</span>
                </div>
                <Progress value={92.1} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">+2.6% durch Satellitendaten</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}