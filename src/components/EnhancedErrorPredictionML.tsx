import React, { useState, useEffect, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Brain, 
  TrendUp, 
  Cpu, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Activity,
  ShieldCheck,
  Lightning,
  Bug,
  Warning,
  Info,
  CircleNotch,
  ChartLine,
  Database,
  GitBranch,
  Pulse,
  Eye,
  Sparkle,
  Wrench,
  Gauge,
  Siren,
  Crosshair,
  Robot,
  MagnifyingGlass,
  ArrowUp,
  ArrowDown,
  Minus,
  FlaskConical,
  GraduationCap,
  Lightbulb
} from '@phosphor-icons/react';

interface CriticalErrorPrediction {
  predictionId: string;
  errorType: string;
  errorCategory: 'system_failure' | 'performance_degradation' | 'security_breach' | 'data_corruption' | 'network_outage';
  confidenceScore: number;
  timeToFailure: number; // minutes
  severity: 'minor' | 'moderate' | 'severe' | 'catastrophic';
  affectedComponents: string[];
  rootCauseAnalysis: string[];
  preventionActions: string[];
  automaticMitigation: boolean;
  estimatedDowntime: number; // minutes
  businessImpact: number; // scale 1-100
  technicalComplexity: number; // scale 1-100
  requiredExpertise: string[];
  dependentSystems: string[];
  timestamp: string;
  status: 'predicted' | 'confirmed' | 'prevented' | 'occurred' | 'false_positive';
}

interface MLModelMetrics {
  modelId: string;
  modelName: string;
  architecture: string;
  trainingData: {
    samples: number;
    features: number;
    timespan: string;
    lastUpdated: string;
  };
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
    falsePositiveRate: number;
    falseNegativeRate: number;
  };
  predictions: {
    totalPredictions: number;
    correctPredictions: number;
    preventedIncidents: number;
    missedIncidents: number;
  };
  complexity: {
    layers: number;
    parameters: number;
    inferenceTime: number;
    memoryUsage: number;
    computeIntensity: number;
  };
  lastOptimization: string;
  status: 'training' | 'active' | 'testing' | 'deprecated';
}

interface SystemHealthIndicator {
  componentId: string;
  componentName: string;
  currentHealth: number; // 0-100
  healthTrend: 'improving' | 'stable' | 'degrading' | 'critical';
  predictedHealth24h: number;
  predictedHealth7d: number;
  riskFactors: string[];
  maintenanceRecommendations: string[];
  alertThreshold: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  failureProbability: number; // 0-100
  criticalityScore: number; // 0-100
}

interface ErrorPreventionAction {
  actionId: string;
  actionName: string;
  description: string;
  automationType: 'fully_automatic' | 'semi_automatic' | 'manual';
  executionTime: number; // seconds
  successRate: number; // 0-100
  resourceRequirements: string[];
  prerequisites: string[];
  sideEffects: string[];
  rollbackPossible: boolean;
  costEstimate: number; // euro
  impactScore: number; // 0-100
  lastExecuted?: string;
  executionCount: number;
  averageEffectiveness: number; // 0-100
}

const EnhancedErrorPredictionML: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionMode, setPredictionMode] = useState<'real_time' | 'scheduled' | 'on_demand'>('real_time');
  const [predictionHorizon, setPredictionHorizon] = useState(1440); // 24 hours default
  
  const [criticalPredictions, setCriticalPredictions] = useKV<CriticalErrorPrediction[]>('critical-error-predictions', []);
  
  const [mlModels, setMlModels] = useKV<MLModelMetrics[]>('enhanced-ml-models', [
    {
      modelId: 'ensemble-critical-predictor',
      modelName: 'Ensemble Critical System Failure Predictor',
      architecture: 'Random Forest + Deep Neural Network + LSTM',
      trainingData: {
        samples: 2847291,
        features: 1247,
        timespan: '18 Monate',
        lastUpdated: new Date(Date.now() - 3600000).toISOString()
      },
      performance: {
        accuracy: 97.8,
        precision: 96.2,
        recall: 98.1,
        f1Score: 97.1,
        auc: 0.984,
        falsePositiveRate: 1.4,
        falseNegativeRate: 0.9
      },
      predictions: {
        totalPredictions: 18492,
        correctPredictions: 17834,
        preventedIncidents: 1247,
        missedIncidents: 89
      },
      complexity: {
        layers: 24,
        parameters: 12847291,
        inferenceTime: 78,
        memoryUsage: 3.7,
        computeIntensity: 92
      },
      lastOptimization: new Date(Date.now() - 7200000).toISOString(),
      status: 'active'
    },
    {
      modelId: 'transformer-anomaly-detector',
      modelName: 'Transformer-basierter Anomalie-Detektor',
      architecture: 'Multi-Head Attention Transformer',
      trainingData: {
        samples: 5647291,
        features: 892,
        timespan: '24 Monate',
        lastUpdated: new Date(Date.now() - 1800000).toISOString()
      },
      performance: {
        accuracy: 94.7,
        precision: 93.1,
        recall: 95.8,
        f1Score: 94.4,
        auc: 0.971,
        falsePositiveRate: 2.8,
        falseNegativeRate: 1.9
      },
      predictions: {
        totalPredictions: 24891,
        correctPredictions: 23178,
        preventedIncidents: 891,
        missedIncidents: 127
      },
      complexity: {
        layers: 18,
        parameters: 8947291,
        inferenceTime: 124,
        memoryUsage: 5.2,
        computeIntensity: 87
      },
      lastOptimization: new Date(Date.now() - 14400000).toISOString(),
      status: 'active'
    },
    {
      modelId: 'graph-dependency-analyzer',
      modelName: 'Graph Neural Network Dependency Analyzer',
      architecture: 'Graph Convolutional Network + Graph Attention',
      trainingData: {
        samples: 1247891,
        features: 2847,
        timespan: '12 Monate',
        lastUpdated: new Date(Date.now() - 10800000).toISOString()
      },
      performance: {
        accuracy: 91.4,
        precision: 89.7,
        recall: 92.6,
        f1Score: 91.1,
        auc: 0.948,
        falsePositiveRate: 4.1,
        falseNegativeRate: 3.2
      },
      predictions: {
        totalPredictions: 8924,
        correctPredictions: 8147,
        preventedIncidents: 524,
        missedIncidents: 187
      },
      complexity: {
        layers: 12,
        parameters: 3847291,
        inferenceTime: 189,
        memoryUsage: 2.9,
        computeIntensity: 73
      },
      lastOptimization: new Date(Date.now() - 21600000).toISOString(),
      status: 'training'
    }
  ]);

  const [systemHealth, setSystemHealth] = useKV<SystemHealthIndicator[]>('system-health-indicators', [
    {
      componentId: 'central-ai-processing',
      componentName: 'Zentrale KI-Verarbeitung',
      currentHealth: 94,
      healthTrend: 'stable',
      predictedHealth24h: 91,
      predictedHealth7d: 87,
      riskFactors: [
        'Erhöhte CPU-Last bei Stoßzeiten',
        'Speicher-Fragmentierung',
        'Model-Drift bei Wettervorhersage'
      ],
      maintenanceRecommendations: [
        'Memory Defragmentierung',
        'Model Retraining',
        'Load Balancer Optimierung'
      ],
      alertThreshold: 85,
      lastMaintenanceDate: new Date(Date.now() - 2592000000).toISOString(),
      nextMaintenanceDate: new Date(Date.now() + 604800000).toISOString(),
      failureProbability: 8,
      criticalityScore: 98
    },
    {
      componentId: 'sensor-network-grid',
      componentName: 'Sensor-Netzwerk-Grid',
      currentHealth: 87,
      healthTrend: 'degrading',
      predictedHealth24h: 83,
      predictedHealth7d: 76,
      riskFactors: [
        'Sensor-Ausfall-Rate steigt',
        'Konnektivitätsprobleme bei schlechtem Wetter',
        'Batterie-Degradation bei älteren Sensoren'
      ],
      maintenanceRecommendations: [
        'Sensor-Austausch in Zone 7A',
        'Backup-Kommunikationskanäle aktivieren',
        'Batterie-Monitoring verstärken'
      ],
      alertThreshold: 80,
      lastMaintenanceDate: new Date(Date.now() - 1296000000).toISOString(),
      nextMaintenanceDate: new Date(Date.now() + 259200000).toISOString(),
      failureProbability: 23,
      criticalityScore: 89
    },
    {
      componentId: 'database-cluster',
      componentName: 'Datenbank-Cluster',
      currentHealth: 96,
      healthTrend: 'improving',
      predictedHealth24h: 97,
      predictedHealth7d: 98,
      riskFactors: [
        'Disk Space Growth Rate',
        'Index-Fragmentierung'
      ],
      maintenanceRecommendations: [
        'Index-Rebuild planen',
        'Archivierung alter Daten',
        'Performance-Tuning'
      ],
      alertThreshold: 90,
      lastMaintenanceDate: new Date(Date.now() - 432000000).toISOString(),
      nextMaintenanceDate: new Date(Date.now() + 1209600000).toISOString(),
      failureProbability: 4,
      criticalityScore: 95
    }
  ]);

  const [preventionActions, setPreventionActions] = useKV<ErrorPreventionAction[]>('error-prevention-actions', [
    {
      actionId: 'auto-resource-scaling',
      actionName: 'Automatische Ressourcen-Skalierung',
      description: 'Dynamische Anpassung der Compute-Ressourcen basierend auf vorhergesagter Last',
      automationType: 'fully_automatic',
      executionTime: 45,
      successRate: 97.8,
      resourceRequirements: ['CPU', 'Memory', 'Network Bandwidth'],
      prerequisites: ['Load Prediction Model', 'Resource Pool Available'],
      sideEffects: ['Temporäre Latenz-Erhöhung', 'Kostenerhöhung'],
      rollbackPossible: true,
      costEstimate: 150,
      impactScore: 85,
      lastExecuted: new Date(Date.now() - 3600000).toISOString(),
      executionCount: 247,
      averageEffectiveness: 94
    },
    {
      actionId: 'predictive-failover',
      actionName: 'Prädiktive Failover-Aktivierung',
      description: 'Vorzeitige Umschaltung auf Backup-Systeme bei vorhergesagten Ausfällen',
      automationType: 'semi_automatic',
      executionTime: 120,
      successRate: 92.1,
      resourceRequirements: ['Backup Systems', 'Network Capacity'],
      prerequisites: ['System Health Monitoring', 'Backup System Ready'],
      sideEffects: ['Service-Unterbrechung 2-5 Sekunden', 'Reduced Performance'],
      rollbackPossible: true,
      costEstimate: 300,
      impactScore: 92,
      lastExecuted: new Date(Date.now() - 14400000).toISOString(),
      executionCount: 89,
      averageEffectiveness: 88
    },
    {
      actionId: 'ml-model-refresh',
      actionName: 'ML-Model Notfall-Refresh',
      description: 'Sofortiges Retraining kritischer ML-Modelle bei Drift-Erkennung',
      automationType: 'manual',
      executionTime: 1800,
      successRate: 89.7,
      resourceRequirements: ['GPU Cluster', 'Training Data', 'ML Engineers'],
      prerequisites: ['Model Drift Detection', 'Training Infrastructure'],
      sideEffects: ['Reduzierte Vorhersagegenauigkeit während Training', 'Hoher Ressourcenverbrauch'],
      rollbackPossible: true,
      costEstimate: 2500,
      impactScore: 78,
      lastExecuted: new Date(Date.now() - 86400000).toISOString(),
      executionCount: 12,
      averageEffectiveness: 82
    }
  ]);

  // Enhanced Prediction Analysis
  const runEnhancedPredictionAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    toast.info('Starte Enhanced ML-Fehlervorhersage...', {
      description: 'Analysiere System mit Deep Learning und fortgeschrittener Mustererkennung',
      duration: 4000
    });

    // Simulate comprehensive analysis
    setTimeout(() => {
      // Generate sophisticated predictions
      const newPredictions: CriticalErrorPrediction[] = [];
      
      // Systematic failure prediction
      if (Math.random() < 0.3) {
        newPredictions.push({
          predictionId: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          errorType: 'Kaskadierende Systemüberlastung',
          errorCategory: 'system_failure',
          confidenceScore: 89 + Math.random() * 10,
          timeToFailure: Math.floor(Math.random() * predictionHorizon/4) + 60, // 1-6 hours
          severity: 'catastrophic',
          affectedComponents: [
            'Zentrale KI-Verarbeitung',
            'Sensor-Netzwerk',
            'Kommunikations-Hub',
            'Backup-Systeme'
          ],
          rootCauseAnalysis: [
            'Exponentieller Anstieg der Verarbeitungsanfragen',
            'Memory-Leak in KI-Processing-Pipeline',
            'Unzureichende Load-Balancing-Kapazität',
            'Sensor-Daten-Overflow bei Anomalie-Erkennung'
          ],
          preventionActions: [
            'Sofortige Aktivierung zusätzlicher Verarbeitungsknoten',
            'Memory-Cleanup und Garbage Collection',
            'Priorisierung kritischer Verarbeitungsaufgaben',
            'Temporäre Reduzierung nicht-essentieller Funktionen'
          ],
          automaticMitigation: true,
          estimatedDowntime: 45,
          businessImpact: 95,
          technicalComplexity: 87,
          requiredExpertise: ['DevOps Engineer', 'ML Engineer', 'System Architect'],
          dependentSystems: ['Passenger Information', 'Emergency Response', 'Maintenance Scheduling'],
          timestamp: new Date().toISOString(),
          status: 'predicted'
        });
      }

      // Performance degradation prediction
      if (Math.random() < 0.5) {
        newPredictions.push({
          predictionId: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          errorType: 'ML-Model Performance Degradation',
          errorCategory: 'performance_degradation',
          confidenceScore: 82 + Math.random() * 15,
          timeToFailure: Math.floor(Math.random() * predictionHorizon/2) + 120, // 2-12 hours
          severity: 'severe',
          affectedComponents: [
            'Transformer Anomalie-Detektor',
            'Vorhersage-Pipeline',
            'Entscheidungs-Engine'
          ],
          rootCauseAnalysis: [
            'Data Drift in Input-Features',
            'Model-Parameter Verschlechterung',
            'Unvorhergesehene Edge Cases',
            'Konzeptdrift in Umgebungsbedingungen'
          ],
          preventionActions: [
            'Aktivierung Backup-Modelle',
            'Incrementelles Model-Retraining',
            'Feature-Engineering Anpassung',
            'Ensemble-Method Umschaltung'
          ],
          automaticMitigation: true,
          estimatedDowntime: 15,
          businessImpact: 67,
          technicalComplexity: 79,
          requiredExpertise: ['ML Engineer', 'Data Scientist'],
          dependentSystems: ['Error Detection', 'Predictive Maintenance', 'Anomaly Detection'],
          timestamp: new Date().toISOString(),
          status: 'predicted'
        });
      }

      // Security breach prediction
      if (Math.random() < 0.2) {
        newPredictions.push({
          predictionId: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          errorType: 'Potential Security Vulnerability Exploitation',
          errorCategory: 'security_breach',
          confidenceScore: 74 + Math.random() * 20,
          timeToFailure: Math.floor(Math.random() * predictionHorizon) + 30,
          severity: 'severe',
          affectedComponents: [
            'API Gateway',
            'Sensor Communication',
            'Data Storage'
          ],
          rootCauseAnalysis: [
            'Ungewöhnliche Zugriffsmuster erkannt',
            'Schwachstelle in Authentication Layer',
            'Potentielle Brute-Force-Aktivität',
            'Verdächtige Datenexfiltration-Versuche'
          ],
          preventionActions: [
            'Verstärkung der Authentifizierung',
            'Rate Limiting aktivieren',
            'Verdächtige IPs blockieren',
            'Security Monitoring erhöhen'
          ],
          automaticMitigation: true,
          estimatedDowntime: 0,
          businessImpact: 89,
          technicalComplexity: 65,
          requiredExpertise: ['Security Engineer', 'Network Administrator'],
          dependentSystems: ['User Management', 'Data Protection', 'Audit Logging'],
          timestamp: new Date().toISOString(),
          status: 'predicted'
        });
      }

      setCriticalPredictions(prev => [...newPredictions, ...prev.slice(0, 12)]);
      
      // Update system health based on predictions
      setSystemHealth(prev => prev.map(component => {
        const hasPrediction = newPredictions.some(p => 
          p.affectedComponents.some(ac => ac.toLowerCase().includes(component.componentName.toLowerCase()))
        );
        
        if (hasPrediction) {
          return {
            ...component,
            currentHealth: Math.max(70, component.currentHealth - Math.random() * 10),
            healthTrend: 'degrading' as const,
            failureProbability: Math.min(100, component.failureProbability + Math.random() * 15)
          };
        }
        
        return component;
      }));

      setIsAnalyzing(false);
      
      toast.success('Enhanced ML-Analyse abgeschlossen!', {
        description: `${newPredictions.length} kritische Vorhersagen generiert • ${newPredictions.filter(p => p.automaticMitigation).length} automatische Mitigationen verfügbar`,
        duration: 6000
      });
    }, 12000);
  }, [predictionHorizon, setCriticalPredictions, setSystemHealth]);

  // Auto-analysis scheduling
  useEffect(() => {
    if (predictionMode !== 'real_time') return;

    const interval = setInterval(() => {
      if (!isAnalyzing && Math.random() < 0.25) { // 25% chance every interval
        runEnhancedPredictionAnalysis();
      }
    }, 120000); // Every 2 minutes

    return () => clearInterval(interval);
  }, [predictionMode, isAnalyzing, runEnhancedPredictionAnalysis]);

  const executePrevention = useCallback(async (actionId: string) => {
    const action = preventionActions.find(a => a.actionId === actionId);
    if (!action) return;

    toast.info(`Führe Präventionsmaßnahme aus: ${action.actionName}`, {
      description: `Geschätzte Ausführungszeit: ${action.executionTime} Sekunden`,
      duration: 4000
    });

    // Simulate execution
    setTimeout(() => {
      const success = Math.random() < (action.successRate / 100);
      
      if (success) {
        toast.success(`Präventionsmaßnahme erfolgreich: ${action.actionName}`, {
          description: `Effektivität: ${action.averageEffectiveness}% • Kosten: €${action.costEstimate}`,
          duration: 5000
        });

        // Update action statistics
        setPreventionActions(prev => prev.map(a => 
          a.actionId === actionId ? {
            ...a,
            executionCount: a.executionCount + 1,
            lastExecuted: new Date().toISOString(),
            averageEffectiveness: Math.min(100, a.averageEffectiveness + Math.random() * 3)
          } : a
        ));
      } else {
        toast.error(`Präventionsmaßnahme fehlgeschlagen: ${action.actionName}`, {
          description: 'Manuelle Intervention erforderlich',
          duration: 6000
        });
      }
    }, action.executionTime * 1000);
  }, [preventionActions, setPreventionActions]);

  const getCategoryIcon = (category: CriticalErrorPrediction['errorCategory']) => {
    switch (category) {
      case 'system_failure': return <Bug size={16} className="text-red-500" />;
      case 'performance_degradation': return <TrendUp size={16} className="text-orange-500" />;
      case 'security_breach': return <ShieldCheck size={16} className="text-purple-500" />;
      case 'data_corruption': return <Database size={16} className="text-yellow-500" />;
      case 'network_outage': return <GitBranch size={16} className="text-blue-500" />;
      default: return <Warning size={16} className="text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: CriticalErrorPrediction['severity']) => {
    switch (severity) {
      case 'minor': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'severe': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'catastrophic': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthTrendIcon = (trend: SystemHealthIndicator['healthTrend']) => {
    switch (trend) {
      case 'improving': return <ArrowUp size={14} className="text-green-600" />;
      case 'stable': return <Minus size={14} className="text-blue-600" />;
      case 'degrading': return <ArrowDown size={14} className="text-orange-600" />;
      case 'critical': return <AlertTriangle size={14} className="text-red-600" />;
      default: return <Minus size={14} className="text-gray-600" />;
    }
  };

  const getAutomationIcon = (type: ErrorPreventionAction['automationType']) => {
    switch (type) {
      case 'fully_automatic': return <Robot size={14} className="text-green-600" />;
      case 'semi_automatic': return <GraduationCap size={14} className="text-yellow-600" />;
      case 'manual': return <Lightbulb size={14} className="text-blue-600" />;
      default: return <Settings size={14} className="text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Enhanced ML Fehlervorhersage</h1>
            <p className="text-muted-foreground">Kritische Systemfehler mit Machine Learning vorhersagen und verhindern</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Modus:</label>
            <Button
              variant={predictionMode === 'real_time' ? "default" : "outline"}
              size="sm"
              onClick={() => setPredictionMode('real_time')}
            >
              <Pulse size={14} className="mr-1" />
              Echtzeit
            </Button>
            <Button
              variant={predictionMode === 'on_demand' ? "default" : "outline"}
              size="sm"
              onClick={() => setPredictionMode('on_demand')}
            >
              <Target size={14} className="mr-1" />
              On-Demand
            </Button>
          </div>
          
          <Button
            onClick={runEnhancedPredictionAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? <CircleNotch size={16} className="animate-spin" /> : <Lightning size={16} />}
            {isAnalyzing ? 'Analysiere...' : 'Deep Analysis'}
          </Button>
        </div>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <Alert className="border-blue-200 bg-blue-50">
          <Cpu className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>Enhanced ML-Analyse läuft • Verarbeite Systemdaten mit Deep Learning</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Multi-Model Processing</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="predictions">Kritische Vorhersagen</TabsTrigger>
          <TabsTrigger value="health">System-Gesundheit</TabsTrigger>
          <TabsTrigger value="models">ML-Modelle</TabsTrigger>
          <TabsTrigger value="prevention">Prävention</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Siren size={20} className="text-primary" />
                Kritische Systemfehler-Vorhersagen
              </CardTitle>
              <CardDescription>
                Machine Learning Vorhersagen für schwerwiegende Systemfehler
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalPredictions.length > 0 ? (
                <div className="space-y-6">
                  {criticalPredictions.slice(0, 6).map((prediction) => (
                    <div key={prediction.predictionId} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityColor(prediction.severity)}`}>
                            {getCategoryIcon(prediction.errorCategory)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{prediction.errorType}</h4>
                            <p className="text-sm text-muted-foreground">
                              Kategorie: {prediction.errorCategory.replace('_', ' ')} • 
                              Zeit bis Fehler: {Math.round(prediction.timeToFailure / 60)}h {prediction.timeToFailure % 60}min
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            Konfidenz: {prediction.confidenceScore.toFixed(1)}%
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Business Impact: {prediction.businessImpact}%
                          </div>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-2 bg-secondary/30 rounded-lg">
                          <div className="text-lg font-bold text-red-600">
                            {prediction.estimatedDowntime}min
                          </div>
                          <div className="text-xs text-muted-foreground">Geschätzte Ausfallzeit</div>
                        </div>
                        
                        <div className="text-center p-2 bg-secondary/30 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">
                            {prediction.technicalComplexity}%
                          </div>
                          <div className="text-xs text-muted-foreground">Technische Komplexität</div>
                        </div>
                        
                        <div className="text-center p-2 bg-secondary/30 rounded-lg">
                          <div className={`text-lg font-bold ${prediction.automaticMitigation ? 'text-green-600' : 'text-red-600'}`}>
                            {prediction.automaticMitigation ? 'Auto' : 'Manual'}
                          </div>
                          <div className="text-xs text-muted-foreground">Mitigation</div>
                        </div>
                        
                        <div className="text-center p-2 bg-secondary/30 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {prediction.affectedComponents.length}
                          </div>
                          <div className="text-xs text-muted-foreground">Betroffene Systeme</div>
                        </div>
                      </div>

                      {/* Root Cause Analysis */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium mb-2">Grundursachen-Analyse</h5>
                        <div className="space-y-1">
                          {prediction.rootCauseAnalysis.slice(0, 3).map((cause, index) => (
                            <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <MagnifyingGlass size={12} className="mt-1 text-orange-500" />
                              {cause}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Prevention Actions */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium mb-2">Empfohlene Präventionsmaßnahmen</h5>
                        <div className="space-y-2">
                          {prediction.preventionActions.slice(0, 3).map((action, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                              <div className="text-sm flex items-center gap-2">
                                <ShieldCheck size={12} className="text-green-500" />
                                {action}
                              </div>
                              <Button size="sm" variant="outline" className="text-xs">
                                Ausführen
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Affected Components & Dependencies */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Betroffene Komponenten</h5>
                          <div className="flex flex-wrap gap-1">
                            {prediction.affectedComponents.map((component, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {component}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-2">Abhängige Systeme</h5>
                          <div className="flex flex-wrap gap-1">
                            {prediction.dependentSystems.map((system, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {system}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={prediction.automaticMitigation ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {prediction.automaticMitigation ? 'Automatische Mitigation verfügbar' : 'Manuelle Intervention erforderlich'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Benötigte Expertise: {prediction.requiredExpertise.join(', ')}
                          </span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Vorhergesagt: {new Date(prediction.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Keine kritischen Vorhersagen verfügbar</p>
                  <p className="text-xs text-muted-foreground mt-1">Starten Sie eine Enhanced ML-Analyse</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid gap-4">
            {systemHealth.map((component) => (
              <Card key={component.componentId} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Activity size={16} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{component.componentName}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          {getHealthTrendIcon(component.healthTrend)}
                          {component.healthTrend} • Kritikalität: {component.criticalityScore}%
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{component.currentHealth}%</div>
                      <div className="text-sm text-muted-foreground">Aktuelle Gesundheit</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Health Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Aktuelle Gesundheit</span>
                      <div className="space-y-1">
                        <Progress value={component.currentHealth} className="h-2" />
                        <p className="text-lg font-bold text-primary">{component.currentHealth}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Vorhersage 24h</span>
                      <div className="space-y-1">
                        <Progress value={component.predictedHealth24h} className="h-2" />
                        <p className="text-lg font-bold text-blue-600">{component.predictedHealth24h}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Ausfallwahrscheinlichkeit</span>
                      <div className="space-y-1">
                        <Progress value={component.failureProbability} className="h-2" />
                        <p className="text-lg font-bold text-red-600">{component.failureProbability}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Risikofaktoren</h4>
                    <div className="space-y-1">
                      {component.riskFactors.map((factor, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Warning size={12} className="mt-1 text-yellow-500" />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Maintenance Recommendations */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Wartungsempfehlungen</h4>
                    <div className="space-y-1">
                      {component.maintenanceRecommendations.map((recommendation, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Wrench size={12} className="mt-1 text-blue-500" />
                          {recommendation}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span>Letzte Wartung:</span>
                      <span className="ml-2 font-medium">{new Date(component.lastMaintenanceDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span>Nächste Wartung:</span>
                      <span className="ml-2 font-medium">{new Date(component.nextMaintenanceDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {mlModels.map((model) => (
              <Card key={model.modelId} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Brain size={16} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{model.modelName}</CardTitle>
                        <CardDescription>{model.architecture}</CardDescription>
                      </div>
                    </div>
                    
                    <Badge variant={model.status === 'active' ? 'default' : model.status === 'training' ? 'secondary' : 'outline'}>
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Genauigkeit</span>
                      <Progress value={model.performance.accuracy} className="h-2" />
                      <p className="text-sm font-bold text-primary">{model.performance.accuracy.toFixed(1)}%</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Precision</span>
                      <Progress value={model.performance.precision} className="h-2" />
                      <p className="text-sm font-bold text-green-600">{model.performance.precision.toFixed(1)}%</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium">Recall</span>
                      <Progress value={model.performance.recall} className="h-2" />
                      <p className="text-sm font-bold text-blue-600">{model.performance.recall.toFixed(1)}%</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium">F1-Score</span>
                      <Progress value={model.performance.f1Score} className="h-2" />
                      <p className="text-sm font-bold text-purple-600">{model.performance.f1Score.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Training Data */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <div className="text-lg font-bold text-primary">
                        {(model.trainingData.samples / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-muted-foreground">Trainingssamples</div>
                    </div>
                    
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {model.trainingData.features}
                      </div>
                      <div className="text-xs text-muted-foreground">Features</div>
                    </div>
                    
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {model.complexity.inferenceTime}ms
                      </div>
                      <div className="text-xs text-muted-foreground">Inferenzzeit</div>
                    </div>
                    
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {model.complexity.memoryUsage.toFixed(1)}GB
                      </div>
                      <div className="text-xs text-muted-foreground">Speicherverbrauch</div>
                    </div>
                  </div>

                  {/* Prediction Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Vorhersage-Statistiken</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Gesamt Vorhersagen:</span>
                          <span className="text-sm font-bold">{model.predictions.totalPredictions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Korrekte Vorhersagen:</span>
                          <span className="text-sm font-bold text-green-600">{model.predictions.correctPredictions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Verhinderte Vorfälle:</span>
                          <span className="text-sm font-bold text-blue-600">{model.predictions.preventedIncidents.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Model-Komplexität</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Schichten:</span>
                          <span className="text-sm font-bold">{model.complexity.layers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Parameter:</span>
                          <span className="text-sm font-bold">{(model.complexity.parameters / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Compute-Intensität:</span>
                          <span className="text-sm font-bold">{model.complexity.computeIntensity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground">
                    Letzte Optimierung: {new Date(model.lastOptimization).toLocaleString()} • 
                    Trainingsdaten aktualisiert: {new Date(model.trainingData.lastUpdated).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prevention" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary" />
                Automatische Fehlerprävention
              </CardTitle>
              <CardDescription>
                Verfügbare Präventionsmaßnahmen und ihre Wirksamkeit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preventionActions.map((action) => (
                  <div key={action.actionId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          {getAutomationIcon(action.automationType)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{action.actionName}</h4>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Button 
                          size="sm" 
                          onClick={() => executePrevention(action.actionId)}
                          disabled={action.automationType === 'manual'}
                        >
                          Ausführen
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center p-2 bg-secondary/30 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {action.successRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Erfolgsrate</div>
                      </div>
                      
                      <div className="text-center p-2 bg-secondary/30 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {action.executionTime}s
                        </div>
                        <div className="text-xs text-muted-foreground">Ausführungszeit</div>
                      </div>
                      
                      <div className="text-center p-2 bg-secondary/30 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">
                          €{action.costEstimate}
                        </div>
                        <div className="text-xs text-muted-foreground">Geschätzte Kosten</div>
                      </div>
                      
                      <div className="text-center p-2 bg-secondary/30 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {action.averageEffectiveness}%
                        </div>
                        <div className="text-xs text-muted-foreground">Durchschn. Effektivität</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h5 className="text-sm font-medium mb-1">Ressourcenanforderungen</h5>
                        <div className="flex flex-wrap gap-1">
                          {action.resourceRequirements.map((resource, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {resource}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-1">Voraussetzungen</h5>
                        <div className="flex flex-wrap gap-1">
                          {action.prerequisites.map((prereq, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant={action.rollbackPossible ? 'default' : 'destructive'} className="text-xs">
                          {action.rollbackPossible ? 'Rollback möglich' : 'Irreversibel'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Ausgeführt: {action.executionCount} mal • 
                          Letztes Mal: {action.lastExecuted ? new Date(action.lastExecuted).toLocaleString() : 'Noch nie'}
                        </span>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {action.automationType.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Prediction Accuracy */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Vorhersage-Genauigkeit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mlModels.map((model) => (
                    <div key={model.modelId} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{model.modelName.split(' ')[0]}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={model.performance.accuracy} className="w-16 h-2" />
                        <span className="text-sm font-bold w-12">{model.performance.accuracy.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prevention Success Rate */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Präventions-Erfolg</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {preventionActions.map((action) => (
                    <div key={action.actionId} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{action.actionName.split(' ')[0]}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={action.averageEffectiveness} className="w-16 h-2" />
                        <span className="text-sm font-bold w-12">{action.averageEffectiveness}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health Summary */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">System-Übersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {Math.round(systemHealth.reduce((acc, c) => acc + c.currentHealth, 0) / systemHealth.length)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Durchschnittliche Gesundheit</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {systemHealth.filter(c => c.currentHealth >= 90).length}
                      </div>
                      <div className="text-xs text-green-600">Gesunde Systeme</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">
                        {systemHealth.filter(c => c.failureProbability > 20).length}
                      </div>
                      <div className="text-xs text-red-600">Risiko-Systeme</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedErrorPredictionML;