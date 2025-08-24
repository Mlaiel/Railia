import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Cube, 
  Eye, 
  Lightning, 
  CloudRain, 
  Mountain, 
  Radar,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  RotateClockwise,
  ThermometerSimple,
  Wind,
  Layers,
  Satellite,
  Activity,
  Target,
  Map,
  Settings
} from '@phosphor-icons/react'

interface LidarElevationData {
  id: string
  latitude: number
  longitude: number
  elevation: number
  accuracy: number
  timestamp: string
  source: 'satellite' | 'ground' | 'aerial'
  pointDensity: number
  surfaceType: 'vegetation' | 'building' | 'ground' | 'water' | 'infrastructure'
  reflectanceIntensity: number
  errorMargin: number
}

interface SatelliteLidarMission {
  id: string
  satelliteName: string
  altitude: number
  scanPattern: 'linear' | 'grid' | 'spiral'
  beamWidth: number
  pulseRate: number
  coverage: {
    northEast: { lat: number; lon: number }
    southWest: { lat: number; lon: number }
  }
  status: 'active' | 'planned' | 'completed' | 'failed'
  dataQuality: number
}

interface WeatherLayer {
  id: string
  type: 'temperature' | 'precipitation' | 'wind' | 'pressure' | 'clouds' | 'visibility' | 'turbulence'
  altitude: number
  data: number[][]
  intensity: number
  opacity: number
  color: string
  thickness: number
  animationSpeed: number
  interpolationMethod: 'linear' | 'cubic' | 'kriging'
}

interface TerrainMesh {
  vertices: Float32Array
  indices: Uint32Array
  normals: Float32Array
  textureCoords: Float32Array
  resolution: number
  bounds: {
    minX: number
    maxX: number
    minY: number
    maxY: number
    minZ: number
    maxZ: number
  }
}

interface Weather3DPoint {
  x: number
  y: number
  z: number
  temperature: number
  humidity: number
  windSpeed: number
  pressure: number
  precipitation: number
}

export default function Weather3DVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  const [lidarData, setLidarData] = useKV<LidarElevationData[]>('lidar-elevation-data', [])
  const [satelliteMissions, setSatelliteMissions] = useKV<SatelliteLidarMission[]>('satellite-missions', [])
  const [terrainMesh, setTerrainMesh] = useKV<TerrainMesh | null>('terrain-mesh', null)
  const [weatherLayers, setWeatherLayers] = useKV<WeatherLayer[]>('weather-3d-layers', [])
  const [visualization3D, setVisualization3D] = useKV('weather-3d-viz', {
    isActive: false,
    viewAngle: { x: 45, y: 0, z: 0 },
    zoom: 1.0,
    selectedAltitude: 1000,
    animationSpeed: 1.0,
    renderMode: 'realistic',
    dataResolution: 'high',
    enableTerrainShading: true,
    enableVolumetricClouds: true,
    enableParticleEffects: true
  })

  const [viewControls, setViewControls] = useState({
    rotation: { x: 0, y: 0, z: 0 },
    translation: { x: 0, y: 0, z: 0 },
    zoom: 1.0,
    isAnimating: false,
    showGrid: true,
    showLabels: true,
    enableLighting: true,
    showSatellitePaths: true,
    terrainExaggeration: 2.0
  })

  const [lidarSettings, setLidarSettings] = useState({
    dataSource: 'satellite',
    accuracy: 'high',
    updateInterval: 300000, // 5 minutes
    filterThreshold: 0.95,
    interpolationMethod: 'kriging',
    pointCloudDensity: 'adaptive',
    elevationSmoothing: 0.3,
    surfaceClassification: true
  })

  const [renderingStatus] = useKV('3d-rendering-status', {
    isProcessing: false,
    progress: 0,
    qualityLevel: 'high',
    frameRate: 60,
    memoryUsage: 45,
    lastUpdate: new Date().toISOString(),
    activeSatellites: 3,
    dataPoints: 0,
    renderingTime: 16.7,
    gpuUtilization: 75
  })

  // Simuliere Satelliten-Lidar-Missionen
  useEffect(() => {
    const generateSatelliteMissions = () => {
      const missions: SatelliteLidarMission[] = [
        {
          id: 'sentinel-3a',
          satelliteName: 'Sentinel-3A',
          altitude: 814000, // 814 km
          scanPattern: 'linear',
          beamWidth: 0.3,
          pulseRate: 20000,
          coverage: {
            northEast: { lat: 55.0, lon: 15.0 },
            southWest: { lat: 47.0, lon: 6.0 }
          },
          status: 'active',
          dataQuality: 0.97
        },
        {
          id: 'icesat-2',
          satelliteName: 'ICESat-2',
          altitude: 496000, // 496 km
          scanPattern: 'grid',
          beamWidth: 0.17,
          pulseRate: 10000,
          coverage: {
            northEast: { lat: 54.0, lon: 14.0 },
            southWest: { lat: 48.0, lon: 7.0 }
          },
          status: 'active',
          dataQuality: 0.95
        },
        {
          id: 'gedi',
          satelliteName: 'GEDI',
          altitude: 408000, // 408 km
          scanPattern: 'spiral',
          beamWidth: 0.25,
          pulseRate: 242,
          coverage: {
            northEast: { lat: 52.0, lon: 13.0 },
            southWest: { lat: 49.0, lon: 8.0 }
          },
          status: 'planned',
          dataQuality: 0.93
        }
      ]
      
      setSatelliteMissions(missions)
    }

    generateSatelliteMissions()
    const interval = setInterval(generateSatelliteMissions, 600000) // 10 minutes
    return () => clearInterval(interval)
  }, [setSatelliteMissions])

  // Erweiterte Lidar-Datengenerierung mit realistischen Satellitenparametern
  useEffect(() => {
    const generateAdvancedLidarData = () => {
      const newData: LidarElevationData[] = []
      
      // Generiere hochauflösende Höhendaten für deutsche Bahnstrecken
      for (let lat = 47.0; lat <= 55.0; lat += 0.001) { // 100m Auflösung
        for (let lon = 6.0; lon <= 15.0; lon += 0.001) {
          // Simuliere realistische Topographie
          const baseElevation = Math.sin(lat * 0.1) * 500 + Math.cos(lon * 0.1) * 300
          const terrain = Math.random() * 200 - 100
          const elevation = Math.max(0, baseElevation + terrain)
          
          // Oberflächenklassifikation basierend auf Höhe und Kontext
          let surfaceType: LidarElevationData['surfaceType'] = 'ground'
          if (elevation > 800) surfaceType = 'vegetation'
          else if (Math.random() > 0.95) surfaceType = 'building'
          else if (elevation < 50 && Math.random() > 0.8) surfaceType = 'water'
          else if (Math.random() > 0.98) surfaceType = 'infrastructure'
          
          // Simuliere verschiedene Satellitenquellen
          const satelliteIndex = Math.floor(Math.random() * satelliteMissions.length)
          const satellite = satelliteMissions[satelliteIndex]
          const accuracy = satellite ? satellite.dataQuality : 0.95
          
          newData.push({
            id: `lidar-${lat.toFixed(3)}-${lon.toFixed(3)}`,
            latitude: lat,
            longitude: lon,
            elevation: elevation,
            accuracy: accuracy + Math.random() * 0.05,
            timestamp: new Date().toISOString(),
            source: Math.random() > 0.85 ? 'satellite' : 'aerial',
            pointDensity: Math.random() * 100 + 50, // Punkte pro m²
            surfaceType: surfaceType,
            reflectanceIntensity: Math.random() * 255,
            errorMargin: (1 - accuracy) * 10
          })
        }
      }
      
      // Begrenze Datenmenge für Performance (adaptive Sampling)
      const sampledData = newData.filter((_, index) => {
        const sampleRate = lidarSettings.pointCloudDensity === 'high' ? 1 : 
                          lidarSettings.pointCloudDensity === 'medium' ? 5 : 10
        return index % sampleRate === 0
      }).slice(0, 5000)
      
      setLidarData(sampledData)
      
      // Generiere Terrain-Mesh aus Lidar-Daten
      generateTerrainMesh(sampledData)
    }

    generateAdvancedLidarData()
    const interval = setInterval(generateAdvancedLidarData, lidarSettings.updateInterval)
    return () => clearInterval(interval)
  }, [lidarSettings.updateInterval, lidarSettings.pointCloudDensity, satelliteMissions, setLidarData])

  // Generiere optimiertes Terrain-Mesh
  const generateTerrainMesh = (data: LidarElevationData[]) => {
    if (data.length === 0) return

    const resolution = 64 // Mesh-Auflösung
    const vertices = new Float32Array(resolution * resolution * 3)
    const indices = new Uint32Array((resolution - 1) * (resolution - 1) * 6)
    const normals = new Float32Array(resolution * resolution * 3)
    const textureCoords = new Float32Array(resolution * resolution * 2)

    // Finde Datenbereich
    const minLat = Math.min(...data.map(p => p.latitude))
    const maxLat = Math.max(...data.map(p => p.latitude))
    const minLon = Math.min(...data.map(p => p.longitude))
    const maxLon = Math.max(...data.map(p => p.longitude))
    const minElev = Math.min(...data.map(p => p.elevation))
    const maxElev = Math.max(...data.map(p => p.elevation))

    // Generiere Vertices
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const lat = minLat + (maxLat - minLat) * (i / (resolution - 1))
        const lon = minLon + (maxLon - minLon) * (j / (resolution - 1))
        
        // Finde nächsten Datenpunkt oder interpoliere
        const nearestPoint = data.reduce((closest, point) => {
          const distance = Math.sqrt(
            Math.pow(point.latitude - lat, 2) + 
            Math.pow(point.longitude - lon, 2)
          )
          return distance < closest.distance ? { point, distance } : closest
        }, { point: data[0], distance: Infinity })

        const index = i * resolution + j
        vertices[index * 3] = (lon - minLon) / (maxLon - minLon) * 10 - 5     // x
        vertices[index * 3 + 1] = (nearestPoint.point.elevation - minElev) / (maxElev - minElev) * 2 // y (höhe)
        vertices[index * 3 + 2] = (lat - minLat) / (maxLat - minLat) * 10 - 5 // z
        
        // Texturkoordinaten
        textureCoords[index * 2] = j / (resolution - 1)
        textureCoords[index * 2 + 1] = i / (resolution - 1)
      }
    }

    // Generiere Indices für Dreiecke
    let indexCount = 0
    for (let i = 0; i < resolution - 1; i++) {
      for (let j = 0; j < resolution - 1; j++) {
        const topLeft = i * resolution + j
        const topRight = topLeft + 1
        const bottomLeft = (i + 1) * resolution + j
        const bottomRight = bottomLeft + 1

        // Erstes Dreieck
        indices[indexCount++] = topLeft
        indices[indexCount++] = bottomLeft
        indices[indexCount++] = topRight

        // Zweites Dreieck
        indices[indexCount++] = topRight
        indices[indexCount++] = bottomLeft
        indices[indexCount++] = bottomRight
      }
    }

    // Berechne Normalen für Beleuchtung
    for (let i = 0; i < resolution * resolution; i++) {
      normals[i * 3] = 0     // x
      normals[i * 3 + 1] = 1 // y (nach oben)
      normals[i * 3 + 2] = 0 // z
    }

    const mesh: TerrainMesh = {
      vertices,
      indices,
      normals,
      textureCoords,
      resolution,
      bounds: {
        minX: minLon,
        maxX: maxLon,
        minY: minElev,
        maxY: maxElev,
        minZ: minLat,
        maxZ: maxLat
      }
    }

    setTerrainMesh(mesh)
  }

  // Erweiterte 3D-Wetterschichten generieren
  useEffect(() => {
    const generateAdvancedWeatherLayers = () => {
      const layers: WeatherLayer[] = [
        {
          id: 'surface-temp',
          type: 'temperature',
          altitude: 0,
          data: generateLayerData('temperature'),
          intensity: 0.8,
          opacity: 0.7,
          color: '#ff6b6b',
          thickness: 100,
          animationSpeed: 1.0,
          interpolationMethod: 'cubic'
        },
        {
          id: 'low-clouds',
          type: 'clouds',
          altitude: 1500,
          data: generateLayerData('clouds'),
          intensity: 0.6,
          opacity: 0.5,
          color: '#74c0fc',
          thickness: 500,
          animationSpeed: 0.8,
          interpolationMethod: 'linear'
        },
        {
          id: 'mid-precipitation',
          type: 'precipitation',
          altitude: 3000,
          data: generateLayerData('precipitation'),
          intensity: 0.9,
          opacity: 0.8,
          color: '#4dabf7',
          thickness: 1000,
          animationSpeed: 1.5,
          interpolationMethod: 'kriging'
        },
        {
          id: 'high-wind',
          type: 'wind',
          altitude: 5000,
          data: generateLayerData('wind'),
          intensity: 0.7,
          opacity: 0.6,
          color: '#51cf66',
          thickness: 800,
          animationSpeed: 2.0,
          interpolationMethod: 'linear'
        },
        {
          id: 'visibility-layer',
          type: 'visibility',
          altitude: 500,
          data: generateLayerData('visibility'),
          intensity: 0.5,
          opacity: 0.4,
          color: '#ffd43b',
          thickness: 300,
          animationSpeed: 0.5,
          interpolationMethod: 'cubic'
        },
        {
          id: 'turbulence-layer',
          type: 'turbulence',
          altitude: 2000,
          data: generateLayerData('turbulence'),
          intensity: 0.3,
          opacity: 0.3,
          color: '#f783ac',
          thickness: 600,
          animationSpeed: 3.0,
          interpolationMethod: 'linear'
        }
      ]
      
      setWeatherLayers(layers)
    }

    generateAdvancedWeatherLayers()
    const interval = setInterval(generateAdvancedWeatherLayers, 120000) // 2 minutes
    return () => clearInterval(interval)
  }, [setWeatherLayers])

  const generateLayerData = (type: string): number[][] => {
    const data: number[][] = []
    const size = visualization3D.dataResolution === 'high' ? 80 : 
                 visualization3D.dataResolution === 'medium' ? 50 : 30
    
    for (let i = 0; i < size; i++) {
      data[i] = []
      for (let j = 0; j < size; j++) {
        const time = Date.now() / 1000
        const spatialFreq = 0.1
        const temporalFreq = 0.001
        
        switch (type) {
          case 'temperature':
            // Realistische Temperaturverteilung mit Tag/Nacht-Zyklus
            const baseTemp = 15 + Math.sin(time * temporalFreq) * 8
            const terrainInfluence = Math.sin(i * spatialFreq) * 5
            const coastalEffect = Math.cos(j * spatialFreq) * 3
            data[i][j] = baseTemp + terrainInfluence + coastalEffect
            break
            
          case 'precipitation':
            // Niederschlag mit Wetterfront-Simulation
            const frontPosition = (time * temporalFreq * 10) % size
            const distance = Math.abs(i - frontPosition)
            const intensity = Math.max(0, 20 - distance * 2)
            data[i][j] = intensity * (Math.random() * 0.5 + 0.5)
            break
            
          case 'wind':
            // Windgeschwindigkeit mit Höhenabhängigkeit
            const altitude = 5000 // Beispielhöhe für diese Schicht
            const baseWind = Math.sqrt(altitude / 1000) * 10
            const turbulence = Math.sin(i * 0.3 + time * 0.01) * Math.cos(j * 0.3) * 20
            data[i][j] = Math.max(0, baseWind + turbulence)
            break
            
          case 'clouds':
            // Wolkenbedeckung mit realistischen Mustern
            const cloudiness = (Math.sin(i * 0.15 + time * 0.005) + 
                              Math.cos(j * 0.12 + time * 0.003)) * 30 + 40
            data[i][j] = Math.max(0, Math.min(100, cloudiness + Math.random() * 20 - 10))
            break
            
          case 'visibility':
            // Sichtweite abhängig von Wetter und Höhe
            const baseVisibility = 80
            const weatherReduction = Math.max(0, (data[i] && data[i][j]) || 0) * 0.5
            data[i][j] = Math.max(10, baseVisibility - weatherReduction + Math.random() * 10)
            break
            
          case 'turbulence':
            // Atmosphärische Turbulenz
            const terrainRoughness = Math.abs(Math.sin(i * 0.2) * Math.cos(j * 0.2)) * 50
            const thermalActivity = Math.sin(time * 0.01 + i * 0.1) * 20
            data[i][j] = Math.max(0, terrainRoughness + thermalActivity)
            break
            
          default:
            data[i][j] = Math.random() * 100
        }
      }
    }
    
    return data
  }

  // Erweiterte 3D-Rendering-Engine
  useEffect(() => {
    if (!canvasRef.current || !visualization3D.isActive) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render3DScene = () => {
      // Canvas löschen
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Erweiterte Hintergrund-Gradients basierend auf Tageszeit
      const time = new Date().getHours()
      let skyGradient: CanvasGradient
      
      if (time >= 6 && time <= 18) {
        // Tageshimmel
        skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        skyGradient.addColorStop(0, '#87CEEB')
        skyGradient.addColorStop(0.7, '#E0F6FF')
        skyGradient.addColorStop(1, '#f0f8ff')
      } else {
        // Nachthimmel
        skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        skyGradient.addColorStop(0, '#191970')
        skyGradient.addColorStop(0.7, '#483D8B')
        skyGradient.addColorStop(1, '#2F2F4F')
      }
      
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Rendereihenfolge: Terrain -> Wetter -> UI-Elemente
      if (terrainMesh && visualization3D.enableTerrainShading) {
        renderAdvancedTerrain(ctx, canvas.width, canvas.height)
      } else {
        renderElevationSurface(ctx, canvas.width, canvas.height)
      }
      
      // Wetterschichten mit verbessertem Rendering
      weatherLayers.forEach(layer => {
        if (layer.altitude <= visualization3D.selectedAltitude + 1000) {
          renderAdvancedWeatherLayer(ctx, layer, canvas.width, canvas.height)
        }
      })

      // Satellitenbahnen anzeigen
      if (viewControls.showSatellitePaths) {
        renderSatellitePaths(ctx, canvas.width, canvas.height)
      }

      // Partikeleffekte für Wetter
      if (visualization3D.enableParticleEffects) {
        renderParticleEffects(ctx, canvas.width, canvas.height)
      }

      // Grid und Labels mit verbesserter Darstellung
      if (viewControls.showGrid) {
        renderAdvancedGrid(ctx, canvas.width, canvas.height)
      }
      
      if (viewControls.showLabels) {
        renderAdvancedLabels(ctx, canvas.width, canvas.height)
      }

      // 3D-Beleuchtung simulieren
      if (viewControls.enableLighting) {
        renderLighting(ctx, canvas.width, canvas.height)
      }

      if (viewControls.isAnimating) {
        // Smooth rotation animation
        setViewControls(prev => ({
          ...prev,
          rotation: {
            ...prev.rotation,
            y: (prev.rotation.y + visualization3D.animationSpeed) % 360
          }
        }))
        
        animationRef.current = requestAnimationFrame(render3DScene)
      }
    }

    render3DScene()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [visualization3D.isActive, weatherLayers, viewControls, lidarData, terrainMesh, satelliteMissions, visualization3D])

  const renderAdvancedTerrain = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!terrainMesh) return

    const { vertices, resolution } = terrainMesh
    const cellWidth = width / resolution
    const cellHeight = height / resolution

    // Erweiterte Terrain-Darstellung mit Schattierung
    for (let i = 0; i < resolution - 1; i++) {
      for (let j = 0; j < resolution - 1; j++) {
        const index = i * resolution + j
        const nextRowIndex = (i + 1) * resolution + j
        
        if (index * 3 + 2 < vertices.length && nextRowIndex * 3 + 2 < vertices.length) {
          const elevation = vertices[index * 3 + 1] || 0
          const nextElevation = vertices[nextRowIndex * 3 + 1] || 0
          
          // Höhenbasierte Farbgebung mit Schattierung
          const normalizedHeight = Math.min(elevation / 2, 1)
          const slope = Math.abs(elevation - nextElevation)
          const shadow = Math.max(0.3, 1 - slope * 0.1)
          
          // Terrain-Farben basierend auf Höhe
          let r, g, b
          if (normalizedHeight < 0.2) {
            // Wasser/Tiefland (Blau-Grün)
            r = Math.floor(100 * shadow)
            g = Math.floor(150 * shadow)
            b = Math.floor(200 * shadow)
          } else if (normalizedHeight < 0.5) {
            // Ebenen (Grün)
            r = Math.floor(120 * shadow)
            g = Math.floor(180 * shadow)
            b = Math.floor(100 * shadow)
          } else if (normalizedHeight < 0.8) {
            // Hügel (Braun-Grün)
            r = Math.floor(160 * shadow)
            g = Math.floor(140 * shadow)
            b = Math.floor(80 * shadow)
          } else {
            // Berge (Grau-Weiß)
            r = Math.floor(200 * shadow)
            g = Math.floor(200 * shadow)
            b = Math.floor(210 * shadow)
          }
          
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctx.globalAlpha = 0.8
          
          const x = j * cellWidth
          const y = i * cellHeight - (normalizedHeight * 80 * viewControls.terrainExaggeration)
          
          ctx.fillRect(x, y, cellWidth + 1, cellHeight + 1)
        }
      }
    }
    
    ctx.globalAlpha = 1
  }

  const renderAdvancedWeatherLayer = (ctx: CanvasRenderingContext2D, layer: WeatherLayer, width: number, height: number) => {
    const time = Date.now() / 1000
    const animationOffset = Math.sin(time * layer.animationSpeed * 0.001) * 10
    
    ctx.globalAlpha = layer.opacity
    
    const gridSize = Math.sqrt(layer.data.length)
    const cellWidth = width / gridSize
    const cellHeight = height / gridSize

    layer.data.forEach((row, i) => {
      row.forEach((value, j) => {
        const intensity = value / 100
        const alpha = intensity * layer.opacity
        
        if (alpha > 0.05) { // Nur sichtbare Bereiche rendern
          // Animierte Farbe basierend auf Schichttyp
          let color = layer.color
          if (layer.type === 'precipitation' && intensity > 0.5) {
            // Starker Regen - dunklere Farbe
            color = '#2563eb'
          } else if (layer.type === 'clouds' && intensity > 0.7) {
            // Dichte Wolken - grauer
            color = '#64748b'
          }
          
          ctx.fillStyle = color
          ctx.globalAlpha = alpha
          
          const x = j * cellWidth + animationOffset
          const y = i * cellHeight - (layer.altitude / 50) - animationOffset * 0.5
          
          // Schichtdicke berücksichtigen
          const thickness = Math.max(1, layer.thickness / 100)
          
          if (layer.type === 'wind') {
            // Windlinien statt Blöcke
            ctx.strokeStyle = color
            ctx.lineWidth = thickness
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + intensity * 20, y + Math.sin(time * 0.01 + j) * 5)
            ctx.stroke()
          } else {
            ctx.fillRect(x, y, cellWidth * thickness, cellHeight)
          }
        }
      })
    })
    
    ctx.globalAlpha = 1
  }

  const renderSatellitePaths = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const time = Date.now() / 1000
    
    satelliteMissions.forEach((mission, index) => {
      if (mission.status === 'active') {
        const orbitRadius = 100 + index * 20
        const angle = (time * 0.01 + index * Math.PI / 3) % (2 * Math.PI)
        
        const x = width / 2 + Math.cos(angle) * orbitRadius
        const y = height / 2 + Math.sin(angle) * orbitRadius * 0.3 // Elliptische Bahn
        
        // Satelliten-Symbol
        ctx.fillStyle = mission.dataQuality > 0.95 ? '#22c55e' : '#f59e0b'
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
        
        // Scanbereich anzeigen
        ctx.strokeStyle = ctx.fillStyle
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.arc(x, y, mission.beamWidth * 100, 0, 2 * Math.PI)
        ctx.stroke()
        
        // Satelliten-Label
        ctx.fillStyle = '#ffffff'
        ctx.globalAlpha = 0.9
        ctx.font = '10px Inter'
        ctx.fillText(mission.satelliteName, x + 8, y - 8)
      }
    })
    
    ctx.globalAlpha = 1
  }

  const renderParticleEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const time = Date.now()
    
    // Animierte Partikel für Niederschlag
    const precipLayer = weatherLayers.find(l => l.type === 'precipitation')
    if (precipLayer && precipLayer.intensity > 0.3) {
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(time * 0.001 + i) * width + width) % width
        const y = (time * 0.1 + i * 20) % height
        
        ctx.fillStyle = '#4dabf7'
        ctx.globalAlpha = 0.6
        ctx.fillRect(x, y, 1, 8)
      }
    }
    
    ctx.globalAlpha = 1
  }

  const renderAdvancedGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#ffffff20'
    ctx.lineWidth = 0.5
    
    const gridSpacing = 25
    const offset = viewControls.translation
    
    // Isometrische Grid-Linien
    for (let x = -gridSpacing; x <= width + gridSpacing; x += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(x + offset.x, 0)
      ctx.lineTo(x + offset.x + 20, height)
      ctx.stroke()
    }
    
    for (let y = -gridSpacing; y <= height + gridSpacing; y += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(0, y + offset.y)
      ctx.lineTo(width, y + offset.y - 10)
      ctx.stroke()
    }
  }

  const renderAdvancedLabels = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff'
    ctx.font = '11px Inter'
    ctx.textAlign = 'left'
    
    // Höhen-Labels mit verbesserter Positionierung
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i
      const altitude = Math.round((5 - i) * 2000)
      
      // Hintergrund für bessere Lesbarkeit
      ctx.fillStyle = '#00000060'
      ctx.fillRect(8, y + 5, 60, 18)
      
      ctx.fillStyle = '#ffffff'
      ctx.fillText(`${altitude}m`, 12, y + 17)
    }
    
    // Windgeschwindigkeits-Skala
    const windLayer = weatherLayers.find(l => l.type === 'wind')
    if (windLayer) {
      ctx.textAlign = 'right'
      ctx.fillStyle = '#00000060'
      ctx.fillRect(width - 80, 10, 70, 60)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = '10px Inter'
      ctx.fillText('Wind (km/h)', width - 15, 25)
      
      for (let i = 0; i < 4; i++) {
        const speed = i * 20
        const color = `hsl(${120 - i * 30}, 70%, 50%)`
        ctx.fillStyle = color
        ctx.fillRect(width - 75, 30 + i * 8, 10, 6)
        
        ctx.fillStyle = '#ffffff'
        ctx.fillText(`${speed}`, width - 15, 36 + i * 8)
      }
    }
  }

  const renderLighting = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Simuliere Sonnenlicht/Mondlicht basierend auf Tageszeit
    const hour = new Date().getHours()
    const lightIntensity = hour >= 6 && hour <= 18 ? 0.2 : 0.05
    
    const lightGradient = ctx.createRadialGradient(
      width * 0.7, height * 0.3, 0,
      width * 0.7, height * 0.3, Math.max(width, height)
    )
    
    lightGradient.addColorStop(0, `rgba(255, 255, 200, ${lightIntensity})`)
    lightGradient.addColorStop(0.5, `rgba(255, 255, 200, ${lightIntensity * 0.5})`)
    lightGradient.addColorStop(1, 'rgba(255, 255, 200, 0)')
    
    ctx.fillStyle = lightGradient
    ctx.globalCompositeOperation = 'screen'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
  }

  // Keep the original renderElevationSurface as fallback
  const renderElevationSurface = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 30
    const cellWidth = width / gridSize
    const cellHeight = height / gridSize

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const dataIndex = Math.floor((i * gridSize + j) * (lidarData.length / (gridSize * gridSize)))
        const point = lidarData[dataIndex]
        const elevation = point?.elevation || 0
        
        // Erweiterte Höhendarstellung
        const normalizedHeight = Math.min(elevation / 1000, 1)
        
        // Farbe basierend auf Oberflächentyp
        let r, g, b
        switch (point?.surfaceType) {
          case 'water':
            r = 100; g = 150; b = 255
            break
          case 'vegetation':
            r = 120; g = 180; b = 100
            break
          case 'building':
            r = 200; g = 200; b = 200
            break
          case 'infrastructure':
            r = 150; g = 100; b = 50
            break
          default:
            r = 255 - Math.floor(normalizedHeight * 155)
            g = Math.floor(normalizedHeight * 200) + 55
            b = 100
        }
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.globalAlpha = 0.7
        
        const x = i * cellWidth
        const y = j * cellHeight - (normalizedHeight * 60 * viewControls.terrainExaggeration)
        
        ctx.fillRect(x, y, cellWidth + 1, cellHeight + 1)
      }
    }
    
    ctx.globalAlpha = 1
  }

  const renderGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#ffffff20'
    ctx.lineWidth = 1
    
    // Vertikale Linien
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // Horizontale Linien
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  const renderLabels = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px Inter'
    ctx.textAlign = 'left'
    
    // Höhen-Labels
    for (let i = 0; i < 6; i++) {
      const y = (height / 6) * i + 20
      const altitude = Math.round((6 - i) * 1000)
      
      // Hintergrund für bessere Lesbarkeit
      ctx.fillStyle = '#00000040'
      ctx.fillRect(5, y - 15, 55, 18)
      
      ctx.fillStyle = '#ffffff'
      ctx.fillText(`${altitude}m`, 8, y - 2)
    }
  }

  const toggleAnimation = () => {
    setViewControls(prev => ({
      ...prev,
      isAnimating: !prev.isAnimating
    }))
    
    if (!viewControls.isAnimating) {
      toast.success('3D-Animation gestartet')
    } else {
      toast.info('3D-Animation pausiert')
    }
  }

  const toggle3DVisualization = () => {
    setVisualization3D(prev => ({
      ...prev,
      isActive: !prev.isActive
    }))
    
    if (!visualization3D.isActive) {
      toast.success('3D-Wettervisualisierung aktiviert')
    } else {
      toast.info('3D-Wettervisualisierung deaktiviert')
    }
  }

  const updateLayerSettings = (layerId: string, property: string, value: number) => {
    setWeatherLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, [property]: value }
          : layer
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Cube size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">3D-Wettervisualisierung</h2>
            <p className="text-sm text-muted-foreground">Satelliten-Lidar mit Höhendaten-Integration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={visualization3D.isActive ? "default" : "outline"}
            size="sm"
            onClick={toggle3DVisualization}
            className="gap-2"
          >
            <Eye size={16} />
            {visualization3D.isActive ? 'Aktiv' : 'Inaktiv'}
          </Button>
          
          <Button
            variant={viewControls.isAnimating ? "default" : "outline"}
            size="sm"
            onClick={toggleAnimation}
            disabled={!visualization3D.isActive}
            className="gap-2"
          >
            {viewControls.isAnimating ? <Pause size={16} /> : <Play size={16} />}
            Animation
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Alert>
        <Satellite className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>
              Lidar-Daten: {lidarData.length.toLocaleString()} Messpunkte • 
              Aktive Satelliten: {satelliteMissions.filter(m => m.status === 'active').length} • 
              Genauigkeit: {((lidarData.reduce((sum, point) => sum + point.accuracy, 0) / Math.max(lidarData.length, 1)) * 100).toFixed(1)}% • 
              Terrain-Mesh: {terrainMesh ? 'Generiert' : 'Wird erstellt'} •
              Letzte Aktualisierung: {new Date(renderingStatus.lastUpdate).toLocaleTimeString()}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {renderingStatus.frameRate} FPS
              </Badge>
              <Badge variant="outline" className="text-xs">
                GPU: {renderingStatus.gpuUtilization}%
              </Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Visualization Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain size={20} />
                3D-Höhenkarte mit Satelliten-Lidar
              </CardTitle>
              <CardDescription>
                Hochauflösende Topographie mit überlagerten Wetterschichten und Echtzeit-Satellitendaten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full h-96 border border-border rounded-lg bg-gradient-to-b from-sky-100 to-blue-50"
                />
                
                {!visualization3D.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center space-y-3">
                      <Eye size={48} className="text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">3D-Visualisierung deaktiviert</p>
                      <Button onClick={toggle3DVisualization} size="sm">
                        Aktivieren
                      </Button>
                    </div>
                  </div>
                )}

                {/* View Controls Overlay */}
                {visualization3D.isActive && (
                  <div className="absolute top-4 right-4 space-y-2">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border shadow-sm">
                      <div className="flex items-center gap-2 text-xs">
                        <RotateClockwise size={14} />
                        <span>Rotation: {viewControls.rotation.y.toFixed(0)}°</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <Target size={14} />
                        <span>Zoom: {(viewControls.zoom * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <Satellite size={14} />
                        <span>Satelliten: {satelliteMissions.filter(m => m.status === 'active').length}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <Activity size={14} />
                        <span>Mesh-Punkte: {terrainMesh?.vertices.length || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View Controls */}
              {visualization3D.isActive && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Zoom</label>
                      <Slider
                        value={[viewControls.zoom]}
                        onValueChange={([value]) => 
                          setViewControls(prev => ({ ...prev, zoom: value }))
                        }
                        min={0.5}
                        max={5.0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Höhen-Übertreibung</label>
                      <Slider
                        value={[viewControls.terrainExaggeration]}
                        onValueChange={([value]) => 
                          setViewControls(prev => ({ ...prev, terrainExaggeration: value }))
                        }
                        min={0.5}
                        max={5.0}
                        step={0.1}
                        className="w-full"
                      />
                      <span className="text-xs text-muted-foreground">
                        {viewControls.terrainExaggeration.toFixed(1)}x
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Höhenschicht</label>
                      <Slider
                        value={[visualization3D.selectedAltitude]}
                        onValueChange={([value]) => 
                          setVisualization3D(prev => ({ ...prev, selectedAltitude: value }))
                        }
                        min={0}
                        max={10000}
                        step={100}
                        className="w-full"
                      />
                      <span className="text-xs text-muted-foreground">
                        {visualization3D.selectedAltitude}m
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Animations-Geschwindigkeit</label>
                      <Slider
                        value={[visualization3D.animationSpeed]}
                        onValueChange={([value]) => 
                          setVisualization3D(prev => ({ ...prev, animationSpeed: value }))
                        }
                        min={0.1}
                        max={3.0}
                        step={0.1}
                        className="w-full"
                      />
                      <span className="text-xs text-muted-foreground">
                        {visualization3D.animationSpeed.toFixed(1)}x
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={viewControls.showGrid}
                          onCheckedChange={(checked) =>
                            setViewControls(prev => ({ ...prev, showGrid: checked }))
                          }
                        />
                        <span className="text-sm">Gitter</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={viewControls.showLabels}
                          onCheckedChange={(checked) =>
                            setViewControls(prev => ({ ...prev, showLabels: checked }))
                          }
                        />
                        <span className="text-sm">Beschriftung</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={viewControls.enableLighting}
                          onCheckedChange={(checked) =>
                            setViewControls(prev => ({ ...prev, enableLighting: checked }))
                          }
                        />
                        <span className="text-sm">Beleuchtung</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={viewControls.showSatellitePaths}
                          onCheckedChange={(checked) =>
                            setViewControls(prev => ({ ...prev, showSatellitePaths: checked }))
                          }
                        />
                        <span className="text-sm">Satelliten</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Auflösung: {visualization3D.dataResolution}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Modus: {visualization3D.renderMode}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controls Sidebar */}
        <div className="space-y-6">
          {/* Satellite Missions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Satellite size={18} />
                Satelliten-Missionen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {satelliteMissions.map(mission => (
                <div key={mission.id} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{mission.satelliteName}</span>
                    <Badge 
                      variant={mission.status === 'active' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {mission.status === 'active' ? 'Aktiv' : 
                       mission.status === 'planned' ? 'Geplant' : 
                       mission.status === 'completed' ? 'Abgeschlossen' : 'Fehler'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Höhe:</span>
                      <div>{(mission.altitude / 1000).toFixed(0)}km</div>
                    </div>
                    <div>
                      <span className="font-medium">Qualität:</span>
                      <div>{(mission.dataQuality * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="font-medium">Strahlbreite:</span>
                      <div>{mission.beamWidth}°</div>
                    </div>
                    <div>
                      <span className="font-medium">Pulsrate:</span>
                      <div>{mission.pulseRate.toLocaleString()} Hz</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Datenqualität</span>
                      <span>{Math.round(mission.dataQuality * 100)}%</span>
                    </div>
                    <Progress value={mission.dataQuality * 100} className="h-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Lidar Data Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Radar size={18} />
                Lidar-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Datenquelle</span>
                  <Badge variant="outline">{lidarSettings.dataSource}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Genauigkeit</span>
                  <Badge variant="default">{lidarSettings.accuracy}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Punkt-Dichte</span>
                  <Badge variant="outline">{lidarSettings.pointCloudDensity}</Badge>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Update-Intervall</label>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(lidarSettings.updateInterval / 60000)} Minuten
                  </div>
                  <Progress value={(lidarSettings.updateInterval / 600000) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Oberflächenglättung</label>
                  <div className="text-xs text-muted-foreground">
                    {(lidarSettings.elevationSmoothing * 100).toFixed(0)}%
                  </div>
                  <Progress value={lidarSettings.elevationSmoothing * 100} className="h-2" />
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-blue-600">
                      {lidarData.length.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Messpunkte</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-green-600">
                      {lidarData.filter(p => p.source === 'satellite').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Satelliten</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-purple-600">
                      {lidarData.filter(p => p.surfaceType === 'infrastructure').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Infrastruktur</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-amber-600">
                      {((lidarData.reduce((sum, p) => sum + p.pointDensity, 0) / Math.max(lidarData.length, 1))).toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Ø Dichte/m²</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Layers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers size={18} />
                Wetterschichten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="temperature" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="temperature">Temperatur</TabsTrigger>
                  <TabsTrigger value="precipitation">Niederschlag</TabsTrigger>
                  <TabsTrigger value="advanced">Erweitert</TabsTrigger>
                </TabsList>
                
                <TabsContent value="temperature" className="space-y-3">
                  {weatherLayers.filter(l => l.type === 'temperature').map(layer => (
                    <div key={layer.id} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Oberflächentemperatur</span>
                        <Badge style={{ backgroundColor: layer.color }} className="text-white text-xs">
                          {layer.altitude}m
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Intensität</span>
                          <span>{Math.round(layer.intensity * 100)}%</span>
                        </div>
                        <Slider
                          value={[layer.intensity]}
                          onValueChange={([value]) => updateLayerSettings(layer.id, 'intensity', value)}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                        
                        <div className="flex items-center justify-between text-xs">
                          <span>Schichtdicke</span>
                          <span>{layer.thickness}m</span>
                        </div>
                        <Slider
                          value={[layer.thickness]}
                          onValueChange={([value]) => updateLayerSettings(layer.id, 'thickness', value)}
                          min={50}
                          max={500}
                          step={25}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="precipitation" className="space-y-3">
                  {weatherLayers.filter(l => l.type === 'precipitation').map(layer => (
                    <div key={layer.id} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Niederschlag</span>
                        <Badge style={{ backgroundColor: layer.color }} className="text-white text-xs">
                          {layer.altitude}m
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Sichtbarkeit</span>
                          <span>{Math.round(layer.opacity * 100)}%</span>
                        </div>
                        <Slider
                          value={[layer.opacity]}
                          onValueChange={([value]) => updateLayerSettings(layer.id, 'opacity', value)}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                        
                        <div className="flex items-center justify-between text-xs">
                          <span>Animation</span>
                          <span>{layer.animationSpeed.toFixed(1)}x</span>
                        </div>
                        <Slider
                          value={[layer.animationSpeed]}
                          onValueChange={([value]) => updateLayerSettings(layer.id, 'animationSpeed', value)}
                          min={0.1}
                          max={3.0}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-3">
                  {weatherLayers.filter(l => ['visibility', 'turbulence', 'wind'].includes(l.type)).map(layer => (
                    <div key={layer.id} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {layer.type === 'visibility' ? 'Sichtweite' :
                           layer.type === 'turbulence' ? 'Turbulenz' : 'Wind'}
                        </span>
                        <Badge style={{ backgroundColor: layer.color }} className="text-white text-xs">
                          {layer.altitude}m
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Intensität</span>
                          <span>{Math.round(layer.intensity * 100)}%</span>
                        </div>
                        <Slider
                          value={[layer.intensity]}
                          onValueChange={([value]) => updateLayerSettings(layer.id, 'intensity', value)}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                        
                        <div className="text-xs text-muted-foreground">
                          Interpolation: {layer.interpolationMethod}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Performance Monitor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity size={18} />
                Rendering-Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bildrate</span>
                  <Badge variant="outline">{renderingStatus.frameRate} FPS</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Render-Zeit</span>
                  <Badge variant="outline">{renderingStatus.renderingTime.toFixed(1)}ms</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Speicherverbrauch</span>
                    <span>{renderingStatus.memoryUsage}%</span>
                  </div>
                  <Progress value={renderingStatus.memoryUsage} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>GPU-Auslastung</span>
                    <span>{renderingStatus.gpuUtilization}%</span>
                  </div>
                  <Progress value={renderingStatus.gpuUtilization} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Rendering-Fortschritt</span>
                    <span>{renderingStatus.progress}%</span>
                  </div>
                  <Progress value={renderingStatus.progress} className="h-2" />
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Qualitätsstufe</span>
                  <Badge variant="outline">{renderingStatus.qualityLevel}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-blue-600">
                      {renderingStatus.dataPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Datenpunkte</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-green-600">
                      {renderingStatus.activeSatellites}
                    </div>
                    <div className="text-xs text-muted-foreground">Satelliten</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}