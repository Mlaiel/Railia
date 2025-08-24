import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  TrendUp,
  TrendDown,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart,
  MapPin,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Gauge
} from '@phosphor-icons/react'

interface WeatherTrend {
  location: string
  parameter: 'temperature' | 'windSpeed' | 'precipitation' | 'pressure'
  current: number
  previous: number
  trend: 'increasing' | 'decreasing' | 'stable'
  changeRate: number
  severity: 'normal' | 'warning' | 'critical'
  forecast: Array<{
    time: string
    value: number
    confidence: number
  }>
}

interface OperationalImpact {
  id: string
  location: string
  impactType: 'delay' | 'cancellation' | 'reroute' | 'speedRestriction'
  severity: 'low' | 'medium' | 'high' | 'critical'
  estimatedDuration: number
  affectedLines: string[]
  passengerImpact: number
  costImpact: number
  weatherCause: string
  mitigationActions: string[]
  status: 'predicted' | 'active' | 'resolved'
  timestamp: string
}

interface AdaptationMetrics {
  totalAdaptations: number
  averageResponseTime: number
  costSavings: number
  delaysPrevented: number
  accuracyRate: number
  operationalEfficiency: number
}

export default function WeatherImpactAnalytics() {
  const [weatherTrends, setWeatherTrends] = useKV<WeatherTrend[]>('weather-trends', [])
  const [operationalImpacts, setOperationalImpacts] = useKV<OperationalImpact[]>('operational-impacts', [])
  const [adaptationMetrics, setAdaptationMetrics] = useKV<AdaptationMetrics>('adaptation-metrics', {
    totalAdaptations: 0,
    averageResponseTime: 0,
    costSavings: 0,
    delaysPrevented: 0,
    accuracyRate: 0,
    operationalEfficiency: 0
  })

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '6h' | '24h' | '7d'>('24h')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Initialize with sample data
    if (weatherTrends.length === 0) {
      const sampleTrends: WeatherTrend[] = [
        {
          location: 'Hauptbahnhof Region',
          parameter: 'windSpeed',
          current: 45,
          previous: 32,
          trend: 'increasing',
          changeRate: 4.2,
          severity: 'warning',
          forecast: Array.from({ length: 12 }, (_, i) => ({
            time: new Date(Date.now() + i * 3600000).toISOString(),
            value: 45 + Math.sin(i / 2) * 10 + Math.random() * 5,
            confidence: 95 - i * 2
          }))
        },
        {
          location: 'Bergstrecke Nord',
          parameter: 'precipitation',
          current: 12.5,
          previous: 3.2,
          trend: 'increasing',
          changeRate: 8.7,
          severity: 'critical',
          forecast: Array.from({ length: 12 }, (_, i) => ({
            time: new Date(Date.now() + i * 3600000).toISOString(),
            value: 12.5 + Math.random() * 5 - i * 0.5,
            confidence: 92 - i * 1.5
          }))
        },
        {
          location: 'Küstenlinie Ost',
          parameter: 'temperature',
          current: 8,
          previous: 14,
          trend: 'decreasing',
          changeRate: -2.1,
          severity: 'normal',
          forecast: Array.from({ length: 12 }, (_, i) => ({
            time: new Date(Date.now() + i * 3600000).toISOString(),
            value: 8 + Math.sin(i / 6) * 4,
            confidence: 98 - i
          }))
        }
      ]
      setWeatherTrends(sampleTrends)
    }

    if (operationalImpacts.length === 0) {
      const sampleImpacts: OperationalImpact[] = [
        {
          id: 'OI001',
          location: 'Bergstrecke Nord',
          impactType: 'speedRestriction',
          severity: 'high',
          estimatedDuration: 180,
          affectedLines: ['RE45', 'IC78', 'RB23'],
          passengerImpact: 2400,
          costImpact: 45000,
          weatherCause: 'Starkregen und Überflutungsrisiko',
          mitigationActions: [
            'Geschwindigkeitsbegrenzung 80 km/h',
            'Verstärkte Streckenüberwachung',
            'Alternativrouten aktiviert'
          ],
          status: 'active',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 'OI002',
          location: 'Hauptbahnhof Region',
          impactType: 'delay',
          severity: 'medium',
          estimatedDuration: 45,
          affectedLines: ['S1', 'S2', 'RB12'],
          passengerImpact: 1200,
          costImpact: 18000,
          weatherCause: 'Starke Windböen - Vorsichtsmaßnahme',
          mitigationActions: [
            'Verlängerte Haltezeiten',
            'Zusätzliche Durchsagen',
            'Mobile Teams im Einsatz'
          ],
          status: 'predicted',
          timestamp: new Date(Date.now() + 3600000).toISOString()
        },
        {
          id: 'OI003',
          location: 'Industriegebiet Süd',
          impactType: 'reroute',
          severity: 'low',
          estimatedDuration: 120,
          affectedLines: ['RE67'],
          passengerImpact: 450,
          costImpact: 8500,
          weatherCause: 'Nebel - Sichtbeeinträchtigung',
          mitigationActions: [
            'Umleitung über Parallelstrecke',
            'Angepasste Fahrpläne'
          ],
          status: 'resolved',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ]
      setOperationalImpacts(sampleImpacts)
    }

    if (adaptationMetrics.totalAdaptations === 0) {
      setAdaptationMetrics({
        totalAdaptations: 247,
        averageResponseTime: 3.7,
        costSavings: 890000,
        delaysPrevented: 156,
        accuracyRate: 94.2,
        operationalEfficiency: 87.8
      })
    }
  }, [])

  const runImpactAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Update metrics with new "analysis"
      setAdaptationMetrics(prev => ({
        ...prev,
        totalAdaptations: prev.totalAdaptations + Math.floor(Math.random() * 5),
        accuracyRate: Math.min(100, prev.accuracyRate + Math.random() * 2),
        operationalEfficiency: Math.min(100, prev.operationalEfficiency + Math.random() * 1.5)
      }))
      
      toast.success('Impact-Analyse abgeschlossen')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getTrendIcon = (trend: string, size: number = 16) => {
    switch (trend) {
      case 'increasing': return <TrendUp size={size} className="text-red-600" />
      case 'decreasing': return <TrendDown size={size} className="text-green-600" />
      case 'stable': return <Activity size={size} className="text-gray-600" />
      default: return <Activity size={size} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactTypeIcon = (type: string, size: number = 16) => {
    switch (type) {
      case 'delay': return <Clock size={size} className="text-orange-600" />
      case 'cancellation': return <AlertTriangle size={size} className="text-red-600" />
      case 'reroute': return <MapPin size={size} className="text-blue-600" />
      case 'speedRestriction': return <Gauge size={size} className="text-purple-600" />
      default: return <Activity size={size} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'predicted': return 'text-blue-600'
      case 'active': return 'text-red-600'
      case 'resolved': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Wetter-Impact-Analytics</h2>
          <p className="text-muted-foreground">Erweiterte Analyse von Wetterauswirkungen auf den Bahnbetrieb</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-secondary/50 rounded-lg p-1">
            {(['1h', '6h', '24h', '7d'] as const).map(timeframe => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>
          <Button 
            onClick={runImpactAnalysis} 
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <Activity size={16} className="animate-spin" />
            ) : (
              <BarChart size={16} />
            )}
            Analyse starten
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target size={20} className="text-blue-600" />
              <div>
                <p className="text-xl font-bold">{adaptationMetrics.totalAdaptations}</p>
                <p className="text-xs text-muted-foreground">Anpassungen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-green-600" />
              <div>
                <p className="text-xl font-bold">{adaptationMetrics.averageResponseTime}min</p>
                <p className="text-xs text-muted-foreground">Ø Reaktionszeit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendUp size={20} className="text-purple-600" />
              <div>
                <p className="text-xl font-bold">€{(adaptationMetrics.costSavings / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Kosteneinsparungen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-emerald-600" />
              <div>
                <p className="text-xl font-bold">{adaptationMetrics.delaysPrevented}</p>
                <p className="text-xs text-muted-foreground">Verspätungen verhindert</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart size={20} className="text-indigo-600" />
              <div>
                <p className="text-xl font-bold">{adaptationMetrics.accuracyRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Vorhersagegenauigkeit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gauge size={20} className="text-orange-600" />
              <div>
                <p className="text-xl font-bold">{adaptationMetrics.operationalEfficiency.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Betriebseffizienz</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Wetter-Trendanalyse</CardTitle>
            <CardDescription>Entwicklung kritischer Wetterparameter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherTrends.map((trend, idx) => (
                <div key={idx} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTrendIcon(trend.trend)}
                      <div>
                        <h4 className="font-semibold">{trend.location}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {trend.parameter === 'windSpeed' ? 'Windgeschwindigkeit' :
                           trend.parameter === 'precipitation' ? 'Niederschlag' :
                           trend.parameter === 'temperature' ? 'Temperatur' : 'Luftdruck'}
                        </p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(trend.severity)}>
                      {trend.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-lg font-bold">
                        {trend.current.toFixed(1)}
                        {trend.parameter === 'temperature' ? '°C' :
                         trend.parameter === 'windSpeed' ? ' km/h' :
                         trend.parameter === 'precipitation' ? ' mm/h' : ' hPa'}
                      </p>
                      <p className="text-muted-foreground">Aktuell</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold flex items-center justify-center gap-1">
                        {trend.changeRate > 0 ? <ArrowUp size={16} className="text-red-600" /> : 
                         trend.changeRate < 0 ? <ArrowDown size={16} className="text-green-600" /> : null}
                        {Math.abs(trend.changeRate).toFixed(1)}
                      </p>
                      <p className="text-muted-foreground">Änderung/h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">
                        {trend.previous.toFixed(1)}
                      </p>
                      <p className="text-muted-foreground">Vorher</p>
                    </div>
                  </div>

                  {/* Mini forecast chart */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">12h-VORHERSAGE</p>
                    <div className="flex items-end justify-between h-16 border-l border-b border-border/30">
                      {trend.forecast.slice(0, 8).map((point, i) => (
                        <div key={i} className="flex flex-col items-center justify-end flex-1">
                          <div 
                            className="w-2 bg-primary/60 rounded-t"
                            style={{
                              height: `${Math.max(5, (point.value / Math.max(...trend.forecast.map(f => f.value))) * 100)}%`
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Jetzt</span>
                      <span>+6h</span>
                      <span>+12h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operational Impact Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Betriebsauswirkungen</CardTitle>
            <CardDescription>Analyse der operationellen Impacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operationalImpacts.map(impact => (
                <div key={impact.id} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getImpactTypeIcon(impact.impactType)}
                      <div>
                        <h4 className="font-semibold">{impact.location}</h4>
                        <p className="text-sm text-muted-foreground">{impact.weatherCause}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(impact.severity)}>
                        {impact.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(impact.status)}>
                        {impact.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dauer:</span>
                        <span>{impact.estimatedDuration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Betroffene Fahrgäste:</span>
                        <span>{impact.passengerImpact.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kostenschätzung:</span>
                        <span>€{impact.costImpact.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs">BETROFFENE LINIEN</p>
                      <div className="flex flex-wrap gap-1">
                        {impact.affectedLines.map(line => (
                          <Badge key={line} variant="outline" className="text-xs">
                            {line}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">GEGENMASSPNAHMEN</p>
                    <ul className="text-sm space-y-1">
                      {impact.mitigationActions.map((action, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle size={12} className="text-green-600" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-muted-foreground border-t pt-2">
                    {impact.status === 'predicted' ? 'Erwartet: ' : 
                     impact.status === 'active' ? 'Begonnen: ' : 'Beendet: '}
                    {new Date(impact.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Leistungsübersicht</CardTitle>
          <CardDescription>Gesamtperformance der wetterbasierenten Anpassungen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Vorhersagegenauigkeit</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sturm-Vorhersagen</span>
                  <span>96.2%</span>
                </div>
                <Progress value={96.2} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Niederschlag</span>
                  <span>93.8%</span>
                </div>
                <Progress value={93.8} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Wind-Ereignisse</span>
                  <span>91.5%</span>
                </div>
                <Progress value={91.5} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Reaktionszeiten</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Automatische Anpassungen</span>
                  <span>2.1 min</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Manuelle Bestätigung</span>
                  <span>4.3 min</span>
                </div>
                <Progress value={70} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Notfall-Protokolle</span>
                  <span>1.8 min</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Impact-Reduktion</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Verspätungen</span>
                  <span>-67%</span>
                </div>
                <Progress value={67} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Ausfälle</span>
                  <span>-84%</span>
                </div>
                <Progress value={84} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>Kosten</span>
                  <span>-43%</span>
                </div>
                <Progress value={43} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}