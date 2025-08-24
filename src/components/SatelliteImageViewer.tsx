import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Camera, 
  Eye,
  ThermometerSimple,
  Pulse,
  Lightbulb,
  Download,
  Share,
  Crosshair,
  Satellite
} from '@phosphor-icons/react'

interface SatelliteImageViewerProps {
  imageId: string
  timestamp: string
  location: {
    lat: number
    lng: number
    name: string
  }
  imageType: 'visible' | 'infrared' | 'radar' | 'thermal' | 'multispectral'
  resolution: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  cloudCover: number
  size: string
  weatherData: {
    temperature: number
    humidity: number
    pressure: number
    windSpeed: number
    precipitationIntensity: number
  }
  detectedThreats?: Array<{
    type: string
    severity: string
    confidence: number
    location: string
  }>
  showControls?: boolean
  className?: string
}

export default function SatelliteImageViewer({ 
  imageId,
  timestamp, 
  location, 
  imageType, 
  resolution, 
  quality, 
  cloudCover,
  size,
  weatherData,
  detectedThreats = [],
  showControls = true,
  className = ""
}: SatelliteImageViewerProps) {
  const getImageTypeIcon = (type: string) => {
    switch (type) {
      case 'visible': return <Eye size={16} className="text-blue-500" />
      case 'infrared': return <ThermometerSimple size={16} className="text-red-500" />
      case 'radar': return <Pulse size={16} className="text-green-500" />
      case 'thermal': return <ThermometerSimple size={16} className="text-orange-500" />
      case 'multispectral': return <Lightbulb size={16} className="text-purple-500" />
      default: return <Camera size={16} />
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 border-green-200 bg-green-50'
      case 'good': return 'text-blue-600 border-blue-200 bg-blue-50'
      case 'fair': return 'text-yellow-600 border-yellow-200 bg-yellow-50'
      case 'poor': return 'text-red-600 border-red-200 bg-red-50'
      default: return 'text-gray-600 border-gray-200 bg-gray-50'
    }
  }

  const getImageTypeGradient = (type: string) => {
    switch (type) {
      case 'visible': return 'from-blue-900 via-blue-700 to-green-600'
      case 'infrared': return 'from-red-900 via-red-700 to-orange-600'
      case 'radar': return 'from-green-900 via-green-700 to-cyan-600'
      case 'thermal': return 'from-orange-900 via-orange-700 to-red-600'
      case 'multispectral': return 'from-purple-900 via-purple-700 to-pink-600'
      default: return 'from-gray-900 via-gray-700 to-blue-600'
    }
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Simulated satellite image with overlay information */}
      <div className={`h-64 bg-gradient-to-br ${getImageTypeGradient(imageType)} relative`}>
        {/* Simulated satellite imagery overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Weather overlay patterns */}
        {imageType === 'radar' && (
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-red-500 rounded-full"></div>
            <div className="absolute bottom-1/3 left-1/2 w-6 h-6 bg-orange-400 rounded-full"></div>
          </div>
        )}

        {/* Threat indicators */}
        {detectedThreats.map((threat, idx) => (
          <div key={idx} className={`absolute ${idx === 0 ? 'top-1/4 left-1/4' : idx === 1 ? 'top-1/2 right-1/3' : 'bottom-1/3 left-1/2'}`}>
            <div className="w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse"></div>
            <div className="absolute -top-1 -left-1 w-6 h-6 border-2 border-red-400 rounded-full animate-ping"></div>
          </div>
        ))}

        {/* Header badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs bg-black/60 text-white border-white/20">
            {getImageTypeIcon(imageType)}
            <span className="ml-1 capitalize">{imageType}</span>
          </Badge>
          <Badge variant="outline" className={`text-xs ${getQualityColor(quality)}`}>
            {quality}
          </Badge>
          <Badge variant="default" className="text-xs bg-black/60 text-white border-white/20">
            {resolution}m/px
          </Badge>
        </div>

        {/* Crosshair overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Crosshair size={32} className="text-white/50" />
        </div>

        {/* Coordinates and timestamp */}
        <div className="absolute top-3 right-3 text-right">
          <div className="text-white text-xs font-mono bg-black/60 px-2 py-1 rounded">
            {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
          </div>
          <div className="text-white text-xs bg-black/60 px-2 py-1 rounded mt-1">
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        </div>

        {/* Location and cloud cover info */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-black/70 backdrop-blur rounded-lg p-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{location.name}</h4>
              <span className="text-xs">Bewölkung: {cloudCover}%</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-white/70">Temperatur:</span>
                <span className="ml-2 font-medium">{weatherData.temperature}°C</span>
              </div>
              <div>
                <span className="text-white/70">Wind:</span>
                <span className="ml-2 font-medium">{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image metadata and controls */}
      <div className="p-4 space-y-3">
        {/* Weather data grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Luftfeuchtigkeit:</span>
            <span className="font-medium">{weatherData.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Luftdruck:</span>
            <span className="font-medium">{weatherData.pressure} hPa</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Niederschlag:</span>
            <span className="font-medium">{weatherData.precipitationIntensity} mm/h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bildgröße:</span>
            <span className="font-medium">{size}</span>
          </div>
        </div>

        {/* Detected threats */}
        {detectedThreats.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-muted-foreground">Erkannte Bedrohungen:</h5>
            {detectedThreats.map((threat, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded text-sm">
                <span className="capitalize">{threat.type} - {threat.location}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    {threat.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{threat.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        {showControls && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Live-Übertragung</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Download size={14} className="mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Share size={14} className="mr-1" />
                Teilen
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Satellite size={14} className="mr-1" />
                Analyse
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}