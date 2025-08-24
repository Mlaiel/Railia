/**
 * SmartRail-AI Enhanced Error Boundary
 * 
 * Erweiterte Fehlerbehandlung mit ML-Integration für React-Komponenten
 * © 2024 Fahed Mlaiel - mlaiel@live.de
 */

import React, { Component, ErrorInfo, ReactNode, createContext, useContext, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Warning, ArrowsClockwise, Bug, ArrowLeft, Brain, Activity } from '@phosphor-icons/react'
import { errorHandler, ErrorType, ErrorSeverity } from '@/utils/errorHandling'
import { predictiveErrorML } from '@/utils/predictiveErrorML'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
  retryCount: number
  isRecovering: boolean
  mlPredictions: any[]
}

interface SmartRailErrorBoundaryProps {
  children: ReactNode
  level: 'critical' | 'module' | 'component'
  componentName: string
  fallback?: ReactNode
  maxRetries?: number
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  enableMLPrediction?: boolean
}

// Error Boundary Context für erweiterte Funktionalität
interface ErrorBoundaryContextType {
  reportError: (error: Error, context?: string) => void
  clearError: () => void
  retryOperation: () => void
  isInErrorState: boolean
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | null>(null)

export const useErrorHandler = (componentName: string) => {
  const context = useContext(ErrorBoundaryContext)
  
  const handleError = useCallback((error: Error, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    try {
      const errorType = severity === 'critical' ? ErrorType.CRITICAL_SYSTEM : ErrorType.VALIDATION
      errorHandler.handleError(error, errorType, componentName, {
        showToast: severity !== 'low',
        reportToSystem: severity === 'critical' || severity === 'high'
      })
      
      context?.reportError(error, componentName)
    } catch (handlingError) {
      console.error('Fehler beim Fehlerhandling:', handlingError)
    }
  }, [componentName, context])

  const handleAsyncError = useCallback(async <T,>(
    operation: () => Promise<T>,
    fallbackValue: T,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<T> => {
    try {
      return await operation()
    } catch (error) {
      handleError(error as Error, severity)
      return fallbackValue
    }
  }, [handleError])

  return {
    handleError,
    handleAsyncError,
    reportError: context?.reportError || (() => {}),
    clearError: context?.clearError || (() => {}),
    retryOperation: context?.retryOperation || (() => {}),
    isInErrorState: context?.isInErrorState || false
  }
}

class SmartRailErrorBoundary extends Component<SmartRailErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimer: NodeJS.Timeout | null = null

  constructor(props: SmartRailErrorBoundaryProps) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isRecovering: false,
      mlPredictions: []
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { level, componentName, onError, enableMLPrediction = true } = this.props
    
    try {
      // Eindeutige Error-ID generieren
      const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Fehler-Context erweitern
      const enhancedContext = {
        componentStack: errorInfo.componentStack,
        errorBoundary: componentName,
        level,
        retryCount: this.state.retryCount,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }

      // Fehler dem System melden
      const smartRailError = errorHandler.handleError(
        error,
        level === 'critical' ? ErrorType.CRITICAL_SYSTEM : ErrorType.VALIDATION,
        componentName,
        {
          showToast: level !== 'component',
          reportToSystem: level === 'critical' || level === 'module',
          logToConsole: true
        }
      )

      // ML-Vorhersagen abrufen wenn aktiviert
      let mlPredictions: any[] = []
      if (enableMLPrediction) {
        try {
          mlPredictions = await predictiveErrorML.predictFailures()
          
          // Fehler dem ML-System zur Lernverbesserung hinzufügen
          predictiveErrorML.addErrorEvent(smartRailError)
        } catch (mlError) {
          console.warn('ML-Prediction für Error Boundary fehlgeschlagen:', mlError)
        }
      }

      // State aktualisieren
      this.setState({
        errorInfo,
        errorId,
        mlPredictions
      })

      // Custom Error Handler aufrufen
      if (onError) {
        onError(error, errorInfo)
      }

      // Toast-Benachrichtigung je nach Schweregrad
      this.showErrorNotification(error, level, smartRailError.id)

      // Auto-Recovery für nicht-kritische Fehler
      if (level !== 'critical' && this.state.retryCount < (this.props.maxRetries || 3)) {
        this.scheduleAutoRecovery()
      }

    } catch (handlingError) {
      console.error('Fehler in Error Boundary Handler:', handlingError)
      
      // Fallback-Benachrichtigung
      toast.error('Kritischer Systemfehler', {
        description: `Fehlerbehandlung in ${componentName} fehlgeschlagen`,
        duration: 10000
      })
    }
  }

  private showErrorNotification(error: Error, level: string, errorId: string) {
    const messages = {
      critical: {
        title: 'Kritischer Systemfehler',
        description: 'System-Administrator wurde benachrichtigt. Neustart erforderlich.',
        duration: 15000
      },
      module: {
        title: 'Modul-Fehler',
        description: 'Ein System-Modul ist ausgefallen. Automatische Wiederherstellung läuft.',
        duration: 8000
      },
      component: {
        title: 'Komponenten-Fehler',
        description: 'Eine Komponente konnte nicht geladen werden.',
        duration: 5000
      }
    }

    const config = messages[level as keyof typeof messages] || messages.component

    toast.error(config.title, {
      description: `${config.description} (ID: ${errorId.slice(-8)})`,
      duration: config.duration,
      action: level !== 'critical' ? {
        label: 'Wiederholen',
        onClick: () => this.handleRetry()
      } : undefined
    })
  }

  private scheduleAutoRecovery() {
    // Auto-Recovery nach 5 Sekunden für nicht-kritische Fehler
    this.retryTimer = setTimeout(() => {
      this.handleRetry()
    }, 5000)
  }

  private handleRetry = () => {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }

    this.setState(prevState => ({
      isRecovering: true,
      retryCount: prevState.retryCount + 1
    }))

    // Simuliere Recovery-Zeit
    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        isRecovering: false,
        mlPredictions: []
      })

      toast.success('Komponente erfolgreich wiederhergestellt', {
        duration: 3000
      })
    }, 1000)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  private getErrorSeverityBadge() {
    const { level } = this.props
    const variants = {
      critical: 'destructive' as const,
      module: 'secondary' as const,
      component: 'outline' as const
    }
    
    return (
      <Badge variant={variants[level]}>
        {level === 'critical' ? 'Kritisch' : 
         level === 'module' ? 'Modul-Fehler' : 'Komponenten-Fehler'}
      </Badge>
    )
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
    }
  }

  render() {
    const { hasError, error, errorInfo, errorId, retryCount, isRecovering, mlPredictions } = this.state
    const { children, fallback, componentName, level, maxRetries = 3 } = this.props

    // Kein Fehler - normale Render-Pipeline
    if (!hasError) {
      const contextValue: ErrorBoundaryContextType = {
        reportError: (error: Error, context?: string) => {
          errorHandler.handleError(error, ErrorType.VALIDATION, context || componentName)
        },
        clearError: () => {
          this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: null,
            isRecovering: false,
            mlPredictions: []
          })
        },
        retryOperation: this.handleRetry,
        isInErrorState: false
      }

      return (
        <ErrorBoundaryContext.Provider value={contextValue}>
          {children}
        </ErrorBoundaryContext.Provider>
      )
    }

    // Recovery-Animation
    if (isRecovering) {
      return (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <ArrowsClockwise size={32} className="animate-spin text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Komponente wird wiederhergestellt...
            </h3>
            <p className="text-orange-600">
              Bitte warten Sie einen Moment.
            </p>
          </CardContent>
        </Card>
      )
    }

    // Custom Fallback verwenden
    if (fallback) {
      return <>{fallback}</>
    }

    // Standard Error UI
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-full">
                <Warning size={24} className="text-destructive" />
              </div>
              <div>
                <CardTitle className="text-destructive flex items-center gap-2">
                  Fehler in {componentName}
                  {this.getErrorSeverityBadge()}
                </CardTitle>
                <CardDescription className="mt-1">
                  {error?.message || 'Ein unerwarteter Fehler ist aufgetreten'}
                </CardDescription>
              </div>
            </div>
            
            {errorId && (
              <Badge variant="outline" className="font-mono text-xs">
                ID: {errorId.slice(-8)}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Fehler-Details */}
          <div className="space-y-3">
            <div className="text-sm">
              <strong>Fehlertyp:</strong> {error?.name || 'Unbekannt'}
            </div>
            
            {errorInfo?.componentStack && (
              <details className="text-xs">
                <summary className="cursor-pointer font-medium mb-2">
                  Komponenten-Stack (für Entwickler)
                </summary>
                <pre className="bg-muted/50 p-3 rounded text-xs overflow-auto whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
              <div>Wiederholungsversuche: {retryCount}/{maxRetries}</div>
              <div>Zeitstempel: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          {/* ML-Vorhersagen */}
          {mlPredictions.length > 0 && (
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center gap-2 mb-2">
                  <strong>ML-Analyse:</strong>
                  <Badge variant="outline" className="text-xs">
                    {mlPredictions.length} Vorhersage{mlPredictions.length !== 1 ? 'n' : ''}
                  </Badge>
                </div>
                Das ML-System hat {mlPredictions.length > 0 ? 'verwandte' : 'keine'} Systemprobleme identifiziert.
                {mlPredictions.length > 0 && ' Überprüfen Sie das Predictive Error Dashboard.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Aktionen */}
          <div className="flex flex-col sm:flex-row gap-3">
            {retryCount < maxRetries && level !== 'critical' && (
              <Button 
                onClick={this.handleRetry}
                className="flex items-center gap-2"
                variant="default"
              >
                <ArrowsClockwise size={16} />
                Erneut versuchen ({maxRetries - retryCount} verbleibend)
              </Button>
            )}

            <Button 
              onClick={this.handleGoBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Zurück
            </Button>

            {level === 'critical' && (
              <Button 
                onClick={this.handleReload}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <ArrowsClockwise size={16} />
                System neu laden
              </Button>
            )}
          </div>

          {/* Entwickler-Informationen */}
          {process.env.NODE_ENV === 'development' && (
            <details className="border-t pt-4">
              <summary className="cursor-pointer font-medium mb-2 flex items-center gap-2">
                <Bug size={16} />
                Entwickler-Informationen
              </summary>
              <div className="space-y-2 text-xs">
                <div>
                  <strong>Komponente:</strong> {componentName}
                </div>
                <div>
                  <strong>Level:</strong> {level}
                </div>
                {error?.stack && (
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="bg-muted/50 p-2 rounded mt-1 overflow-auto text-xs">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    )
  }
}

export { SmartRailErrorBoundary }