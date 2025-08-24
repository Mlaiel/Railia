// Constants for SmartRail-AI system

export const neuromorphicEventTypes = [
  'Personenerkennung',
  'Hinderniserkennung', 
  'Anomaliedetection',
  'Türblockade-Vorhersage',
  'Menschenmenge-Analyse',
  'Wetter-Korrelation',
  'Infrastruktur-Inspektion',
  'Schwingungsanalyse',
  'Thermische-Anomalie',
  'Bewegungsmuster-Erkennung',
  'Kollisions-Vorhersage',
  'Sicherheits-Ereignis'
]

export const locations = [
  'Bahnhof Berlin Hbf',
  'Strecke Hamburg-Bremen', 
  'München Süd Terminal',
  'Köln-Düsseldorf Korridor',
  'Frankfurt Airport Terminal',
  'Dresden Neustadt',
  'Stuttgart Zentrum',
  'Hannover Messe/Laatzen',
  'Dortmund Signal-Brücke',
  'Leipzig/Halle Kreuzung',
  'Nürnberg Rangierbahnhof',
  'Erfurt Hauptbahnhof',
  'Wuppertal Schwebebahn',
  'Bremen Überseestadt',
  'Karlsruhe Technologie-Park'
]

export const weatherConditions = [
  'Sonnig',
  'Bewölkt', 
  'Regen',
  'Schnee',
  'Nebel',
  'Sturm',
  'Hagel',
  'Gewitter'
]

export const emergencyTypes = [
  'Medizinischer Notfall',
  'Feuer',
  'Evakuierung',
  'Stromausfall',
  'Gleisblockade', 
  'Terrorverdacht',
  'Naturkatastrophe',
  'Technischer Defekt'
]

export const droneTypes = [
  'Inspection-Drohne Alpha',
  'Surveillance-Drohne Beta',
  'Emergency-Drohne Gamma',
  'Weather-Drohne Delta',
  'Maintenance-Drohne Epsilon',
  'Security-Drohne Zeta'
]

export const statusColors = {
  active: '#10b981',
  processing: '#3b82f6', 
  standby: '#f59e0b',
  maintenance: '#ef4444',
  offline: '#6b7280',
  emergency: '#dc2626'
}

export const performanceThresholds = {
  energyEfficiency: {
    excellent: 90,
    good: 75,
    warning: 60,
    critical: 40
  },
  accuracy: {
    excellent: 98,
    good: 95,
    warning: 90,
    critical: 85
  },
  latency: {
    excellent: 0.1,
    good: 1.0,
    warning: 5.0,
    critical: 10.0
  },
  temperature: {
    optimal: 30,
    warning: 40,
    critical: 50,
    shutdown: 60
  }
}

export const neuromorphicConstants = {
  maxSpikeRate: 25000, // Spikes per second
  minPowerConsumption: 10, // mW
  maxPowerConsumption: 80, // mW
  optimalTemperature: 25, // Celsius
  synapticTimeConstant: 20, // ms
  refractoryPeriod: 2, // ms
  learningRateRange: [0.001, 0.1],
  membraneThreshold: 1.0,
  defaultSynapticWeight: 0.5
}

// Battery capacity and discharge curves for different device types
export const batteryProfiles = {
  drone: {
    capacity: 5000, // mAh
    nominalVoltage: 14.8, // V
    dischargeCurve: [100, 95, 85, 70, 50, 30, 15, 5, 0], // % over time
    neuromorphicExtension: 8.5 // Multiplier for neuromorphic efficiency
  },
  sensor: {
    capacity: 3000, // mAh  
    nominalVoltage: 3.7, // V
    dischargeCurve: [100, 98, 92, 85, 75, 60, 40, 20, 5, 0],
    neuromorphicExtension: 12.0
  },
  gateway: {
    capacity: 8000, // mAh
    nominalVoltage: 12.0, // V
    dischargeCurve: [100, 96, 88, 78, 65, 50, 35, 20, 8, 0],
    neuromorphicExtension: 6.2
  }
}

export const systemLimits = {
  maxConcurrentEvents: 1000,
  maxUnitsPerNetwork: 500,
  maxHistoryRetention: 30, // days
  maxLogFileSize: 100, // MB
  networkTimeoutMs: 5000,
  emergencyResponseTimeMs: 2000
}