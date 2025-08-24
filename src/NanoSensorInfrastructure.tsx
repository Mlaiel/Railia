/**
 * @fileoverview Nano-Sensoren in Gleisinfrastruktur
 * @author SmartRail-AI System
 * @version 2.0.0
 * 
 * Molekulare Sensoren für ultra-präzise Überwachung der Gleisinfrastruktur
 * mit Nanotechnologie für Mikro-Bewegungen, Materialermüdung und strukturelle Integrität
 */

import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Atom, 
  Target, 
  Activity, 
  AlertTriangle, 
  TrendUp,
  Lightning,
  Database,
  Gear,
  MagnifyingGlass,
  Pulse,
  Graph,
  MapPin,
  Clock,
  Warning,
  CheckCircle,
  Monitor
} from '@phosphor-icons/react'

interface NanoSensor {
  id: string
  type: 'molecular' | 'quantum' | 'carbon_nanotube' | 'graphene' | 'piezoelectric'
  position: {
    track: string
    kilometer: number
    x: number
    y: number
    z: number
  }
  status: 'active' | 'calibrating' | 'maintenance' | 'error'
  batteryLevel: number
  signalStrength: number
  measurements: {
    vibration: number
    temperature: number
    pressure: number
    strain: number
    magneticField: number
    humidity: number
  }
  alerts: Array<{
    type: 'micro_crack' | 'wear' | 'expansion' | 'electromagnetic' | 'contamination'
    severity: 'low' | 'medium' | 'high' | 'critical'
    timestamp: string
    value: number
  }>
}

interface MolecularData {
  atomicStructure: string
  bondStrength: number
  molecularVibration: number
  crystallineDefects: number
  corrosionLevel: number
}

const NanoSensorInfrastructure: React.FC = () => {
  const [nanoSensors, setNanoSensors] = useKV<NanoSensor[]>('nano-sensors', [])
  const [molecularAnalysis, setMolecularAnalysis] = useKV<Record<string, MolecularData>>('molecular-analysis', {})
  const [systemConfig, setSystemConfig] = useKV('nano-sensor-config', {
    scanInterval: 1000, // Millisekunden
    alertThreshold: 0.001, // Nanometer-Bewegungen
    quantumCalibration: true,
    molecularMapping: true,
    realTimeAnalysis: true
  })

  const [analyticsData, setAnalyticsData] = useState({
    totalSensors: 0,
    activeSensors: 0,
    criticalAlerts: 0,
    avgAccuracy: 0,
    dataPoints: 0,
    molecularChanges: 0
  })

  // Simulation der Nano-Sensoren
  useEffect(() => {
    if (nanoSensors.length === 0) {
      const mockNanoSensors: NanoSensor[] = [
        {
          id: 'nano-mol-001',
          type: 'molecular',
          position: { track: 'Gleis 1', kilometer: 12.347, x: 1.2347, y: 0.0001, z: 0.5678 },
          status: 'active',
          batteryLevel: 94,
          signalStrength: 98,
          measurements: {
            vibration: 0.00012, // Nanometer
            temperature: 23.4567,
            pressure: 101325.67,
            strain: 0.000089,
            magneticField: 45.67,
            humidity: 67.8
          },
          alerts: [
            {
              type: 'micro_crack',
              severity: 'medium',
              timestamp: new Date().toISOString(),
              value: 0.00034
            }
          ]
        },
        {
          id: 'nano-qnt-002', 
          type: 'quantum',
          position: { track: 'Gleis 2', kilometer: 15.892, x: 2.8921, y: 0.0002, z: 0.7123 },
          status: 'active',
          batteryLevel: 87,
          signalStrength: 96,
          measurements: {
            vibration: 0.00008,
            temperature: 24.1234,
            pressure: 101298.45,
            strain: 0.000067,
            magneticField: 47.23,
            humidity: 65.2
          },
          alerts: []
        },
        {
          id: 'nano-cnt-003',
          type: 'carbon_nanotube',
          position: { track: 'Gleis 3', kilometer: 8.456, x: 0.4567, y: 0.0001, z: 0.3894 },
          status: 'calibrating',
          batteryLevel: 92,
          signalStrength: 94,
          measurements: {
            vibration: 0.00015,
            temperature: 22.8901,
            pressure: 101356.78,
            strain: 0.000123,
            magneticField: 43.89,
            humidity: 69.1
          },
          alerts: [
            {
              type: 'electromagnetic',
              severity: 'low',
              timestamp: new Date().toISOString(),
              value: 0.00012
            }
          ]
        },
        {
          id: 'nano-grp-004',
          type: 'graphene',
          position: { track: 'Gleis 4', kilometer: 23.108, x: 3.1087, y: 0.0003, z: 0.9876 },
          status: 'active',
          batteryLevel: 99,
          signalStrength: 99,
          measurements: {
            vibration: 0.00005,
            temperature: 25.6789,
            pressure: 101289.12,
            strain: 0.000045,
            magneticField: 48.56,
            humidity: 63.4
          },
          alerts: []
        },
        {
          id: 'nano-pzo-005',
          type: 'piezoelectric',
          position: { track: 'Gleis 5', kilometer: 31.567, x: 1.5678, y: 0.0002, z: 0.6543 },
          status: 'error',
          batteryLevel: 23,
          signalStrength: 45,
          measurements: {
            vibration: 0.00089,
            temperature: 26.7890,
            pressure: 101267.89,
            strain: 0.000234,
            magneticField: 52.34,
            humidity: 71.8
          },
          alerts: [
            {
              type: 'wear',
              severity: 'critical',
              timestamp: new Date().toISOString(),
              value: 0.00089
            }
          ]
        }
      ]
      setNanoSensors(mockNanoSensors)

      // Molekulare Analysedaten
      const mockMolecularData: Record<string, MolecularData> = {
        'nano-mol-001': {
          atomicStructure: 'Fe₅₄C₂₁Ni₁₂Cr₁₃',
          bondStrength: 1247.56, // kJ/mol
          molecularVibration: 1567.89, // cm⁻¹
          crystallineDefects: 0.0234, // %
          corrosionLevel: 0.0012 // µm/Jahr
        },
        'nano-qnt-002': {
          atomicStructure: 'Fe₅₆C₁₉Ni₁₄Cr₁₁',
          bondStrength: 1289.34,
          molecularVibration: 1543.21,
          crystallineDefects: 0.0189,
          corrosionLevel: 0.0008
        }
      }
      setMolecularAnalysis(mockMolecularData)
    }

    // Echtzeit-Analytics aktualisieren
    const interval = setInterval(() => {
      const activeSensors = nanoSensors.filter(s => s.status === 'active').length
      const criticalAlerts = nanoSensors.reduce((sum, sensor) => 
        sum + sensor.alerts.filter(alert => alert.severity === 'critical').length, 0
      )
      const avgAccuracy = nanoSensors.reduce((sum, sensor) => sum + sensor.signalStrength, 0) / nanoSensors.length

      setAnalyticsData(prev => ({
        totalSensors: nanoSensors.length,
        activeSensors,
        criticalAlerts,
        avgAccuracy: avgAccuracy || 0,
        dataPoints: prev.dataPoints + activeSensors * 6, // 6 Messwerte pro Sensor
        molecularChanges: prev.molecularChanges + Math.floor(Math.random() * 3)
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [nanoSensors, setNanoSensors, setMolecularAnalysis])

  const calibrateQuantumSensors = async () => {
    try {
      const quantumSensors = nanoSensors.filter(sensor => sensor.type === 'quantum')
      
      setNanoSensors(currentSensors => 
        currentSensors.map(sensor => 
          sensor.type === 'quantum' 
            ? { ...sensor, status: 'calibrating' as const }
            : sensor
        )
      )

      toast.info('Quantum-Sensor-Kalibrierung gestartet...', {
        description: `${quantumSensors.length} Quantum-Sensoren werden kalibriert`
      })

      // Simuliere Kalibrierung
      setTimeout(() => {
        setNanoSensors(currentSensors => 
          currentSensors.map(sensor => 
            sensor.type === 'quantum' && sensor.status === 'calibrating'
              ? { 
                  ...sensor, 
                  status: 'active' as const,
                  signalStrength: Math.min(100, sensor.signalStrength + 5)
                }
              : sensor
          )
        )
        toast.success('Quantum-Sensor-Kalibrierung abgeschlossen')
      }, 3000)

    } catch (error) {
      toast.error('Fehler bei der Quantum-Sensor-Kalibrierung')
    }
  }

  const performMolecularAnalysis = async (sensorId: string) => {
    try {
      toast.info('Molekulare Analyse gestartet...', {
        description: 'Atomare Struktur wird analysiert'
      })

      // Simuliere molekulare Analyse
      setTimeout(() => {
        const newAnalysis: MolecularData = {
          atomicStructure: `Fe₅${Math.floor(Math.random() * 10)}C₂${Math.floor(Math.random() * 5)}Ni₁${Math.floor(Math.random() * 8)}Cr₁${Math.floor(Math.random() * 5)}`,
          bondStrength: 1200 + Math.random() * 200,
          molecularVibration: 1500 + Math.random() * 100,
          crystallineDefects: Math.random() * 0.05,
          corrosionLevel: Math.random() * 0.002
        }

        setMolecularAnalysis(current => ({
          ...current,
          [sensorId]: newAnalysis
        }))

        toast.success('Molekulare Analyse abgeschlossen', {
          description: 'Neue atomare Strukturdaten verfügbar'
        })
      }, 2500)

    } catch (error) {
      toast.error('Fehler bei der molekularen Analyse')
    }
  }

  const getSensorTypeColor = (type: NanoSensor['type']) => {
    switch (type) {
      case 'molecular': return 'bg-blue-500'
      case 'quantum': return 'bg-purple-500'
      case 'carbon_nanotube': return 'bg-gray-700'
      case 'graphene': return 'bg-green-500'
      case 'piezoelectric': return 'bg-yellow-500'
      default: return 'bg-gray-400'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600'
      case 'medium': return 'text-orange-600'
      case 'high': return 'text-red-600'
      case 'critical': return 'text-red-800'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Atom size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nano-Sensoren Infrastruktur</h1>
            <p className="text-muted-foreground">Molekulare Sensoren in der Gleisinfrastruktur</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={calibrateQuantumSensors}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Target size={16} className="mr-2" />
            Quantum-Kalibrierung
          </Button>
          <Button 
            onClick={() => toast.info('Nano-Sensoren werden synchronisiert...')}
            variant="outline"
          >
            <Lightning size={16} className="mr-2" />
            Synchronisieren
          </Button>
        </div>
      </div>

      {/* System-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Gesamt-Sensoren</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{analyticsData.totalSensors}</div>
            <p className="text-xs text-muted-foreground">Nano-Einheiten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aktive Sensoren</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{analyticsData.activeSensors}</div>
            <p className="text-xs text-muted-foreground">Online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Kritische Alarme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{analyticsData.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Sofortige Aufmerksamkeit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ø Genauigkeit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{analyticsData.avgAccuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Signal-Qualität</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Datenpunkte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{analyticsData.dataPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Seit Start</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Molekulare Änderungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{analyticsData.molecularChanges}</div>
            <p className="text-xs text-muted-foreground">Letzte 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Nano-Sensor Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor size={20} />
              Aktive Nano-Sensoren
            </CardTitle>
            <CardDescription>Echtzeit-Status aller molekularen Sensoren</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nanoSensors.map((sensor) => (
              <div key={sensor.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getSensorTypeColor(sensor.type)}`}></div>
                    <div>
                      <h4 className="font-semibold">{sensor.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        {sensor.type.replace('_', '-')} • {sensor.position.track} km {sensor.position.kilometer}
                      </p>
                    </div>
                  </div>
                  <Badge variant={sensor.status === 'active' ? "default" : 
                                 sensor.status === 'error' ? "destructive" : "secondary"}>
                    {sensor.status === 'active' ? 'Aktiv' : 
                     sensor.status === 'error' ? 'Fehler' : 
                     sensor.status === 'calibrating' ? 'Kalibrierung' : 'Wartung'}
                  </Badge>
                </div>

                {/* Präzise Messungen */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vibration (nm)</p>
                    <p className="font-mono font-semibold">{sensor.measurements.vibration.toFixed(5)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spannung (μ-strain)</p>
                    <p className="font-mono font-semibold">{sensor.measurements.strain.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Temperatur (°C)</p>
                    <p className="font-mono font-semibold">{sensor.measurements.temperature.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Druck (Pa)</p>
                    <p className="font-mono font-semibold">{sensor.measurements.pressure.toFixed(2)}</p>
                  </div>
                </div>

                {/* System-Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Batterie</span>
                      <span>{sensor.batteryLevel}%</span>
                    </div>
                    <Progress value={sensor.batteryLevel} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Signal</span>
                      <span>{sensor.signalStrength}%</span>
                    </div>
                    <Progress value={sensor.signalStrength} className="h-2" />
                  </div>
                </div>

                {/* Alarme */}
                {sensor.alerts.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Aktive Alarme</h5>
                    {sensor.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2 bg-destructive/10 rounded">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className={getSeverityColor(alert.severity)} />
                          <span>{alert.type.replace('_', ' ')}</span>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="text-xs">
                            {alert.severity}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {alert.value.toFixed(5)} nm
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => performMolecularAnalysis(sensor.id)}
                  >
                    <MagnifyingGlass size={14} className="mr-1" />
                    Molekular-Analyse
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={sensor.status !== 'active'}
                  >
                    <Pulse size={14} className="mr-1" />
                    Live-Stream
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={20} />
              Molekulare Analyse
            </CardTitle>
            <CardDescription>Atomare Strukturdaten der Gleisinfrastruktur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(molecularAnalysis).map(([sensorId, data]) => (
              <div key={sensorId} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{sensorId}</h4>
                  <Badge variant="outline">Molekular-Daten</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Atomare Struktur</p>
                    <p className="font-mono text-lg font-semibold">{data.atomicStructure}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Bindungsstärke</p>
                      <p className="font-semibold">{data.bondStrength.toFixed(2)} kJ/mol</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Molekular-Vibration</p>
                      <p className="font-semibold">{data.molecularVibration.toFixed(2)} cm⁻¹</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kristalline Defekte</p>
                      <p className="font-semibold">{(data.crystallineDefects * 100).toFixed(4)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Korrosionsrate</p>
                      <p className="font-semibold">{(data.corrosionLevel * 1000).toFixed(3)} nm/Jahr</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Strukturelle Integrität</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Bindungsstärke</span>
                        <span>{((data.bondStrength / 1500) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(data.bondStrength / 1500) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {Object.keys(molecularAnalysis).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Database size={48} className="mx-auto mb-4 opacity-50" />
                <p>Keine molekularen Analysedaten verfügbar</p>
                <p className="text-sm">Führen Sie eine Analyse an einem Sensor durch</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System-Konfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gear size={20} />
            Nano-Sensor Konfiguration
          </CardTitle>
          <CardDescription>Erweiterte Einstellungen für molekulare Sensorik</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Scan-Intervall</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-600">{systemConfig.scanInterval}</p>
                <p className="text-xs text-muted-foreground">Millisekunden</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Alert-Schwelle</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-orange-600">{systemConfig.alertThreshold}</p>
                <p className="text-xs text-muted-foreground">Nanometer</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Quantum-Kalibrierung</h4>
              <Badge variant={systemConfig.quantumCalibration ? "default" : "secondary"}>
                {systemConfig.quantumCalibration ? 'Aktiviert' : 'Deaktiviert'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Automatische Quantum-Justierung
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Molekular-Mapping</h4>
              <Badge variant={systemConfig.molecularMapping ? "default" : "secondary"}>
                {systemConfig.molecularMapping ? 'Aktiviert' : 'Deaktiviert'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                3D-Strukturanalyse
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Echtzeit-Analyse</h4>
              <Badge variant={systemConfig.realTimeAnalysis ? "default" : "secondary"}>
                {systemConfig.realTimeAnalysis ? 'Aktiviert' : 'Deaktiviert'}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Live-Datenverarbeitung
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status & Warnungen */}
      {analyticsData.criticalAlerts > 0 && (
        <Alert variant="destructive">
          <AlertTriangle size={16} />
          <AlertDescription>
            {analyticsData.criticalAlerts} kritische Alarm{analyticsData.criticalAlerts !== 1 ? 'e' : ''} von Nano-Sensoren erkannt. 
            Sofortige Inspektion der betroffenen Gleisabschnitte erforderlich.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default NanoSensorInfrastructure