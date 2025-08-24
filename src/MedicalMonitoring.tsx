import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  Phone, 
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  Pulse,
  FirstAid,
  Ambulance,
  Train
} from '@phosphor-icons/react'

interface MedicalIncident {
  id: string
  type: 'cardiac' | 'fall' | 'seizure' | 'respiratory' | 'injury' | 'panic'
  trainId: string
  carriage: number
  location: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'detected' | 'confirmed' | 'responding' | 'treated' | 'evacuated'
  responseTime?: number
  aiConfidence: number
  vitalSigns?: {
    heartRate?: number
    movement?: boolean
    consciousness?: 'conscious' | 'unconscious' | 'unknown'
  }
}

interface MedicalResource {
  id: string
  type: 'paramedic' | 'nurse' | 'doctor' | 'first-aid'
  name: string
  location: string
  status: 'available' | 'en-route' | 'on-scene' | 'busy'
  specialization?: string
  eta?: number
}

interface HealthMonitor {
  trainId: string
  totalPassengers: number
  activeMonitoring: number
  anomaliesDetected: number
  systemStatus: 'online' | 'offline' | 'maintenance'
  lastHealthScan: string
}

export default function MedicalMonitoring() {
  const [incidents, setIncidents] = useKV<MedicalIncident[]>('medical-incidents', [])
  const [resources, setResources] = useKV<MedicalResource[]>('medical-resources', [])
  const [monitors, setMonitors] = useKV<HealthMonitor[]>('health-monitors', [])
  const [medicalStats, setMedicalStats] = useKV('medical-stats', {
    totalIncidents: 23,
    averageResponseTime: 3.8,
    livesAssisted: 89,
    systemAccuracy: 91.4
  })

  useEffect(() => {
    if (incidents.length === 0) {
      const mockIncidents: MedicalIncident[] = [
        {
          id: 'MI001',
          type: 'cardiac',
          trainId: 'ICE1001',
          carriage: 4,
          location: 'Carriage 4, Seat 15A',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          severity: 'critical',
          status: 'responding',
          responseTime: 2.1,
          aiConfidence: 96,
          vitalSigns: {
            heartRate: 145,
            movement: false,
            consciousness: 'conscious'
          }
        },
        {
          id: 'MI002',
          type: 'fall',
          trainId: 'RE4501',
          carriage: 2,
          location: 'Carriage 2, Aisle',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          severity: 'medium',
          status: 'treated',
          responseTime: 4.3,
          aiConfidence: 87,
          vitalSigns: {
            movement: true,
            consciousness: 'conscious'
          }
        },
        {
          id: 'MI003',
          type: 'panic',
          trainId: 'RB2334',
          carriage: 1,
          location: 'Carriage 1, Seat 8B',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          severity: 'low',
          status: 'confirmed',
          aiConfidence: 73,
          vitalSigns: {
            heartRate: 98,
            movement: true,
            consciousness: 'conscious'
          }
        }
      ]
      setIncidents(mockIncidents)
    }

    if (resources.length === 0) {
      const mockResources: MedicalResource[] = [
        {
          id: 'MR001',
          type: 'paramedic',
          name: 'Emergency Unit 7',
          location: 'Station Medical Center',
          status: 'en-route',
          specialization: 'Cardiac Care',
          eta: 6
        },
        {
          id: 'MR002',
          type: 'doctor',
          name: 'Dr. Sarah Chen',
          location: 'Train ICE1001',
          status: 'on-scene',
          specialization: 'Emergency Medicine'
        },
        {
          id: 'MR003',
          type: 'first-aid',
          name: 'Conductor Martinez',
          location: 'Train RE4501',
          status: 'available',
          specialization: 'Basic Life Support'
        },
        {
          id: 'MR004',
          type: 'nurse',
          name: 'Mobile Health Unit 3',
          location: 'Central Station',
          status: 'available',
          specialization: 'Trauma Care'
        }
      ]
      setResources(mockResources)
    }

    if (monitors.length === 0) {
      const mockMonitors: HealthMonitor[] = [
        {
          trainId: 'ICE1001',
          totalPassengers: 456,
          activeMonitoring: 423,
          anomaliesDetected: 1,
          systemStatus: 'online',
          lastHealthScan: new Date(Date.now() - 30000).toISOString()
        },
        {
          trainId: 'RE4501',
          totalPassengers: 342,
          activeMonitoring: 298,
          anomaliesDetected: 0,
          systemStatus: 'online',
          lastHealthScan: new Date(Date.now() - 45000).toISOString()
        },
        {
          trainId: 'RB2334',
          totalPassengers: 189,
          activeMonitoring: 167,
          anomaliesDetected: 1,
          systemStatus: 'online',
          lastHealthScan: new Date(Date.now() - 60000).toISOString()
        },
        {
          trainId: 'IC7812',
          totalPassengers: 298,
          activeMonitoring: 0,
          anomaliesDetected: 0,
          systemStatus: 'maintenance',
          lastHealthScan: new Date(Date.now() - 3600000).toISOString()
        }
      ]
      setMonitors(mockMonitors)
    }
  }, [incidents, setIncidents, resources, setResources, monitors, setMonitors])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'default'
      case 'medium': return 'secondary'
      case 'high': return 'destructive'
      case 'critical': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'destructive'
      case 'confirmed': return 'destructive'
      case 'responding': return 'secondary'
      case 'treated': return 'default'
      case 'evacuated': return 'default'
      default: return 'default'
    }
  }

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'cardiac': return <Heart size={16} className="text-red-600" />
      case 'fall': return <AlertTriangle size={16} className="text-amber-600" />
      case 'seizure': return <Pulse size={16} className="text-purple-600" />
      case 'respiratory': return <Activity size={16} className="text-blue-600" />
      case 'injury': return <FirstAid size={16} className="text-green-600" />
      case 'panic': return <Heart size={16} className="text-pink-600" />
      default: return <Heart size={16} />
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'paramedic': return <Ambulance size={16} className="text-red-600" />
      case 'doctor': return <FirstAid size={16} className="text-blue-600" />
      case 'nurse': return <Heart size={16} className="text-pink-600" />
      case 'first-aid': return <FirstAid size={16} className="text-green-600" />
      default: return <FirstAid size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Medical Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart size={20} className="text-red-600" />
              <div>
                <p className="text-2xl font-bold">{medicalStats.totalIncidents}</p>
                <p className="text-sm text-muted-foreground">Medical Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{medicalStats.averageResponseTime}m</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">{medicalStats.livesAssisted}</p>
                <p className="text-sm text-muted-foreground">Lives Assisted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity size={20} className="text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{medicalStats.systemAccuracy}%</p>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Medical Alert */}
      {incidents.some(i => i.severity === 'critical' && ['detected', 'confirmed', 'responding'].includes(i.status)) && (
        <Alert className="border-destructive bg-destructive/10">
          <Heart className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            MEDICAL EMERGENCY: Cardiac incident detected on ICE1001 Carriage 4 - Emergency response active
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Active Medical Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Active Medical Incidents</CardTitle>
            <CardDescription>Real-time health monitoring and emergency response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.filter(i => !['treated', 'evacuated'].includes(i.status)).map(incident => (
                <div key={incident.id} className="p-3 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getIncidentIcon(incident.type)}
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium capitalize">
                        {incident.type} Emergency
                      </span>
                    </div>
                    <Badge variant={getStatusColor(incident.status)}>
                      {incident.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Train size={14} className="text-muted-foreground" />
                        <span className="font-medium">{incident.trainId}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>{incident.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{incident.aiConfidence}% Confidence</p>
                      <p className="text-muted-foreground">
                        {new Date(incident.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {incident.vitalSigns && (
                    <div className="pt-2 border-t">
                      <h5 className="text-sm font-medium mb-2">Vital Signs</h5>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {incident.vitalSigns.heartRate && (
                          <div className="text-center">
                            <p className="font-medium">{incident.vitalSigns.heartRate}</p>
                            <p className="text-muted-foreground">BPM</p>
                          </div>
                        )}
                        <div className="text-center">
                          <p className="font-medium">{incident.vitalSigns.movement ? 'Yes' : 'No'}</p>
                          <p className="text-muted-foreground">Movement</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium capitalize">{incident.vitalSigns.consciousness}</p>
                          <p className="text-muted-foreground">Consciousness</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Train Health Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle>Train Health Monitoring</CardTitle>
            <CardDescription>AI-powered passenger health surveillance systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monitors.map(monitor => (
                <div key={monitor.trainId} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Train size={16} />
                      <span className="font-medium">{monitor.trainId}</span>
                    </div>
                    <Badge variant={monitor.systemStatus === 'online' ? 'default' : 
                                  monitor.systemStatus === 'maintenance' ? 'secondary' : 'destructive'}>
                      {monitor.systemStatus.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{monitor.totalPassengers}</p>
                      <p className="text-muted-foreground">Total Passengers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{monitor.activeMonitoring}</p>
                      <p className="text-muted-foreground">Monitored</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-destructive">{monitor.anomaliesDetected}</p>
                      <p className="text-muted-foreground">Anomalies</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <Progress 
                      value={monitor.totalPassengers > 0 ? (monitor.activeMonitoring / monitor.totalPassengers) * 100 : 0} 
                      className="flex-1 mr-2 h-2" 
                    />
                    <span className="text-muted-foreground">
                      Last scan: {new Date(monitor.lastHealthScan).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Resources & Response */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Response Resources</CardTitle>
          <CardDescription>Emergency medical personnel and equipment coordination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Active Medical Personnel</h4>
              <div className="space-y-3">
                {resources.map(resource => (
                  <div key={resource.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      {getResourceIcon(resource.type)}
                      <div>
                        <p className="font-medium">{resource.name}</p>
                        <p className="text-sm text-muted-foreground">{resource.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={
                        resource.status === 'available' ? 'default' : 
                        resource.status === 'en-route' ? 'secondary' : 
                        'destructive'
                      }>
                        {resource.status.toUpperCase()}
                      </Badge>
                      {resource.eta && (
                        <p className="text-sm text-muted-foreground mt-1">ETA: {resource.eta}m</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Response Performance</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Detection Accuracy</span>
                    <span>91.4%</span>
                  </div>
                  <Progress value={91.4} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Response Time</span>
                    <span>95.2%</span>
                  </div>
                  <Progress value={95.2} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Treatment Success</span>
                    <span>98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-3" />
                </div>

                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Emergency Contacts</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Hospital Network</span>
                    <Badge variant="outline">Connected</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical AI Model</span>
                    <Badge variant="outline">v3.1.2</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}