import React, { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { 
  Atom,
  Cube,
  Eye,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Camera,
  ArrowsCounterClockwise,
  Lightning,
  TrendUp,
  Activity,
  Timer,
  Database,
  Target,
  GraphicsCard,
  Brain,
  Function,
  ChartLine,
  Warning,
  CheckCircle,
  Gear,
  Flask,
  MagnifyingGlass,
  ThreeDimensions,
  Palette,
  Graph,
  MapPin,
  RocketLaunch
} from '@phosphor-icons/react'

interface Atom3D {
  id: string
  element: string
  x: number
  y: number
  z: number
}

interface Bond3D {
  id: string
  atom1: string
  atom2: string
  type: 'single' | 'double' | 'triple'
  length: number
}

interface ProteinStructure {
  name: string
  description: string
  aminoAcids: number
  molecularWeight: number
  structure: string
}

interface SimulationState {
  proteinName: string
  status: 'running' | 'paused' | 'completed'
  progress: number
  timeRemaining: string
}

const ProteinFoldingVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState('viewer')
  const [selectedProtein, setSelectedProtein] = useState('')
  const [selectedSimulation, setSelectedSimulation] = useState('')
  const [atoms, setAtoms] = useKV<Atom3D[]>('protein-atoms', [])
  const [bonds, setBonds] = useKV<Bond3D[]>('protein-bonds', [])
  const [selectedAtoms, setSelectedAtoms] = useState<Atom3D[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [renderMode, setRenderMode] = useState('space-filling')
  const [colorScheme, setColorScheme] = useState('element')
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)

  const viewerRef = useRef<HTMLDivElement>(null)
  const [mouseDown, setMouseDown] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  // Performance settings state
  const [performanceSettings, setPerformanceSettings] = useKV('protein-performance-settings', {
    quality: 'high',
    particleCount: 10000,
    renderDistance: 100,
    shadows: true,
    reflections: true,
    antiAliasing: true
  })

  // Simulation state
  const [simulationState, setSimulationState] = useKV<SimulationState>('protein-simulation', {
    proteinName: '',
    status: 'paused',
    progress: 0,
    timeRemaining: '00:00:00'
  })

  // Sample protein structures
  const proteinStructures: ProteinStructure[] = [
    {
      name: 'Hemoglobin',
      description: 'Sauerstofftransportprotein in roten Blutkörperchen',
      aminoAcids: 574,
      molecularWeight: 64458,
      structure: 'α2β2-Tetramer'
    },
    {
      name: 'Insulin',
      description: 'Hormon zur Blutzuckerregulation',
      aminoAcids: 51,
      molecularWeight: 5808,
      structure: 'Zwei Polypeptidketten'
    },
    {
      name: 'Collagen',
      description: 'Strukturprotein in Bindegewebe',
      aminoAcids: 1464,
      molecularWeight: 300000,
      structure: 'Tripelhelix'
    },
    {
      name: 'Myosin',
      description: 'Motorprotein für Muskelkontraktion',
      aminoAcids: 1939,
      molecularWeight: 223000,
      structure: 'Filamentöse Struktur'
    }
  ]

  // Generate random protein atoms for visualization
  const generateProteinAtoms = (proteinName: string) => {
    setIsLoading(true)
    
    const elements = ['C', 'N', 'O', 'S', 'H']
    const colors = {
      'C': '#808080',
      'N': '#3050F8',
      'O': '#FF0D0D',
      'S': '#FFFF30',
      'H': '#FFFFFF'
    }
    
    const protein = proteinStructures.find(p => p.name === proteinName)
    if (!protein) return
    
    const atomCount = Math.min(protein.aminoAcids * 10, 5000) // Limit for performance
    const newAtoms: Atom3D[] = []
    const newBonds: Bond3D[] = []
    
    // Generate atoms in a rough protein-like structure
    for (let i = 0; i < atomCount; i++) {
      const angle = (i / atomCount) * Math.PI * 4
      const radius = 20 + Math.random() * 30
      const height = Math.sin(angle * 2) * 10
      
      newAtoms.push({
        id: `atom_${i}`,
        element: elements[Math.floor(Math.random() * elements.length)],
        x: Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
        y: height + (Math.random() - 0.5) * 5,
        z: Math.sin(angle) * radius + (Math.random() - 0.5) * 10
      })
      
      // Create bonds to nearby atoms
      if (i > 0 && Math.random() > 0.3) {
        newBonds.push({
          id: `bond_${i}`,
          atom1: `atom_${i-1}`,
          atom2: `atom_${i}`,
          type: 'single',
          length: Math.random() * 3 + 1
        })
      }
    }
    
    setAtoms(newAtoms)
    setBonds(newBonds)
    
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`${proteinName} struktur geladen (${newAtoms.length} Atome)`)
    }, 1500)
  }

  // Start protein folding simulation
  const startSimulation = async () => {
    if (!selectedProtein) {
      toast.error('Bitte wählen Sie zuerst ein Protein aus')
      return
    }
    
    setIsSimulationRunning(true)
    setSimulationState({
      proteinName: selectedProtein,
      status: 'running',
      progress: 0,
      timeRemaining: '05:30:00'
    })
    
    toast.success('Protein-Faltungs-Simulation gestartet')
    
    // Simulate progress
    const interval = setInterval(() => {
      setSimulationState(prev => {
        const newProgress = Math.min(prev.progress + Math.random() * 2, 100)
        const timeLeft = Math.max(0, 330 - (newProgress / 100) * 330)
        const hours = Math.floor(timeLeft / 60)
        const minutes = Math.floor(timeLeft % 60)
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsSimulationRunning(false)
          toast.success('Protein-Faltungs-Simulation abgeschlossen!')
          return {
            ...prev,
            status: 'completed',
            progress: 100,
            timeRemaining: '00:00:00'
          }
        }
        
        return {
          ...prev,
          progress: newProgress,
          timeRemaining: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`
        }
      })
    }, 500)
  }

  // Pause simulation
  const pauseSimulation = () => {
    setIsSimulationRunning(false)
    setSimulationState(prev => ({ ...prev, status: 'paused' }))
    toast.info('Simulation pausiert')
  }

  // Reset simulation
  const resetSimulation = () => {
    setIsSimulationRunning(false)
    setSimulationState({
      proteinName: '',
      status: 'paused',
      progress: 0,
      timeRemaining: '00:00:00'
    })
    toast.info('Simulation zurückgesetzt')
  }

  // Mouse interaction handlers for 3D viewer
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseDown) return
    
    const deltaX = e.clientX - lastMousePos.x
    const deltaY = e.clientY - lastMousePos.y
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5,
      z: prev.z
    }))
    
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setMouseDown(false)
  }

  const getElementColor = (element: string) => {
    const colors: { [key: string]: string } = {
      'C': '#808080',
      'N': '#3050F8',
      'O': '#FF0D0D',
      'S': '#FFFF30',
      'H': '#FFFFFF'
    }
    return colors[element] || '#CCCCCC'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Flask size={20} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Protein-Faltungs-3D-Viewer</h1>
            <p className="text-muted-foreground">Molekulare Visualisierung und Faltungssimulation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Brain size={12} className="mr-1" />
            DNA-Computing Integration
          </Badge>
          <Badge variant={isSimulationRunning ? "default" : "secondary"}>
            {isSimulationRunning ? 'Simulation läuft' : 'Bereit'}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="viewer">3D-Viewer</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        {/* 3D Viewer Tab */}
        <TabsContent value="viewer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Viewer */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <ThreeDimensions size={20} />
                      <span>3D-Molekülviewer</span>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setZoom(zoom * 1.2)}>
                        <ZoomIn size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setZoom(zoom * 0.8)}>
                        <ZoomOut size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRotation({ x: 0, y: 0, z: 0 })}>
                        <RotateCcw size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    ref={viewerRef}
                    className="w-full h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg relative overflow-hidden cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                          <p>Laden der Proteinstruktur...</p>
                        </div>
                      </div>
                    ) : atoms.length > 0 ? (
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`
                        }}
                      >
                        <svg width="400" height="300" className="overflow-visible">
                          {/* Render bonds first (behind atoms) */}
                          {bonds.map(bond => {
                            const atom1 = atoms.find(a => a.id === bond.atom1)
                            const atom2 = atoms.find(a => a.id === bond.atom2)
                            if (!atom1 || !atom2) return null
                            
                            const x1 = atom1.x * 2 + 200
                            const y1 = atom1.y * 2 + 150
                            const x2 = atom2.x * 2 + 200
                            const y2 = atom2.y * 2 + 150
                            
                            return (
                              <line
                                key={bond.id}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#666"
                                strokeWidth={bond.type === 'double' ? 2 : bond.type === 'triple' ? 3 : 1}
                                opacity={0.6}
                              />
                            )
                          })}
                          
                          {/* Render atoms */}
                          {atoms.slice(0, 500).map(atom => (
                            <circle
                              key={atom.id}
                              cx={atom.x * 2 + 200}
                              cy={atom.y * 2 + 150}
                              r={atom.element === 'H' ? 3 : 6}
                              fill={getElementColor(atom.element)}
                              stroke="#fff"
                              strokeWidth={0.5}
                              className="cursor-pointer hover:stroke-2"
                              onClick={() => {
                                setSelectedAtoms([atom])
                                toast.info(`${atom.element} Atom ausgewählt`)
                              }}
                            />
                          ))}
                        </svg>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Atom size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Wählen Sie ein Protein zum Laden</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Controls overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                      <div>Zoom: {zoom.toFixed(1)}x</div>
                      <div>Rotation: {rotation.y.toFixed(0)}°</div>
                      <div>Atome: {atoms.length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls Panel */}
            <div className="space-y-4">
              {/* Protein Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proteinauswahl</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="protein-select">Protein</Label>
                    <select
                      id="protein-select"
                      className="w-full p-2 border border-input bg-background rounded-md"
                      value={selectedProtein}
                      onChange={(e) => setSelectedProtein(e.target.value)}
                    >
                      <option value="">Protein auswählen...</option>
                      {proteinStructures.map(protein => (
                        <option key={protein.name} value={protein.name}>
                          {protein.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <Button 
                    onClick={() => generateProteinAtoms(selectedProtein)}
                    disabled={!selectedProtein || isLoading}
                    className="w-full"
                  >
                    <RocketLaunch size={16} className="mr-2" />
                    Struktur laden
                  </Button>
                </CardContent>
              </Card>

              {/* Render Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Darstellung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Render-Modus</Label>
                    <select
                      className="w-full p-2 border border-input bg-background rounded-md"
                      value={renderMode}
                      onChange={(e) => setRenderMode(e.target.value)}
                    >
                      <option value="space-filling">Space-Filling</option>
                      <option value="ball-stick">Ball & Stick</option>
                      <option value="wireframe">Wireframe</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Farbschema</Label>
                    <select
                      className="w-full p-2 border border-input bg-background rounded-md"
                      value={colorScheme}
                      onChange={(e) => setColorScheme(e.target.value)}
                    >
                      <option value="element">Nach Element</option>
                      <option value="structure">Nach Struktur</option>
                      <option value="temperature">Temperatur</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Zoom: {zoom.toFixed(1)}x</Label>
                    <Slider
                      value={[zoom]}
                      onValueChange={(value) => setZoom(value[0])}
                      min={0.1}
                      max={3.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Selected Atoms Info */}
              {selectedAtoms.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Atom-Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAtoms.map(atom => (
                      <div key={atom.id} className="space-y-2 p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{atom.element}</span>
                          <div 
                            className="w-4 h-4 rounded-full border border-white"
                            style={{ backgroundColor: getElementColor(atom.element) }}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>X: {atom.x.toFixed(2)}</div>
                          <div>Y: {atom.y.toFixed(2)}</div>
                          <div>Z: {atom.z.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simulation Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightning size={20} />
                  <span>Faltungs-Simulation</span>
                </CardTitle>
                <CardDescription>
                  Starten Sie eine Protein-Faltungs-Simulation mit DNA-Computing-Unterstützung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {simulationState.proteinName && (
                  <Alert>
                    <CheckCircle size={16} />
                    <AlertDescription>
                      Simulation für {simulationState.proteinName} - Status: {simulationState.status}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sim-protein">Protein für Simulation</Label>
                    <select
                      id="sim-protein"
                      className="w-full mt-1 p-2 border border-input bg-background rounded-md"
                      value={selectedProtein}
                      onChange={(e) => setSelectedProtein(e.target.value)}
                    >
                      <option value="">Protein auswählen...</option>
                      {proteinStructures.map(protein => (
                        <option key={protein.name} value={protein.name}>
                          {protein.name} ({protein.aminoAcids} AS)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={startSimulation}
                      disabled={!selectedProtein || isSimulationRunning}
                      className="flex-1"
                    >
                      <Play size={16} className="mr-2" />
                      Simulation starten
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={pauseSimulation}
                      disabled={!isSimulationRunning}
                    >
                      <Pause size={16} />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={resetSimulation}
                    >
                      <RotateCcw size={16} />
                    </Button>
                  </div>
                </div>

                {simulationState.status !== 'paused' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Fortschritt</span>
                      <span>{simulationState.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={simulationState.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Verbleibende Zeit</span>
                      <span>{simulationState.timeRemaining}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Protein Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database size={20} />
                  <span>Protein-Informationen</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProtein ? (
                  <div className="space-y-4">
                    {proteinStructures
                      .filter(p => p.name === selectedProtein)
                      .map(protein => (
                        <div key={protein.name} className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg">{protein.name}</h3>
                            <p className="text-muted-foreground text-sm">{protein.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Aminosäuren:</span>
                                <span className="font-medium">{protein.aminoAcids}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Molekulargewicht:</span>
                                <span className="font-medium">{protein.molecularWeight.toLocaleString()} Da</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Struktur:</span>
                                <span className="font-medium">{protein.structure}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Komplexität:</span>
                                <Badge variant="outline" className="text-xs">
                                  {protein.aminoAcids > 1000 ? 'Hoch' : protein.aminoAcids > 200 ? 'Mittel' : 'Niedrig'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Flask size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Wählen Sie ein Protein für Details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChartLine size={20} />
                  <span>Strukturanalyse</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground py-8">
                    <Graph size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Laden Sie ein Protein für die Analyse</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target size={20} />
                  <span>Bindungsstellen</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground py-8">
                    <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Analyse der aktiven Zentren</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gear size={20} />
                <span>Leistungseinstellungen</span>
              </CardTitle>
              <CardDescription>
                Konfiguration für optimale Visualisierung und Simulation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quality">Renderqualität</Label>
                    <select
                      id="quality"
                      className="w-full mt-1 p-2 border border-input bg-background rounded-md"
                      value={performanceSettings.quality}
                      onChange={(e) => setPerformanceSettings(prev => ({ ...prev, quality: e.target.value }))}
                    >
                      <option value="low">Niedrig</option>
                      <option value="medium">Mittel</option>
                      <option value="high">Hoch</option>
                      <option value="ultra">Ultra</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="particles">Maximale Partikel: {performanceSettings.particleCount}</Label>
                    <Slider
                      value={[performanceSettings.particleCount]}
                      onValueChange={(value) => setPerformanceSettings(prev => ({ ...prev, particleCount: value[0] }))}
                      min={1000}
                      max={50000}
                      step={1000}
                      className="w-full mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="render-distance">Render-Distanz: {performanceSettings.renderDistance}Å</Label>
                    <Slider
                      value={[performanceSettings.renderDistance]}
                      onValueChange={(value) => setPerformanceSettings(prev => ({ ...prev, renderDistance: value[0] }))}
                      min={10}
                      max={500}
                      step={10}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Grafik-Optionen</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={performanceSettings.shadows}
                          onChange={(e) => setPerformanceSettings(prev => ({ ...prev, shadows: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Schatten</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={performanceSettings.reflections}
                          onChange={(e) => setPerformanceSettings(prev => ({ ...prev, reflections: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Reflektionen</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={performanceSettings.antiAliasing}
                          onChange={(e) => setPerformanceSettings(prev => ({ ...prev, antiAliasing: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Anti-Aliasing</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <Alert>
                <GraphicsCard size={16} />
                <AlertDescription>
                  Höhere Qualitätseinstellungen erfordern mehr Rechenleistung. 
                  Reduzieren Sie diese bei Performance-Problemen.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProteinFoldingVisualization