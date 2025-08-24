import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  ShieldCheck, 
  Brain,
  Eye,
  Heart,
  CloudRain,
  Database,
  Wifi,
  Lock,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info
} from '@phosphor-icons/react'

interface SystemConfig {
  modules: {
    networkControl: boolean
    doorAnalytics: boolean
    trackSurveillance: boolean
    weatherForecasting: boolean
    medicalMonitoring: boolean
  }
  aiSettings: {
    confidenceThreshold: number
    predictionHorizon: number
    autoResponseEnabled: boolean
    learningMode: boolean
  }
  alertSettings: {
    criticalAlerts: boolean
    emailNotifications: boolean
    smsAlerts: boolean
    soundAlerts: boolean
  }
  privacySettings: {
    dataRetention: number
    anonymizeData: boolean
    localProcessing: boolean
    auditLogging: boolean
  }
}

interface SystemHealth {
  database: number
  aiProcessing: number
  networkConnection: number
  cameraSystem: number
  sensorNetwork: number
  weatherData: number
}

export default function SystemSettings() {
  const [config, setConfig] = useKV<SystemConfig>('system-config', {
    modules: {
      networkControl: true,
      doorAnalytics: true,
      trackSurveillance: true,
      weatherForecasting: true,
      medicalMonitoring: true
    },
    aiSettings: {
      confidenceThreshold: 85,
      predictionHorizon: 24,
      autoResponseEnabled: false,
      learningMode: true
    },
    alertSettings: {
      criticalAlerts: true,
      emailNotifications: true,
      smsAlerts: false,
      soundAlerts: true
    },
    privacySettings: {
      dataRetention: 30,
      anonymizeData: true,
      localProcessing: true,
      auditLogging: true
    }
  })

  const [systemHealth] = useKV<SystemHealth>('system-health', {
    database: 98,
    aiProcessing: 94,
    networkConnection: 99,
    cameraSystem: 96,
    sensorNetwork: 92,
    weatherData: 97
  })

  const [licenseInfo] = useKV('license-info', {
    version: 'SmartRail-AI v1.0.0',
    license: 'Humanitarian Use License',
    attribution: 'Fahed Mlaiel',
    email: 'mlaiel@live.de',
    lastUpdate: new Date().toISOString()
  })

  const updateConfig = (section: keyof SystemConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const getHealthColor = (value: number) => {
    if (value >= 95) return 'text-green-600'
    if (value >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-2xl font-bold">Operational</p>
                <p className="text-sm text-muted-foreground">System Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={20} className="text-blue-600" />
              <div>
                <p className="text-2xl font-bold">Secure</p>
                <p className="text-sm text-muted-foreground">Privacy Compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-purple-600" />
              <div>
                <p className="text-2xl font-bold">Humanitarian</p>
                <p className="text-sm text-muted-foreground">Public Good License</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Module Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>System Modules</CardTitle>
            <CardDescription>Enable or disable SmartRail-AI functional modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain size={16} className="text-primary" />
                <Label htmlFor="network-control">Network Control Center</Label>
              </div>
              <Switch 
                id="network-control"
                checked={config.modules.networkControl}
                onCheckedChange={(checked) => updateConfig('modules', 'networkControl', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye size={16} className="text-blue-600" />
                <Label htmlFor="door-analytics">Door Analytics AI</Label>
              </div>
              <Switch 
                id="door-analytics"
                checked={config.modules.doorAnalytics}
                onCheckedChange={(checked) => updateConfig('modules', 'doorAnalytics', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={16} className="text-green-600" />
                <Label htmlFor="track-surveillance">Track Surveillance</Label>
              </div>
              <Switch 
                id="track-surveillance"
                checked={config.modules.trackSurveillance}
                onCheckedChange={(checked) => updateConfig('modules', 'trackSurveillance', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CloudRain size={16} className="text-amber-600" />
                <Label htmlFor="weather-forecasting">Weather Forecasting</Label>
              </div>
              <Switch 
                id="weather-forecasting"
                checked={config.modules.weatherForecasting}
                onCheckedChange={(checked) => updateConfig('modules', 'weatherForecasting', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart size={16} className="text-red-600" />
                <Label htmlFor="medical-monitoring">Medical Monitoring</Label>
              </div>
              <Switch 
                id="medical-monitoring"
                checked={config.modules.medicalMonitoring}
                onCheckedChange={(checked) => updateConfig('modules', 'medicalMonitoring', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>AI Engine Settings</CardTitle>
            <CardDescription>Configure artificial intelligence parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium">AI Confidence Threshold: {config.aiSettings.confidenceThreshold}%</Label>
              <Slider
                value={[config.aiSettings.confidenceThreshold]}
                onValueChange={([value]) => updateConfig('aiSettings', 'confidenceThreshold', value)}
                max={100}
                min={50}
                step={5}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum confidence required for automated actions
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Prediction Horizon: {config.aiSettings.predictionHorizon} hours</Label>
              <Slider
                value={[config.aiSettings.predictionHorizon]}
                onValueChange={([value]) => updateConfig('aiSettings', 'predictionHorizon', value)}
                max={72}
                min={1}
                step={1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How far ahead the AI should predict events
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-response">Automated Emergency Response</Label>
                <p className="text-xs text-muted-foreground">Allow AI to trigger emergency protocols</p>
              </div>
              <Switch 
                id="auto-response"
                checked={config.aiSettings.autoResponseEnabled}
                onCheckedChange={(checked) => updateConfig('aiSettings', 'autoResponseEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="learning-mode">Continuous Learning</Label>
                <p className="text-xs text-muted-foreground">AI model learns from new data</p>
              </div>
              <Switch 
                id="learning-mode"
                checked={config.aiSettings.learningMode}
                onCheckedChange={(checked) => updateConfig('aiSettings', 'learningMode', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Dashboard</CardTitle>
          <CardDescription>Real-time monitoring of all SmartRail-AI subsystems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Core Systems</h4>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center space-x-2">
                    <Database size={14} />
                    <span>Database</span>
                  </div>
                  <span className={getHealthColor(systemHealth.database)}>{systemHealth.database}%</span>
                </div>
                <Progress value={systemHealth.database} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center space-x-2">
                    <Brain size={14} />
                    <span>AI Processing</span>
                  </div>
                  <span className={getHealthColor(systemHealth.aiProcessing)}>{systemHealth.aiProcessing}%</span>
                </div>
                <Progress value={systemHealth.aiProcessing} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Data Sources</h4>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center space-x-2">
                    <Eye size={14} />
                    <span>Camera Network</span>
                  </div>
                  <span className={getHealthColor(systemHealth.cameraSystem)}>{systemHealth.cameraSystem}%</span>
                </div>
                <Progress value={systemHealth.cameraSystem} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center space-x-2">
                    <Wifi size={14} />
                    <span>Sensor Network</span>
                  </div>
                  <span className={getHealthColor(systemHealth.sensorNetwork)}>{systemHealth.sensorNetwork}%</span>
                </div>
                <Progress value={systemHealth.sensorNetwork} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">External Services</h4>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center space-x-2">
                    <Wifi size={14} />
                    <span>Network Connection</span>
                  </div>
                  <span className={getHealthColor(systemHealth.networkConnection)}>{systemHealth.networkConnection}%</span>
                </div>
                <Progress value={systemHealth.networkConnection} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center space-x-2">
                    <CloudRain size={14} />
                    <span>Weather Data</span>
                  </div>
                  <span className={getHealthColor(systemHealth.weatherData)}>{systemHealth.weatherData}%</span>
                </div>
                <Progress value={systemHealth.weatherData} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Compliance */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Data Protection</CardTitle>
            <CardDescription>GDPR-compliant data handling and privacy controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Data Retention Period: {config.privacySettings.dataRetention} days</Label>
              <Slider
                value={[config.privacySettings.dataRetention]}
                onValueChange={([value]) => updateConfig('privacySettings', 'dataRetention', value)}
                max={90}
                min={7}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="anonymize-data">Data Anonymization</Label>
                <p className="text-xs text-muted-foreground">Remove personal identifiers</p>
              </div>
              <Switch 
                id="anonymize-data"
                checked={config.privacySettings.anonymizeData}
                onCheckedChange={(checked) => updateConfig('privacySettings', 'anonymizeData', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="local-processing">Local Data Processing</Label>
                <p className="text-xs text-muted-foreground">Process data on-device only</p>
              </div>
              <Switch 
                id="local-processing"
                checked={config.privacySettings.localProcessing}
                onCheckedChange={(checked) => updateConfig('privacySettings', 'localProcessing', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="audit-logging">Audit Trail Logging</Label>
                <p className="text-xs text-muted-foreground">Log all system decisions</p>
              </div>
              <Switch 
                id="audit-logging"
                checked={config.privacySettings.auditLogging}
                onCheckedChange={(checked) => updateConfig('privacySettings', 'auditLogging', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* License & Attribution */}
        <Card>
          <CardHeader>
            <CardTitle>License & Attribution</CardTitle>
            <CardDescription>SmartRail-AI licensing and usage information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Humanitarian Use License:</strong> This software is free for public good and humanitarian purposes only.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Version:</span>
                <Badge variant="outline">{licenseInfo.version}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Attribution Required:</span>
                <span className="text-muted-foreground">{licenseInfo.attribution}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">License Contact:</span>
                <span className="text-muted-foreground">{licenseInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Commercial Licensing:</span>
                <span className="text-primary">Contact Required</span>
              </div>
            </div>

            <Alert className="mt-4">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Commercial use requires paid licensing. All usage must include attribution to Fahed Mlaiel.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}