/**
 * SmartRail-AI - Crowd Analytics Utilities
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

export interface PassengerMetrics {
  timestamp: string
  stationId: string
  platform: string
  density: number
  flow: {
    incoming: number
    outgoing: number
    boarding: number
    alighting: number
  }
  capacity: {
    current: number
    maximum: number
    utilization: number
  }
  predictions: {
    nextPeak: string
    expectedDensity: number
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
  }
}

export interface FlowOptimizationStrategy {
  id: string
  type: 'redistribute' | 'delay' | 'redirect' | 'emergency' | 'capacity_increase'
  priority: 'low' | 'medium' | 'high' | 'critical'
  description: string
  targetStations: string[]
  estimatedEffectiveness: number
  implementationTime: number
  resourcesRequired: string[]
  riskAssessment: {
    safety: number
    efficiency: number
    passengerSatisfaction: number
  }
}

export class CrowdAnalytics {
  private readonly DENSITY_THRESHOLDS = {
    low: 30,
    medium: 60,
    high: 80,
    critical: 95
  }

  private readonly FLOW_PATTERNS = {
    morning_rush: { start: '07:00', end: '09:30' },
    lunch_peak: { start: '12:00', end: '14:00' },
    evening_rush: { start: '17:00', end: '19:30' },
    late_night: { start: '22:00', end: '00:30' }
  }

  /**
   * Analyzes current passenger density and predicts risk levels
   */
  analyzeDensityRisk(metrics: PassengerMetrics): {
    currentRisk: string
    trendDirection: 'increasing' | 'decreasing' | 'stable'
    timeToCapacity: number | null
    recommendedActions: string[]
  } {
    const { density } = metrics
    const utilization = metrics.capacity.utilization

    let currentRisk: string
    if (density >= this.DENSITY_THRESHOLDS.critical) {
      currentRisk = 'critical'
    } else if (density >= this.DENSITY_THRESHOLDS.high) {
      currentRisk = 'high'
    } else if (density >= this.DENSITY_THRESHOLDS.medium) {
      currentRisk = 'medium'
    } else {
      currentRisk = 'low'
    }

    // Calculate trend based on flow data
    const netFlow = metrics.flow.incoming - metrics.flow.outgoing
    let trendDirection: 'increasing' | 'decreasing' | 'stable'
    if (netFlow > 10) {
      trendDirection = 'increasing'
    } else if (netFlow < -10) {
      trendDirection = 'decreasing'
    } else {
      trendDirection = 'stable'
    }

    // Estimate time to capacity
    let timeToCapacity: number | null = null
    if (trendDirection === 'increasing' && utilization < 100) {
      const ratePerMinute = netFlow / 5 // Assuming 5-minute measurement window
      const remainingCapacity = metrics.capacity.maximum - metrics.capacity.current
      timeToCapacity = Math.round(remainingCapacity / ratePerMinute)
    }

    // Generate recommendations
    const recommendedActions: string[] = []
    if (currentRisk === 'critical') {
      recommendedActions.push('Sofortige Evakuierung erwägen')
      recommendedActions.push('Zusätzliche Züge bereitstellen')
      recommendedActions.push('Fahrgäste zu alternativen Routen umleiten')
    } else if (currentRisk === 'high') {
      recommendedActions.push('Überfüllungswarnung aussenden')
      recommendedActions.push('Fahrgastverteilung optimieren')
      recommendedActions.push('Zusätzliches Personal entsenden')
    } else if (currentRisk === 'medium' && trendDirection === 'increasing') {
      recommendedActions.push('Präventive Maßnahmen aktivieren')
      recommendedActions.push('Fahrgastinformationen verstärken')
    }

    return {
      currentRisk,
      trendDirection,
      timeToCapacity,
      recommendedActions
    }
  }

  /**
   * Generates flow optimization strategies based on current conditions
   */
  generateOptimizationStrategies(
    stationMetrics: PassengerMetrics[],
    networkCapacity: number
  ): FlowOptimizationStrategy[] {
    const strategies: FlowOptimizationStrategy[] = []

    // Find overcrowded and underutilized stations
    const overcrowded = stationMetrics.filter(s => s.capacity.utilization > 80)
    const underutilized = stationMetrics.filter(s => s.capacity.utilization < 50)

    // Strategy 1: Redistribute passengers from overcrowded to underutilized
    if (overcrowded.length > 0 && underutilized.length > 0) {
      strategies.push({
        id: `redistribute_${Date.now()}`,
        type: 'redistribute',
        priority: overcrowded.some(s => s.capacity.utilization > 95) ? 'critical' : 'high',
        description: `Fahrgäste von überfüllten Bahnhöfen (${overcrowded.map(s => s.stationId).join(', ')}) zu weniger genutzten Bereichen umleiten`,
        targetStations: [...overcrowded.map(s => s.stationId), ...underutilized.map(s => s.stationId)],
        estimatedEffectiveness: this.calculateRedistributionEffectiveness(overcrowded, underutilized),
        implementationTime: 5,
        resourcesRequired: ['Digitale Anzeigetafeln', 'Personal für Fahrgastlenkung', 'Mobile Apps'],
        riskAssessment: {
          safety: 85,
          efficiency: 75,
          passengerSatisfaction: 70
        }
      })
    }

    // Strategy 2: Delay trains to allow better distribution
    const criticalStations = stationMetrics.filter(s => s.capacity.utilization > 90)
    if (criticalStations.length > 0) {
      strategies.push({
        id: `delay_${Date.now()}`,
        type: 'delay',
        priority: 'medium',
        description: `Kurze Verzögerungen (2-3 Minuten) implementieren, um Fahrgastverteilung zu verbessern`,
        targetStations: criticalStations.map(s => s.stationId),
        estimatedEffectiveness: 65,
        implementationTime: 1,
        resourcesRequired: ['Zugsteuerungssystem', 'Fahrgastinformation'],
        riskAssessment: {
          safety: 95,
          efficiency: 60,
          passengerSatisfaction: 50
        }
      })
    }

    // Strategy 3: Emergency capacity increase
    if (stationMetrics.some(s => s.capacity.utilization > 95)) {
      strategies.push({
        id: `emergency_capacity_${Date.now()}`,
        type: 'capacity_increase',
        priority: 'critical',
        description: 'Zusätzliche Züge und verlängerte Züge zur Kapazitätserhöhung einsetzen',
        targetStations: stationMetrics.filter(s => s.capacity.utilization > 95).map(s => s.stationId),
        estimatedEffectiveness: 90,
        implementationTime: 15,
        resourcesRequired: ['Reserve-Züge', 'Zusätzliches Personal', 'Erweiterte Gleiskapazität'],
        riskAssessment: {
          safety: 80,
          efficiency: 90,
          passengerSatisfaction: 85
        }
      })
    }

    return strategies.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  /**
   * Predicts passenger flow patterns based on historical data and current trends
   */
  predictFlowPatterns(
    currentMetrics: PassengerMetrics,
    historicalData: PassengerMetrics[]
  ): {
    nextPeakTime: string
    expectedDensity: number
    confidenceLevel: number
    factors: string[]
  } {
    const currentTime = new Date()
    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()

    // Determine current period
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    
    let nextPeakTime: string
    let expectedDensity: number
    let confidenceLevel: number
    const factors: string[] = []

    // Predict based on typical patterns
    if (currentHour >= 7 && currentHour < 10) {
      nextPeakTime = '08:30'
      expectedDensity = 85
      confidenceLevel = 90
      factors.push('Morgendlicher Berufsverkehr')
    } else if (currentHour >= 12 && currentHour < 14) {
      nextPeakTime = '13:00'
      expectedDensity = 65
      confidenceLevel = 75
      factors.push('Mittagspause')
    } else if (currentHour >= 17 && currentHour < 20) {
      nextPeakTime = '18:15'
      expectedDensity = 90
      confidenceLevel = 95
      factors.push('Feierabendverkehr')
    } else {
      nextPeakTime = '18:15'
      expectedDensity = 45
      confidenceLevel = 60
      factors.push('Normale Verkehrszeit')
    }

    // Adjust based on current trends
    const currentTrend = currentMetrics.flow.incoming - currentMetrics.flow.outgoing
    if (currentTrend > 20) {
      expectedDensity += 15
      factors.push('Überdurchschnittlicher Zustrom')
    } else if (currentTrend < -20) {
      expectedDensity -= 10
      factors.push('Reduzierter Fahrgastaufkommen')
    }

    // Consider day of week and special events
    const dayOfWeek = currentTime.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      expectedDensity *= 0.7 // Weekend reduction
      factors.push('Wochenende - reduziertes Aufkommen')
    }

    return {
      nextPeakTime,
      expectedDensity: Math.min(100, Math.max(0, expectedDensity)),
      confidenceLevel,
      factors
    }
  }

  /**
   * Calculates real-time capacity utilization and safety margins
   */
  calculateCapacityMetrics(
    currentPassengers: number,
    maxCapacity: number,
    safetyBuffer: number = 0.1
  ): {
    utilization: number
    safeCapacity: number
    remainingCapacity: number
    safetyMargin: number
    statusLevel: 'safe' | 'caution' | 'warning' | 'critical'
  } {
    const utilization = (currentPassengers / maxCapacity) * 100
    const safeCapacity = maxCapacity * (1 - safetyBuffer)
    const remainingCapacity = maxCapacity - currentPassengers
    const safetyMargin = ((safeCapacity - currentPassengers) / safeCapacity) * 100

    let statusLevel: 'safe' | 'caution' | 'warning' | 'critical'
    if (utilization < 60) {
      statusLevel = 'safe'
    } else if (utilization < 80) {
      statusLevel = 'caution'
    } else if (utilization < 95) {
      statusLevel = 'warning'
    } else {
      statusLevel = 'critical'
    }

    return {
      utilization,
      safeCapacity,
      remainingCapacity,
      safetyMargin: Math.max(0, safetyMargin),
      statusLevel
    }
  }

  /**
   * Generates crowd density heat map data for visualization
   */
  generateHeatMapData(stationMetrics: PassengerMetrics[]): {
    stationId: string
    stationName: string
    coordinates: { x: number; y: number }
    density: number
    color: string
    radius: number
  }[] {
    return stationMetrics.map((station, index) => {
      // Simulate station positions (in a real system, these would be actual coordinates)
      const coordinates = {
        x: 50 + (index % 3) * 30,
        y: 30 + Math.floor(index / 3) * 25
      }

      let color: string
      if (station.capacity.utilization > 90) {
        color = '#ef4444' // red
      } else if (station.capacity.utilization > 70) {
        color = '#f97316' // orange
      } else if (station.capacity.utilization > 40) {
        color = '#eab308' // yellow
      } else {
        color = '#22c55e' // green
      }

      return {
        stationId: station.stationId,
        stationName: station.stationId, // In real system, map to actual names
        coordinates,
        density: station.capacity.utilization,
        color,
        radius: Math.max(10, station.capacity.utilization / 5)
      }
    })
  }

  private calculateRedistributionEffectiveness(
    overcrowded: PassengerMetrics[],
    underutilized: PassengerMetrics[]
  ): number {
    const totalOvercapacity = overcrowded.reduce((sum, s) => 
      sum + Math.max(0, s.capacity.utilization - 80), 0
    )
    const totalAvailableCapacity = underutilized.reduce((sum, s) => 
      sum + Math.max(0, 80 - s.capacity.utilization), 0
    )
    
    const redistributionPotential = Math.min(totalOvercapacity, totalAvailableCapacity)
    return Math.round((redistributionPotential / totalOvercapacity) * 100)
  }
}

export const crowdAnalytics = new CrowdAnalytics()