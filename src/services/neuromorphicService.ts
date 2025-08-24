// Neuromorphic Computing simulation service for demo data generation
import { neuromorphicEventTypes, locations } from '../utils/constants'

export interface NeuromorphicEvent {
  id: string
  timestamp: string
  type: string
  location: string
  confidence: number
  processingTime: number
  energyUsed: number
  spikePattern: number[]
  synapticActivity: number
}

export interface NeuromorphicMetrics {
  totalSpikesProcessed: number
  averageEnergyEfficiency: number
  realTimeEvents: number
  adaptiveLearning: number
  temperatureDistribution: number[]
  powerConsumptionHistory: number[]
}

export class NeuromorphicService {
  private eventBuffer: NeuromorphicEvent[] = []
  private metricsHistory: NeuromorphicMetrics[] = []
  
  generateRealtimeEvent(): NeuromorphicEvent {
    const eventType = neuromorphicEventTypes[Math.floor(Math.random() * neuromorphicEventTypes.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    
    return {
      id: `neuro-evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type: eventType,
      location: location,
      confidence: 85 + Math.random() * 14, // 85-99% confidence
      processingTime: 0.05 + Math.random() * 2.95, // 0.05-3ms processing time
      energyUsed: 0.3 + Math.random() * 3.7, // 0.3-4μJ energy consumption
      spikePattern: this.generateSpikePattern(),
      synapticActivity: 70 + Math.random() * 29 // 70-99% activity
    }
  }
  
  private generateSpikePattern(): number[] {
    // Generate realistic spike timing pattern (last 100ms in 1ms intervals)
    const pattern: number[] = new Array(100).fill(0)
    const spikeCount = Math.floor(1 + Math.random() * 15) // 1-15 spikes
    
    for (let i = 0; i < spikeCount; i++) {
      const spikeTime = Math.floor(Math.random() * 100)
      pattern[spikeTime] = 1 + Math.random() * 4 // Spike magnitude 1-5
    }
    
    return pattern
  }
  
  simulateNeuromorphicProcessing(units: any[]): NeuromorphicMetrics {
    const totalSpikes = units.reduce((sum, unit) => sum + unit.spikeRate, 0)
    const avgEfficiency = units.reduce((sum, unit) => sum + unit.energyEfficiency, 0) / units.length
    
    return {
      totalSpikesProcessed: totalSpikes,
      averageEnergyEfficiency: avgEfficiency,
      realTimeEvents: Math.floor(Math.random() * 10) + 15, // 15-25 events/minute
      adaptiveLearning: 82 + Math.random() * 16, // 82-98% learning efficiency
      temperatureDistribution: this.generateTemperatureDistribution(),
      powerConsumptionHistory: this.generatePowerHistory()
    }
  }
  
  private generateTemperatureDistribution(): number[] {
    // Generate temperature distribution across neuromorphic units
    return Array.from({ length: 24 }, (_, i) => {
      const baseTemp = 25 + Math.sin(i * Math.PI / 12) * 8 // Daily temperature cycle
      return baseTemp + (Math.random() - 0.5) * 6 // ±3°C variation
    })
  }
  
  private generatePowerHistory(): number[] {
    // Generate power consumption history (last 24 hours)
    return Array.from({ length: 24 }, (_, i) => {
      const basePower = 35 // Base power consumption in mW
      const loadVariation = Math.sin(i * Math.PI / 6) * 15 // Peak during day hours
      const randomVariation = (Math.random() - 0.5) * 8
      return Math.max(15, basePower + loadVariation + randomVariation)
    })
  }
  
  getPerformanceComparison() {
    return {
      neuromorphic: {
        powerConsumption: 42.5, // mW
        operationsPerJoule: 2.8e12,
        latency: 0.15, // ms
        accuracy: 96.8, // %
        batteryLife: 62 // hours
      },
      traditional: {
        powerConsumption: 850, // mW  
        operationsPerJoule: 3.2e10,
        latency: 12.5, // ms
        accuracy: 94.2, // %
        batteryLife: 6.5 // hours
      }
    }
  }
  
  analyzeSpikingPatterns(spikeData: number[]): {
    frequency: number
    burstiness: number
    regularity: number
    efficiency: number
  } {
    const spikeCount = spikeData.filter(x => x > 0).length
    const totalTime = spikeData.length
    
    // Calculate spike frequency (Hz)
    const frequency = (spikeCount / totalTime) * 1000 // Convert to Hz
    
    // Calculate burstiness (measure of temporal clustering)
    let burstiness = 0
    for (let i = 1; i < spikeData.length; i++) {
      if (spikeData[i] > 0 && spikeData[i-1] > 0) {
        burstiness += 1
      }
    }
    burstiness = burstiness / Math.max(1, spikeCount - 1)
    
    // Calculate regularity (inverse of coefficient of variation)
    const intervals: number[] = []
    let lastSpikeTime = -1
    for (let i = 0; i < spikeData.length; i++) {
      if (spikeData[i] > 0) {
        if (lastSpikeTime >= 0) {
          intervals.push(i - lastSpikeTime)
        }
        lastSpikeTime = i
      }
    }
    
    const meanInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - meanInterval, 2), 0) / intervals.length
    const regularity = meanInterval / Math.sqrt(variance)
    
    // Calculate efficiency (information per spike)
    const maxPossibleInfo = Math.log2(totalTime) // Maximum information with perfect timing
    const actualInfo = spikeCount > 0 ? Math.log2(spikeCount * 100 / totalTime) : 0
    const efficiency = actualInfo / maxPossibleInfo
    
    return {
      frequency: Math.round(frequency * 100) / 100,
      burstiness: Math.round(burstiness * 100) / 100,
      regularity: Math.round(regularity * 100) / 100,
      efficiency: Math.round(efficiency * 100) / 100
    }
  }
  
  predictMaintenanceNeeds(units: any[]): {
    unitId: string
    riskLevel: 'low' | 'medium' | 'high'
    predictedIssues: string[]
    maintenanceWindow: string
  }[] {
    return units.map(unit => {
      const tempRisk = unit.temperature > 40 ? 'high' : unit.temperature > 35 ? 'medium' : 'low'
      const powerRisk = unit.powerConsumption > 60 ? 'high' : unit.powerConsumption > 50 ? 'medium' : 'low'
      const overallRisk = [tempRisk, powerRisk].includes('high') ? 'high' : 
                         [tempRisk, powerRisk].includes('medium') ? 'medium' : 'low'
      
      const issues: string[] = []
      if (unit.temperature > 40) issues.push('Thermisches Management')
      if (unit.powerConsumption > 55) issues.push('Energieeffizienz-Degradation')
      if (unit.accuracy < 95) issues.push('Synaptische Drift')
      if (unit.processingLoad > 90) issues.push('Überlastung')
      
      const maintenanceWindow = overallRisk === 'high' ? 'Sofort' :
                               overallRisk === 'medium' ? 'Diese Woche' : 'Nächster Monat'
      
      return {
        unitId: unit.id,
        riskLevel: overallRisk,
        predictedIssues: issues,
        maintenanceWindow
      }
    })
  }
}

export const neuromorphicService = new NeuromorphicService()