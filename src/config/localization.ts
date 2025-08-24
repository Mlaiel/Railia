/**
 * Localization configuration for SmartRail-AI
 * Professional naming and language standards
 */

export const SUPPORTED_LANGUAGES = {
  DE: 'de',
  EN: 'en',
  FR: 'fr'
} as const;

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.DE;

export const UI_TEXTS = {
  de: {
    // Header
    systemIntegrity: 'System-Integrität',
    integrityShort: 'Integrität',
    activeTrains: 'Aktive Züge',
    networkHealth: 'Netzwerk-Gesundheit',
    alerts: 'Alarm',
    alertsPlural: 'Alarme',
    
    // Navigation
    controlModules: 'Kontroll-Module',
    searchModules: 'Module suchen...',
    favoriteModules: 'Favorisierte Module',
    basicModules: 'Grundlegende Module',
    
    // Module Categories
    dronesAutonomous: 'Drohnen & Autonome Systeme',
    artificialIntelligence: 'Künstliche Intelligenz',
    quantumComputing: 'Quanteninformatik',
    maintenancePrediction: 'Wartung & Vorhersage',
    passengerManagement: 'Fahrgastmanagement',
    futureTechnologies: 'Zukunftstechnologien',
    
    // System Status
    systemMonitoring: 'System überwacht aktive Vorfälle',
    lastUpdate: 'Letzte Aktualisierung:',
    
    // Footer
    copyright: '© 2024 SmartRail-AI - Namensnennung Fahed Mlaiel erforderlich',
    license: 'Lizenziert nur für humanitäre und gemeinnützige Nutzung',
    
    // Error Messages
    moduleLoadError: 'Fehler beim Laden des Moduls',
  },
  
  en: {
    // Header
    systemIntegrity: 'System Integrity',
    integrityShort: 'Integrity',
    activeTrains: 'Active Trains',
    networkHealth: 'Network Health',
    alerts: 'Alert',
    alertsPlural: 'Alerts',
    
    // Navigation
    controlModules: 'Control Modules',
    searchModules: 'Search modules...',
    favoriteModules: 'Favorite Modules',
    basicModules: 'Basic Modules',
    
    // Module Categories
    dronesAutonomous: 'Drones & Autonomous Systems',
    artificialIntelligence: 'Artificial Intelligence',
    quantumComputing: 'Quantum Computing',
    maintenancePrediction: 'Maintenance & Prediction',
    passengerManagement: 'Passenger Management',
    futureTechnologies: 'Future Technologies',
    
    // System Status
    systemMonitoring: 'System monitoring active incidents',
    lastUpdate: 'Last Update:',
    
    // Footer
    copyright: '© 2024 SmartRail-AI - Attribution to Fahed Mlaiel required',
    license: 'Licensed for humanitarian and non-profit use only',
    
    // Error Messages
    moduleLoadError: 'Error loading module',
  },
  
  fr: {
    // Header
    systemIntegrity: 'Intégrité Système',
    integrityShort: 'Intégrité',
    activeTrains: 'Trains Actifs',
    networkHealth: 'Santé Réseau',
    alerts: 'Alerte',
    alertsPlural: 'Alertes',
    
    // Navigation
    controlModules: 'Modules de Contrôle',
    searchModules: 'Rechercher modules...',
    favoriteModules: 'Modules Favoris',
    basicModules: 'Modules de Base',
    
    // Module Categories
    dronesAutonomous: 'Drones & Systèmes Autonomes',
    artificialIntelligence: 'Intelligence Artificielle',
    quantumComputing: 'Informatique Quantique',
    maintenancePrediction: 'Maintenance & Prédiction',
    passengerManagement: 'Gestion Passagers',
    futureTechnologies: 'Technologies Futures',
    
    // System Status
    systemMonitoring: 'Système surveillant incidents actifs',
    lastUpdate: 'Dernière Mise à Jour:',
    
    // Footer
    copyright: '© 2024 SmartRail-AI - Attribution à Fahed Mlaiel requise',
    license: 'Sous licence pour usage humanitaire et à but non lucratif uniquement',
    
    // Error Messages
    moduleLoadError: 'Erreur lors du chargement du module',
  }
} as const;

export type Language = keyof typeof UI_TEXTS;
export type UITextKey = keyof typeof UI_TEXTS.de;
