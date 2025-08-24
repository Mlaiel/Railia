import { useState } from 'react'
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  List,
  X,
  Train,
  Eye,
  CloudRain,
  Heart,
  Network,
  ShieldCheck,
  Settings,
  Activity,
  Swatches,
  MapPin,
  Siren
} from '@phosphor-icons/react'
import { useSwipeGesture } from '../hooks/useSwipeGesture'

interface MobileNavigationProps {
  activeModule: string
  setActiveModule: (module: string) => void
  systemStatus: {
    operational: boolean
    lastUpdate: string
    activeTrains: number
    criticalAlerts: number
    networkHealth: number
  }
}

const MobileNavigation = ({ activeModule, setActiveModule, systemStatus }: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const modules = [
    { id: 'network', name: 'Network Control', icon: Network },
    { id: 'tracking', name: 'Real-Time Tracking', icon: MapPin },
    { id: 'emergency', name: 'Emergency Response', icon: Siren },
    { id: 'doors', name: 'Door Analytics', icon: Eye },
    { id: 'surveillance', name: 'Track Surveillance', icon: ShieldCheck },
    { id: 'weather', name: 'Weather & Disasters', icon: CloudRain },
    { id: 'medical', name: 'Medical Monitoring', icon: Heart },
    { id: 'settings', name: 'System Settings', icon: Settings }
  ]

  const handleModuleSelect = (moduleId: string) => {
    setActiveModule(moduleId)
    setIsOpen(false)
  }

  // Swipe to close drawer
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => setIsOpen(false),
  }, {
    threshold: 60,
    deltaThreshold: 15
  })

  return (
    <div className="lg:hidden">
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
        <DrawerTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-xl border-border/60 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <List size={18} />
          </Button>
        </DrawerTrigger>
        
        <DrawerContent className="w-80 border-r border-border/50 bg-white/95 backdrop-blur-md" {...swipeHandlers}>
          <DrawerHeader className="border-b border-border/30 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-sm">
                  <Train size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <DrawerTitle className="text-lg font-semibold">SmartRail-AI</DrawerTitle>
                  <p className="text-xs text-muted-foreground font-medium">Railway Intelligence</p>
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="rounded-lg">
                  <X size={18} />
                </Button>
              </DrawerClose>
            </div>
            
            {/* Swipe indicator */}
            <div className="flex items-center justify-center gap-2 mt-3 py-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Swatches size={14} />
                <span className="text-xs">Swipe left to close</span>
              </div>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* System Status - Mobile Compact */}
            <div className="bg-gradient-to-br from-card/80 to-card/40 rounded-xl p-4 border border-border/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity size={14} className="text-primary" />
                </div>
                <h3 className="font-semibold text-sm">System Status</h3>
              </div>
              
              <div className="space-y-4">
                {/* Network Health */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Network Health</span>
                    <span className="text-sm font-bold text-primary">{systemStatus.networkHealth}%</span>
                  </div>
                  <Progress value={systemStatus.networkHealth} className="h-1.5" />
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center space-y-1 p-2 bg-secondary/40 rounded-lg">
                    <div className="text-lg font-bold text-primary">{systemStatus.activeTrains}</div>
                    <div className="text-xs text-muted-foreground">Active Trains</div>
                  </div>
                  <div className="text-center space-y-1 p-2 bg-secondary/40 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{systemStatus.criticalAlerts}</div>
                    <div className="text-xs text-muted-foreground">Alerts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Modules */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground mb-3">Control Modules</h3>
              <nav className="space-y-1">
                {modules.map(module => {
                  const Icon = module.icon
                  const isActive = activeModule === module.id
                  return (
                    <button
                      key={module.id}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => handleModuleSelect(module.id)}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                      <span className="font-medium text-sm flex-1 text-left">{module.name}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-primary-foreground/70 rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Service Status Indicators */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Service Status</h4>
              <div className="space-y-1.5">
                {[
                  { name: 'AI Processing', status: 'active' },
                  { name: 'Camera Network', status: 'online' },
                  { name: 'Weather Data', status: 'live' },
                  { name: 'Track Sensors', status: 'active' }
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium">{service.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-green-50 text-green-700 border-green-200 h-5 px-2"
                    >
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="border-t border-border/30 p-4 bg-white/30 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">
                Last Update: {new Date(systemStatus.lastUpdate).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default MobileNavigation