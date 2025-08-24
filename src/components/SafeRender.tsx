import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  errorMessage?: string
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * SafeRender Komponente zum Abfangen von Render-Fehlern
 * Besonders nützlich für Komponenten mit dynamischen Daten
 */
export class SafeRender extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SafeRender caught an error:', error, errorInfo)
    // Log detailed error information
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle size={16} />
          <AlertDescription className="space-y-3">
            <div className="flex items-center justify-between">
              <span>
                {this.props.errorMessage || 'Fehler beim Laden der Komponente'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="ml-2"
              >
                <RefreshCw size={14} className="mr-1" />
                Erneut versuchen
              </Button>
            </div>
            {this.state.error && (
              <details className="text-xs opacity-70">
                <summary className="cursor-pointer">Fehlerdetails anzeigen</summary>
                <pre className="mt-2 whitespace-pre-wrap text-xs bg-destructive/10 p-2 rounded">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

/**
 * Hook für sichere Wert-Darstellung mit automatischer Fallback-Behandlung
 */
export function useSafeValue<T>(value: T | undefined | null, fallback: T): T {
  return value !== undefined && value !== null ? value : fallback
}

/**
 * Sichere toFixed-Funktion als Hook
 */
export function useSafeToFixed(value: number | undefined | null, digits: number = 2): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0'
  }
  return value.toFixed(digits)
}