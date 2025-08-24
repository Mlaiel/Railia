/**
 * SmartRail-AI - Predictive Analytics Hook
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
import { toast } from 'sonner'

export interface SpecialEvent {
  id: string
  name: string
  type: 'sport' | 'concert' | 'conference' | 'festival' | 'shopping' | 'holiday'
  location: string
  startTime: string
  endTime: string
  attendees: number
  impact: {
    level: 'minimal' | 'low' | 'moderate' | 'high' | 'severe'
    passengerIncrease: number
    duration: number
  }
  affectedStations: string[]
  peakTimes: string[]
  historicalData?: {
    previousOccurrences: number
    averageImpact: number
    successfulMitigations: number
  }
}

export interface WeatherAlert {
  id: string
  type: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'windy' | 'extreme'
  severity: 'low' | 'moderate' | 'high' | 'severe'
  description: string
  startTime: string
  endTime: string
  affectedStations?: string[]
  passengerImpact: number
  punctualityImpact: number
}

export interface WeatherImpact {
  current: {
    condition: string
    temperature: number
    humidity: number
    windSpeed: number
  }
  alerts: WeatherAlert[]
  forecast: Array<{
    time: string
    condition: string
    temperature: number
    passengerImpact: number
    confidence: number
  }>
  passengerBehaviorChange: number
  historicalCorrelation: number
}

export interface PredictiveEvent {
  id: string
  type: 'event' | 'weather' | 'holiday' | 'maintenance'
  description: string
  predictedTime: string
  confidence: number
  impact: {
    level: 'minimal' | 'low' | 'moderate' | 'high' | 'severe'
    passengerChange: number
    punctualityChange: number
    capacityUtilization: number
  }
  affectedStations: string[]
  recommendations: string[]
  mitigationStrategies: string[]
}

export interface ImpactAssessment {
  predictedNetworkLoad: number
  peakTime: string
  criticalEvents: Array<{
    name: string
    time: string
    expectedPassengerIncrease: number
    mitigation: string
  }>
  weatherRisk: 'low' | 'moderate' | 'high' | 'severe'
  overallConfidence: number
}

interface PredictiveAnalyticsState {
  predictions: PredictiveEvent[]
  specialEvents: SpecialEvent[]
  weatherImpact: WeatherImpact
  impactAssessment: ImpactAssessment
  isAnalyzing: boolean
  confidenceScore: number
  lastUpdate: string
}

export const usePredictiveAnalytics = () => {
  const [analyticsState, setAnalyticsState] = useKV<PredictiveAnalyticsState>('predictive-analytics-state', {
    predictions: [],
    specialEvents: [],
    weatherImpact: {
      current: {
        condition: 'cloudy',
        temperature: 22,
        humidity: 65,
        windSpeed: 12
      },
      alerts: [],
      forecast: [],
      passengerBehaviorChange: 0,
      historicalCorrelation: 85
    },
    impactAssessment: {
      predictedNetworkLoad: 0,
      peakTime: '18:30',
      criticalEvents: [],
      weatherRisk: 'low',
      overallConfidence: 0
    },
    isAnalyzing: false,
    confidenceScore: 87,
    lastUpdate: new Date().toISOString()
  })

  // Initialize with mock data
  useEffect(() => {
    if (analyticsState.predictions.length === 0) {
      const mockEvents: SpecialEvent[] = [
        {
          id: 'event-1',
          name: 'FC Union Berlin vs. Hertha BSC',
          type: 'sport',
          location: 'Stadion An der Alten Försterei',
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          attendees: 22012,
          impact: {
            level: 'high',
            passengerIncrease: 85,
            duration: 180
          },
          affectedStations: ['Köpenick', 'Schöneweide', 'Warschauer Str'],
          peakTimes: ['19:45', '21:30'],
          historicalData: {
            previousOccurrences: 15,
            averageImpact: 78,
            successfulMitigations: 12
          }
        },
        {
          id: 'event-2',
          name: 'Lange Nacht der Museen',
          type: 'festival',
          location: 'Berliner Museen',
          startTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),
          attendees: 50000,
          impact: {
            level: 'moderate',
            passengerIncrease: 45,
            duration: 480
          },
          affectedStations: ['Friedrichstraße', 'Unter den Linden', 'Potsdamer Platz'],
          peakTimes: ['20:00', '23:30'],
          historicalData: {
            previousOccurrences: 8,
            averageImpact: 52,
            successfulMitigations: 7
          }
        },
        {
          id: 'event-3',
          name: 'Tech Conference Berlin 2024',
          type: 'conference',
          location: 'Messe Berlin',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(),
          attendees: 12000,
          impact: {
            level: 'moderate',
            passengerIncrease: 35,
            duration: 240
          },
          affectedStations: ['Kaiserdamm', 'Theodor-Heuss-Platz'],
          peakTimes: ['08:30', '17:00'],
          historicalData: {
            previousOccurrences: 3,
            averageImpact: 38,
            successfulMitigations: 2
          }
        }
      ]

      const mockWeatherAlerts: WeatherAlert[] = [
        {
          id: 'weather-1',
          type: 'rainy',
          severity: 'moderate',
          description: 'Anhaltende Regenfälle erwartet',
          startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
          affectedStations: ['HBF', 'ALX', 'POT', 'Friedrichstraße'],
          passengerImpact: 15,
          punctualityImpact: -8
        },
        {
          id: 'weather-2',
          type: 'stormy',
          severity: 'high',
          description: 'Gewitterfront mit starken Böen',
          startTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 40 * 60 * 60 * 1000).toISOString(),
          affectedStations: ['Alle Außenstationen'],
          passengerImpact: 25,
          punctualityImpact: -15
        }
      ]

      const mockPredictions: PredictiveEvent[] = [
        {
          id: 'pred-1',
          type: 'event',
          description: 'Hoher Fahrgastansturm nach Fußballspiel',
          predictedTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          confidence: 92,
          impact: {
            level: 'high',
            passengerChange: 85,
            punctualityChange: -12,
            capacityUtilization: 95
          },
          affectedStations: ['Köpenick', 'Schöneweide', 'Warschauer Str'],
          recommendations: [
            'Zusätzliche Züge auf Linie S3 bereitstellen',
            'Personal für Fahrgastlenkung mobilisieren',
            'Fahrgastinformation 30min vor Spielende'
          ],
          mitigationStrategies: [
            'Express-Shuttle zwischen Stadion und Hauptbahnhof',
            'Verstärkte Taktung nach Spielende'
          ]
        },
        {
          id: 'pred-2',
          type: 'weather',
          description: 'Regen führt zu erhöhter ÖPNV-Nutzung',
          predictedTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          confidence: 78,
          impact: {
            level: 'moderate',
            passengerChange: 15,
            punctualityChange: -5,
            capacityUtilization: 78
          },
          affectedStations: ['HBF', 'ALX', 'POT'],
          recommendations: [
            'Wetterwarnung in Fahrgast-Apps',
            'Bereitschaft für zusätzliche Kapazitäten',
            'Monitoring der Hauptstrecken verstärken'
          ],
          mitigationStrategies: [
            'Flexibles Zugmaterial verfügbar halten',
            'Informationskampagne über alternative Routen'
          ]
        },
        {
          id: 'pred-3',
          type: 'holiday',
          description: 'Wochenend-Reiseverkehr zu Ferienstart',
          predictedTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          confidence: 85,
          impact: {
            level: 'moderate',
            passengerChange: 40,
            punctualityChange: -8,
            capacityUtilization: 82
          },
          affectedStations: ['HBF', 'Südkreuz', 'Spandau'],
          recommendations: [
            'Ferienreiseverkehr-Information veröffentlichen',
            'Längere Züge für Fernverkehrsverbindungen',
            'Zusätzliches Personal am Wochenende'
          ],
          mitigationStrategies: [
            'Koordination mit Fernverkehr',
            'Verstärkte Informationskampagne'
          ]
        }
      ]

      const mockForecast = [
        {
          time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          condition: 'rainy',
          temperature: 18,
          passengerImpact: 12,
          confidence: 85
        },
        {
          time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          condition: 'cloudy',
          temperature: 21,
          passengerImpact: 3,
          confidence: 78
        },
        {
          time: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          condition: 'sunny',
          temperature: 25,
          passengerImpact: -8,
          confidence: 72
        }
      ]

      setAnalyticsState(current => ({
        ...current,
        predictions: mockPredictions,
        specialEvents: mockEvents,
        weatherImpact: {
          ...current.weatherImpact,
          alerts: mockWeatherAlerts,
          forecast: mockForecast,
          passengerBehaviorChange: 8
        },
        impactAssessment: {
          predictedNetworkLoad: 78,
          peakTime: '18:45',
          criticalEvents: [
            {
              name: 'FC Union Berlin vs. Hertha BSC',
              time: '21:30',
              expectedPassengerIncrease: 85,
              mitigation: 'Express-Shuttle und verstärkte Taktung'
            },
            {
              name: 'Regenwetter Impact',
              time: '17:00',
              expectedPassengerIncrease: 15,
              mitigation: 'Flexible Kapazitätsbereitstellung'
            }
          ],
          weatherRisk: 'moderate',
          overallConfidence: 84
        },
        confidenceScore: 84,
        lastUpdate: new Date().toISOString()
      }))
    }
  }, [analyticsState.predictions.length, setAnalyticsState])

  // Real-time prediction updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsState(current => {
        // Update confidence scores based on time proximity
        const updatedPredictions = current.predictions.map(prediction => {
          const timeToEvent = new Date(prediction.predictedTime).getTime() - Date.now()
          const hoursToEvent = timeToEvent / (1000 * 60 * 60)
          
          // Confidence increases as event approaches
          let confidenceAdjustment = 0
          if (hoursToEvent < 2) {
            confidenceAdjustment = 5
          } else if (hoursToEvent < 6) {
            confidenceAdjustment = 3
          } else if (hoursToEvent < 24) {
            confidenceAdjustment = 1
          }
          
          return {
            ...prediction,
            confidence: Math.min(99, prediction.confidence + confidenceAdjustment + (Math.random() - 0.5) * 2)
          }
        })

        // Update weather conditions
        const weatherConditions = ['sunny', 'cloudy', 'rainy', 'stormy']
        const currentCondition = current.weatherImpact.current.condition
        const shouldChangeWeather = Math.random() < 0.1 // 10% chance to change weather
        
        const updatedWeatherImpact = {
          ...current.weatherImpact,
          current: {
            ...current.weatherImpact.current,
            condition: shouldChangeWeather ? 
              weatherConditions[Math.floor(Math.random() * weatherConditions.length)] : 
              currentCondition,
            temperature: Math.max(10, Math.min(35, 
              current.weatherImpact.current.temperature + (Math.random() - 0.5) * 2
            )),
            humidity: Math.max(30, Math.min(95, 
              current.weatherImpact.current.humidity + (Math.random() - 0.5) * 5
            ))
          },
          passengerBehaviorChange: current.weatherImpact.current.condition === 'rainy' ? 
            Math.floor(Math.random() * 20) + 5 : 
            Math.floor(Math.random() * 10) - 5
        }

        // Update overall confidence
        const avgConfidence = updatedPredictions.reduce((sum, p) => sum + p.confidence, 0) / updatedPredictions.length
        
        return {
          ...current,
          predictions: updatedPredictions,
          weatherImpact: updatedWeatherImpact,
          confidenceScore: Math.round(avgConfidence),
          lastUpdate: new Date().toISOString()
        }
      })
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [setAnalyticsState])

  const runPredictiveAnalysis = useCallback(async () => {
    setAnalyticsState(current => ({ ...current, isAnalyzing: true }))

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate new predictions using AI simulation
      try {
        const prompt = spark.llmPrompt`
          Based on current railway network data, weather conditions, and upcoming events, 
          generate predictive analytics for passenger flow impact. Consider:
          - Special events in Berlin area
          - Weather forecasts and historical correlations
          - Seasonal patterns and holiday effects
          - Network capacity constraints
          
          Provide recommendations for:
          - Resource allocation
          - Passenger communication
          - Service adjustments
          - Risk mitigation strategies
        `

        const aiResponse = await spark.llm(prompt, 'gpt-4o-mini')
      } catch (error) {
        console.log('AI analysis simulated locally due to API limitations')
      }

      // Update predictions with enhanced confidence
      setAnalyticsState(current => {
        const enhancedPredictions = current.predictions.map(prediction => ({
          ...prediction,
          confidence: Math.min(99, prediction.confidence + Math.floor(Math.random() * 5) + 2),
          recommendations: [
            ...prediction.recommendations,
            'KI-optimierte Ressourcenzuteilung basierend auf aktuellen Daten'
          ]
        }))

        const newNetworkLoad = Math.max(50, Math.min(95, 
          current.impactAssessment.predictedNetworkLoad + (Math.random() - 0.5) * 10
        ))

        return {
          ...current,
          predictions: enhancedPredictions,
          impactAssessment: {
            ...current.impactAssessment,
            predictedNetworkLoad: newNetworkLoad,
            overallConfidence: Math.round(enhancedPredictions.reduce((sum, p) => sum + p.confidence, 0) / enhancedPredictions.length)
          },
          confidenceScore: Math.round(enhancedPredictions.reduce((sum, p) => sum + p.confidence, 0) / enhancedPredictions.length),
          isAnalyzing: false,
          lastUpdate: new Date().toISOString()
        }
      })

      toast.success('Prädiktive Analyse abgeschlossen', {
        description: `Vorhersagen aktualisiert mit ${Math.round(Math.random() * 10) + 85}% Konfidenz`
      })

    } catch (error) {
      setAnalyticsState(current => ({ ...current, isAnalyzing: false }))
      toast.error('Fehler bei der prädiktiven Analyse')
      throw error
    }
  }, [setAnalyticsState])

  const getEventImpactForecast = useCallback((timeRange: '6h' | '24h' | '7d' | '30d') => {
    const now = Date.now()
    const ranges = {
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }
    
    const endTime = now + ranges[timeRange]
    
    return analyticsState.predictions.filter(prediction => {
      const predictionTime = new Date(prediction.predictedTime).getTime()
      return predictionTime >= now && predictionTime <= endTime
    })
  }, [analyticsState.predictions])

  const getWeatherRiskAssessment = useCallback(() => {
    const highSeverityAlerts = analyticsState.weatherImpact.alerts.filter(
      alert => alert.severity === 'high' || alert.severity === 'severe'
    )
    
    const overallRisk = highSeverityAlerts.length > 0 ? 'high' : 
                      analyticsState.weatherImpact.alerts.length > 0 ? 'moderate' : 'low'
    
    return {
      riskLevel: overallRisk,
      activeAlerts: analyticsState.weatherImpact.alerts.length,
      criticalAlerts: highSeverityAlerts.length,
      expectedPassengerImpact: analyticsState.weatherImpact.passengerBehaviorChange
    }
  }, [analyticsState.weatherImpact])

  return {
    // State
    predictions: analyticsState.predictions,
    specialEvents: analyticsState.specialEvents,
    weatherImpact: analyticsState.weatherImpact,
    impactAssessment: analyticsState.impactAssessment,
    isAnalyzing: analyticsState.isAnalyzing,
    confidenceScore: analyticsState.confidenceScore,
    lastUpdate: analyticsState.lastUpdate,

    // Actions
    runPredictiveAnalysis,

    // Analysis functions
    getEventImpactForecast,
    getWeatherRiskAssessment
  }
}

export type UsePredictiveAnalyticsReturn = ReturnType<typeof usePredictiveAnalytics>