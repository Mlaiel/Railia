/**
 * SmartRail-AI Error Handling Hooks
 * 
 * React Hooks für vereinfachte Fehlerbehandlung in funktionalen Komponenten
 * © 2024 Fahed Mlaiel - mlaiel@live.de
 */

import { useCallback, useEffect, useState } from 'react'
import { 
  errorHandler, 
  ErrorType, 
  ErrorSeverity, 
  withAsyncErrorHandling,
  withSyncErrorHandling
} from '@/utils/errorHandling'
import { toast } from 'sonner'

// Error State Hook
export function useErrorState(initialError?: Error | null) {
  const [error, setError] = useState<Error | null>(initialError || null)
  const [hasError, setHasError] = useState<boolean>(!!initialError)
  
  const clearError = useCallback(() => {
    setError(null)
    setHasError(false)
  }, [])

  const setErrorState = useCallback((newError: Error | null) => {
    setError(newError)
    setHasError(!!newError)
  }, [])

  return {
    error,
    hasError,
    clearError,
    setError: setErrorState
  }
}

// Async Error Handler Hook
export function useAsyncErrorHandler(
  componentName?: string,
  defaultErrorType: ErrorType = ErrorType.VALIDATION
) {
  const [isLoading, setIsLoading] = useState(false)
  const { error, hasError, clearError, setError } = useErrorState()

  const executeAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    options: {
      errorType?: ErrorType
      showToast?: boolean
      fallbackValue?: T
      retryCount?: number
      loadingState?: boolean
    } = {}
  ): Promise<T | undefined> => {
    const {
      errorType = defaultErrorType,
      showToast = true,
      fallbackValue,
      retryCount = 0,
      loadingState = true
    } = options

    try {
      if (loadingState) setIsLoading(true)
      clearError()

      const result = await withAsyncErrorHandling(
        operation,
        errorType,
        componentName,
        {
          showToast,
          fallbackValue,
          retryCount
        }
      )

      return result || fallbackValue
    } catch (err) {
      const error = err as Error
      setError(error)
      
      if (showToast) {
        toast.error('Fehler aufgetreten', {
          description: error.message
        })
      }

      return fallbackValue
    } finally {
      if (loadingState) setIsLoading(false)
    }
  }, [componentName, defaultErrorType, clearError, setError])

  return {
    executeAsync,
    isLoading,
    error,
    hasError,
    clearError
  }
}

// Safe State Update Hook (verhindert Memory Leaks)
export function useSafeState<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue)
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    return () => {
      setIsMounted(false)
    }
  }, [])

  const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
    if (isMounted) {
      setState(value)
    }
  }, [isMounted])

  return [state, safeSetState]
}

// API Call Hook mit integrierter Fehlerbehandlung
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean
    errorType?: ErrorType
    componentName?: string
    fallbackValue?: T
    showToast?: boolean
  } = {}
) {
  const {
    immediate = true,
    errorType = ErrorType.NETWORK,
    componentName = 'APICall',
    fallbackValue,
    showToast = true
  } = options

  const [data, setData] = useSafeState<T | undefined>(fallbackValue)
  const [isLoading, setIsLoading] = useSafeState(false)
  const { error, hasError, clearError, setError } = useErrorState()

  const execute = useCallback(async () => {
    try {
      setIsLoading(true)
      clearError()

      const result = await withAsyncErrorHandling(
        apiCall,
        errorType,
        componentName,
        {
          showToast,
          fallbackValue,
          retryCount: 2
        }
      )

      setData(result || fallbackValue)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      setData(fallbackValue)
      return fallbackValue
    } finally {
      setIsLoading(false)
    }
  }, [apiCall, errorType, componentName, showToast, fallbackValue, setData, setIsLoading, clearError, setError])

  // Auto-execute on mount and dependency changes
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute, ...dependencies])

  const retry = useCallback(() => {
    execute()
  }, [execute])

  return {
    data,
    isLoading,
    error,
    hasError,
    execute,
    retry,
    clearError
  }
}

// Form Error Handler Hook
export function useFormErrorHandler(componentName?: string) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const setFieldError = useCallback((field: string, error: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setFieldErrors({})
    setGeneralError(null)
  }, [])

  const handleValidationError = useCallback((error: any) => {
    errorHandler.handleError(
      error,
      ErrorType.VALIDATION,
      componentName,
      {
        showToast: false,
        logToConsole: true
      }
    )

    if (error.validationErrors) {
      setFieldErrors(error.validationErrors)
    } else {
      setGeneralError(error.message || 'Validierungsfehler aufgetreten')
    }
  }, [componentName])

  const validateField = useCallback((
    field: string,
    value: any,
    validator: (value: any) => string | null
  ) => {
    try {
      const result = withSyncErrorHandling(
        () => validator(value),
        ErrorType.VALIDATION,
        componentName,
        {
          showToast: false,
          fallbackValue: null
        }
      )

      if (result) {
        setFieldError(field, result)
        return false
      } else {
        clearFieldError(field)
        return true
      }
    } catch (error) {
      setFieldError(field, 'Validierungsfehler')
      return false
    }
  }, [componentName, setFieldError, clearFieldError])

  return {
    fieldErrors,
    generalError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    handleValidationError,
    validateField,
    hasErrors: Object.keys(fieldErrors).length > 0 || !!generalError
  }
}

// Component Lifecycle Error Handler Hook
export function useComponentErrorHandler(
  componentName: string,
  onError?: (error: Error) => void
) {
  const { error, hasError, clearError, setError } = useErrorState()

  // Global Error Boundary Handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const error = new Error(`Global Error in ${componentName}: ${event.message}`)
      setError(error)
      onError?.(error)
      
      errorHandler.handleError(
        error,
        ErrorType.CRITICAL_SYSTEM,
        componentName,
        {
          showToast: true,
          reportToSystem: true
        }
      )
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(`Unhandled Promise Rejection in ${componentName}: ${event.reason}`)
      setError(error)
      onError?.(error)
      
      errorHandler.handleError(
        error,
        ErrorType.CRITICAL_SYSTEM,
        componentName,
        {
          showToast: true,
          reportToSystem: true
        }
      )
    }

    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [componentName, onError, setError])

  const handleComponentError = useCallback((
    error: Error,
    errorType: ErrorType = ErrorType.VALIDATION,
    options: {
      showToast?: boolean
      reportToSystem?: boolean
      critical?: boolean
    } = {}
  ) => {
    const { showToast = true, reportToSystem = false, critical = false } = options

    setError(error)
    onError?.(error)

    errorHandler.handleError(
      error,
      critical ? ErrorType.CRITICAL_SYSTEM : errorType,
      componentName,
      {
        showToast,
        reportToSystem: reportToSystem || critical
      }
    )
  }, [componentName, onError, setError])

  const handleAsyncComponentError = useCallback(async <T>(
    operation: () => Promise<T>,
    errorType: ErrorType = ErrorType.VALIDATION,
    fallbackValue?: T
  ): Promise<T | undefined> => {
    try {
      clearError()
      return await operation()
    } catch (err) {
      const error = err as Error
      handleComponentError(error, errorType)
      return fallbackValue
    }
  }, [clearError, handleComponentError])

  return {
    error,
    hasError,
    clearError,
    handleComponentError,
    handleAsyncComponentError
  }
}

// Error Recovery Hook
export function useErrorRecovery() {
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoveryAttempts, setRecoveryAttempts] = useState(0)

  const attemptRecovery = useCallback(async (
    errorId: string,
    customRecovery?: () => Promise<boolean>
  ): Promise<boolean> => {
    setIsRecovering(true)
    setRecoveryAttempts(prev => prev + 1)

    try {
      let success = false
      
      if (customRecovery) {
        success = await customRecovery()
      } else {
        success = await errorHandler.attemptRecovery(errorId)
      }

      if (success) {
        toast.success('Wiederherstellung erfolgreich')
        setRecoveryAttempts(0)
      } else {
        toast.error('Wiederherstellung fehlgeschlagen')
      }

      return success
    } catch (error) {
      toast.error('Wiederherstellung nicht möglich')
      return false
    } finally {
      setIsRecovering(false)
    }
  }, [])

  const resetRecovery = useCallback(() => {
    setIsRecovering(false)
    setRecoveryAttempts(0)
  }, [])

  return {
    isRecovering,
    recoveryAttempts,
    attemptRecovery,
    resetRecovery,
    maxAttemptsReached: recoveryAttempts >= 3
  }
}

// Error Metrics Hook
export function useErrorMetrics() {
  const [metrics, setMetrics] = useState(errorHandler.getErrorMetrics())
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const refreshMetrics = useCallback(() => {
    try {
      const newMetrics = errorHandler.getErrorMetrics()
      setMetrics(newMetrics)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to refresh error metrics:', error)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(refreshMetrics, 30000) // Alle 30 Sekunden
    return () => clearInterval(interval)
  }, [refreshMetrics])

  return {
    metrics,
    lastUpdate,
    refreshMetrics
  }
}