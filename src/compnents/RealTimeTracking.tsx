import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  MapPin,
  Train,
  Clock,
  Gauge,
  Navigation,
  Zap,
  Users,
  AlertTriangle,
  Eye,
  Crosshair,
  Activity,
  Route,
  Timer,
  Signal
} from '@phosphor-icons/react'

interface TrainLocation {
  id: string
  trainNumber: string
  line: string
  coordinates: {
    latitude: number
    longitude: number
    altitude?: number
  }
  speed: number
  heading: number
  status: 'on-time' | 'delayed' | 'ahead' | 'stopped' | 'emergency'
  delay: number // minutes
  nextStation: string
  eta: string
  passengers: number
  capacity: number
  lastUpdate: string
  route: string[]
  completedStops: number
  totalStops: number
  fuelLevel?: number
  signalStrength: number
}

interface StationLocation {
  id: string
  name: string
  code: string
  coordinates: {
    latitude: number
    longitude: number
  }
  platform: string
  activeTrains: string[]
}

const RealTimeTracking = () => {
  const [selectedTrain, setSelectedTrain] = useState<string>('')
  const [trackingFilter, setTrackingFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mapView, setMapView] = useState<'map' | 'list'>('map')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Mock real-time train data with periodic updates
  const [trainLocations, setTrainLocations] = useKV<TrainLocation[]>('train-locations', [
    {
      id: 'train-001',
      trainNumber: 'IC 2451',
      line: 'Berlin-Munich',
      coordinates: { latitude: 52.5200, longitude: 13.4050, altitude: 34 },
      speed: 287,
      heading: 215,
      status: 'on-time',
      delay: 0,
      nextStation: 'Berlin Hauptbahnhof',
      eta: '14:32',
      passengers: 284,
      capacity: 400,
      lastUpdate: new Date().toISOString(),
      route: ['Berlin Hbf', 'Leipzig', 'Nuremberg', 'Munich'],
      completedStops: 0,
      totalStops: 4,
      fuelLevel: 85,
      signalStrength: 95
    },
    {
      id: 'train-002',
      trainNumber: 'RE 4723',
      line: 'Hamburg-Frankfurt',
      coordinates: { latitude: 53.5511, longitude: 9.9937, altitude: 12 },
      speed: 160,
      heading: 180,
      status: 'delayed',
      delay: 12,
      nextStation: 'Hamburg-Altona',
      eta: '15:45',
      passengers: 156,
      capacity: 200,
      lastUpdate: new Date().toISOString(),
      route: ['Hamburg Hbf', 'Bremen', 'Hanover', 'Göttingen', 'Frankfurt'],
      completedStops: 1,
      totalStops: 5,
      fuelLevel: 72,
      signalStrength: 88
    },
    {
      id: 'train-003',
      trainNumber: 'ICE 1247',
      line: 'Cologne-Dresden',
      coordinates: { latitude: 50.9375, longitude: 6.9603, altitude: 55 },
      speed: 0,
      heading: 90,
      status: 'stopped',
      delay: 5,
      nextStation: 'Cologne Central',
      eta: '16:20',
      passengers: 387,
      capacity: 450,
      lastUpdate: new Date().toISOString(),
      route: ['Cologne', 'Düsseldorf', 'Duisburg', 'Leipzig', 'Dresden'],
      completedStops: 0,
      totalStops: 5,
      fuelLevel: 91,
      signalStrength: 92
    }
  ])

  const [stations] = useKV<StationLocation[]>('station-locations', [
    {
      id: 'station-001',
      name: 'Berlin Hauptbahnhof',
      code: 'BER',
      coordinates: { latitude: 52.5250, longitude: 13.3694 },
      platform: '12A',
      activeTrains: ['train-001']
    },
    {
      id: 'station-002',
      name: 'Hamburg Hauptbahnhof',
      code: 'HAM',
      coordinates: { latitude: 53.5528, longitude: 10.0067 },
      platform: '8B',
      activeTrains: ['train-002']
    },
    {
      id: 'station-003',
      name: 'Cologne Central',
      code: 'COL',
      coordinates: { latitude: 50.9430, longitude: 6.9587 },
      platform: '5C',
      activeTrains: ['train-003']
    }
  ])

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setTrainLocations(currentTrains => 
        currentTrains.map(train => {
          // Simulate movement and status changes
          const speedVariation = (Math.random() - 0.5) * 20
          const newSpeed = Math.max(0, Math.min(300, train.speed + speedVariation))
          
          // Simulate coordinate changes based on heading and speed
          const distanceKm = (newSpeed / 60) * 0.0167 // Distance traveled in 1 second at current speed
          const latChange = (distanceKm / 111) * Math.cos(train.heading * Math.PI / 180)
          const lonChange = (distanceKm / 111) * Math.sin(train.heading * Math.PI / 180)
          
          return {
            ...train,
            speed: newSpeed,
            coordinates: {
              ...train.coordinates,
              latitude: train.coordinates.latitude + latChange,
              longitude: train.coordinates.longitude + lonChange
            },
            passengers: train.passengers + Math.floor((Math.random() - 0.5) * 10),
            signalStrength: Math.max(60, Math.min(100, train.signalStrength + (Math.random() - 0.5) * 10)),
            lastUpdate: new Date().toISOString()
          }
        })
      )
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, setTrainLocations])

  const filteredTrains = trainLocations
    .filter(train => {
      if (trackingFilter === 'all') return true
      return train.status === trackingFilter
    })
    .filter(train => 
      train.trainNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.line.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.nextStation.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const getStatusColor = (status: TrainLocation['status']) => {
    switch (status) {
      case 'on-time': return 'bg-green-500'
      case 'delayed': return 'bg-yellow-500'
      case 'ahead': return 'bg-blue-500'
      case 'stopped': return 'bg-gray-500'
      case 'emergency': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusBadge = (status: TrainLocation['status']) => {
    switch (status) {
      case 'on-time': return 'default'
      case 'delayed': return 'secondary'
      case 'ahead': return 'outline'
      case 'stopped': return 'outline'
      case 'emergency': return 'destructive'
      default: return 'outline'
    }
  }

  const formatCoordinates = (lat: number, lon: number) => {
    return `${(lat || 0).toFixed(6)}°, ${(lon || 0).toFixed(6)}°`
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const trackTrain = (trainId: string) => {
    const train = trainLocations.find(t => t.id === trainId)
    if (train) {
      setSelectedTrain(trainId)
      toast.success(`Now tracking ${train.trainNumber}`, {
        description: `Live GPS coordinates: ${formatCoordinates(train.coordinates.latitude, train.coordinates.longitude)}`
      })
    }
  }

  const stopTracking = () => {
    setSelectedTrain('')
    toast.info('Stopped tracking train')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-primary" />
              </div>
              Real-Time Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Live GPS coordinates and train positioning • {filteredTrains.length} active trains
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="gap-2"
            >
              <Activity size={16} />
              {autoRefresh ? 'Live' : 'Paused'}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search trains, routes, or stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={trackingFilter} onValueChange={setTrackingFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trains</SelectItem>
              <SelectItem value="on-time">On Time</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="ahead">Ahead of Schedule</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>

          <Tabs value={mapView} onValueChange={(v) => setMapView(v as 'map' | 'list')} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="map" className="gap-2">
                <MapPin size={16} />
                Map
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <Train size={16} />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={mapView} className="space-y-6">
        <TabsContent value="map" className="space-y-6">
          {/* Map View */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Interactive Map Placeholder */}
            <div className="xl:col-span-2">
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation size={20} />
                    Live Train Map
                  </CardTitle>
                  <CardDescription>
                    Real-time GPS positioning of all active trains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                    {/* Map visualization placeholder */}
                    <div className="text-center space-y-4">
                      <div className="grid grid-cols-2 gap-4 max-w-sm">
                        {filteredTrains.slice(0, 4).map((train, index) => (
                          <div key={train.id} className="relative">
                            <div 
                              className={`w-3 h-3 rounded-full ${getStatusColor(train.status)} animate-pulse absolute`}
                              style={{
                                left: `${20 + index * 30}%`,
                                top: `${30 + index * 15}%`
                              }}
                            />
                            <div className="text-xs text-muted-foreground mt-8">
                              {train.trainNumber}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Interactive Map View</p>
                        <p className="text-xs text-muted-foreground">
                          Live GPS coordinates • Real-time positioning
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {filteredTrains.length} trains tracked
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Train Details */}
            <div className="space-y-4">
              {selectedTrain ? (
                (() => {
                  const train = trainLocations.find(t => t.id === selectedTrain)
                  if (!train) return null
                  
                  return (
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{train.trainNumber}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={stopTracking}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
                        <CardDescription>{train.line}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* GPS Coordinates */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Crosshair size={16} className="text-primary" />
                            GPS Coordinates
                          </div>
                          <div className="bg-secondary/50 p-3 rounded-lg font-mono text-sm">
                            <div>Lat: {(train.coordinates?.latitude || 0).toFixed(6)}°</div>
                            <div>Lon: {(train.coordinates?.longitude || 0).toFixed(6)}°</div>
                            {train.coordinates.altitude && (
                              <div>Alt: {train.coordinates.altitude}m</div>
                            )}
                          </div>
                        </div>

                        {/* Status & Speed */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Status</div>
                            <Badge variant={getStatusBadge(train.status)} className="capitalize">
                              {train.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Speed</div>
                            <div className="font-bold text-lg flex items-center gap-1">
                              {train.speed}
                              <span className="text-xs font-normal">km/h</span>
                            </div>
                          </div>
                        </div>

                        {/* Next Station */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Route size={16} className="text-primary" />
                            Next Station
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{train.nextStation}</span>
                            <Badge variant="outline" className="text-xs">
                              ETA {train.eta}
                            </Badge>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Route Progress</span>
                            <span className="text-muted-foreground">
                              {train.completedStops}/{train.totalStops}
                            </span>
                          </div>
                          <Progress 
                            value={(train.completedStops / train.totalStops) * 100}
                            className="h-2"
                          />
                        </div>

                        {/* Additional Metrics */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                          <div className="text-center space-y-1">
                            <div className="text-lg font-bold text-primary">
                              {train.passengers}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Passengers
                            </div>
                          </div>
                          <div className="text-center space-y-1">
                            <div className="text-lg font-bold text-green-600">
                              {train.signalStrength}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Signal
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
                          Last updated: {new Date(train.lastUpdate).toLocaleTimeString()}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })()
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Select a Train</CardTitle>
                    <CardDescription>
                      Click on a train to view detailed GPS tracking information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-3 py-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Train size={24} className="text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Choose a train from the list to track its real-time location
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center space-y-1 p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {filteredTrains.filter(t => t.status === 'on-time').length}
                      </div>
                      <div className="text-xs text-muted-foreground">On Time</div>
                    </div>
                    <div className="text-center space-y-1 p-3 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600">
                        {filteredTrains.filter(t => t.status === 'delayed').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Delayed</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>GPS Coverage</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <Progress value={98.5} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* List View */}
          <div className="grid gap-4">
            {filteredTrains.map((train) => (
              <Card 
                key={train.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTrain === train.id ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => trackTrain(train.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(train.status)} animate-pulse`} />
                        <div>
                          <div className="font-semibold text-lg">{train.trainNumber}</div>
                          <div className="text-sm text-muted-foreground">{train.line}</div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block">
                        <Badge variant={getStatusBadge(train.status)} className="capitalize">
                          {train.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* GPS Coordinates */}
                      <div className="hidden lg:block text-right">
                        <div className="text-sm font-mono">
                          {formatCoordinates(train.coordinates.latitude, train.coordinates.longitude)}
                        </div>
                        <div className="text-xs text-muted-foreground">GPS Coordinates</div>
                      </div>

                      {/* Speed & Metrics */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold text-lg">{train.speed}</div>
                            <div className="text-xs text-muted-foreground">km/h</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="font-bold text-lg text-primary">{train.passengers}</div>
                            <div className="text-xs text-muted-foreground">passengers</div>
                          </div>
                        </div>
                      </div>

                      {/* Next Station */}
                      <div className="hidden md:block text-right">
                        <div className="font-medium">{train.nextStation}</div>
                        <div className="text-sm text-muted-foreground">ETA {train.eta}</div>
                        {train.delay > 0 && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            +{train.delay}min
                          </Badge>
                        )}
                      </div>

                      {/* Track Button */}
                      <Button
                        variant={selectedTrain === train.id ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          selectedTrain === train.id ? stopTracking() : trackTrain(train.id)
                        }}
                        className="gap-2"
                      >
                        <Eye size={16} />
                        {selectedTrain === train.id ? 'Tracking' : 'Track'}
                      </Button>
                    </div>
                  </div>

                  {/* Mobile-only additional info */}
                  <div className="sm:hidden mt-3 pt-3 border-t border-border/50">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">GPS: </span>
                        <span className="font-mono text-xs">
                          {(train.coordinates?.latitude || 0).toFixed(3)}°, {(train.coordinates?.longitude || 0).toFixed(3)}°
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next: </span>
                        <span>{train.nextStation}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTrains.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Train size={24} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  No trains found matching your search criteria
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => {
                    setSearchQuery('')
                    setTrackingFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RealTimeTracking