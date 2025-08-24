/**
 * SmartRail-AI Error Monitoring Dashboard
 * 
 * Zentrale Übersicht für alle Systemfehler und Monitoring
 * © 2024 Fahed Mlaiel - mlaiel@live.de
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bug, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendUp,
  Eye,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  Activity,
  Warning
} from '@phosphor-icons/react'
import { errorHandler, ErrorType, ErrorSeverity } from '@/utils/errorHandling'
import { SmartRailErrorBoundary } from '@/components/SmartRailErrorBoundary'
import { toast } from 'sonner'

interface ErrorMetrics {
  totalErrors: number
  errorsByType: Record<ErrorType, number>
  errorsBySeverity: Record<ErrorSeverity, number>
  recentErrors: any[]
}

const ErrorMonitoringDashboard: React.FC = () => {
  const [errorMetrics, setErrorMetrics] = useState<ErrorMetrics>({
    totalErrors: 0,
    errorsByType: {} as Record<ErrorType, number>,
    errorsBySeverity: {} as Record<ErrorSeverity, number>,
    recentErrors: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<ErrorType | 'all'>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<ErrorSeverity | 'all'>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Error Metrics laden
  const loadErrorMetrics = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const metrics = errorHandler.getErrorMetrics()
      setErrorMetrics(metrics)
    } catch (error) {
      console.error('Failed to load error metrics:', error)
      toast.error('Fehler beim Laden der Fehlerstatistiken')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial Load und Auto-Refresh
  useEffect(() => {
    loadErrorMetrics()

    if (autoRefresh) {
      const interval = setInterval(loadErrorMetrics, 30000) // Alle 30 Sekunden
      return () => clearInterval(interval)
    }
  }, [loadErrorMetrics, autoRefresh])

  // Gefilterte Fehler
  const filteredErrors = React.useMemo(() => {
    return errorMetrics.recentErrors.filter(error => {
      const typeMatch = selectedFilter === 'all' || error.type === selectedFilter
      const severityMatch = selectedSeverity === 'all' || error.severity === selectedSeverity
      return typeMatch && severityMatch
    })
  }, [errorMetrics.recentErrors, selectedFilter, selectedSeverity])

  // Severity Badge Variant
  const getSeverityVariant = (severity: ErrorSeverity): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case ErrorSeverity.CRITICAL: return 'destructive'
      case ErrorSeverity.HIGH: return 'destructive'
      case ErrorSeverity.MEDIUM: return 'secondary'
      default: return 'outline'
    }
  }

  // Severity Color
  const getSeverityColor = (severity: ErrorSeverity): string => {
    switch (severity) {
      case ErrorSeverity.CRITICAL: return 'text-red-600'
      case ErrorSeverity.HIGH: return 'text-orange-600'
      case ErrorSeverity.MEDIUM: return 'text-yellow-600'
      default: return 'text-blue-600'
    }
  }

  // Type Icon
  const getTypeIcon = (type: ErrorType) => {
    switch (type) {
      case ErrorType.CRITICAL_SYSTEM: return <Shield size={16} />
      case ErrorType.AI_PROCESSING: return <Activity size={16} />
      case ErrorType.NETWORK: return <TrendUp size={16} />
      case ErrorType.DRONE_OPERATION: return <Eye size={16} />
      default: return <Bug size={16} />
    }
  }

  // Error Export
  const exportErrorLog = () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        metrics: errorMetrics,
        systemInfo: {
          userAgent: navigator.userAgent,
          url: window.location.href
        }
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `smartrail-errors-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Fehlerprotokoll erfolgreich exportiert')
    } catch (error) {
      toast.error('Export fehlgeschlagen')
    }
  }

  return (
    <SmartRailErrorBoundary level="module" componentName="ErrorMonitoringDashboard">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bug size={28} className="text-destructive" />
              Fehler-Monitoring
            </h1>
            <p className="text-muted-foreground">
              Zentrale Übersicht aller Systemfehler und Monitoring-Daten
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadErrorMetrics}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportErrorLog}
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Bug className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Gesamt-Fehler</p>
                  <div className="text-2xl font-bold">{errorMetrics.totalErrors}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Kritische Fehler</p>
                  <div className="text-2xl font-bold text-red-600">
                    {errorMetrics.errorsBySeverity[ErrorSeverity.CRITICAL] || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Warning className="h-4 w-4 text-yellow-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">Hohe Priorität</p>
                  <div className="text-2xl font-bold text-yellow-600">
                    {errorMetrics.errorsBySeverity[ErrorSeverity.HIGH] || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">System-Status</p>
                  <div className="text-lg font-bold text-green-600">
                    {errorMetrics.errorsBySeverity[ErrorSeverity.CRITICAL] ? 'Kritisch' : 'Stabil'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="recent">Aktuelle Fehler</TabsTrigger>
            <TabsTrigger value="analytics">Analytik</TabsTrigger>
            <TabsTrigger value="system">System-Status</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Errors by Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={20} />
                    Fehler nach Typ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(errorMetrics.errorsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(type as ErrorType)}
                        <span className="text-sm font-medium capitalize">
                          {type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <Progress 
                            value={(count / errorMetrics.totalErrors) * 100} 
                            className="h-2"
                          />
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Errors by Severity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Fehler nach Schweregrad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(errorMetrics.errorsBySeverity).map(([severity, count]) => (
                    <div key={severity} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          severity === ErrorSeverity.CRITICAL ? 'bg-red-500' :
                          severity === ErrorSeverity.HIGH ? 'bg-orange-500' :
                          severity === ErrorSeverity.MEDIUM ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-sm font-medium capitalize">
                          {severity === ErrorSeverity.CRITICAL ? 'Kritisch' :
                           severity === ErrorSeverity.HIGH ? 'Hoch' :
                           severity === ErrorSeverity.MEDIUM ? 'Mittel' : 'Niedrig'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <Progress 
                            value={(count / errorMetrics.totalErrors) * 100} 
                            className="h-2"
                          />
                        </div>
                        <Badge variant={getSeverityVariant(severity as ErrorSeverity)}>
                          {count}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recent Errors Tab */}
          <TabsContent value="recent" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value as ErrorType | 'all')}
                className="px-3 py-1 rounded border border-border bg-background text-sm"
              >
                <option value="all">Alle Typen</option>
                {Object.values(ErrorType).map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
              <select 
                value={selectedSeverity} 
                onChange={(e) => setSelectedSeverity(e.target.value as ErrorSeverity | 'all')}
                className="px-3 py-1 rounded border border-border bg-background text-sm"
              >
                <option value="all">Alle Schweregrade</option>
                {Object.values(ErrorSeverity).map(severity => (
                  <option key={severity} value={severity}>{severity}</option>
                ))}
              </select>
            </div>

            {/* Recent Errors List */}
            <div className="space-y-3">
              {filteredErrors.length > 0 ? (
                filteredErrors.map((error, index) => (
                  <Card key={error.id || index} className="border-l-4 border-l-destructive/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(error.type)}
                            <Badge variant={getSeverityVariant(error.severity)}>
                              {error.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {error.type.replace('_', ' ')}
                            </Badge>
                            {error.component && (
                              <Badge variant="secondary">{error.component}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground font-medium">
                            {error.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={12} />
                            <span>{new Date(error.timestamp).toLocaleString()}</span>
                            {error.id && (
                              <span>• ID: {error.id.slice(-8)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Keine Fehler gefunden
                      </h3>
                      <p className="text-muted-foreground">
                        Mit den aktuellen Filtern wurden keine Fehler gefunden.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                Erweiterte Analytik-Features werden in zukünftigen Versionen verfügbar sein.
                Aktuell werden grundlegende Metriken in der Übersicht angezeigt.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System-Gesundheit</CardTitle>
                <CardDescription>
                  Aktueller Status der SmartRail-AI Fehlerbehandlung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fehlerbehandlung</span>
                  <Badge variant="default">Aktiv</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto-Refresh</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                  >
                    {autoRefresh ? 'Ein' : 'Aus'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Letzte Aktualisierung</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SmartRailErrorBoundary>
  )
}

export default ErrorMonitoringDashboard