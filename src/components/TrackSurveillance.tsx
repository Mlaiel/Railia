import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  ShieldCheck, 
  AlertTriangle, 
  Eye,
  MapPin,
  Brain,
  Heart,
  Phone,
  CheckCircle,
  Clock,
  Users,
  Camera
} from '@phosphor-icons/react'

interface SecurityIncident {
  id: string
  type: 'intrusion' | 'suicide-risk' | 'vandalism' | 'suspicious-behavior'
  location: string
  coordinates: { lat: number; lng: number }
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'detected' | 'investigating' | 'responding' | 'resolved'
  aiConfidence: number
  responseTime?: number
}

interface SurveillanceZone {
  id: string
  name: string
  cameras: number
  activeCameras: number
  riskLevel: 'low' | 'medium' | 'high'
  lastIncident?: string
  aiAnomalies: number
}

interface PreventionResource {
  type: 'counselor' | 'security' | 'medical' | 'drone'
  location: string
  status: 'available' | 'deployed' | 'busy'
  eta?: number
}

export default function TrackSurveillance() {
  const [incidents, setIncidents] = useKV<SecurityIncident[]>('security-incidents', [])
  const [zones, setZones] = useKV<SurveillanceZone[]>('surveillance-zones', [])
  const [resources, setResources] = useKV<PreventionResource[]>('prevention-resources', [])
  const [analytics, setAnalytics] = useKV('surveillance-analytics', {
    totalIncidents: 47,
    prevented: 42,
    averageResponseTime: 4.2,
    aiAccuracy: 94.7
  })

  useEffect(() => {
    if (incidents.length === 0) {
      const mockIncidents: SecurityIncident[] = [
        {
          id: 'SI001',
          type: 'suicide-risk',
          location: 'Bridge Section 7A',
          coordinates: { lat: 52.5200, lng: 13.4050 },
          timestamp: new Date(Date.now() - 900000).toISOString(),
          severity: 'critical',
          status: 'responding',
          aiConfidence: 97,
          responseTime: 3.2
        },
        {
          id: 'SI002', 
          type: 'intrusion',
          location: 'Track Junction 14B',
          coordinates: { lat: 52.5100, lng: 13.3950 },
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          severity: 'medium',
          status: 'resolved',
          aiConfidence: 89,
          responseTime: 5.1
        },
        {
          id: 'SI003',
          type: 'suspicious-behavior',
          location: 'Platform Extension 3',
          coordinates: { lat: 52.5300, lng: 13.4150 },
          timestamp: new Date(Date.now() - 300000).toISOString(),
          severity: 'low',
          status: 'investigating',
          aiConfidence: 76
        }
      ]
      setIncidents(mockIncidents)
    }

    if (zones.length === 0) {
      const mockZones: SurveillanceZone[] = [
        {
          id: 'SZ001',
          name: 'Central District',
          cameras: 24,
          activeCameras: 23,
          riskLevel: 'medium',
          lastIncident: '2 hours ago',
          aiAnomalies: 3
        },
        {
          id: 'SZ002',
          name: 'Bridge Networks',
          cameras: 18,
          activeCameras: 18,
          riskLevel: 'high',
          lastIncident: '15 minutes ago',
          aiAnomalies: 7
        },
        {
          id: 'SZ003',
          name: 'Suburban Lines',
          cameras: 32,
          activeCameras: 30,
          riskLevel: 'low',
          lastIncident: '6 hours ago',
          aiAnomalies: 1
        },
        {
          id: 'SZ004',
          name: 'Industrial Section',
          cameras: 16,
          activeCameras: 15,
          riskLevel: 'medium',
          lastIncident: '1 hour ago',
          aiAnomalies: 2
        }
      ]
      setZones(mockZones)
    }

    if (resources.length === 0) {
      const mockResources: PreventionResource[] = [
        { type: 'counselor', location: 'Crisis Center Alpha', status: 'available' },
        { type: 'counselor', location: 'Crisis Center Beta', status: 'deployed', eta: 8 },
        { type: 'security', location: 'Security Station 1', status: 'available' },
        { type: 'security', location: 'Security Station 2', status: 'busy' },
        { type: 'medical', location: 'Emergency Unit 7', status: 'available' },
        { type: 'drone', location: 'Drone Base North', status: 'deployed', eta: 12 }
      ]
      setResources(mockResources)
    }
  }, [incidents, setIncidents, zones, setZones, resources, setResources])

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
      case 'investigating': return 'secondary'
      case 'responding': return 'default'
      case 'resolved': return 'default'
      default: return 'default'
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

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'suicide-risk': return <Heart size={16} className="text-red-600" />
      case 'intrusion': return <AlertTriangle size={16} className="text-amber-600" />
      case 'vandalism': return <ShieldCheck size={16} className="text-blue-600" />
      case 'suspicious-behavior': return <Eye size={16} className="text-purple-600" />
      default: return <AlertTriangle size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={20} className="text-primary" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalIncidents}</p>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.prevented}</p>
                <p className="text-sm text-muted-foreground">Lives Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.averageResponseTime}m</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain size={20} className="text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.aiAccuracy}%</p>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alert */}
      {incidents.some(i => i.severity === 'critical' && i.status !== 'resolved') && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            CRITICAL INCIDENT: Suicide risk detected at Bridge Section 7A - Emergency response deployed
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Active Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Active Security Incidents</CardTitle>
            <CardDescription>Real-time threat detection and response coordination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidents.filter(i => i.status !== 'resolved').map(incident => (
                <div key={incident.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getIncidentIcon(incident.type)}
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium capitalize">
                        {incident.type.replace('-', ' ')}
                      </span>
                    </div>
                    <Badge variant={getStatusColor(incident.status)}>
                      {incident.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span>{incident.location}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(incident.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      AI Confidence: {incident.aiConfidence}%
                    </span>
                    {incident.responseTime && (
                      <span className="text-muted-foreground">
                        Response: {incident.responseTime}m
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Surveillance Zones */}
        <Card>
          <CardHeader>
            <CardTitle>Surveillance Zone Status</CardTitle>
            <CardDescription>AI monitoring coverage and anomaly detection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zones.map(zone => (
                <div key={zone.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{zone.name}</h4>
                    <Badge variant={getRiskColor(zone.riskLevel)}>
                      {zone.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{zone.activeCameras}/{zone.cameras}</p>
                      <p className="text-muted-foreground">Cameras</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{zone.aiAnomalies}</p>
                      <p className="text-muted-foreground">Anomalies</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{zone.lastIncident || 'None'}</p>
                      <p className="text-muted-foreground">Last Event</p>
                    </div>
                  </div>

                  <Progress 
                    value={(zone.activeCameras / zone.cameras) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prevention Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Response Resources</CardTitle>
          <CardDescription>Crisis intervention teams and emergency services coordination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {['counselor', 'security', 'medical', 'drone'].map(type => {
              const typeResources = resources.filter(r => r.type === type)
              const available = typeResources.filter(r => r.status === 'available').length
              const total = typeResources.length

              return (
                <div key={type} className="p-4 rounded-lg border text-center">
                  <div className="flex justify-center mb-2">
                    {type === 'counselor' && <Heart size={24} className="text-pink-600" />}
                    {type === 'security' && <ShieldCheck size={24} className="text-blue-600" />}
                    {type === 'medical' && <Phone size={24} className="text-red-600" />}
                    {type === 'drone' && <Eye size={24} className="text-purple-600" />}
                  </div>
                  <h4 className="font-medium capitalize mb-1">{type} Units</h4>
                  <p className="text-2xl font-bold mb-1">{available}/{total}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                  
                  {available > 0 ? (
                    <Badge variant="default" className="mt-2">Ready</Badge>
                  ) : (
                    <Badge variant="destructive" className="mt-2">All Deployed</Badge>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-3">Active Deployments</h4>
            <div className="space-y-2">
              {resources.filter(r => r.status === 'deployed').map((resource, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">{resource.type}</Badge>
                    <span className="text-sm">{resource.location}</span>
                  </div>
                  {resource.eta && (
                    <span className="text-sm text-muted-foreground">ETA: {resource.eta}m</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}