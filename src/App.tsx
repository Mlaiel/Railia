import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { toast, Toaster } from 'sonner'
import { 
  Train, 
  Smiley,
  Heart,
  DoorOpen, 
  CloudRain, 
  Network, 
  Warning,
  Activity,
  MapPin,
  ShieldCheck,
  Gear,
  CaretLeft,
  CaretRight,
  Siren,
  Cube,
  Robot,
  Drone,
  Eye,
  Brain,
  Wrench,
  Graph,
  Globe,
  ChatCircle,
  Users,
  Lightning,
  Target,
  MagnifyingGlass,
  GearSix,
  FlowArrow,
  TrendUp,
  Database,
  ChartBar,
  WarningCircle,
  Stack,
  Clock,
  Atom,
  RadioButton,
  CubeTransparent,
  Rocket,
  Dna,
  Flask,
  FunnelSimple,
  CaretDown,
  CaretUp,
  Star,
  CircleDashed
} from '@phosphor-icons/react'
import { SafeRender } from './components/SafeRender'

import NetworkDashboard from './components/NetworkDashboard.tsx'
import DoorAnalytics from './components/DoorAnalytics.tsx'
import TrackSurveillance from './components/TrackSurveillance.tsx'
import WeatherForecasting from './components/WeatherForecasting.tsx'
import MedicalMonitoring from './components/MedicalMonitoring.tsx'
import RealTimeTracking from './components/RealTimeTracking.tsx'
import EmergencyCoordination from './components/EmergencyCoordination.tsx'
import VRTraining from './components/VRTraining.tsx'
import SystemSettings from './components/SystemSettings.tsx'
import MobileNavigation from './components/MobileNavigation.tsx'
import SwipeDetector from './components/SwipeDetector.tsx'
import ModuleQuickActions from './components/ModuleQuickActions.tsx'
import ModuleNavItem from './components/ModuleNavItem.tsx'
import MobileModuleControl from './components/MobileModuleControl.tsx'
import ModuleProgressDot from './components/ModuleProgressDot.tsx'
import TestComponent from './components/TestComponent.tsx'
import ComponentTester from './components/ComponentTester.tsx'

// Erweiterte KI-Module
import AutonomousDroneFleet from './components/AutonomousDroneFleet.tsx'
import DronePatrol from './components/DronePatrol.tsx'
import CooperativeMultiAgentSystem from './components/CooperativeMultiAgentSystem.tsx'
import ReinforcementLearningOptimizer from './components/ReinforcementLearningOptimizer.tsx'
import RainbowDQNSystem from './components/RainbowDQNSystem.tsx'
import MetaLearningSystem from './components/MetaLearningSystem.tsx'
import NeuralArchitectureSearch from './components/NeuralArchitectureSearch.tsx'
import FederatedLearningSystem from './components/FederatedLearningSystem.tsx'
import DynamicTopologySystem from './components/DynamicTopologySystem.tsx'
import QuantumMachineLearning from './components/QuantumMachineLearning.tsx'
import NeuromorphicComputing from './components/NeuromorphicComputing.tsx'
import QuantumNeuromorphicHybridSystem from './components/QuantumNeuromorphicHybridSystem.tsx'
import BioInspiredQuantumNeuralNetworks from './components/BioInspiredQuantumNeuralNetworks.tsx'
import AdvancedPredictiveModels from './components/AdvancedPredictiveModels.tsx'
import PredictiveMaintenanceAI from './components/PredictiveMaintenanceAI.tsx'
import IoTSensorMonitoring from './components/IoTSensorMonitoring.tsx'
import ARMaintenanceGuide from './components/ARMaintenanceGuide.tsx'
import MaintenancePlanning from './components/MaintenancePlanning.tsx'
import PassengerFlow from './components/PassengerFlow.tsx'
import PredictiveAnalytics from './components/PredictiveAnalytics.tsx'
import PassengerNotifications from './components/PassengerNotifications.tsx'
import SocialMediaIntegration from './components/SocialMediaIntegration.tsx'
import CrisisCommunication from './components/CrisisCommunication.tsx'
import InternationalTranslation from './components/InternationalTranslation.tsx'
import EnhancedErrorPredictionML from './components/EnhancedErrorPredictionML.tsx'
import DeepLearningErrorDetection from './components/DeepLearningErrorDetection.tsx'
import ExplainableAI from './components/ExplainableAI.tsx'
import RealTimeWeatherMissions from './components/RealTimeWeatherMissions.tsx'
import SatelliteImagerySystem from './components/SatelliteImagerySystem.tsx'
import Weather3DVisualization from './components/Weather3DVisualization.tsx'
import SatelliteLidarCollisionSystem from './components/SatelliteLidarCollisionSystem.tsx'
import MobileLidarUnits from './components/MobileLidarUnits.tsx'
import DQNTrainingVisualization from './components/DQNTrainingVisualization.tsx'
import MultiEnvironmentTraining from './components/MultiEnvironmentTraining.tsx'
import SelfLearningDroneSwarms from './components/SelfLearningDroneSwarms.tsx'
import MultiModalReinforcementLearning from './components/MultiModalReinforcementLearning.tsx'
import ContinuousOnlineLearning from './components/ContinuousOnlineLearning.tsx'
import SelfOrganizingMaps from './components/SelfOrganizingMaps.tsx'
import HierarchicalSOMs from './components/HierarchicalSOMs.tsx'
import TemporalAI4DSystem from './components/TemporalAI4DSystem.tsx'
import EdgeQuantumComputing from './components/EdgeQuantumComputing.tsx'
import FiveGSixGIntegration from './components/FiveGSixGIntegration.tsx'
import SatelliteMeshNetwork from './components/SatelliteMeshNetwork.tsx'
import EmotionalAI from './components/EmotionalAI.tsx'
import HolographicDisplays from './components/HolographicDisplays.tsx'

// Latest advanced technologies
import PassengerHolographicDisplays from './components/PassengerHolographicDisplays.tsx'
import NanoSensorInfrastructure from './components/NanoSensorInfrastructure.tsx'
import BrainComputerInterface from './components/BrainComputerInterface.tsx'
import SwarmRoboticsMaintenanceSystem from './components/SwarmRoboticsMaintenanceSystem.tsx'
import QuantumTeleportationSystem from './components/QuantumTeleportationSystem.tsx'
import AGIIntegrationSystem from './components/AGIIntegrationSystem.tsx'
import SpaceBasedMonitoringSystem from './components/SpaceBasedMonitoringSystem.tsx'
import TimeTravelAlgorithmSystem from './components/TimeTravelAlgorithmSystem.tsx'
import AutonomousRailCapsules from './components/AutonomousRailCapsules.tsx'
import DNAComputingSystem from './components/DNAComputingSystem.tsx'
import ProteinFoldingVisualization from './components/ProteinFoldingVisualization.tsx'
import { useSwipeGesture } from './hooks/useSwipeGesture'
import { hapticFeedback } from './utils/mobileUtils'

function App() {
  const [activeModule, setActiveModule] = useState('protein-folding-3d')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['featured', 'basic'])
  const [favoriteModules, setFavoriteModules] = useState<string[]>(['doors', 'surveillance', 'medical'])
  const [quickActionsState, setQuickActionsState] = useState<{
    isOpen: boolean
    moduleId: string
    moduleName: string
    position: { x: number; y: number }
  }>({
    isOpen: false,
    moduleId: '',
    moduleName: '',
    position: { x: 0, y: 0 }
  })

  const [systemStatus] = useKV('system-status', JSON.stringify({
    operational: true,
    lastUpdate: new Date().toISOString(),
    activeTrains: 247,
    criticalAlerts: 0,
    networkHealth: 98
  }))

  const [alerts] = useKV('active-alerts', JSON.stringify([]))

  // Parse JSON data
  const parsedSystemStatus = systemStatus ? JSON.parse(systemStatus) : {
    operational: true,
    lastUpdate: new Date().toISOString(),
    activeTrains: 247,
    criticalAlerts: 0,
    networkHealth: 98
  }
  
  const parsedAlerts = alerts ? JSON.parse(alerts) : []

  // Module organization in categories
  const moduleCategories = {
    featured: {
      name: '⭐ Favorisierte Module',
      icon: Star,
      modules: [
        { id: 'doors', name: 'Tür-Intelligenz', icon: DoorOpen, component: DoorAnalytics, description: 'Intelligente Türsystemanalyse' },
        { id: 'surveillance', name: 'Gleisüberwachung', icon: ShieldCheck, component: TrackSurveillance, description: 'Echtzeitüberwachung der Gleisanlagen' },
        { id: 'medical', name: 'Notfallerkennung', icon: Heart, component: MedicalMonitoring, description: 'Automatische Erkennung medizinischer Notfälle' },
        { id: 'weather', name: 'Naturgefahren-Management', icon: CloudRain, component: WeatherForecasting, description: 'Verwaltung natürlicher Gefahren' }
      ]
    },
    basic: {
      name: '🎯 Grundlegende Module',
      icon: Target,
      modules: [
        { id: 'test', name: 'Test-Komponente', icon: Activity, component: TestComponent, description: 'System-Tests und Diagnostik' },
        { id: 'component-tester', name: 'Komponenten-Tester', icon: Gear, component: ComponentTester, description: 'Automatische Komponententests' },
        { id: 'tracking', name: 'Echtzeit-Verfolgung', icon: MapPin, component: RealTimeTracking, description: 'Live-Tracking von Zügen und Fahrgästen' },
        { id: 'emergency', name: 'Notfall-Koordination', icon: Siren, component: EmergencyCoordination, description: 'Zentrale Notfallkoordination' },
        { id: 'network', name: 'Netzwerk-Optimierung', icon: Network, component: NetworkDashboard, description: 'Optimierung der Netzwerkinfrastruktur' },
        { id: 'vr-training', name: 'VR-Schulungen', icon: Cube, component: VRTraining, description: 'Virtual Reality Trainingsmodule für Bahnpersonal' }
      ]
    },
    drones: {
      name: '🚁 Drohnen & Autonome Systeme',
      icon: Drone,
      modules: [
        { id: 'drone-fleet', name: 'Autonome Drohnenflotte', icon: Drone, component: AutonomousDroneFleet, description: 'Intelligente Drohnenflotte zur Überwachung' },
        { id: 'drone-patrol', name: 'Drohnenpatrouillen', icon: Eye, component: DronePatrol, description: 'Automatisierte Sicherheitspatrouillen' },
        { id: 'multi-agent', name: 'Multi-Agent-Systeme', icon: Users, component: CooperativeMultiAgentSystem, description: 'Kooperative Mehragentensysteme' }
      ]
    },
    ai: {
      name: '🧠 Künstliche Intelligenz',
      icon: Brain,
      modules: [
        { id: 'reinforcement-learning', name: 'Verstärkungslernen', icon: Brain, component: ReinforcementLearningOptimizer, description: 'Optimierung durch Verstärkungslernen' },
        { id: 'rainbow-dqn', name: 'Rainbow DQN System', icon: Target, component: RainbowDQNSystem, description: 'Fortgeschrittenes Deep Q-Network System' },
        { id: 'meta-learning', name: 'Meta-Learning', icon: Lightning, component: MetaLearningSystem, description: 'Lernen des Lernens - Meta-Algorithmen' },
        { id: 'neural-search', name: 'Neural Architecture Search', icon: MagnifyingGlass, component: NeuralArchitectureSearch, description: 'Automatische Suche nach Netzwerkarchitekturen' },
        { id: 'federated-learning', name: 'Föderiertes Lernen', icon: Globe, component: FederatedLearningSystem, description: 'Verteiltes Lernen ohne Datentransfer' },
        { id: 'dynamic-topology', name: 'Dynamische Topologie', icon: FlowArrow, component: DynamicTopologySystem, description: 'Adaptive Netzwerktopologie' }
      ]
    },
    quantum: {
      name: '⚛️ Quanteninformatik',
      icon: Atom,
      modules: [
        { id: 'quantum-ml', name: 'Quantum Machine Learning', icon: Database, component: QuantumMachineLearning, description: 'Maschinelles Lernen mit Quantencomputing' },
        { id: 'neuromorphic', name: 'Neuromorphes Computing', icon: GearSix, component: NeuromorphicComputing, description: 'Gehirn-inspirierte Rechensysteme' },
        { id: 'quantum-hybrid', name: 'Quantum-Neuromorphes Hybridsystem', icon: Lightning, component: QuantumNeuromorphicHybridSystem, description: 'Kombination aus Quanten- und neuromorpher Technik' },
        { id: 'bio-quantum', name: 'Bio-Quanten-Neuronale Netze', icon: Brain, component: BioInspiredQuantumNeuralNetworks, description: 'Biologisch inspirierte Quantennetzwerke' }
      ]
    },
    maintenance: {
      name: '🔧 Wartung & Vorhersage',
      icon: Wrench,
      modules: [
        { id: 'predictive-models', name: 'Erweiterte Vorhersagemodelle', icon: TrendUp, component: AdvancedPredictiveModels, description: 'KI-basierte Verspätungsvorhersage' },
        { id: 'maintenance-ai', name: 'KI-Wartungsvorhersage', icon: Wrench, component: PredictiveMaintenanceAI, description: 'Prädiktive Wartung mit Künstlicher Intelligenz' },
        { id: 'iot-sensors', name: 'IoT-Sensorüberwachung', icon: Target, component: IoTSensorMonitoring, description: 'Intelligente Sensorüberwachung' },
        { id: 'ar-maintenance', name: 'AR-Wartungsanleitungen', icon: Eye, component: ARMaintenanceGuide, description: 'Augmented Reality Wartungsassistenz' },
        { id: 'maintenance-planning', name: 'Wartungsplanung', icon: ChartBar, component: MaintenancePlanning, description: 'Optimierte Wartungsplanung' }
      ]
    },
    passengers: {
      name: '👥 Fahrgastmanagement',
      icon: Users,
      modules: [
        { id: 'passenger-flow', name: 'Fahrgastfluss-Optimierung', icon: Users, component: PassengerFlow, description: 'Optimierung der Fahrgastströme' },
        { id: 'predictive-analytics', name: 'Prädiktive Analytik', icon: Graph, component: PredictiveAnalytics, description: 'Vorhersagebasierte Datenanalyse' },
        { id: 'passenger-notifications', name: 'Fahrgastbenachrichtigungen', icon: ChatCircle, component: PassengerNotifications, description: 'Intelligente Kommunikation mit Fahrgästen' },
        { id: 'social-media', name: 'Social Media Integration', icon: Globe, component: SocialMediaIntegration, description: 'Integration sozialer Medien' }
      ]
    },
    future: {
      name: '🚀 Zukunftstechnologien',
      icon: Rocket,
      modules: [
        { id: 'autonomous-rail-capsules', name: 'Autonome Bahnkapseln', icon: Rocket, component: AutonomousRailCapsules, description: 'Selbstfahrende Bahnkapseln der Zukunft' },
        { id: 'dna-computing', name: 'DNA-Computing System', icon: Dna, component: DNAComputingSystem, description: 'Biologisches Computing mit DNA-Speicher' },
        { id: 'protein-folding-3d', name: 'Proteinfaltungs-3D-Viewer', icon: Flask, component: ProteinFoldingVisualization, description: '3D-Visualisierung von Proteinfaltung' },
        { id: 'brain-computer-interface', name: 'Gehirn-Computer-Schnittstelle', icon: Brain, component: BrainComputerInterface, description: 'Direkte Gehirn-Computer-Kommunikation' },
        { id: 'quantum-teleportation', name: 'Quantenteleportation', icon: Lightning, component: QuantumTeleportationSystem, description: 'Quantenmechanische Informationsübertragung' },
        { id: 'time-travel-algorithms', name: 'Zeitreise-Algorithmen', icon: Clock, component: TimeTravelAlgorithmSystem, description: 'Theoretische Zeitmanipulationsalgorithmen' }
      ]
    }
  }

  // Function to get all modules
  const getAllModules = (): ModuleType[] => {
    const allModules: ModuleType[] = []
    Object.values(moduleCategories).forEach(category => {
      allModules.push(...category.modules)
    })
    return allModules
  }

  const modules = getAllModules()

  // Type for modules
  type ModuleType = {
    id: string
    name: string
    icon: any
    component: any
    description: string
  }

  // Function to filter modules according to search query
  const getFilteredModules = (categoryModules: ModuleType[]) => {
    if (!searchQuery) return categoryModules
    return categoryModules.filter((module: ModuleType) => 
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Function to toggle category expansion
  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    )
  }

  // Function to toggle favorites
  const toggleFavorite = (moduleId: string) => {
    setFavoriteModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const currentModuleIndex = modules.findIndex((m: ModuleType) => m.id === activeModule)
  
  const showQuickActions = (moduleId: string, moduleName: string, event?: React.TouchEvent | React.MouseEvent) => {
    let x = window.innerWidth / 2 // Default to center of screen
    let y = window.innerHeight / 2
    
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect()
      const isTouch = 'touches' in event
      
      x = isTouch 
        ? event.touches[0]?.clientX || rect.left + rect.width / 2
        : (event as React.MouseEvent).clientX
      y = isTouch 
        ? event.touches[0]?.clientY || rect.top + rect.height / 2
        : (event as React.MouseEvent).clientY
    }

    setQuickActionsState({
      isOpen: true,
      moduleId,
      moduleName,
      position: { x, y }
    })

    hapticFeedback.medium()
    toast.info(`${moduleName} quick actions`, {
      duration: 1500,
      position: 'bottom-center',
    })
  }

  const hideQuickActions = () => {
    setQuickActionsState(prev => ({ ...prev, isOpen: false }))
  }

  const navigateToModule = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (currentModuleIndex + 1) % modules.length
      : currentModuleIndex === 0 ? modules.length - 1 : currentModuleIndex - 1
    
    const newModule = modules[newIndex] as ModuleType
    setActiveModule(newModule.id)

    // Show toast notification for successful navigation
    hapticFeedback.light()
    toast(`Gewechselt zu ${newModule.name}`, {
      duration: 1500,
      position: 'bottom-center',
      style: {
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '8px 16px'
      }
    })
  }

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => navigateToModule('next'),
    onSwipeRight: () => navigateToModule('prev'),
  }, {
    threshold: 80, // Increased threshold for more deliberate swipes
    deltaThreshold: 20,
    enableHapticFeedback: true
  })

  const ActiveComponent = (modules.find((m: ModuleType) => m.id === activeModule) as ModuleType)?.component || NetworkDashboard

  // Simple fallback to help with debugging
  const renderActiveComponent = () => {
    try {
      return <ActiveComponent />
    } catch (error) {
      console.error('Error rendering component:', error)
      return (
        <div className="p-6">
          <Alert variant="destructive">
            <Warning size={16} />
            <AlertDescription>
              Fehler beim Laden des Moduls "{activeModule}". Bitte versuchen Sie ein anderes Modul.
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl sm:rounded-2xl shadow-sm">
                <Train size={20} className="sm:hidden text-primary-foreground" />
                <Train size={26} className="hidden sm:block text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-semibold text-foreground tracking-tight">SmartRail-AI</h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">KI-gestützte Verspätungsreduktion für Bahnunternehmen</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-6">
              {/* Mobile Navigation */}
              <MobileNavigation 
                activeModule={activeModule}
                setActiveModule={setActiveModule}
                systemStatus={parsedSystemStatus}
              />

              {/* Status indicators - responsive */}
              <div className="hidden sm:flex items-center space-x-3 bg-secondary/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{parsedSystemStatus.activeTrains} Züge aktiv</span>
              </div>
              
              <Badge 
                variant={parsedSystemStatus.networkHealth >= 95 ? "default" : "destructive"}
                className="px-2 sm:px-3 py-1 text-xs font-medium"
              >
                <span className="hidden sm:inline">System-Integrität</span>
                <span className="sm:hidden">Integrität</span>
              </Badge>

              {parsedSystemStatus.criticalAlerts > 0 && (
                <Button variant="destructive" size="sm" className="rounded-full">
                  <Warning size={16} className="mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {parsedSystemStatus.criticalAlerts} Alarm{parsedSystemStatus.criticalAlerts !== 1 ? 'e' : ''}
                  </span>
                  <span className="sm:hidden">{parsedSystemStatus.criticalAlerts}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Critical Alerts Banner */}
      {parsedAlerts.length > 0 && (
        <div className="bg-destructive/5 border-b border-destructive/10">
          <div className="container mx-auto px-4 sm:px-8 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-destructive/10 rounded-full">
                <Warning className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
              </div>
              <span className="text-destructive font-medium text-xs sm:text-sm">
                {parsedAlerts[0]?.message || 'System überwacht aktive Vorfälle'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Kontroll-Module</h2>
              <div className="relative">
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Module suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Module Categories */}
            <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-border">
              {Object.entries(moduleCategories).map(([categoryKey, category]) => {
                const filteredModules = getFilteredModules(category.modules)
                const isExpanded = expandedCategories.includes(categoryKey)
                
                // Hide empty categories during search
                if (searchQuery && filteredModules.length === 0) return null

                return (
                  <div key={categoryKey} className="bg-gradient-to-br from-card/60 to-card/40 rounded-xl border border-border/50 overflow-hidden">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(categoryKey)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <category.icon size={16} className="text-primary" />
                        </div>
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          {filteredModules.length}
                        </Badge>
                        {isExpanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
                      </div>
                    </button>

                    {/* Category Modules */}
                    {isExpanded && (
                      <div className="px-2 pb-3 space-y-1">
                        {filteredModules.map((module: ModuleType) => {
                          const ModuleIcon = module.icon
                          const isActive = activeModule === module.id
                          const isFavorite = favoriteModules.includes(module.id)
                          
                          return (
                            <div
                              key={module.id}
                              className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                isActive 
                                  ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                                  : 'hover:bg-secondary/40 border border-transparent'
                              }`}
                              onClick={() => setActiveModule(module.id)}
                              onContextMenu={(e) => {
                                e.preventDefault()
                                showQuickActions(module.id, module.name, e)
                              }}
                            >
                              {/* Module Icon */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                isActive 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-secondary/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                              }`}>
                                <ModuleIcon size={16} />
                              </div>

                              {/* Module Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-medium text-sm truncate ${
                                  isActive ? 'text-primary' : 'text-foreground'
                                }`}>
                                  {module.name}
                                </h4>
                                {module.description && (
                                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                                    {module.description}
                                  </p>
                                )}
                              </div>

                              {/* Favorite Star */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(module.id)
                                }}
                                className={`flex-shrink-0 p-1 rounded-md transition-colors ${
                                  isFavorite 
                                    ? 'text-yellow-500 hover:text-yellow-600' 
                                    : 'text-muted-foreground/50 hover:text-muted-foreground opacity-0 group-hover:opacity-100'
                                }`}
                              >
                                <Star size={14} weight={isFavorite ? 'fill' : 'regular'} />
                              </button>

                              {/* Active Indicator */}
                              {isActive && (
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                              )}
                            </div>
                          )
                        })}

                        {/* Empty State */}
                        {filteredModules.length === 0 && searchQuery && (
                          <div className="text-center py-6">
                            <CircleDashed size={32} className="mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Aucun module trouvé
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-card/60 to-card/40 rounded-xl border border-border/50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity size={16} className="text-primary" />
                </div>
                <h3 className="font-medium text-sm">Schnelle Statistiken</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{modules.length}</div>
                  <div className="text-xs text-muted-foreground">Module</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{favoriteModules.length}</div>
                  <div className="text-xs text-muted-foreground">Favoriten</div>
                </div>
              </div>
            </div>

            {/* System Status Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-card/60 to-card/40">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Activity size={16} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">System-Status</CardTitle>
                    <p className="text-xs text-muted-foreground">Echtzeit</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Network Performance */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Netzwerk-Performance</span>
                    <span className="text-lg font-bold text-primary">{parsedSystemStatus.networkHealth}%</span>
                  </div>
                  <Progress 
                    value={parsedSystemStatus.networkHealth} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Optimal</span>
                    <span>Ausgezeichnet</span>
                  </div>
                </div>
                
                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center space-y-1 p-3 bg-white/50 rounded-lg border border-border/30">
                    <div className="text-2xl font-bold text-primary">
                      {parsedSystemStatus.activeTrains}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Aktive Züge
                    </div>
                    <div className="w-4 h-1 bg-green-500 rounded-full mx-auto"></div>
                  </div>
                  <div className="text-center space-y-1 p-3 bg-white/50 rounded-lg border border-border/30">
                    <div className="text-2xl font-bold text-green-600">
                      {parsedSystemStatus.criticalAlerts}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Warnungen
                    </div>
                    <div className="w-4 h-1 bg-green-500 rounded-full mx-auto"></div>
                  </div>
                </div>

                {/* Service Status */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Service-Status</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'KI-Verarbeitung', status: 'aktiv', color: 'green' },
                      { name: 'Kamera-Netzwerk', status: 'online', color: 'green' },
                      { name: 'Wetterdaten', status: 'live', color: 'blue' },
                      { name: 'Gleissensoren', status: 'aktiv', color: 'green' }
                    ].map((service) => (
                      <div key={service.name} className="flex items-center justify-between p-2 bg-white/30 rounded-md">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            service.color === 'green' ? 'bg-green-500' : 
                            service.color === 'blue' ? 'bg-blue-500' : 'bg-gray-500'
                          } animate-pulse`}></div>
                          <span className="text-sm font-medium">{service.name}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-0.5 capitalize ${
                            service.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                            service.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {service.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Update */}
                <div className="text-center pt-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    Letzte Aktualisierung: {new Date(parsedSystemStatus.lastUpdate).toLocaleTimeString('de-DE')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area - Full width on mobile, 9 columns on desktop */}
          <div className="lg:col-span-9">
            {/* Mobile Module Navigation Bar */}
            <div className="lg:hidden mb-4 bg-white/80 backdrop-blur-sm rounded-xl border border-border/50 p-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToModule('prev')}
                  className="rounded-lg hover:bg-secondary/60 disabled:opacity-30"
                  disabled={currentModuleIndex === 0}
                >
                  <CaretLeft size={16} />
                </Button>
                
                <div className="flex items-center gap-2 flex-1 justify-center">
                  {(modules.find((m: ModuleType) => m.id === activeModule) as ModuleType) && (
                    <MobileModuleControl
                      module={modules.find((m: ModuleType) => m.id === activeModule) as ModuleType}
                      onShowQuickActions={showQuickActions}
                    />
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToModule('next')}
                  className="rounded-lg hover:bg-secondary/60 disabled:opacity-30"
                  disabled={currentModuleIndex === modules.length - 1}
                >
                  <CaretRight size={16} />
                </Button>
              </div>
              
              {/* Module progress dots */}
              <div className="flex justify-center gap-1.5 mt-3">
                {modules.map((module: ModuleType, index: number) => (
                  <ModuleProgressDot
                    key={module.id}
                    module={module}
                    index={index}
                    isActive={index === currentModuleIndex}
                    onModuleSelect={setActiveModule}
                    onShowQuickActions={showQuickActions}
                  />
                ))}
              </div>

              {/* Swipe hint for first-time users */}
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Wischen links/rechts • Langes Drücken für Aktionen • {currentModuleIndex + 1} von {modules.length}
                </p>
              </div>
            </div>

            <SwipeDetector 
              onSwipe={(direction) => {
                if (direction === 'left') {
                  navigateToModule('next')
                } else {
                  navigateToModule('prev')
                }
              }}
              threshold={80}
              enableHapticFeedback={true}
            >
              <div 
                className="bg-white/60 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-border/50 overflow-hidden"
                {...swipeHandlers}
              >
                <SafeRender errorMessage={`Fehler beim Laden des ${(modules.find((m: ModuleType) => m.id === activeModule) as ModuleType)?.name || activeModule} Moduls`}>
                  {renderActiveComponent()}
                </SafeRender>
              </div>
            </SwipeDetector>
          </div>
        </div>
      </div>

      {/* Quick Actions Modal */}
      <ModuleQuickActions
        moduleId={quickActionsState.moduleId}
        moduleName={quickActionsState.moduleName}
        isOpen={quickActionsState.isOpen}
        onClose={hideQuickActions}
        position={quickActionsState.position}
      />

      {/* Footer */}
      <footer className="border-t border-border/50 bg-white/40 backdrop-blur-md mt-16">
        <div className="container mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-medium">© 2024 SmartRail-AI - Namensnennung Fahed Mlaiel erforderlich</p>
              <p className="text-xs opacity-70">Lizenziert nur für humanitäre und gemeinnützige Nutzung</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs">Letzte Aktualisierung:</span>
              <Badge variant="outline" className="text-xs font-mono">
                {new Date(parsedSystemStatus.lastUpdate).toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App