/**
 * SmartRail-AI - Passenger Flow Management Hook
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { crowdAnalytics, PassengerMetrics, FlowOptimizationStrategy } from '../utils/crowdAnalytics'
import { toast } from 'sonner'

interface PassengerFlowState {
  stations: PassengerMetrics[]
  totalPassengers: number
  averageUtilization: number
  criticalStations: string[]
  optimizations: FlowOptimizationStrategy[]
  lastUpdate: string
  isAnalyzing: boolean
}

interface AlertThresholds {
  warning: number
  critical: number
  emergency: number
}

export const usePassengerFlow = () => {
  const [flowState, setFlowState] = useKV<PassengerFlowState>('passenger-flow-state', {
    stations: [],
    totalPassengers: 0,
    averageUtilization: 0,
    criticalStations: [],
    optimizations: [],
    lastUpdate: new Date().toISOString(),
    isAnalyzing: false
  })

  const [alertThresholds] = useKV<AlertThresholds>('flow-alert-thresholds', {
    warning: 75,
    critical: 90,
    emergency: 95
  })

  const [historicalData, setHistoricalData] = useKV<PassengerMetrics[]>('flow-historical-data', [])

  // Initialize with mock station data
  useEffect(() => {
    if (flowState.stations.length === 0) {
      const mockStations: PassengerMetrics[] = [
        {
          timestamp: new Date().toISOString(),
          stationId: 'HBF',
          platform: 'Gleis 7-8',
          density: 85,
          flow: {
            incoming: 45,
            outgoing: 38,
            boarding: 35,
            alighting: 42
          },
          capacity: {
            current: 1020,
            maximum: 1200,
            utilization: 85
          },
          predictions: {
            nextPeak: '18:15',
            expectedDensity: 92,
            riskLevel: 'high'
          }
        },
        {
          timestamp: new Date().toISOString(),
          stationId: 'ALX',
          platform: 'Gleis 3-4',
          density: 62,
          flow: {
            incoming: 32,
            outgoing: 28,
            boarding: 25,
            alighting: 35
          },
          capacity: {
            current: 496,
            maximum: 800,
            utilization: 62
          },
          predictions: {
            nextPeak: '18:30',
            expectedDensity: 75,
            riskLevel: 'medium'
          }
        },
        {
          timestamp: new Date().toISOString(),
          stationId: 'POT',
          platform: 'Gleis 1-2',
          density: 45,
          flow: {
            incoming: 22,
            outgoing: 31,
            boarding: 18,
            alighting: 28
          },
          capacity: {
            current: 270,
            maximum: 600,
            utilization: 45
          },
          predictions: {
            nextPeak: '19:00',
            expectedDensity: 60,
            riskLevel: 'low'
          }
        }
      ]

      setFlowState(current => ({
        ...current,
        stations: mockStations,
        totalPassengers: mockStations.reduce((sum, s) => sum + s.capacity.current, 0),
        averageUtilization: mockStations.reduce((sum, s) => sum + s.capacity.utilization, 0) / mockStations.length,
        lastUpdate: new Date().toISOString()
      }))
    }
  }, [flowState.stations.length, setFlowState])

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowState(current => {
        const updatedStations = current.stations.map(station => {
          // Simulate realistic passenger flow changes
          const timeOfDay = new Date().getHours()
          let flowMultiplier = 1

          // Rush hour multipliers
          if ((timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19)) {
            flowMultiplier = 1.5
          } else if (timeOfDay >= 22 || timeOfDay <= 5) {
            flowMultiplier = 0.3
          }

          const densityChange = (Math.random() - 0.5) * 8 * flowMultiplier
          const newDensity = Math.max(10, Math.min(100, station.density + densityChange))
          
          const capacityChange = Math.floor((newDensity - station.density) * station.capacity.maximum / 100)
          const newCurrentCapacity = Math.max(0, station.capacity.current + capacityChange)

          // Update flow rates based on density changes
          const incomingAdjustment = densityChange > 0 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 5)
          const outgoingAdjustment = densityChange < 0 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 5)

          const updatedStation: PassengerMetrics = {
            ...station,
            timestamp: new Date().toISOString(),
            density: newDensity,
            flow: {
              ...station.flow,
              incoming: Math.max(0, station.flow.incoming + incomingAdjustment),
              outgoing: Math.max(0, station.flow.outgoing + outgoingAdjustment),
              boarding: Math.max(0, station.flow.boarding + Math.floor((Math.random() - 0.5) * 6)),
              alighting: Math.max(0, station.flow.alighting + Math.floor((Math.random() - 0.5) * 6))
            },
            capacity: {
              ...station.capacity,
              current: newCurrentCapacity,
              utilization: (newCurrentCapacity / station.capacity.maximum) * 100
            }
          }

          // Update predictions based on current trends
          const riskAnalysis = crowdAnalytics.analyzeDensityRisk(updatedStation)
          updatedStation.predictions.riskLevel = riskAnalysis.currentRisk as any

          return updatedStation
        })

        // Calculate overall metrics
        const totalPassengers = updatedStations.reduce((sum, s) => sum + s.capacity.current, 0)
        const averageUtilization = updatedStations.reduce((sum, s) => sum + s.capacity.utilization, 0) / updatedStations.length
        const criticalStations = updatedStations
          .filter(s => s.capacity.utilization >= alertThresholds.critical)
          .map(s => s.stationId)

        return {
          ...current,
          stations: updatedStations,
          totalPassengers,
          averageUtilization,
          criticalStations,
          lastUpdate: new Date().toISOString()
        }
      })
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [setFlowState, alertThresholds])

  // Monitor for alerts
  useEffect(() => {
    const criticalStations = flowState.stations.filter(s => s.capacity.utilization >= alertThresholds.critical)
    const emergencyStations = flowState.stations.filter(s => s.capacity.utilization >= alertThresholds.emergency)

    if (emergencyStations.length > 0) {
      toast.error(`Notfall: Kritische Überfüllung in ${emergencyStations.length} Bahnhof${emergencyStations.length !== 1 ? 'en' : ''}`, {
        description: emergencyStations.map(s => s.stationId).join(', '),
        duration: 10000,
      })
    } else if (criticalStations.length > 0) {
      toast.warning(`Warnung: Hohe Auslastung in ${criticalStations.length} Bahnhof${criticalStations.length !== 1 ? 'en' : ''}`, {
        description: criticalStations.map(s => s.stationId).join(', '),
        duration: 5000,
      })
    }
  }, [flowState.stations, alertThresholds])

  const runFlowAnalysis = useCallback(async () => {
    setFlowState(current => ({ ...current, isAnalyzing: true }))

    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate optimization strategies
      const strategies = crowdAnalytics.generateOptimizationStrategies(
        flowState.stations,
        flowState.totalPassengers
      )

      setFlowState(current => ({
        ...current,
        optimizations: strategies,
        isAnalyzing: false,
        lastUpdate: new Date().toISOString()
      }))

      // Store historical data
      setHistoricalData(current => [
        ...current.slice(-100), // Keep last 100 entries
        ...flowState.stations
      ])

      toast.success('Fahrgastfluss-Analyse abgeschlossen', {
        description: `${strategies.length} Optimierungsvorschläge generiert`
      })

      return strategies
    } catch (error) {
      setFlowState(current => ({ ...current, isAnalyzing: false }))
      toast.error('Fehler bei der Fahrgastfluss-Analyse')
      throw error
    }
  }, [flowState.stations, flowState.totalPassengers, setFlowState, setHistoricalData])

  const implementOptimization = useCallback((optimizationId: string) => {
    setFlowState(current => ({
      ...current,
      optimizations: current.optimizations.map(opt =>
        opt.id === optimizationId
          ? { ...opt, implementationTime: Date.now() }
          : opt
      )
    }))

    toast.success('Optimierung implementiert', {
      description: 'Fahrgastfluss wird angepasst'
    })
  }, [setFlowState])

  const removeOptimization = useCallback((optimizationId: string) => {
    setFlowState(current => ({
      ...current,
      optimizations: current.optimizations.filter(opt => opt.id !== optimizationId)
    }))
  }, [setFlowState])

  const getStationRiskAnalysis = useCallback((stationId: string) => {
    const station = flowState.stations.find(s => s.stationId === stationId)
    if (!station) return null

    return crowdAnalytics.analyzeDensityRisk(station)
  }, [flowState.stations])

  const getPredictions = useCallback((stationId: string) => {
    const station = flowState.stations.find(s => s.stationId === stationId)
    if (!station) return null

    const relevantHistory = historicalData.filter(h => h.stationId === stationId)
    return crowdAnalytics.predictFlowPatterns(station, relevantHistory)
  }, [flowState.stations, historicalData])

  const getNetworkHeatMap = useCallback(() => {
    return crowdAnalytics.generateHeatMapData(flowState.stations)
  }, [flowState.stations])

  return {
    // State
    flowState,
    historicalData,
    alertThresholds,

    // Actions
    runFlowAnalysis,
    implementOptimization,
    removeOptimization,

    // Analysis
    getStationRiskAnalysis,
    getPredictions,
    getNetworkHeatMap,

    // Computed values
    criticalStationsCount: flowState.criticalStations.length,
    totalCapacityUtilization: flowState.averageUtilization,
    isRealTimeActive: !flowState.isAnalyzing
  }
}

export type UsePassengerFlowReturn = ReturnType<typeof usePassengerFlow>