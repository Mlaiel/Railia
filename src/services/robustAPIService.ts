/**
 * SmartRail-AI Robust Service Layer
 * 
 * Robuste API-Services mit umfassender Fehlerbehandlung
 * © 2024 Fahed Mlaiel - mlaiel@live.de
 */

import { 
  errorHandler, 
  ErrorType, 
  withAsyncErrorHandling,
  handleNetworkError,
  handleAIError,
  handleWeatherError,
  handleSensorError,
  handleDroneError
} from '@/utils/errorHandling'

// Base Service Interface
interface ServiceConfig {
  baseUrl?: string
  timeout?: number
  retryCount?: number
  retryDelay?: number
  enableCaching?: boolean
  cacheTimeout?: number
}

// Response Interface
interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
  fromCache?: boolean
}

// Cache Interface
interface CacheEntry<T> {
  data: T
  timestamp: Date
  expiresAt: Date
}

export class RobustAPIService {
  private baseUrl: string
  private timeout: number
  private retryCount: number
  private retryDelay: number
  private enableCaching: boolean
  private cacheTimeout: number
  private cache = new Map<string, CacheEntry<any>>()

  constructor(config: ServiceConfig = {}) {
    this.baseUrl = config.baseUrl || ''
    this.timeout = config.timeout || 10000
    this.retryCount = config.retryCount || 3
    this.retryDelay = config.retryDelay || 1000
    this.enableCaching = config.enableCaching || true
    this.cacheTimeout = config.cacheTimeout || 300000 // 5 Minuten
  }

  /**
   * Robuster HTTP-Request mit automatischer Fehlerbehandlung
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    errorType: ErrorType = ErrorType.NETWORK,
    componentName: string = 'APIService'
  ): Promise<ServiceResponse<T>> {
    const fullUrl = `${this.baseUrl}${url}`
    const cacheKey = `${options.method || 'GET'}_${fullUrl}_${JSON.stringify(options.body || {})}`

    // Cache Check
    if (this.enableCaching && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      const cached = this.getFromCache<T>(cacheKey)
      if (cached) {
        return {
          success: true,
          data: cached,
          timestamp: new Date(),
          fromCache: true
        }
      }
    }

    return await withAsyncErrorHandling(
      async () => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        try {
          const response = await fetch(fullUrl, {
            ...options,
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              ...options.headers
            }
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()

          // Cache speichern
          if (this.enableCaching && options.method !== 'POST') {
            this.setCache(cacheKey, data)
          }

          return {
            success: true,
            data,
            timestamp: new Date()
          }
        } catch (fetchError) {
          clearTimeout(timeoutId)
          
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            throw new Error(`Request timeout after ${this.timeout}ms`)
          }
          
          throw fetchError
        }
      },
      errorType,
      componentName,
      {
        retryCount: this.retryCount,
        retryDelay: this.retryDelay,
        fallbackValue: {
          success: false,
          error: 'Request failed after all retries',
          timestamp: new Date()
        }
      }
    ) || {
      success: false,
      error: 'Request failed',
      timestamp: new Date()
    }
  }

  /**
   * GET Request mit Fehlerbehandlung
   */
  async get<T>(
    url: string, 
    errorType: ErrorType = ErrorType.NETWORK,
    componentName: string = 'APIService'
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(url, { method: 'GET' }, errorType, componentName)
  }

  /**
   * POST Request mit Fehlerbehandlung
   */
  async post<T>(
    url: string, 
    data: any,
    errorType: ErrorType = ErrorType.NETWORK,
    componentName: string = 'APIService'
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(
      url, 
      { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }, 
      errorType, 
      componentName
    )
  }

  /**
   * PUT Request mit Fehlerbehandlung
   */
  async put<T>(
    url: string, 
    data: any,
    errorType: ErrorType = ErrorType.NETWORK,
    componentName: string = 'APIService'
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(
      url, 
      { 
        method: 'PUT', 
        body: JSON.stringify(data) 
      }, 
      errorType, 
      componentName
    )
  }

  /**
   * DELETE Request mit Fehlerbehandlung
   */
  async delete<T>(
    url: string,
    errorType: ErrorType = ErrorType.NETWORK,
    componentName: string = 'APIService'
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>(url, { method: 'DELETE' }, errorType, componentName)
  }

  // Cache Management
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (new Date() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  private setCache<T>(key: string, data: T): void {
    const now = new Date()
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: new Date(now.getTime() + this.cacheTimeout)
    })
  }

  // Cache löschen
  public clearCache(): void {
    this.cache.clear()
  }
}

// Spezielle Service-Klassen für verschiedene SmartRail-AI Bereiche

/**
 * AI Processing Service mit spezieller Fehlerbehandlung
 */
export class AIProcessingService extends RobustAPIService {
  constructor() {
    super({
      baseUrl: '/api/ai',
      timeout: 30000, // Längere Timeouts für AI-Processing
      retryCount: 2,
      retryDelay: 2000,
      enableCaching: false // AI-Requests nicht cachen
    })
  }

  async processVideoStream(streamData: any, component: string = 'AIProcessing'): Promise<ServiceResponse<any>> {
    return await withAsyncErrorHandling(
      async () => {
        const response = await this.post('/video-analysis', streamData, ErrorType.AI_PROCESSING, component)
        
        if (!response.success) {
          throw new Error(response.error || 'AI processing failed')
        }

        return response
      },
      ErrorType.AI_PROCESSING,
      component,
      {
        retryCount: 1, // Weniger Retries für AI
        fallbackValue: {
          success: false,
          error: 'AI processing unavailable, using fallback detection',
          timestamp: new Date()
        }
      }
    ) || {
      success: false,
      error: 'AI processing failed',
      timestamp: new Date()
    }
  }

  async trainModel(modelData: any, component: string = 'AITraining'): Promise<ServiceResponse<any>> {
    return this.post('/train', modelData, ErrorType.AI_PROCESSING, component)
  }

  async predictDelays(trackData: any, component: string = 'DelayPrediction'): Promise<ServiceResponse<any>> {
    return this.post('/predict-delays', trackData, ErrorType.AI_PROCESSING, component)
  }
}

/**
 * Drone Service mit spezieller Fehlerbehandlung
 */
export class DroneControlService extends RobustAPIService {
  constructor() {
    super({
      baseUrl: '/api/drones',
      timeout: 15000,
      retryCount: 2,
      retryDelay: 3000,
      enableCaching: true,
      cacheTimeout: 60000 // 1 Minute für Drohnen-Status
    })
  }

  async getFleetStatus(component: string = 'DroneFleet'): Promise<ServiceResponse<any>> {
    return this.get('/fleet/status', ErrorType.DRONE_OPERATION, component)
  }

  async deployDrone(droneConfig: any, component: string = 'DroneDeployment'): Promise<ServiceResponse<any>> {
    return await withAsyncErrorHandling(
      async () => {
        const response = await this.post('/deploy', droneConfig, ErrorType.DRONE_OPERATION, component)
        
        if (!response.success) {
          // Versuche Backup-Drohne zu aktivieren
          const backupResponse = await this.activateBackupDrone(droneConfig, component)
          if (backupResponse.success) {
            return backupResponse
          }
          
          throw new Error(response.error || 'Drone deployment failed')
        }

        return response
      },
      ErrorType.DRONE_OPERATION,
      component,
      {
        retryCount: 1,
        fallbackValue: {
          success: false,
          error: 'No drones available for deployment',
          timestamp: new Date()
        }
      }
    ) || {
      success: false,
      error: 'Drone deployment failed',
      timestamp: new Date()
    }
  }

  private async activateBackupDrone(config: any, component: string): Promise<ServiceResponse<any>> {
    try {
      return await this.post('/deploy/backup', config, ErrorType.DRONE_OPERATION, component)
    } catch (error) {
      return {
        success: false,
        error: 'Backup drone activation failed',
        timestamp: new Date()
      }
    }
  }

  async returnDrone(droneId: string, component: string = 'DroneReturn'): Promise<ServiceResponse<any>> {
    return this.post(`/${droneId}/return`, {}, ErrorType.DRONE_OPERATION, component)
  }

  async emergencyLand(droneId: string, component: string = 'DroneEmergency'): Promise<ServiceResponse<any>> {
    return this.post(`/${droneId}/emergency-land`, {}, ErrorType.DRONE_OPERATION, component)
  }
}

/**
 * Weather Service mit spezieller Fehlerbehandlung
 */
export class WeatherDataService extends RobustAPIService {
  constructor() {
    super({
      baseUrl: '/api/weather',
      timeout: 8000,
      retryCount: 3,
      retryDelay: 1000,
      enableCaching: true,
      cacheTimeout: 600000 // 10 Minuten für Wetterdaten
    })
  }

  async getCurrentWeather(location: string, component: string = 'WeatherData'): Promise<ServiceResponse<any>> {
    return await withAsyncErrorHandling(
      async () => {
        const response = await this.get(`/current?location=${encodeURIComponent(location)}`, ErrorType.WEATHER_API, component)
        
        if (!response.success) {
          // Fallback auf lokale Wetterdaten
          const localWeather = await this.getLocalWeatherFallback(location)
          if (localWeather) {
            return {
              success: true,
              data: localWeather,
              timestamp: new Date(),
              fromCache: true
            }
          }
          
          throw new Error(response.error || 'Weather data unavailable')
        }

        return response
      },
      ErrorType.WEATHER_API,
      component,
      {
        retryCount: 2,
        fallbackValue: {
          success: true,
          data: { status: 'unknown', conditions: 'fallback' },
          timestamp: new Date()
        }
      }
    ) || {
      success: false,
      error: 'Weather service unavailable',
      timestamp: new Date()
    }
  }

  private async getLocalWeatherFallback(location: string): Promise<any | null> {
    try {
      // Lokale Wetter-Fallback-Logik
      const cached = this.getFromCache(`weather_${location}`)
      return cached || null
    } catch (error) {
      return null
    }
  }

  async getWeatherForecast(location: string, days: number = 7, component: string = 'WeatherForecast'): Promise<ServiceResponse<any>> {
    return this.get(`/forecast?location=${encodeURIComponent(location)}&days=${days}`, ErrorType.WEATHER_API, component)
  }

  async getWeatherAlerts(region: string, component: string = 'WeatherAlerts'): Promise<ServiceResponse<any>> {
    return this.get(`/alerts?region=${encodeURIComponent(region)}`, ErrorType.WEATHER_API, component)
  }
}

/**
 * Sensor Data Service mit spezieller Fehlerbehandlung
 */
export class SensorDataService extends RobustAPIService {
  constructor() {
    super({
      baseUrl: '/api/sensors',
      timeout: 5000,
      retryCount: 2,
      retryDelay: 500,
      enableCaching: true,
      cacheTimeout: 30000 // 30 Sekunden für Sensordaten
    })
  }

  async getTrackSensors(sectionId: string, component: string = 'TrackSensors'): Promise<ServiceResponse<any>> {
    return await withAsyncErrorHandling(
      async () => {
        const response = await this.get(`/track/${sectionId}`, ErrorType.SENSOR_DATA, component)
        
        if (!response.success) {
          // Versuche alternative Sensoren
          const alternativeData = await this.getAlternativeSensorData(sectionId)
          if (alternativeData) {
            return {
              success: true,
              data: alternativeData,
              timestamp: new Date()
            }
          }
          
          throw new Error(response.error || 'Sensor data unavailable')
        }

        return response
      },
      ErrorType.SENSOR_DATA,
      component,
      {
        retryCount: 1,
        showToast: false, // Sensor-Fehler sind häufig
        fallbackValue: {
          success: true,
          data: { status: 'estimated', sensors: [] },
          timestamp: new Date()
        }
      }
    ) || {
      success: false,
      error: 'Sensor data unavailable',
      timestamp: new Date()
    }
  }

  private async getAlternativeSensorData(sectionId: string): Promise<any | null> {
    try {
      // Alternative Sensor-Logik (z.B. benachbarte Sensoren)
      const response = await this.get(`/track/${sectionId}/alternative`, ErrorType.SENSOR_DATA, 'AlternativeSensors')
      return response.success ? response.data : null
    } catch (error) {
      return null
    }
  }

  async getDoorSensors(trainId: string, component: string = 'DoorSensors'): Promise<ServiceResponse<any>> {
    return this.get(`/door/${trainId}`, ErrorType.SENSOR_DATA, component)
  }

  async getCameraSensors(cameraId: string, component: string = 'CameraSensors'): Promise<ServiceResponse<any>> {
    return this.get(`/camera/${cameraId}`, ErrorType.CAMERA_SYSTEM, component)
  }
}

// Service-Instanzen für den globalen Gebrauch
export const aiService = new AIProcessingService()
export const droneService = new DroneControlService()
export const weatherService = new WeatherDataService()
export const sensorService = new SensorDataService()

// Health Check Service für System-Monitoring
export class HealthCheckService {
  private services = [
    { name: 'AI Processing', service: aiService },
    { name: 'Drone Control', service: droneService },
    { name: 'Weather Data', service: weatherService },
    { name: 'Sensor Data', service: sensorService }
  ]

  async checkAllServices(): Promise<{ [serviceName: string]: boolean }> {
    const results: { [serviceName: string]: boolean } = {}

    await Promise.all(
      this.services.map(async ({ name, service }) => {
        try {
          const response = await service.get('/health', ErrorType.NETWORK, 'HealthCheck')
          results[name] = response.success
        } catch (error) {
          handleNetworkError(error, 'HealthCheck')
          results[name] = false
        }
      })
    )

    return results
  }

  async getSystemHealth(): Promise<{
    overall: 'healthy' | 'degraded' | 'critical'
    services: { [serviceName: string]: boolean }
    timestamp: Date
  }> {
    const services = await this.checkAllServices()
    const healthyCount = Object.values(services).filter(Boolean).length
    const totalCount = Object.keys(services).length
    
    let overall: 'healthy' | 'degraded' | 'critical'
    if (healthyCount === totalCount) {
      overall = 'healthy'
    } else if (healthyCount >= totalCount * 0.5) {
      overall = 'degraded'
    } else {
      overall = 'critical'
    }

    return {
      overall,
      services,
      timestamp: new Date()
    }
  }
}

export const healthCheckService = new HealthCheckService()