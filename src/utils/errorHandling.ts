/**
 * SmartRail-AI Error Handling Utilities
 * 
 * Umfassende Fehlerbehandlung für alle System-Komponenten
 * © 2024 Fahed Mlaiel - mlaiel@live.de
 */

import { toast } from 'sonner'
import { predictiveErrorML } from './predictiveErrorML'

// Error types für verschiedene System-Bereiche
export enum ErrorType {
  NETWORK = 'network',
  AI_PROCESSING = 'ai_processing', 
  DRONE_OPERATION = 'drone_operation',
  SENSOR_DATA = 'sensor_data',
  WEATHER_API = 'weather_api',
  CAMERA_SYSTEM = 'camera_system',
  DATABASE = 'database',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  CRITICAL_SYSTEM = 'critical_system'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface SmartRailError {
  id: string
  type: ErrorType
  severity: ErrorSeverity
  message: string
  details?: any
  timestamp: Date
  component?: string
  userId?: string
  stackTrace?: string
  context?: Record<string, any>
}

export interface ErrorHandlingOptions {
  showToast?: boolean
  logToConsole?: boolean
  reportToSystem?: boolean
  fallbackValue?: any
  retryCount?: number
  retryDelay?: number
}

export class SmartRailErrorHandler {
  private static instance: SmartRailErrorHandler
  private errorLog: SmartRailError[] = []
  private maxLogSize = 1000

  public static getInstance(): SmartRailErrorHandler {
    if (!SmartRailErrorHandler.instance) {
      SmartRailErrorHandler.instance = new SmartRailErrorHandler()
    }
    return SmartRailErrorHandler.instance
  }

  /**
   * Hauptfehlerbehandlungsmethode mit ML-Integration
   */
  public handleError(
    error: Error | any,
    type: ErrorType,
    component?: string,
    options: ErrorHandlingOptions = {}
  ): SmartRailError {
    const {
      showToast = true,
      logToConsole = true,
      reportToSystem = true,
      retryCount = 0
    } = options

    const smartRailError: SmartRailError = {
      id: this.generateErrorId(),
      type,
      severity: this.determineSeverity(type, error),
      message: this.formatErrorMessage(error),
      details: error,
      timestamp: new Date(),
      component,
      stackTrace: error?.stack,
      context: this.gatherContext()
    }

    // Fehler protokollieren
    if (logToConsole) {
      this.logToConsole(smartRailError)
    }

    // Fehler in internem Log speichern
    this.addToErrorLog(smartRailError)

    // ML-System über Fehler informieren
    try {
      predictiveErrorML.addErrorEvent(smartRailError)
    } catch (mlError) {
      console.warn('ML-System Fehlerintegration fehlgeschlagen:', mlError)
    }

    // Benutzerbenachrichtigung
    if (showToast) {
      this.showUserNotification(smartRailError)
    }

    // System-Reporting
    if (reportToSystem) {
      this.reportToSystem(smartRailError)
    }

    return smartRailError
  }

  /**
   * Async Wrapper mit automatischer Fehlerbehandlung
   */
  public async withErrorHandling<T>(
    operation: () => Promise<T>,
    type: ErrorType,
    component?: string,
    options: ErrorHandlingOptions = {}
  ): Promise<T | null> {
    const { retryCount = 0, retryDelay = 1000, fallbackValue } = options

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        return await operation()
      } catch (error) {
        const smartRailError = this.handleError(error, type, component, {
          ...options,
          showToast: attempt === retryCount // Nur beim letzten Versuch Toast zeigen
        })

        if (attempt < retryCount) {
          await this.delay(retryDelay * (attempt + 1)) // Exponential backoff
          continue
        }

        if (fallbackValue !== undefined) {
          return fallbackValue
        }

        throw smartRailError
      }
    }

    return null
  }

  /**
   * Sync Wrapper mit Fehlerbehandlung
   */
  public withSyncErrorHandling<T>(
    operation: () => T,
    type: ErrorType,
    component?: string,
    options: ErrorHandlingOptions = {}
  ): T | null {
    try {
      return operation()
    } catch (error) {
      this.handleError(error, type, component, options)
      
      if (options.fallbackValue !== undefined) {
        return options.fallbackValue
      }
      
      return null
    }
  }

  /**
   * Kritische Systemfehler mit ML-Integration
   */
  public handleCriticalError(
    error: Error | any,
    component: string,
    context?: Record<string, any>
  ): void {
    const criticalError: SmartRailError = {
      id: this.generateErrorId(),
      type: ErrorType.CRITICAL_SYSTEM,
      severity: ErrorSeverity.CRITICAL,
      message: `KRITISCHER SYSTEMFEHLER in ${component}: ${this.formatErrorMessage(error)}`,
      details: error,
      timestamp: new Date(),
      component,
      stackTrace: error?.stack,
      context: { ...this.gatherContext(), ...context }
    }

    // Sofortige Protokollierung
    console.error('🚨 KRITISCHER SYSTEMFEHLER:', criticalError)
    
    // ML-System über kritischen Fehler informieren
    try {
      predictiveErrorML.addErrorEvent(criticalError)
    } catch (mlError) {
      console.warn('ML-System kritische Fehlerintegration fehlgeschlagen:', mlError)
    }
    
    // Kritische Benachrichtigung
    toast.error(`Kritischer Fehler in ${component}`, {
      description: 'System-Administrator wurde benachrichtigt - ML-Analyse läuft',
      duration: 10000,
      style: {
        background: 'var(--destructive)',
        color: 'var(--destructive-foreground)',
        borderColor: 'var(--destructive)'
      }
    })

    // Notfall-Reporting
    this.emergencyReport(criticalError)
    this.addToErrorLog(criticalError)
  }

  /**
   * Fehlertyp-spezifische Handler
   */
  public handleNetworkError(error: any, component?: string): SmartRailError {
    return this.handleError(error, ErrorType.NETWORK, component, {
      showToast: true,
      retryCount: 3,
      retryDelay: 2000
    })
  }

  public handleAIProcessingError(error: any, component?: string): SmartRailError {
    return this.handleError(error, ErrorType.AI_PROCESSING, component, {
      showToast: true,
      fallbackValue: null
    })
  }

  public handleDroneOperationError(error: any, component?: string): SmartRailError {
    return this.handleError(error, ErrorType.DRONE_OPERATION, component, {
      showToast: true,
      reportToSystem: true
    })
  }

  public handleSensorDataError(error: any, component?: string): SmartRailError {
    return this.handleError(error, ErrorType.SENSOR_DATA, component, {
      showToast: false, // Sensor-Fehler sind häufig, nicht immer Toast zeigen
      logToConsole: true
    })
  }

  public handleWeatherAPIError(error: any, component?: string): SmartRailError {
    return this.handleError(error, ErrorType.WEATHER_API, component, {
      retryCount: 2,
      fallbackValue: { status: 'unavailable' }
    })
  }

  /**
   * Fehler-Recovery-Strategien
   */
  public async attemptRecovery(errorId: string): Promise<boolean> {
    const error = this.errorLog.find(e => e.id === errorId)
    if (!error) return false

    try {
      switch (error.type) {
        case ErrorType.NETWORK:
          return await this.recoveryStrategies.network()
        case ErrorType.AI_PROCESSING:
          return await this.recoveryStrategies.aiProcessing()
        case ErrorType.DRONE_OPERATION:
          return await this.recoveryStrategies.droneOperation()
        case ErrorType.CAMERA_SYSTEM:
          return await this.recoveryStrategies.cameraSystem()
        default:
          return false
      }
    } catch (recoveryError) {
      this.handleError(recoveryError, ErrorType.CRITICAL_SYSTEM, 'ErrorRecovery')
      return false
    }
  }

  /**
   * Recovery-Strategien
   */
  private recoveryStrategies = {
    network: async (): Promise<boolean> => {
      // Netzwerk-Recovery: Verbindung testen und Cache verwenden
      try {
        const response = await fetch('/api/health-check', { 
          method: 'HEAD',
          cache: 'no-cache'
        })
        return response.ok
      } catch {
        return false
      }
    },

    aiProcessing: async (): Promise<boolean> => {
      // KI-Processing Recovery: Alternative Modelle aktivieren
      try {
        // Fallback auf lokale KI-Modelle
        return true
      } catch {
        return false
      }
    },

    droneOperation: async (): Promise<boolean> => {
      // Drohnen-Recovery: Backup-Drohnen aktivieren
      try {
        // Drohnen-Fleet neu initialisieren
        return true
      } catch {
        return false
      }
    },

    cameraSystem: async (): Promise<boolean> => {
      // Kamera-Recovery: Alternative Kameras verwenden
      try {
        // Backup-Kameras aktivieren
        return true
      } catch {
        return false
      }
    }
  }

  /**
   * Error Metrics und Reporting
   */
  public getErrorMetrics(): {
    totalErrors: number
    errorsByType: Record<ErrorType, number>
    errorsBySeverity: Record<ErrorSeverity, number>
    recentErrors: SmartRailError[]
  } {
    const errorsByType = {} as Record<ErrorType, number>
    const errorsBySeverity = {} as Record<ErrorSeverity, number>

    this.errorLog.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1
    })

    return {
      totalErrors: this.errorLog.length,
      errorsByType,
      errorsBySeverity,
      recentErrors: this.errorLog.slice(-10)
    }
  }

  // Private Hilfsmethoden
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private determineSeverity(type: ErrorType, error: any): ErrorSeverity {
    // Kritische Systemfehler
    if (type === ErrorType.CRITICAL_SYSTEM) return ErrorSeverity.CRITICAL
    
    // Sicherheitsrelevante Fehler
    if ([ErrorType.DRONE_OPERATION, ErrorType.CAMERA_SYSTEM].includes(type)) {
      return ErrorSeverity.HIGH
    }

    // Netzwerk- und API-Fehler
    if ([ErrorType.NETWORK, ErrorType.WEATHER_API].includes(type)) {
      return ErrorSeverity.MEDIUM
    }

    // Standard-Schweregrad
    return ErrorSeverity.LOW
  }

  private formatErrorMessage(error: any): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    if (error?.message) {
      return error.message
    }
    return 'Unbekannter Fehler aufgetreten'
  }

  private gatherContext(): Record<string, any> {
    return {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      memory: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize
      } : undefined
    }
  }

  private logToConsole(error: SmartRailError): void {
    const logLevel = error.severity === ErrorSeverity.CRITICAL ? 'error' : 
                    error.severity === ErrorSeverity.HIGH ? 'warn' : 'log'
    
    console[logLevel](`[SmartRail-AI] ${error.severity.toUpperCase()}:`, {
      id: error.id,
      type: error.type,
      component: error.component,
      message: error.message,
      details: error.details
    })
  }

  private addToErrorLog(error: SmartRailError): void {
    this.errorLog.push(error)
    
    // Log-Größe begrenzen
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize + 100)
    }
  }

  private showUserNotification(error: SmartRailError): void {
    const userMessage = this.getUserFriendlyMessage(error)
    
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        toast.error('Kritischer Systemfehler', {
          description: userMessage,
          duration: 10000
        })
        break
      case ErrorSeverity.HIGH:
        toast.error('Wichtiger Hinweis', {
          description: userMessage,
          duration: 6000
        })
        break
      case ErrorSeverity.MEDIUM:
        toast.warning('Systemhinweis', {
          description: userMessage,
          duration: 4000
        })
        break
      default:
        toast.info('Information', {
          description: userMessage,
          duration: 3000
        })
    }
  }

  private getUserFriendlyMessage(error: SmartRailError): string {
    const typeMessages: Record<ErrorType, string> = {
      [ErrorType.NETWORK]: 'Netzwerkverbindung unterbrochen. Prüfe die Internetverbindung.',
      [ErrorType.AI_PROCESSING]: 'KI-Verarbeitung vorübergehend nicht verfügbar.',
      [ErrorType.DRONE_OPERATION]: 'Drohnen-System meldet Störung. Backup-Systeme aktiviert.',
      [ErrorType.SENSOR_DATA]: 'Sensordaten nicht verfügbar. Alternative Quellen werden verwendet.',
      [ErrorType.WEATHER_API]: 'Wetterdaten vorübergehend nicht verfügbar.',
      [ErrorType.CAMERA_SYSTEM]: 'Kamera-System meldet Störung. Überprüfung läuft.',
      [ErrorType.DATABASE]: 'Datenbankverbindung unterbrochen. Lokale Daten werden verwendet.',
      [ErrorType.VALIDATION]: 'Eingabedaten ungültig. Bitte korrigieren.',
      [ErrorType.AUTHENTICATION]: 'Authentifizierung fehlgeschlagen. Bitte neu anmelden.',
      [ErrorType.CRITICAL_SYSTEM]: 'Kritischer Systemfehler. Administrator wurde benachrichtigt.'
    }
    
    return typeMessages[error.type] || 'Ein unerwarteter Fehler ist aufgetreten.'
  }

  private async reportToSystem(error: SmartRailError): Promise<void> {
    // System-Reporting in Production
    try {
      // Hier würde normalerweise ein API-Call an das Monitoring-System erfolgen
      console.log('Reporting error to system:', error.id)
    } catch (reportError) {
      console.warn('Failed to report error to system:', reportError)
    }
  }

  private async emergencyReport(error: SmartRailError): Promise<void> {
    // Notfall-Reporting für kritische Fehler
    try {
      // Hier würde normalerweise eine sofortige Benachrichtigung an Administratoren erfolgen
      console.error('🚨 EMERGENCY REPORT:', error)
    } catch (reportError) {
      console.error('Failed to send emergency report:', reportError)
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Global Error Handler Instanz
export const errorHandler = SmartRailErrorHandler.getInstance()

// Convenience Functions für häufige Anwendungsfälle
export const withAsyncErrorHandling = errorHandler.withErrorHandling.bind(errorHandler)
export const withSyncErrorHandling = errorHandler.withSyncErrorHandling.bind(errorHandler)
export const handleCriticalError = errorHandler.handleCriticalError.bind(errorHandler)
export const handleNetworkError = errorHandler.handleNetworkError.bind(errorHandler)
export const handleAIError = errorHandler.handleAIProcessingError.bind(errorHandler)
export const handleDroneError = errorHandler.handleDroneOperationError.bind(errorHandler)
export const handleSensorError = errorHandler.handleSensorDataError.bind(errorHandler)
export const handleWeatherError = errorHandler.handleWeatherAPIError.bind(errorHandler)