import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import {
  VideoCamera,
  Record,
  Broadcast,
  Monitor,
  SpeakerHigh,
  Microphone,
  DownloadSimple,
  ShareNetwork,
  Crosshair,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  Record as RecordIcon,
  Stop,
  Warning,
  Eye,
  ThermometerSimple,
  Play,
  Pause,
  Square,
  Camera,
  ArrowsOut,
  ArrowsIn
} from '@phosphor-icons/react'

interface DroneVideoStreamProps {
  droneId: string
  droneName: string
  streamUrl: string
  quality: '720p' | '1080p' | '4K'
  isLive: boolean
  isCritical: boolean
  onQualityChange: (quality: '720p' | '1080p' | '4K') => void
  onStreamStop: () => void
  onZoomChange: (direction: 'in' | 'out') => void
  onToggleFeature: (feature: 'thermal' | 'nightVision' | 'audio') => void
  features: {
    thermalActive: boolean
    nightVisionActive: boolean
    audioEnabled: boolean
    zoomLevel: number
    transmissionStrength: number
  }
}

export default function DroneVideoStream({
  droneId,
  droneName,
  streamUrl,
  quality,
  isLive,
  isCritical,
  onQualityChange,
  onStreamStop,
  onZoomChange,
  onToggleFeature,
  features
}: DroneVideoStreamProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [streamStats, setStreamStats] = useState({
    viewers: 0,
    duration: 0,
    dataUsage: 0,
    frameRate: 30,
    bitrate: 5000
  })

  // Simulate real-time stream statistics updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setStreamStats(prev => ({
        ...prev,
        duration: prev.duration + 1,
        dataUsage: prev.dataUsage + (quality === '4K' ? 8 : quality === '1080p' ? 5 : 3),
        viewers: Math.max(0, prev.viewers + Math.floor(Math.random() * 3) - 1)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [isLive, quality, setStreamStats])

  const handleScreenshot = () => {
    toast.success(`Screenshot gespeichert - ${droneName}`)
  }

  const handleRecording = () => {
    setIsRecording(!isRecording)
    toast.info(isRecording ? 'Aufzeichnung gestoppt' : 'Aufzeichnung gestartet')
  }

  const handleDownload = () => {
    toast.success('Video-Download gestartet')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(streamUrl)
    toast.success('Stream-URL in Zwischenablage kopiert')
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getQualityColor = (q: string) => {
    switch (q) {
      case '4K': return 'bg-purple-500'
      case '1080p': return 'bg-blue-500'
      case '720p': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className={`${isCritical ? 'border-destructive shadow-lg' : ''} transition-all duration-300`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {isLive && (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                </>
              )}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {droneName}
                {isCritical && <Warning size={18} className="text-destructive" />}
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                {droneId} • {isLive ? 'LIVE' : 'OFFLINE'} • {formatDuration(streamStats.duration)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isCritical ? 'destructive' : 'secondary'} className="text-xs">
              {isCritical ? 'KRITISCH' : 'NORMAL'}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getQualityColor(quality)} text-white`}>
              {quality}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Stream Display */}
        <div className={`relative bg-black rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          <div className={`${isFullscreen ? 'h-screen' : 'aspect-video'} bg-gradient-to-br from-gray-800 to-black flex items-center justify-center`}>
            {isLive ? (
              <div className="text-center space-y-2">
                <VideoCamera size={isFullscreen ? 64 : 32} className="mx-auto text-white/60" />
                <p className="text-white/80 text-sm">Live Video Stream</p>
                <p className="text-white/60 text-xs font-mono">{streamUrl}</p>
                <div className="text-white/60 text-xs">
                  {streamStats.frameRate} FPS • {(streamStats.bitrate / 1000).toFixed(1)} Mbps
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Monitor size={isFullscreen ? 64 : 32} className="mx-auto text-white/40" />
                <p className="text-white/60 text-sm">Stream offline</p>
              </div>
            )}
          </div>

          {/* Stream Overlay Controls */}
          {isLive && (
            <>
              {/* Top Overlay */}
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="destructive" className="text-xs animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
                  LIVE
                </Badge>
                {isRecording && (
                  <Badge variant="secondary" className="text-xs">
                    <Record size={10} className="mr-1 text-red-500" />
                    REC
                  </Badge>
                )}
                {isCritical && (
                  <Badge variant="destructive" className="text-xs">
                    <Warning size={10} className="mr-1" />
                    NOTFALL
                  </Badge>
                )}
              </div>

              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant="outline" className="text-xs bg-black/60 text-white border-white/20">
                  {streamStats.viewers} Zuschauer
                </Badge>
                <Badge variant="outline" className="text-xs bg-black/60 text-white border-white/20">
                  {features.transmissionStrength}% Signal
                </Badge>
              </div>

              {/* Camera Control Overlay */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex justify-between items-end">
                  {/* Left Controls */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onZoomChange('out')}
                        disabled={features.zoomLevel <= 1.0}
                        className="w-8 h-8 p-0 bg-black/60 hover:bg-black/80 border-white/20 text-white"
                      >
                        <MagnifyingGlassMinus size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onZoomChange('in')}
                        disabled={features.zoomLevel >= 10.0}
                        className="w-8 h-8 p-0 bg-black/60 hover:bg-black/80 border-white/20 text-white"
                      >
                        <MagnifyingGlassPlus size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 bg-black/60 hover:bg-black/80 border-white/20 text-white"
                      >
                        <Crosshair size={14} />
                      </Button>
                    </div>
                    <div className="text-xs text-white/80 bg-black/60 px-2 py-1 rounded">
                      Zoom: {features.zoomLevel.toFixed(1)}x
                    </div>
                  </div>

                  {/* Center Controls */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={features.thermalActive ? "default" : "outline"}
                      onClick={() => onToggleFeature('thermal')}
                      className="w-8 h-8 p-0 bg-black/60 hover:bg-black/80 border-white/20 text-white"
                    >
                      <ThermometerSimple size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant={features.nightVisionActive ? "default" : "outline"}
                      onClick={() => onToggleFeature('nightVision')}
                      className="w-8 h-8 p-0 bg-black/60 hover:bg-black/80 border-white/20 text-white"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant={features.audioEnabled ? "default" : "outline"}
                      onClick={() => onToggleFeature('audio')}
                      className="w-8 h-8 p-0 bg-black/60 hover:bg-black/80 border-white/20 text-white"
                    >
                      <Microphone size={14} />
                    </Button>
                  </div>

                  {/* Right Controls */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleScreenshot}
                      className="w-8 h-8 p-0 bg-black/60 hover:bg-black/80 border-white/20 text-white"
                    >
                      <Camera size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRecording}
                      className="w-8 h-8 p-0 bg-black/60 hover:bg-black/80 border-white/20 text-white"
                    >
                      {isRecording ? <Stop size={14} /> : <Record size={14} />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="w-8 h-8 p-0 bg-black/60 hover:bg-black/80 border-white/20 text-white"
                    >
                      {isFullscreen ? <ArrowsIn size={14} /> : <ArrowsOut size={14} />}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {!isFullscreen && (
          <>
            {/* Stream Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Dauer</p>
                <p className="font-mono font-bold">{formatDuration(streamStats.duration)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Datenverbrauch</p>
                <p className="font-mono">{(streamStats.dataUsage / 1000).toFixed(1)} GB</p>
              </div>
              <div>
                <p className="text-muted-foreground">Zuschauer</p>
                <p className="font-mono">{streamStats.viewers}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bildrate</p>
                <p className="font-mono">{streamStats.frameRate} FPS</p>
              </div>
            </div>

            {/* Quality and Action Controls */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={quality === '720p' ? 'default' : 'outline'}
                  onClick={() => onQualityChange('720p')}
                  className="text-xs"
                >
                  720p
                </Button>
                <Button
                  size="sm"
                  variant={quality === '1080p' ? 'default' : 'outline'}
                  onClick={() => onQualityChange('1080p')}
                  className="text-xs"
                >
                  1080p
                </Button>
                <Button
                  size="sm"
                  variant={quality === '4K' ? 'default' : 'outline'}
                  onClick={() => onQualityChange('4K')}
                  className="text-xs"
                >
                  4K
                </Button>
              </div>

              <div className="flex gap-1 ml-auto">
                <Button size="sm" variant="outline" onClick={handleDownload} className="text-xs">
                  <DownloadSimple size={12} className="mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={handleShare} className="text-xs">
                  <ShareNetwork size={12} className="mr-1" />
                  Teilen
                </Button>
                <Button size="sm" variant="destructive" onClick={onStreamStop} className="text-xs">
                  <Stop size={12} className="mr-1" />
                  Stream beenden
                </Button>
              </div>
            </div>

            {/* Critical Alert */}
            {isCritical && (
              <Alert className="border-destructive bg-destructive/5">
                <Warning className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-sm text-destructive">
                  <strong>Kritischer Vorfall erkannt!</strong> Automatische Aufzeichnung und Benachrichtigung aller relevanten Stellen aktiviert.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}