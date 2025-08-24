import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Cube,
  Eye,
  Target,
  Pulse,
  Activity,
  Globe,
  Crosshair,
  Radar,
  Network,
  Shield,
  AlertTriangle,
  Timer,
  Database,
  Cpu,
  Settings,
  Download,
  PlayCircle,
  PauseCircle
} from '@phosphor-icons/react'

interface PointCloudData {
  id: string
  timestamp: string
  sensorId: string
  pointCount: number
  boundingBox: {
    minX: number
    maxX: number
    minY: number
    maxY: number
    minZ: number
    maxZ: number
  }
  intensity: {
    min: number
    max: number
    average: number
  }
  classification: {
    ground: number
    vegetation: number
    infrastructure: number
    vehicles: number
    obstacles: number
    unknown: number
  }
  processingTime: number
  compressionRatio: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
}

interface LiDARVisualization {
  id: string
  name: string
  type: '3d-pointcloud' | 'depth-map' | 'intensity-map' | 'classification-map'
  renderMode: 'points' | 'mesh' | 'voxels' | 'surface'
  colorScheme: 'height' | 'intensity' | 'classification' | 'distance'
  isActive: boolean
  resolution: number
  frameRate: number
  viewDistance: number
}

export default function LiDARPointCloudViewer() {
  const [pointCloudData, setPointCloudData] = useKV<PointCloudData[]>('pointcloud-data', [])
  const [visualizations, setVisualizations] = useKV<LiDARVisualization[]>('lidar-visualizations', [])
  const [viewerStats, setViewerStats] = useKV('pointcloud-viewer-stats', {
    totalPoints: 3247891,
    framesPerSecond: 20,
    renderTime: 16.7,
    memoryUsage: 847.2,
    gpuUtilization: 76,
    compressionRatio: 8.3
  })

  const [selectedVisualization, setSelectedVisualization] = useState<string>('3d-pointcloud')
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedPointCloud, setSelectedPointCloud] = useState<string | null>(null)
  const [viewerMode, setViewerMode] = useState<'realtime' | 'historical'>('realtime')

  useEffect(() => {
    if (pointCloudData.length === 0) {
      const mockData: PointCloudData[] = [
        {
          id: 'PC001',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          sensorId: 'LIDAR001',
          pointCount: 1247891,
          boundingBox: {
            minX: -500, maxX: 500,
            minY: -300, maxY: 300,
            minZ: 0, maxZ: 50
          },
          intensity: {
            min: 12,
            max: 255,
            average: 134
          },
          classification: {
            ground: 456789,
            vegetation: 234567,
            infrastructure: 123456,
            vehicles: 45678,
            obstacles: 12345,
            unknown: 375056
          },
          processingTime: 23.4,
          compressionRatio: 7.8,
          quality: 'excellent'
        },
        {
          id: 'PC002',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          sensorId: 'LIDAR002',
          pointCount: 2156734,
          boundingBox: {
            minX: -750, maxX: 750,
            minY: -450, maxY: 450,
            minZ: -20, maxZ: 120
          },
          intensity: {
            min: 8,
            max: 248,
            average: 127
          },
          classification: {
            ground: 687234,
            vegetation: 456789,
            infrastructure: 234567,
            vehicles: 67890,
            obstacles: 23456,
            unknown: 686798
          },
          processingTime: 45.6,
          compressionRatio: 9.2,
          quality: 'good'
        },
        {
          id: 'PC003',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          sensorId: 'LIDAR003',
          pointCount: 843267,
          boundingBox: {
            minX: -400, maxX: 400,
            minY: -250, maxY: 250,
            minZ: 5, maxZ: 35
          },
          intensity: {
            min: 15,
            max: 242,
            average: 142
          },
          classification: {
            ground: 367891,
            vegetation: 198765,
            infrastructure: 156789,
            vehicles: 34567,
            obstacles: 8945,
            unknown: 76310
          },
          processingTime: 18.9,
          compressionRatio: 6.7,
          quality: 'excellent'
        }
      ]
      setPointCloudData(mockData)
    }

    if (visualizations.length === 0) {
      const mockVisualizations: LiDARVisualization[] = [
        {
          id: 'VIZ001',
          name: '3D-Punktwolke (Höhe)',
          type: '3d-pointcloud',
          renderMode: 'points',
          colorScheme: 'height',
          isActive: true,
          resolution: 1024,
          frameRate: 20,
          viewDistance: 1000
        },
        {
          id: 'VIZ002',
          name: 'Intensitätskarte',
          type: 'intensity-map',
          renderMode: 'surface',
          colorScheme: 'intensity',
          isActive: false,
          resolution: 512,
          frameRate: 15,
          viewDistance: 500
        },
        {
          id: 'VIZ003',
          name: 'Klassifikationsansicht',
          type: 'classification-map',
          renderMode: 'voxels',
          colorScheme: 'classification',
          isActive: false,
          resolution: 256,
          frameRate: 30,
          viewDistance: 750
        },
        {
          id: 'VIZ004',
          name: 'Tiefenkarte',
          type: 'depth-map',
          renderMode: 'mesh',
          colorScheme: 'distance',
          isActive: false,
          resolution: 2048,
          frameRate: 10,
          viewDistance: 1500
        }
      ]
      setVisualizations(mockVisualizations)
    }
  }, [pointCloudData, setPointCloudData, visualizations, setVisualizations])

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getClassificationColor = (type: string) => {
    switch (type) {
      case 'ground': return 'bg-amber-100 text-amber-800'
      case 'vegetation': return 'bg-green-100 text-green-800'
      case 'infrastructure': return 'bg-blue-100 text-blue-800'
      case 'vehicles': return 'bg-purple-100 text-purple-800'
      case 'obstacles': return 'bg-red-100 text-red-800'
      case 'unknown': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Viewer Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>LiDAR-Punktwolken 3D-Viewer</CardTitle>
              <CardDescription>Hochauflösende 3D-Visualisierung von LiDAR-Sensordaten</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2"
              >
                {isPlaying ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                {isPlaying ? 'Pausieren' : 'Abspielen'}
              </Button>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-2" />
                Einstellungen
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 3D Viewer Interface */}
          <div className="h-96 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-lg relative overflow-hidden border">
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* Viewer Controls Overlay */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge variant="default" className="bg-black/70 backdrop-blur">
                <Cube size={12} className="mr-1" />
                3D-Ansicht
              </Badge>
              <Badge variant="outline" className="bg-black/70 backdrop-blur text-white border-white/30">
                <Pulse size={12} className="mr-1" />
                {viewerStats.framesPerSecond} FPS
              </Badge>
              <Badge variant="outline" className="bg-black/70 backdrop-blur text-white border-white/30">
                <Database size={12} className="mr-1" />
                {(viewerStats.totalPoints / 1000000).toFixed(1)}M Punkte
              </Badge>
            </div>

            {/* Performance Stats */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-black/70 backdrop-blur rounded p-2 text-white text-xs space-y-1">
                <div>Render-Zeit: {viewerStats.renderTime}ms</div>
                <div>GPU: {viewerStats.gpuUtilization}%</div>
                <div>Speicher: {viewerStats.memoryUsage}MB</div>
                <div>Kompression: {viewerStats.compressionRatio}:1</div>
              </div>
            </div>

            {/* Simulated 3D Point Cloud */}
            <div className="absolute inset-4 flex items-center justify-center">
              <div className="relative">
                {/* Simulated point cloud visualization */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full animate-pulse ${
                      i % 4 === 0 ? 'bg-red-400' :
                      i % 4 === 1 ? 'bg-green-400' :
                      i % 4 === 2 ? 'bg-blue-400' : 'bg-yellow-400'
                    }`}
                    style={{
                      left: `${Math.random() * 300}px`,
                      top: `${Math.random() * 200}px`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
                
                {/* Central viewing area indicator */}
                <div className="w-64 h-32 border-2 border-white/30 rounded-lg flex items-center justify-center">
                  <div className="text-white text-sm text-center">
                    <Crosshair size={24} className="mx-auto mb-2 opacity-50" />
                    <div>Live 3D-Punktwolke</div>
                    <div className="text-xs opacity-70">{viewerStats.totalPoints.toLocaleString()} Punkte</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visualization Mode Selector */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 backdrop-blur rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Visualisierungsmodus</span>
                  <div className="flex items-center gap-2 text-white text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live-Erfassung</span>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {visualizations.map(viz => (
                    <Button
                      key={viz.id}
                      variant={selectedVisualization === viz.type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVisualization(viz.type)}
                      className="text-xs whitespace-nowrap"
                    >
                      {viz.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Point Cloud Data Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Point Clouds */}
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Punktwolken</CardTitle>
            <CardDescription>Live-Daten von LiDAR-Sensoren</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pointCloudData.map(cloud => (
                <div 
                  key={cloud.id} 
                  className={`p-4 border rounded-lg space-y-3 cursor-pointer transition-colors ${
                    selectedPointCloud === cloud.id ? 'border-primary bg-primary/5' : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => setSelectedPointCloud(cloud.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Radar size={20} className="text-purple-600" />
                      <div>
                        <h4 className="font-medium">{cloud.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          Sensor: {cloud.sensorId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getQualityColor(cloud.quality)} variant="outline">
                        {cloud.quality}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {(cloud.pointCount / 1000000).toFixed(1)}M Punkte
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Verarbeitung:</p>
                      <p className="font-medium">{cloud.processingTime}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kompression:</p>
                      <p className="font-medium">{cloud.compressionRatio}:1</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Intensität Ø:</p>
                      <p className="font-medium">{cloud.intensity.average}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Zeitstempel:</p>
                      <p className="font-medium">{new Date(cloud.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Klassifikation:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(cloud.classification).map(([type, count]) => (
                        <Badge key={type} className={`text-xs ${getClassificationColor(type)}`}>
                          {type}: {(count / 1000).toFixed(0)}k
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Eye size={14} className="mr-1" />
                      Ansicht
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download size={14} className="mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visualization Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Visualisierungs-Einstellungen</CardTitle>
            <CardDescription>Render-Modi und Darstellungsoptionen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visualizations.map(viz => (
                <div key={viz.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${viz.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h4 className="font-medium">{viz.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {viz.renderMode} • {viz.colorScheme}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={viz.isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const updated = visualizations.map(v => ({
                          ...v,
                          isActive: v.id === viz.id ? !v.isActive : v.isActive
                        }))
                        setVisualizations(updated)
                      }}
                    >
                      {viz.isActive ? 'Aktiv' : 'Aktivieren'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Auflösung:</p>
                      <p className="font-medium">{viz.resolution}px</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Frame-Rate:</p>
                      <p className="font-medium">{viz.frameRate} FPS</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sichtweite:</p>
                      <p className="font-medium">{viz.viewDistance}m</p>
                    </div>
                  </div>

                  {viz.isActive && (
                    <div className="pt-2 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Target size={14} className="mr-1" />
                          Konfigurieren
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye size={14} className="mr-1" />
                          Vollbild
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Viewer-Performance</CardTitle>
          <CardDescription>Rendering- und Systemleistung</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Frame-Rate</span>
                <span className="text-lg font-bold text-green-600">{viewerStats.framesPerSecond} FPS</span>
              </div>
              <Progress value={(viewerStats.framesPerSecond / 30) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">Ziel: 30 FPS</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Render-Zeit</span>
                <span className="text-lg font-bold text-blue-600">{viewerStats.renderTime}ms</span>
              </div>
              <Progress value={100 - (viewerStats.renderTime / 33.3) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">Max: 33ms</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">GPU-Auslastung</span>
                <span className="text-lg font-bold text-purple-600">{viewerStats.gpuUtilization}%</span>
              </div>
              <Progress value={viewerStats.gpuUtilization} className="h-2" />
              <p className="text-xs text-muted-foreground">Optimal: &lt;80%</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Speicher</span>
                <span className="text-lg font-bold text-orange-600">{viewerStats.memoryUsage}MB</span>
              </div>
              <Progress value={(viewerStats.memoryUsage / 2048) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">Limit: 2GB</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Kompression</span>
                <span className="text-lg font-bold text-cyan-600">{viewerStats.compressionRatio}:1</span>
              </div>
              <Progress value={(viewerStats.compressionRatio / 10) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">Effizient: &gt;5:1</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Punkte gesamt</span>
                <span className="text-lg font-bold text-indigo-600">{(viewerStats.totalPoints / 1000000).toFixed(1)}M</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">Live-Erfassung</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}