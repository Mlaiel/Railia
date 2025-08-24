/**
 * IoT Sensor Monitoring Component
 * Real-time monitoring of railway infrastructure IoT sensors
 */

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  CircuitBoard, 
  Activity, 
  ThermometerSimple, 
  Drop, 
  Zap, 
  Gauge, 
  WifiHigh, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Wrench,
  Battery,
  Warning,
  Eye,
  TrendUp,
  TrendDown,
  Minus
} from '@phosphor-icons/react'

interface SensorData {
  id: string
  name: string
  type: 'temperature' | 'humidity' | 'vibration' | 'pressure' | 'current' | 'voltage' | 'proximity' | 'strain'
  location: string
  zone: string
  value: number
  unit: string
  status: 'online' | 'offline' | 'warning' | 'critical'
  lastUpdate: string
  batteryLevel: number
  signalStrength: number
  threshold: {
    min: number
    max: number
    critical: number
  }
  trend: 'up' | 'down' | 'stable'
  alerts: string[]
}

interface ComponentHealth {
  componentId: string
  name: string
  type: 'track' | 'signal' | 'switch' | 'bridge' | 'tunnel' | 'power' | 'station'
  location: string
  overallHealth: number
  sensorCount: number
  activeSensors: number
  criticalAlerts: number
  lastMaintenance: string
  nextMaintenance: string
  status: 'healthy' | 'warning' | 'critical' | 'maintenance'
}

const IoTSensorMonitoring = () => {
  const [selectedZone, setSelectedZone] = useState('all')
  const [selectedSensorType, setSelectedSensorType] = useState('all')
  const [autoRefresh, setAutoRefresh] = useKV('iot-auto-refresh', true)
  
  // Sample sensor data - in real implementation, this would come from IoT backend
  const [sensorData, setSensorData] = useKV('iot-sensor-data', [
    {
      id: 'temp_001',
      name: 'Gleis 1A Temperatur',
      type: 'temperature',
      location: 'Hauptbahnhof Gleis 1A',
      zone: 'Zone A',
      value: 42.5,
      unit: '°C',
      status: 'online',
      lastUpdate: new Date().toISOString(),
      batteryLevel: 85,
      signalStrength: 92,
      threshold: { min: -10, max: 60, critical: 70 },
      trend: 'up',
      alerts: []
    },
    {
      id: 'vib_002',
      name: 'Brücke Nord Vibration',
      type: 'vibration',
      location: 'Eisenbahnbrücke Nord',
      zone: 'Zone B',
      value: 8.7,
      unit: 'mm/s',
      status: 'warning',
      lastUpdate: new Date(Date.now() - 120000).toISOString(),
      batteryLevel: 45,
      signalStrength: 78,
      threshold: { min: 0, max: 10, critical: 15 },
      trend: 'up',
      alerts: ['Erhöhte Vibrationen detektiert']
    },
    {
      id: 'curr_003',
      name: 'Oberleitung Strom A',
      type: 'current',
      location: 'Streckenabschnitt A-B',
      zone: 'Zone A',
      value: 1850,
      unit: 'A',
      status: 'critical',
      lastUpdate: new Date(Date.now() - 45000).toISOString(),
      batteryLevel: 92,
      signalStrength: 88,
      threshold: { min: 0, max: 2000, critical: 2200 },
      trend: 'stable',
      alerts: ['Stromspitze überschritten', 'Sofortige Wartung erforderlich']
    },
    {
      id: 'strain_004',
      name: 'Schiene Dehnung S12',
      type: 'strain',
      location: 'Gleisabschnitt 12',
      zone: 'Zone C',
      value: 1.2,
      unit: 'µε',
      status: 'online',
      lastUpdate: new Date(Date.now() - 30000).toISOString(),
      batteryLevel: 78,
      signalStrength: 95,
      threshold: { min: 0, max: 2.0, critical: 3.0 },
      trend: 'stable',
      alerts: []
    },
    {
      id: 'press_005',
      name: 'Weiche W7 Hydraulik',
      type: 'pressure',
      location: 'Weiche W7',
      zone: 'Zone B',
      value: 145,
      unit: 'bar',
      status: 'offline',
      lastUpdate: new Date(Date.now() - 900000).toISOString(),
      batteryLevel: 12,
      signalStrength: 0,
      threshold: { min: 100, max: 200, critical: 220 },
      trend: 'down',
      alerts: ['Verbindung verloren', 'Batterie schwach']
    }
  ] as SensorData[])

  const [componentHealth, setComponentHealth] = useKV('iot-component-health', [
    {
      componentId: 'track_001',
      name: 'Hauptgleis 1-5',
      type: 'track',
      location: 'Hauptbahnhof',
      overallHealth: 92,
      sensorCount: 12,
      activeSensors: 11,
      criticalAlerts: 0,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      status: 'healthy'
    },
    {
      componentId: 'bridge_001',
      name: 'Eisenbahnbrücke Nord',
      type: 'bridge',
      location: 'Strecke A-B',
      overallHealth: 75,
      sensorCount: 8,
      activeSensors: 7,
      criticalAlerts: 1,
      lastMaintenance: '2023-11-20',
      nextMaintenance: '2024-02-20',
      status: 'warning'
    },
    {
      componentId: 'power_001',
      name: 'Oberleitung Sektor A',
      type: 'power',
      location: 'Zone A',
      overallHealth: 68,
      sensorCount: 6,
      activeSensors: 5,
      criticalAlerts: 2,
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      status: 'critical'
    }
  ] as ComponentHealth[])

  // Filter sensors based on selected criteria
  const filteredSensors = sensorData.filter(sensor => {
    const zoneMatch = selectedZone === 'all' || sensor.zone === selectedZone
    const typeMatch = selectedSensorType === 'all' || sensor.type === selectedSensorType
    return zoneMatch && typeMatch
  })

  // Get unique zones and sensor types for filters
  const zones = [...new Set(sensorData.map(s => s.zone))]
  const sensorTypes = [...new Set(sensorData.map(s => s.type))]

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setSensorData(current => current.map(sensor => ({
        ...sensor,
        value: sensor.status === 'offline' ? sensor.value : 
               sensor.value + (Math.random() - 0.5) * (sensor.threshold.max * 0.05),
        lastUpdate: sensor.status === 'offline' ? sensor.lastUpdate : new Date().toISOString(),
        trend: Math.random() > 0.6 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [autoRefresh, setSensorData])

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <ThermometerSimple size={16} />
      case 'humidity': return <Drop size={16} />
      case 'vibration': return <Activity size={16} />
      case 'pressure': return <Gauge size={16} />
      case 'current': return <Zap size={16} />
      case 'voltage': return <Zap size={16} />
      case 'proximity': return <Eye size={16} />
      case 'strain': return <Wrench size={16} />
      default: return <CircuitBoard size={16} />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="text-green-500" size={16} />
      case 'warning': return <Warning className="text-yellow-500" size={16} />
      case 'critical': return <AlertTriangle className="text-red-500" size={16} />
      case 'offline': return <XCircle className="text-gray-500" size={16} />
      default: return <Clock className="text-gray-400" size={16} />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendUp className="text-red-500" size={14} />
      case 'down': return <TrendDown className="text-blue-500" size={14} />
      case 'stable': return <Minus className="text-gray-500" size={14} />
      default: return null
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600'
    if (health >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const triggerMaintenance = (componentId: string) => {
    setComponentHealth(current => current.map(comp => 
      comp.componentId === componentId 
        ? { ...comp, status: 'maintenance' as const, lastMaintenance: new Date().toISOString().split('T')[0] }
        : comp
    ))
    toast.success('Wartung für Komponente eingeleitet')
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <CircuitBoard size={20} className="text-primary" />
            </div>
            IoT-Sensor Überwachung
          </h2>
          <p className="text-muted-foreground mt-1">
            Echtzeit-Monitoring der Eisenbahn-Infrastruktur durch IoT-Sensoren
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2"
          >
            <Activity size={16} />
            {autoRefresh ? 'Live' : 'Pausiert'}
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktive Sensoren</p>
                <p className="text-2xl font-bold text-green-600">
                  {sensorData.filter(s => s.status === 'online').length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnungen</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {sensorData.filter(s => s.status === 'warning').length}
                </p>
              </div>
              <Warning className="text-yellow-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kritische Alarme</p>
                <p className="text-2xl font-bold text-red-600">
                  {sensorData.filter(s => s.status === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="text-red-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-gray-600">
                  {sensorData.filter(s => s.status === 'offline').length}
                </p>
              </div>
              <XCircle className="text-gray-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sensors">Sensor Details</TabsTrigger>
          <TabsTrigger value="components">Komponenten-Gesundheit</TabsTrigger>
          <TabsTrigger value="alerts">Aktive Alarme</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Zone:</span>
              <div className="flex gap-1">
                <Button
                  variant={selectedZone === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedZone('all')}
                >
                  Alle
                </Button>
                {zones.map(zone => (
                  <Button
                    key={zone}
                    variant={selectedZone === zone ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedZone(zone)}
                  >
                    {zone}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Typ:</span>
              <div className="flex gap-1">
                <Button
                  variant={selectedSensorType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSensorType('all')}
                >
                  Alle
                </Button>
                {sensorTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedSensorType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSensorType(type)}
                    className="gap-1"
                  >
                    {getSensorIcon(type)}
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Sensor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSensors.map(sensor => (
              <Card key={sensor.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getSensorIcon(sensor.type)}
                      <div>
                        <CardTitle className="text-base">{sensor.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {sensor.location}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(sensor.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Current Value */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {sensor.value.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">{sensor.unit}</span>
                      {getTrendIcon(sensor.trend)}
                    </div>
                    <Badge variant={sensor.status === 'online' ? 'default' : 
                                   sensor.status === 'warning' ? 'secondary' : 'destructive'}>
                      {sensor.status}
                    </Badge>
                  </div>

                  {/* Value Range */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Min: {sensor.threshold.min}</span>
                      <span>Max: {sensor.threshold.max}</span>
                    </div>
                    <Progress 
                      value={Math.min(100, Math.max(0, ((sensor.value - sensor.threshold.min) / (sensor.threshold.max - sensor.threshold.min)) * 100))}
                      className="h-2"
                    />
                  </div>

                  {/* Battery and Signal */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Battery size={14} className={sensor.batteryLevel > 20 ? 'text-green-500' : 'text-red-500'} />
                      <span className="text-sm">{sensor.batteryLevel}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <WifiHigh size={14} className={sensor.signalStrength > 50 ? 'text-green-500' : 'text-yellow-500'} />
                      <span className="text-sm">{sensor.signalStrength}%</span>
                    </div>
                  </div>

                  {/* Last Update */}
                  <div className="text-xs text-muted-foreground">
                    Letzte Aktualisierung: {new Date(sensor.lastUpdate).toLocaleTimeString()}
                  </div>

                  {/* Alerts */}
                  {sensor.alerts.length > 0 && (
                    <div className="space-y-1">
                      {sensor.alerts.map((alert, index) => (
                        <Alert key={index} variant="destructive" className="py-2">
                          <AlertTriangle size={14} />
                          <AlertDescription className="text-xs">
                            {alert}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {componentHealth.map(component => (
              <Card key={component.componentId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin size={16} />
                        {component.name}
                      </CardTitle>
                      <CardDescription>{component.location}</CardDescription>
                    </div>
                    <Badge variant={component.status === 'healthy' ? 'default' :
                                   component.status === 'warning' ? 'secondary' : 'destructive'}>
                      {component.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Health Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Gesundheitswert</span>
                      <span className={`text-lg font-bold ${getHealthColor(component.overallHealth)}`}>
                        {component.overallHealth}%
                      </span>
                    </div>
                    <Progress value={component.overallHealth} className="h-2" />
                  </div>

                  {/* Sensor Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Aktive Sensoren</p>
                      <p className="text-xl font-bold">
                        {component.activeSensors}/{component.sensorCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kritische Alarme</p>
                      <p className="text-xl font-bold text-red-600">
                        {component.criticalAlerts}
                      </p>
                    </div>
                  </div>

                  {/* Maintenance Schedule */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Letzte Wartung:</span>
                      <span>{new Date(component.lastMaintenance).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nächste Wartung:</span>
                      <span>{new Date(component.nextMaintenance).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {component.status === 'critical' && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => triggerMaintenance(component.componentId)}
                    >
                      <Wrench size={16} className="mr-2" />
                      Sofortige Wartung einleiten
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {sensorData.filter(s => s.alerts.length > 0).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine aktiven Alarme</h3>
                <p className="text-muted-foreground">
                  Alle IoT-Sensoren arbeiten innerhalb der normalen Parameter.
                </p>
              </CardContent>
            </Card>
          ) : (
            sensorData.filter(s => s.alerts.length > 0).map(sensor => (
              <Alert key={sensor.id} variant="destructive">
                <AlertTriangle size={16} />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{sensor.name}</h4>
                      <p className="text-sm text-muted-foreground">{sensor.location}</p>
                    </div>
                    <Badge variant="destructive">{sensor.status}</Badge>
                  </div>
                  <div className="space-y-1">
                    {sensor.alerts.map((alert, index) => (
                      <AlertDescription key={index} className="text-sm">
                        • {alert}
                      </AlertDescription>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Aktuelle Werte: {sensor.value.toFixed(1)} {sensor.unit} | 
                    Letzte Aktualisierung: {new Date(sensor.lastUpdate).toLocaleTimeString()}
                  </p>
                </div>
              </Alert>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default IoTSensorMonitoring