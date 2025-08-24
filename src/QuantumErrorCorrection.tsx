import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  ShieldCheck,
  Brain,
  Activity,
  TrendUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Cpu,
  Eye,
  Network,
  Warning,
  Gauge,
  RotateCcw,
  Play,
  Pause
} from '@phosphor-icons/react'

interface ErrorPattern {
  id: string
  type: 'bit-flip' | 'phase-flip' | 'amplitude-damping' | 'dephasing' | 'cross-talk'
  severity: 'niedrig' | 'mittel' | 'hoch' | 'kritisch'
  frequency: number
  location: string
  correctionRate: number
  detectionTime: number
  lastOccurrence: string
  trend: 'steigend' | 'fallend' | 'stabil'
}

interface CorrectionCode {
  id: string
  name: string
  type: 'surface' | 'steane' | 'shor' | 'color' | 'toric'
  qubits: number
  logicalQubits: number
  threshold: number
  overhead: number
  efficiency: number
  fidelity: number
  status: 'aktiv' | 'standby' | 'deaktiviert'
}

interface QuantumErrorMetrics {
  totalErrors: number
  correctedErrors: number
  uncorrectedErrors: number
  correctionEfficiency: number
  systemFidelity: number
  logicalErrorRate: number
  physicalErrorRate: number
  codeDistance: number
}

export default function QuantumErrorCorrection() {
  const [isRunning, setIsRunning] = useState(true)
  const [selectedCode, setSelectedCode] = useState<string>('surface')
  const [realTimeMode, setRealTimeMode] = useState(true)

  const [errorPatterns, setErrorPatterns] = useKV<ErrorPattern[]>('quantum-error-patterns', [
    {
      id: 'bit-flip-1',
      type: 'bit-flip',
      severity: 'mittel',
      frequency: 0.15,
      location: 'Qubit 5-12',
      correctionRate: 98.5,
      detectionTime: 0.025,
      lastOccurrence: new Date(Date.now() - 5000).toISOString(),
      trend: 'fallend'
    },
    {
      id: 'phase-flip-1', 
      type: 'phase-flip',
      severity: 'niedrig',
      frequency: 0.08,
      location: 'Qubit 15-20',
      correctionRate: 99.2,
      detectionTime: 0.018,
      lastOccurrence: new Date(Date.now() - 12000).toISOString(),
      trend: 'stabil'
    },
    {
      id: 'amplitude-damping-1',
      type: 'amplitude-damping',
      severity: 'hoch',
      frequency: 0.22,
      location: 'Qubit 1-4',
      correctionRate: 95.8,
      detectionTime: 0.035,
      lastOccurrence: new Date(Date.now() - 2000).toISOString(),
      trend: 'steigend'
    },
    {
      id: 'dephasing-1',
      type: 'dephasing',
      severity: 'mittel',
      frequency: 0.12,
      location: 'Qubit 25-30',
      correctionRate: 97.1,
      detectionTime: 0.028,
      lastOccurrence: new Date(Date.now() - 8000).toISOString(),
      trend: 'fallend'
    },
    {
      id: 'cross-talk-1',
      type: 'cross-talk',
      severity: 'kritisch',
      frequency: 0.05,
      location: 'Qubit 8-9',
      correctionRate: 92.3,
      detectionTime: 0.042,
      lastOccurrence: new Date(Date.now() - 15000).toISOString(),
      trend: 'steigend'
    }
  ])

  const [correctionCodes, setCorrectionCodes] = useKV<CorrectionCode[]>('quantum-correction-codes', [
    {
      id: 'surface',
      name: 'Surface Code',
      type: 'surface',
      qubits: 17,
      logicalQubits: 1,
      threshold: 0.0057,
      overhead: 17,
      efficiency: 94.2,
      fidelity: 99.95,
      status: 'aktiv'
    },
    {
      id: 'steane',
      name: 'Steane Code',
      type: 'steane',
      qubits: 7,
      logicalQubits: 1,
      threshold: 0.0029,
      overhead: 7,
      efficiency: 87.5,
      fidelity: 99.89,
      status: 'standby'
    },
    {
      id: 'shor',
      name: 'Shor Code',
      type: 'shor',
      qubits: 9,
      logicalQubits: 1,
      threshold: 0.0041,
      overhead: 9,
      efficiency: 91.3,
      fidelity: 99.92,
      status: 'standby'
    },
    {
      id: 'color',
      name: 'Color Code',
      type: 'color',
      qubits: 15,
      logicalQubits: 1,
      threshold: 0.0068,
      overhead: 15,
      efficiency: 89.7,
      fidelity: 99.91,
      status: 'deaktiviert'
    },
    {
      id: 'toric',
      name: 'Toric Code',
      type: 'toric',
      qubits: 18,
      logicalQubits: 2,
      threshold: 0.0045,
      overhead: 9,
      efficiency: 96.1,
      fidelity: 99.97,
      status: 'standby'
    }
  ])

  const [errorMetrics, setErrorMetrics] = useKV<QuantumErrorMetrics>('quantum-error-metrics', {
    totalErrors: 1247,
    correctedErrors: 1198,
    uncorrectedErrors: 49,
    correctionEfficiency: 96.1,
    systemFidelity: 99.85,
    logicalErrorRate: 0.00045,
    physicalErrorRate: 0.012,
    codeDistance: 5
  })

  // Simulate real-time error detection and correction
  useEffect(() => {
    if (!realTimeMode) return

    const interval = setInterval(() => {
      // Simulate new errors
      const newErrors = Math.floor(Math.random() * 3)
      const correctedErrors = Math.floor(newErrors * (0.9 + Math.random() * 0.09))
      
      setErrorMetrics(prev => ({
        ...prev,
        totalErrors: prev.totalErrors + newErrors,
        correctedErrors: prev.correctedErrors + correctedErrors,
        uncorrectedErrors: prev.uncorrectedErrors + (newErrors - correctedErrors),
        correctionEfficiency: ((prev.correctedErrors + correctedErrors) / (prev.totalErrors + newErrors)) * 100,
        systemFidelity: Math.max(99.5, Math.min(99.99, prev.systemFidelity + (Math.random() - 0.5) * 0.02))
      }))

      // Update error patterns
      setErrorPatterns(prev => prev.map(pattern => ({
        ...pattern,
        frequency: Math.max(0.01, pattern.frequency + (Math.random() - 0.5) * 0.02),
        correctionRate: Math.max(85, Math.min(99.9, pattern.correctionRate + (Math.random() - 0.5) * 0.5)),
        lastOccurrence: Math.random() < 0.3 ? new Date().toISOString() : pattern.lastOccurrence
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [realTimeMode, setErrorMetrics, setErrorPatterns])

  const activateCorrection = async (codeId: string) => {
    const code = correctionCodes.find(c => c.id === codeId)
    if (!code) return

    setCorrectionCodes(prev => prev.map(c => ({
      ...c,
      status: c.id === codeId ? 'aktiv' : 'standby'
    })))

    toast.success(`${code.name} aktiviert`, {
      description: `Schwellenwert: ${(code.threshold * 100).toFixed(3)}%, Effizienz: ${code.efficiency}%`
    })

    // Simulate improvement in error correction
    setTimeout(() => {
      setErrorMetrics(prev => ({
        ...prev,
        correctionEfficiency: Math.min(99.9, prev.correctionEfficiency + 1.2),
        systemFidelity: Math.min(99.99, prev.systemFidelity + 0.05)
      }))
    }, 1000)
  }

  const runEmergencyCorrection = async () => {
    toast.info('Notfall-Fehlerkorrektur gestartet', {
      description: 'Analysiere kritische Fehlermuster...'
    })

    // Simulate emergency correction
    await new Promise(resolve => setTimeout(resolve, 2000))

    setErrorMetrics(prev => ({
      ...prev,
      uncorrectedErrors: Math.floor(prev.uncorrectedErrors * 0.3),
      correctionEfficiency: Math.min(99.5, prev.correctionEfficiency + 2.5),
      systemFidelity: Math.min(99.95, prev.systemFidelity + 0.1)
    }))

    // Reset critical error patterns
    setErrorPatterns(prev => prev.map(pattern => ({
      ...pattern,
      severity: pattern.severity === 'kritisch' ? 'mittel' : pattern.severity,
      correctionRate: Math.min(99.5, pattern.correctionRate + 3.0),
      trend: 'fallend'
    })))

    toast.success('Notfall-Korrektur abgeschlossen', {
      description: 'Systemintegrität wiederhergestellt'
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'niedrig': return 'bg-green-100 text-green-800'
      case 'mittel': return 'bg-yellow-100 text-yellow-800'
      case 'hoch': return 'bg-orange-100 text-orange-800'
      case 'kritisch': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktiv': return 'bg-green-100 text-green-800'
      case 'standby': return 'bg-yellow-100 text-yellow-800'
      case 'deaktiviert': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'steigend': return <TrendUp size={14} className="text-red-600" />
      case 'fallend': return <TrendUp size={14} className="text-green-600 rotate-180" />
      case 'stabil': return <Activity size={14} className="text-blue-600" />
      default: return <Activity size={14} className="text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quantum Error Correction</h1>
            <p className="text-muted-foreground">Erweiterte Fehlerbehandlung mit Machine Learning</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setRealTimeMode(!realTimeMode)}
            variant="outline"
            className="gap-2"
          >
            {realTimeMode ? <Pause size={16} /> : <Play size={16} />}
            {realTimeMode ? 'Pausieren' : 'Starten'}
          </Button>
          <Button
            onClick={runEmergencyCorrection}
            variant="destructive"
            className="gap-2"
          >
            <RotateCcw size={16} />
            Notfall-Korrektur
          </Button>
          <Badge className={errorMetrics.systemFidelity > 99.9 ? 'bg-green-500' : 'bg-yellow-500'}>
            Fidelity: {errorMetrics.systemFidelity.toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* System Status Alert */}
      <Alert className={errorMetrics.uncorrectedErrors > 20 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
        <ShieldCheck className={`h-4 w-4 ${errorMetrics.uncorrectedErrors > 20 ? 'text-red-600' : 'text-green-600'}`} />
        <AlertDescription className={errorMetrics.uncorrectedErrors > 20 ? 'text-red-800' : 'text-green-800'}>
          Fehlerkorrektur-System operational • 
          {errorMetrics.correctedErrors} korrigierte Fehler • 
          {errorMetrics.uncorrectedErrors} unkorrigierte Fehler • 
          Effizienz: {errorMetrics.correctionEfficiency.toFixed(1)}%
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="patterns">Fehlermuster</TabsTrigger>
          <TabsTrigger value="codes">Korrektur-Codes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Cpu size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {errorMetrics.totalErrors.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Gesamt-Fehler</div>
                <Progress value={75} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {errorMetrics.correctedErrors.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Korrigiert</div>
                <Progress value={errorMetrics.correctionEfficiency} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {errorMetrics.uncorrectedErrors}
                </div>
                <div className="text-sm text-muted-foreground">Unkorrigiert</div>
                <Progress value={(errorMetrics.uncorrectedErrors / errorMetrics.totalErrors) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Gauge size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {errorMetrics.correctionEfficiency.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Effizienz</div>
                <Progress value={errorMetrics.correctionEfficiency} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain size={18} />
                  ML-Fehlervorhersage
                </CardTitle>
                <CardDescription>Künstliche Intelligenz analysiert Fehlermuster</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Vorhersage-Genauigkeit</span>
                    <span className="text-sm">94.7%</span>
                  </div>
                  <Progress value={94.7} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Muster-Erkennung</span>
                    <span className="text-sm">97.2%</span>
                  </div>
                  <Progress value={97.2} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-blue-600">Erkannte Muster</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">0.85ms</div>
                    <div className="text-xs text-green-600">Reaktionszeit</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={18} />
                  Aktuelle Korrektur-Codes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {correctionCodes.filter(code => code.status === 'aktiv').map(code => (
                  <div key={code.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">{code.name}</div>
                      <div className="text-sm text-green-600">
                        {code.qubits} Qubits • Overhead: {code.overhead}x
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      {code.fidelity}%
                    </Badge>
                  </div>
                ))}

                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Standby-Codes:</h4>
                  {correctionCodes.filter(code => code.status === 'standby').slice(0, 2).map(code => (
                    <div key={code.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{code.name}</span>
                      <Badge variant="outline">{code.efficiency}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Error Patterns */}
        <TabsContent value="patterns" className="space-y-6">
          <div className="space-y-4">
            {errorPatterns.map(pattern => (
              <Card key={pattern.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Warning size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold capitalize">{pattern.type.replace('-', ' ')}</h3>
                        <p className="text-sm text-muted-foreground">{pattern.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(pattern.severity)}>
                        {pattern.severity}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(pattern.trend)}
                        <span className="text-xs text-muted-foreground">{pattern.trend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-primary">{(pattern.frequency * 100).toFixed(2)}%</div>
                      <div className="text-xs text-muted-foreground">Häufigkeit</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{pattern.correctionRate.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Korrektur-Rate</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{(pattern.detectionTime * 1000).toFixed(1)}ms</div>
                      <div className="text-xs text-muted-foreground">Erkennungszeit</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <div className="text-sm font-bold text-purple-600">
                        {Math.floor((Date.now() - new Date(pattern.lastOccurrence).getTime()) / 1000)}s
                      </div>
                      <div className="text-xs text-muted-foreground">Zuletzt</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Korrektur-Erfolg</span>
                      <span className="text-sm">{pattern.correctionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={pattern.correctionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Correction Codes */}
        <TabsContent value="codes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {correctionCodes.map(code => (
              <Card key={code.id} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={18} className="text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{code.name}</CardTitle>
                        <CardDescription className="capitalize">{code.type} Code</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(code.status)}>
                      {code.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Qubits:</span>
                        <span className="font-medium">{code.qubits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Logische:</span>
                        <span className="font-medium">{code.logicalQubits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Overhead:</span>
                        <span className="font-medium">{code.overhead}x</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Schwelle:</span>
                        <span className="font-medium">{(code.threshold * 100).toFixed(3)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Effizienz:</span>
                        <span className="font-medium text-green-600">{code.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fidelity:</span>
                        <span className="font-medium text-blue-600">{code.fidelity}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Fehlertoleranz</span>
                      <span className="text-sm">{((1 - code.threshold) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(1 - code.threshold) * 100} className="h-2" />
                  </div>

                  <Button
                    onClick={() => activateCorrection(code.id)}
                    disabled={code.status === 'aktiv'}
                    className="w-full gap-2"
                    variant={code.status === 'aktiv' ? 'outline' : 'default'}
                  >
                    {code.status === 'aktiv' ? (
                      <>
                        <CheckCircle size={16} />
                        Aktiv
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Aktivieren
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={18} />
                Deep Learning Fehleranalyse
              </CardTitle>
              <CardDescription>Neuronale Netzwerke für komplexere Fehlererkennungsmuster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Netzwerk-Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Trainings-Genauigkeit</span>
                      <span className="text-sm font-medium">98.7%</span>
                    </div>
                    <Progress value={98.7} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Validierungs-Genauigkeit</span>
                      <span className="text-sm font-medium">96.2%</span>
                    </div>
                    <Progress value={96.2} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">False-Positive-Rate</span>
                      <span className="text-sm font-medium">2.1%</span>
                    </div>
                    <Progress value={2.1} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Modell-Metriken</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">0.985</div>
                      <div className="text-xs text-blue-600">Precision</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">0.978</div>
                      <div className="text-xs text-green-600">Recall</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">0.981</div>
                      <div className="text-xs text-purple-600">F1-Score</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-xl font-bold text-orange-600">0.962</div>
                      <div className="text-xs text-orange-600">AUC-ROC</div>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="border-purple-200 bg-purple-50">
                <Brain className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-purple-800">
                  Deep Learning Modell aktiv • 
                  Verarbeitet {errorMetrics.totalErrors.toLocaleString()} Datenpoints • 
                  Kontinuierliche Verbesserung durch Transfer Learning
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">15,847</div>
                  <div className="text-sm text-muted-foreground">Trainings-Samples</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">47ms</div>
                  <div className="text-sm text-muted-foreground">Inferenz-Zeit</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">8.2GB</div>
                  <div className="text-sm text-muted-foreground">Modell-Größe</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}