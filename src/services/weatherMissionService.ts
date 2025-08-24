import { useKV } from '@github/spark/hooks'

export interface WeatherData {
  location: string
  coordinates: [number, number]
  current: {
    temperature: number
    humidity: number
    pressure: number
    windSpeed: number
    windDirection: number
    visibility: number
    precipitation: number
    condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog'
    uvIndex: number
  }
  forecast: Array<{
    timestamp: string
    temperature: number
    condition: string
    precipitation: number
    windSpeed: number
    confidence: number
  }>
  alerts: Array<{
    type: string
    severity: 'low' | 'medium' | 'high' | 'extreme'
    message: string
    validUntil: string
  }>
  lastUpdate: string
}

export interface MissionAdjustment {
  id: string
  triggeredBy: string
  type: 'route_change' | 'speed_limit' | 'service_suspension' | 'resource_deployment'
  priority: 'low' | 'medium' | 'high' | 'critical'
  implementation: 'automatic' | 'manual' | 'pending'
  estimatedDelay: number
  costImpact: number
  description: string
  executedAt?: string
}

class WeatherMissionService {
  private static instance: WeatherMissionService
  private weatherData: Map<string, WeatherData> = new Map()
  private activeMissions: Map<string, MissionAdjustment> = new Map()

  static getInstance(): WeatherMissionService {
    if (!WeatherMissionService.instance) {
      WeatherMissionService.instance = new WeatherMissionService()
    }
    return WeatherMissionService.instance
  }

  // Simulate real-time weather data updates
  async updateWeatherData(location: string): Promise<WeatherData> {
    const currentData = this.weatherData.get(location)
    
    // Simulate API call to weather service
    const updatedData: WeatherData = {
      location,
      coordinates: currentData?.coordinates || [52.5200, 13.4050], // Default to Berlin
      current: {
        temperature: 10 + Math.random() * 20,
        humidity: 50 + Math.random() * 40,
        pressure: 1000 + Math.random() * 40,
        windSpeed: Math.random() * 60,
        windDirection: Math.random() * 360,
        visibility: 5 + Math.random() * 5,
        precipitation: Math.random() * 15,
        condition: this.randomWeatherCondition(),
        uvIndex: Math.floor(Math.random() * 11)
      },
      forecast: this.generateForecast(),
      alerts: this.generateWeatherAlerts(),
      lastUpdate: new Date().toISOString()
    }

    this.weatherData.set(location, updatedData)
    
    // Check for mission adjustments
    await this.evaluateMissionAdjustments(updatedData)
    
    return updatedData
  }

  private randomWeatherCondition(): 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' {
    const conditions = ['clear', 'cloudy', 'rain', 'storm', 'snow', 'fog'] as const
    return conditions[Math.floor(Math.random() * conditions.length)]
  }

  private generateForecast() {
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() + i * 3600000).toISOString(),
      temperature: 10 + Math.sin(i / 4) * 8 + Math.random() * 5,
      condition: this.randomWeatherCondition(),
      precipitation: Math.random() * 10,
      windSpeed: 10 + Math.random() * 40,
      confidence: 95 - i * 2
    }))
  }

  private generateWeatherAlerts() {
    const alerts = []
    const random = Math.random()
    
    if (random < 0.3) {
      alerts.push({
        type: 'Storm Warning',
        severity: 'high' as const,
        message: 'Severe thunderstorm expected with strong winds and heavy rain',
        validUntil: new Date(Date.now() + 6 * 3600000).toISOString()
      })
    }
    
    if (random < 0.2) {
      alerts.push({
        type: 'High Wind',
        severity: 'medium' as const,
        message: 'Wind speeds may exceed 50 km/h',
        validUntil: new Date(Date.now() + 4 * 3600000).toISOString()
      })
    }
    
    return alerts
  }

  // Evaluate and create mission adjustments based on weather conditions
  private async evaluateMissionAdjustments(weatherData: WeatherData): Promise<void> {
    const adjustments: MissionAdjustment[] = []

    // High wind conditions
    if (weatherData.current.windSpeed > 50) {
      adjustments.push({
        id: `WM_${Date.now()}_WIND`,
        triggeredBy: `High wind speed: ${Math.round(weatherData.current.windSpeed)} km/h`,
        type: 'speed_limit',
        priority: 'high',
        implementation: 'automatic',
        estimatedDelay: Math.ceil(weatherData.current.windSpeed / 10),
        costImpact: Math.round(weatherData.current.windSpeed * 50),
        description: 'Geschwindigkeitsbegrenzung aufgrund starker Winde',
        executedAt: new Date().toISOString()
      })
    }

    // Heavy precipitation
    if (weatherData.current.precipitation > 8) {
      adjustments.push({
        id: `WM_${Date.now()}_RAIN`,
        triggeredBy: `Heavy precipitation: ${(weatherData.current?.precipitation || 0).toFixed(1)} mm/h`,
        type: 'resource_deployment',
        priority: 'medium',
        implementation: 'automatic',
        estimatedDelay: 5,
        costImpact: 2500,
        description: 'Drohnen-Überwachung für Überschwemmungsrisiko',
        executedAt: new Date().toISOString()
      })
    }

    // Storm conditions
    if (weatherData.current.condition === 'storm') {
      adjustments.push({
        id: `WM_${Date.now()}_STORM`,
        triggeredBy: 'Storm conditions detected',
        type: 'service_suspension',
        priority: 'critical',
        implementation: 'manual',
        estimatedDelay: 30,
        costImpact: 15000,
        description: 'Temporäre Streckensperrung aufgrund Sturm'
      })
    }

    // Low visibility
    if (weatherData.current.visibility < 3) {
      adjustments.push({
        id: `WM_${Date.now()}_VIS`,
        triggeredBy: `Low visibility: ${(weatherData.current?.visibility || 0).toFixed(1)} km`,
        type: 'speed_limit',
        priority: 'high',
        implementation: 'automatic',
        estimatedDelay: 10,
        costImpact: 3000,
        description: 'Sichtfahrt-Protokoll aktiviert',
        executedAt: new Date().toISOString()
      })
    }

    // Store new adjustments
    adjustments.forEach(adjustment => {
      this.activeMissions.set(adjustment.id, adjustment)
    })
  }

  // Get weather impact prediction for mission planning
  getPredictedImpacts(timeWindow: number = 24): Array<{
    timeframe: string
    impactLevel: 'low' | 'medium' | 'high' | 'critical'
    affectedSystems: string[]
    recommendedActions: string[]
    confidence: number
  }> {
    const impacts = []
    const locations = Array.from(this.weatherData.keys())

    for (const location of locations) {
      const weather = this.weatherData.get(location)
      if (!weather) continue

      // Analyze forecast for critical periods
      const criticalPeriods = weather.forecast
        .filter(f => f.windSpeed > 40 || f.precipitation > 5)
        .slice(0, timeWindow)

      for (const period of criticalPeriods) {
        const impactLevel = this.calculateImpactLevel(period)
        
        impacts.push({
          timeframe: new Date(period.timestamp).toLocaleString(),
          impactLevel,
          affectedSystems: this.getAffectedSystems(period, location),
          recommendedActions: this.getRecommendedActions(period),
          confidence: period.confidence
        })
      }
    }

    return impacts.sort((a, b) => 
      this.getImpactWeight(b.impactLevel) - this.getImpactWeight(a.impactLevel)
    )
  }

  private calculateImpactLevel(forecast: any): 'low' | 'medium' | 'high' | 'critical' {
    if (forecast.windSpeed > 60 || forecast.precipitation > 12) return 'critical'
    if (forecast.windSpeed > 45 || forecast.precipitation > 8) return 'high'
    if (forecast.windSpeed > 30 || forecast.precipitation > 3) return 'medium'
    return 'low'
  }

  private getAffectedSystems(forecast: any, location: string): string[] {
    const systems = []
    
    if (forecast.windSpeed > 40) {
      systems.push('Brücken-Netzwerk', 'Waldstrecken', 'Hochgeschwindigkeitsstrecken')
    }
    
    if (forecast.precipitation > 5) {
      systems.push('Tiefergelegene Strecken', 'Unterführungen', 'Entwässerungssysteme')
    }
    
    if (forecast.condition === 'fog') {
      systems.push('Signalsysteme', 'Kameras', 'Automatische Steuerung')
    }

    return systems
  }

  private getRecommendedActions(forecast: any): string[] {
    const actions = []
    
    if (forecast.windSpeed > 45) {
      actions.push('Geschwindigkeitsbegrenzung aktivieren')
      actions.push('Drohnen-Vorab-Inspektion')
      actions.push('Bereitschaftsteams positionieren')
    }
    
    if (forecast.precipitation > 8) {
      actions.push('Entwässerung überprüfen')
      actions.push('Alternativrouten vorbereiten')
      actions.push('Fahrgast-Information verstärken')
    }

    return actions
  }

  private getImpactWeight(level: string): number {
    switch (level) {
      case 'critical': return 4
      case 'high': return 3
      case 'medium': return 2
      case 'low': return 1
      default: return 0
    }
  }

  // Generate optimization recommendations
  getOptimizationRecommendations(): Array<{
    type: string
    description: string
    priority: 'low' | 'medium' | 'high'
    estimatedSavings: number
    implementation: string
  }> {
    return [
      {
        type: 'Proaktive Drohnen-Patrouille',
        description: 'Automatische Drohnen-Inspektion vor vorhergesagten Stürmen',
        priority: 'high',
        estimatedSavings: 25000,
        implementation: 'Kann sofort implementiert werden'
      },
      {
        type: 'Wetterbasierte Taktanpassung',
        description: 'Dynamische Anpassung der Zugfrequenz basierend auf Wettervorhersage',
        priority: 'medium',
        estimatedSavings: 15000,
        implementation: 'Benötigt System-Update'
      },
      {
        type: 'Präventive Wartungsplanung',
        description: 'Wartungsarbeiten vor kritischen Wetterperioden durchführen',
        priority: 'high',
        estimatedSavings: 40000,
        implementation: 'Kann schrittweise eingeführt werden'
      }
    ]
  }

  // Get all active missions
  getActiveMissions(): MissionAdjustment[] {
    return Array.from(this.activeMissions.values())
  }

  // Get weather data for all locations
  getAllWeatherData(): WeatherData[] {
    return Array.from(this.weatherData.values())
  }

  // Initialize with sample data
  initializeSampleData(): void {
    const locations = [
      'Hauptbahnhof Region',
      'Bergstrecke Nord',
      'Küstenlinie Ost',
      'Industriegebiet Süd',
      'Vorstadt West'
    ]

    locations.forEach(location => {
      this.updateWeatherData(location)
    })
  }
}

export const weatherMissionService = WeatherMissionService.getInstance()

// Custom hook for weather-based mission management
export function useWeatherMissions() {
  const [weatherData, setWeatherData] = useKV<WeatherData[]>('weather-mission-data', [])
  const [activeMissions, setActiveMissions] = useKV<MissionAdjustment[]>('active-weather-missions', [])

  const updateWeatherForLocation = async (location: string) => {
    const updated = await weatherMissionService.updateWeatherData(location)
    
    // Update the KV store
    const allWeatherData = weatherMissionService.getAllWeatherData()
    const allMissions = weatherMissionService.getActiveMissions()
    
    setWeatherData(allWeatherData)
    setActiveMissions(allMissions)
    
    return updated
  }

  const initializeService = () => {
    weatherMissionService.initializeSampleData()
    const allWeatherData = weatherMissionService.getAllWeatherData()
    const allMissions = weatherMissionService.getActiveMissions()
    
    setWeatherData(allWeatherData)
    setActiveMissions(allMissions)
  }

  const getPredictedImpacts = (timeWindow?: number) => {
    return weatherMissionService.getPredictedImpacts(timeWindow)
  }

  const getOptimizationRecommendations = () => {
    return weatherMissionService.getOptimizationRecommendations()
  }

  return {
    weatherData,
    activeMissions,
    updateWeatherForLocation,
    initializeService,
    getPredictedImpacts,
    getOptimizationRecommendations
  }
}