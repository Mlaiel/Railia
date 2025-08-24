import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  Cube,
  Eye, 
  Train,
  Radio,
  Globe,
  Lightning,
  Target,
  Smiley,
  Share,
  Warning,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Users,
  Palette,
  MagnifyingGlass,
  Gear,
  Monitor,
  MapPin,
  ClockClockwise,
  Activity,
  ChatCircle,
  Graph,
  CheckCircle,
  XCircle,
  Broadcast
} from '@phosphor-icons/react'

/**
 * Holographische Displays für 3D-Kommunikation zwischen Zügen
 * 
 * Dieses innovative System ermöglicht dreidimensionale Echtzeit-Kommunikation
 * zwischen Zügen mit Hilfe von holographischen Projektionen, die räumliche
 * Informationen, Statusdaten und Warnsignale visualisieren.
 */

interface HologramData {
  id: string
  trainId: string
  position: { x: number; y: number; z: number }
  type: 'status' | 'warning' | 'communication' | 'navigation'
  content: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  visible: boolean
  targetTrains: string[]
  spatialSize: number
  opacity: number
  color: string
  animation: 'static' | 'pulse' | 'rotate' | 'wave'
}

interface Train3D {
  id: string
  name: string
  position: { x: number; y: number; z: number }
  velocity: { x: number; y: number; z: number }
  status: 'active' | 'standby' | 'maintenance' | 'emergency'
  hologramSupport: boolean
  lastUpdate: string
  route: string
  destination: string
  passengerCount: number
  delay: number
}

interface HolographicChannel {
  id: string
  name: string
  frequency: number
  participants: string[]
  active: boolean
  quality: number
  encryption: boolean
  bandwidth: number
}

const HolographicDisplays = () => {
  const [systemStatus, setSystemStatus] = useKV('holographic-system-status', {
    active: true,
    onlineProjectors: 12,
    totalProjectors: 15,
    networkLatency: 2.3,
    signalQuality: 94.7,
    activeCommunications: 8,
    dataTransfer: 4.8
  })

  const [trains3D, setTrains3D] = useKV<Train3D[]>('holographic-trains', [
    {
      id: 'ICE-001',
      name: 'ICE Berlin-München',
      position: { x: 52.520, y: 13.405, z: 0 },
      velocity: { x: 45.2, y: 0, z: 0 },
      status: 'active',
      hologramSupport: true,
      lastUpdate: new Date().toISOString(),
      route: 'Berlin - München',
      destination: 'München Hbf',
      passengerCount: 487,
      delay: -2
    },
    {
      id: 'ICE-002',
      name: 'ICE Hamburg-Frankfurt',
      position: { x: 53.551, y: 9.993, z: 0 },
      velocity: { x: 38.7, y: -2.1, z: 0 },
      status: 'active',
      hologramSupport: true,
      lastUpdate: new Date().toISOString(),
      route: 'Hamburg - Frankfurt',
      destination: 'Frankfurt Hbf',
      passengerCount: 392,
      delay: 4
    },
    {
      id: 'RE-003',
      name: 'RegionalExpress 301',
      position: { x: 50.110, y: 8.682, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      status: 'standby',
      hologramSupport: true,
      lastUpdate: new Date().toISOString(),
      route: 'Frankfurt - Mainz',
      destination: 'Mainz Hbf',
      passengerCount: 156,
      delay: 0
    }
  ])

  const [holograms, setHolograms] = useKV<HologramData[]>('active-holograms', [
    {
      id: 'holo-001',
      trainId: 'ICE-001',
      position: { x: 52.520, y: 13.405, z: 5.2 },
      type: 'status',
      content: 'Pünktlich • 487 Fahrgäste • Nächster Halt: Leipzig',
      priority: 'medium',
      timestamp: new Date().toISOString(),
      visible: true,
      targetTrains: ['ICE-002', 'RE-003'],
      spatialSize: 2.5,
      opacity: 0.85,
      color: '#4f46e5',
      animation: 'pulse'
    },
    {
      id: 'holo-002',
      trainId: 'ICE-002',
      position: { x: 53.551, y: 9.993, z: 3.8 },
      type: 'warning',
      content: 'Verspätung +4 Min • Gleisarbeiten Abschnitt 47-51',
      priority: 'high',
      timestamp: new Date().toISOString(),
      visible: true,
      targetTrains: ['ICE-001'],
      spatialSize: 3.2,
      opacity: 0.92,
      color: '#f59e0b',
      animation: 'wave'
    }
  ])

  const [channels, setChannels] = useKV<HolographicChannel[]>('holographic-channels', [
    {
      id: 'channel-001',
      name: 'Fernverkehr Nord-Süd',
      frequency: 94.7,
      participants: ['ICE-001', 'ICE-002'],
      active: true,
      quality: 96.4,
      encryption: true,
      bandwidth: 12.8
    },
    {
      id: 'channel-002',
      name: 'Regional Frankfurt',
      frequency: 89.3,
      participants: ['RE-003'],
      active: true,
      quality: 91.7,
      encryption: true,
      bandwidth: 8.4
    }
  ])

  const [selectedTrain, setSelectedTrain] = useState<string>('ICE-001')
  const [projectionMode, setProjectionMode] = useState<'2D' | '3D' | 'AR'>('3D')
  const [displayQuality, setDisplayQuality] = useState(85)
  const [autoRotation, setAutoRotation] = useState(true)
  const [realTimeSync, setRealTimeSync] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulation der holographischen 3D-Visualisierung
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2)
      
      // Hintergrund-Gradient für 3D-Effekt
      const gradient = ctx.createRadialGradient(
        canvas.width / 4, canvas.height / 4, 0,
        canvas.width / 4, canvas.height / 4, Math.min(canvas.width, canvas.height) / 4
      )
      gradient.addColorStop(0, 'rgba(79, 70, 229, 0.1)')
      gradient.addColorStop(1, 'rgba(79, 70, 229, 0.02)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2)

      // Zeichne holographisches Gitter
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.3)'
      ctx.lineWidth = 0.5
      
      for (let i = 0; i < 20; i++) {
        const x = (i / 19) * (canvas.width / 2)
        const y = (i / 19) * (canvas.height / 2)
        
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height / 2)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width / 2, y)
        ctx.stroke()
      }

      // Zeichne Züge als 3D-Hologramme
      trains3D.forEach((train, index) => {
        const x = 50 + index * 120
        const y = 100 + Math.sin(Date.now() * 0.002 + index) * 20
        
        // Hologramm-Effekt
        ctx.shadowBlur = 20
        ctx.shadowColor = train.status === 'active' ? '#4f46e5' : '#6b7280'
        
        // Zug-Körper
        ctx.fillStyle = train.status === 'active' ? 'rgba(79, 70, 229, 0.8)' : 'rgba(107, 114, 128, 0.6)'
        ctx.fillRect(x - 20, y - 8, 40, 16)
        
        // 3D-Effekt
        ctx.fillStyle = train.status === 'active' ? 'rgba(99, 102, 241, 0.6)' : 'rgba(156, 163, 175, 0.4)'
        ctx.fillRect(x - 20, y - 16, 40, 8)
        ctx.fillRect(x + 20, y - 8, 8, 16)
        
        // Hologramm-Informationen
        ctx.shadowBlur = 10
        ctx.fillStyle = '#ffffff'
        ctx.font = '8px Inter'
        ctx.fillText(train.name.split(' ')[0], x - 15, y + 25)
        ctx.fillText(`${train.delay >= 0 ? '+' : ''}${train.delay}min`, x - 10, y + 35)
        
        // Kommunikationslinien zu anderen Zügen
        if (realTimeSync) {
          trains3D.forEach((otherTrain, otherIndex) => {
            if (index !== otherIndex && train.hologramSupport && otherTrain.hologramSupport) {
              const otherX = 50 + otherIndex * 120
              const otherY = 100 + Math.sin(Date.now() * 0.002 + otherIndex) * 20
              
              ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)'
              ctx.lineWidth = 1
              ctx.setLineDash([2, 4])
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(otherX, otherY)
              ctx.stroke()
              ctx.setLineDash([])
            }
          })
        }
      })

      // Zeichne aktive Hologramme
      holograms.filter(h => h.visible).forEach((hologram, index) => {
        const x = 400 + index * 60
        const y = 80 + Math.sin(Date.now() * 0.003 + index * 2) * 15
        
        // Hologramm-Projektion
        ctx.shadowBlur = 15
        ctx.shadowColor = hologram.color
        
        const alpha = hologram.opacity * (0.5 + 0.5 * Math.sin(Date.now() * 0.005))
        ctx.fillStyle = hologram.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(')
        
        if (hologram.type === 'warning') {
          // Warnung als Dreieck
          ctx.beginPath()
          ctx.moveTo(x, y - 15)
          ctx.lineTo(x - 12, y + 10)
          ctx.lineTo(x + 12, y + 10)
          ctx.closePath()
          ctx.fill()
        } else {
          // Status als Kreis
          ctx.beginPath()
          ctx.arc(x, y, 12, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Hologramm-Text
        ctx.shadowBlur = 5
        ctx.fillStyle = '#ffffff'
        ctx.font = '6px Inter'
        const text = hologram.content.substring(0, 20) + '...'
        ctx.fillText(text, x - 30, y + 25)
      })

      ctx.shadowBlur = 0
      requestAnimationFrame(animate)
    }

    animate()
  }, [trains3D, holograms, realTimeSync])

  const createHologram = () => {
    const newHologram: HologramData = {
      id: `holo-${Date.now()}`,
      trainId: selectedTrain,
      position: { x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 10 },
      type: 'communication',
      content: 'Neue 3D-Kommunikation erstellt',
      priority: 'medium',
      timestamp: new Date().toISOString(),
      visible: true,
      targetTrains: trains3D.filter(t => t.id !== selectedTrain).map(t => t.id),
      spatialSize: 2.0,
      opacity: 0.8,
      color: '#22c55e',
      animation: 'rotate'
    }

    setHolograms(prev => [...prev, newHologram])
    toast.success('Hologramm erfolgreich projiziert', {
      description: `3D-Kommunikation von ${selectedTrain} gestartet`
    })
  }

  const toggleHologram = (hologramId: string) => {
    setHolograms(prev => 
      prev.map(h => 
        h.id === hologramId 
          ? { ...h, visible: !h.visible }
          : h
      )
    )
  }

  const updateSystemStatus = () => {
    setSystemStatus(prev => ({
      ...prev,
      networkLatency: 1.8 + Math.random() * 1.0,
      signalQuality: 92 + Math.random() * 6,
      activeCommunications: Math.floor(5 + Math.random() * 8),
      dataTransfer: 3.2 + Math.random() * 4.0,
      lastUpdate: new Date().toISOString()
    }))
  }

  // Auto-Update alle 3 Sekunden
  useEffect(() => {
    const interval = setInterval(updateSystemStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'standby': return 'bg-yellow-500'
      case 'maintenance': return 'bg-blue-500'
      case 'emergency': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-blue-600'
      case 'high': return 'text-orange-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Cube size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Holographische 3D-Displays</h1>
            <p className="text-muted-foreground">Räumliche Echtzeit-Kommunikation zwischen Zügen</p>
          </div>
        </div>
      </div>

      {/* System-Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity size={18} />
                Holographisches System
              </CardTitle>
              <CardDescription>Echtzeit-Status der 3D-Projektoren und Kommunikationskanäle</CardDescription>
            </div>
            <Badge variant={systemStatus.active ? "default" : "destructive"}>
              {systemStatus.active ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Projektoren</span>
                <span className="text-lg font-bold text-primary">
                  {systemStatus.onlineProjectors}/{systemStatus.totalProjectors}
                </span>
              </div>
              <Progress value={(systemStatus.onlineProjectors / systemStatus.totalProjectors) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Signalqualität</span>
                <span className="text-lg font-bold text-green-600">{systemStatus.signalQuality.toFixed(1)}%</span>
              </div>
              <Progress value={systemStatus.signalQuality} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Latenz</span>
                <span className="text-lg font-bold text-blue-600">{systemStatus.networkLatency.toFixed(1)}ms</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.max(0, 100 - systemStatus.networkLatency * 10)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Aktive Komm.</span>
                <span className="text-lg font-bold text-purple-600">{systemStatus.activeCommunications}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {systemStatus.dataTransfer.toFixed(1)} GB/s Transfer
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D-Hologramm-Viewer */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Monitor size={18} />
                  3D-Hologramm-Projektion
                </CardTitle>
                <CardDescription>Live-Visualisierung der räumlichen Zugkommunikation</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{projectionMode}</Badge>
                <Button size="sm" variant="outline" onClick={() => setAutoRotation(!autoRotation)}>
                  {autoRotation ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas 
                ref={canvasRef}
                className="w-full h-64 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border-2 border-indigo-200"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                3D-Hologramm-Raum • {trains3D.length} Züge • {holograms.filter(h => h.visible).length} aktive Projektionen
              </div>
              
              {/* Projektion Controls */}
              <div className="absolute bottom-2 left-2 flex gap-2">
                {['2D', '3D', 'AR'].map((mode) => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={projectionMode === mode ? "default" : "secondary"}
                    onClick={() => setProjectionMode(mode as '2D' | '3D' | 'AR')}
                    className="text-xs"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>

            {/* Display Controls */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Anzeigequalität</label>
                <Slider
                  value={[displayQuality]}
                  onValueChange={(value) => setDisplayQuality(value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">{displayQuality}% Qualität</div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-Rotation</label>
                <Switch
                  checked={autoRotation}
                  onCheckedChange={setAutoRotation}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Echtzeit-Sync</label>
                <Switch
                  checked={realTimeSync}
                  onCheckedChange={setRealTimeSync}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trains" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trains">Züge 3D</TabsTrigger>
          <TabsTrigger value="holograms">Hologramme</TabsTrigger>
          <TabsTrigger value="channels">Kanäle</TabsTrigger>
          <TabsTrigger value="controls">Steuerung</TabsTrigger>
        </TabsList>

        <TabsContent value="trains">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trains3D.map((train) => (
              <Card key={train.id} className={`transition-all cursor-pointer ${selectedTrain === train.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedTrain(train.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(train.status)}`} />
                      <CardTitle className="text-base">{train.name}</CardTitle>
                    </div>
                    <Badge variant={train.hologramSupport ? "default" : "secondary"}>
                      {train.hologramSupport ? <Cube size={12} /> : <XCircle size={12} />}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Route:</span>
                      <div className="font-medium">{train.route}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Verspätung:</span>
                      <div className={`font-medium ${train.delay > 0 ? 'text-red-600' : train.delay < 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {train.delay > 0 ? '+' : ''}{train.delay} Min
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fahrgäste:</span>
                      <div className="font-medium">{train.passengerCount}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Geschw.:</span>
                      <div className="font-medium">{Math.sqrt(train.velocity.x ** 2 + train.velocity.y ** 2).toFixed(1)} km/h</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {train.position.x.toFixed(3)}, {train.position.y.toFixed(3)}
                    </span>
                  </div>

                  {train.hologramSupport && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">3D-Hologramm verfügbar</span>
                        <CheckCircle size={14} className="text-green-600" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="holograms">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Aktive Hologramme</h3>
              <Button onClick={createHologram} className="flex items-center gap-2">
                <Cube size={16} />
                Hologramm erstellen
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {holograms.map((hologram) => (
                <Card key={hologram.id} className={`transition-all ${hologram.visible ? 'border-primary/50' : 'opacity-60'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: hologram.color }}
                        />
                        <CardTitle className="text-base capitalize">{hologram.type}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getPriorityColor(hologram.priority)}>
                          {hologram.priority}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleHologram(hologram.id)}
                        >
                          {hologram.visible ? <Eye size={14} /> : <Eye size={14} className="opacity-50" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Inhalt:</span>
                      <div className="font-medium mt-1">{hologram.content}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Von Zug:</span>
                        <div className="font-medium">{hologram.trainId}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Animation:</span>
                        <div className="font-medium capitalize">{hologram.animation}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Größe:</span>
                        <div className="font-medium">{hologram.spatialSize}m</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sichtbarkeit:</span>
                        <div className="font-medium">{Math.round(hologram.opacity * 100)}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Ziel: {hologram.targetTrains.length} Züge
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ClockClockwise size={12} />
                      {new Date(hologram.timestamp).toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="channels">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Holographische Kommunikationskanäle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {channels.map((channel) => (
                <Card key={channel.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Radio size={18} />
                        {channel.name}
                      </CardTitle>
                      <Badge variant={channel.active ? "default" : "secondary"}>
                        {channel.active ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Frequenz</span>
                        <div className="text-lg font-bold text-primary">{channel.frequency} MHz</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Qualität</span>
                        <div className="text-lg font-bold text-green-600">{channel.quality.toFixed(1)}%</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Bandbreite</span>
                        <span className="text-sm font-medium">{channel.bandwidth} Mbit/s</span>
                      </div>
                      <Progress value={(channel.bandwidth / 20) * 100} className="h-2" />
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Teilnehmer ({channel.participants.length})</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {channel.participants.map((trainId) => (
                          <Badge key={trainId} variant="outline" className="text-xs">
                            {trainId}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        {channel.encryption && <CheckCircle size={14} className="text-green-600" />}
                        <span className="text-xs text-muted-foreground">
                          {channel.encryption ? 'Verschlüsselt' : 'Unverschlüsselt'}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Gear size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="controls">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projektionssteuerung</CardTitle>
                <CardDescription>Globale Einstellungen für holographische Displays</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Globale Helligkeit</label>
                      <Slider
                        defaultValue={[75]}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Projektions-Reichweite</label>
                      <Slider
                        defaultValue={[50]}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Animationsgeschwindigkeit</label>
                      <Slider
                        defaultValue={[60]}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Energiesparmodus</label>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Automatische Skalierung</label>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Kollisionserkennung</label>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Notfall-Override</label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Target size={16} />
                      Kalibrieren
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Broadcast size={16} />
                      Test-Projektion
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <StopCircle size={16} />
                      Alle stoppen
                    </Button>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Warning size={16} />
                      Notfall-Shutdown
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Cube size={16} />
              <AlertDescription>
                <strong>Hinweis:</strong> Holographische 3D-Displays ermöglichen räumliche Kommunikation zwischen Zügen 
                in Echtzeit. Das System projiziert wichtige Informationen, Warnungen und Statusdaten als dreidimensionale 
                Hologramme, die von anderen Zügen in der Nähe gesehen und interpretiert werden können.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HolographicDisplays