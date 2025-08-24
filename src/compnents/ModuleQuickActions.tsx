import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings as SettingsIcon,
  Eye,
  AlertTriangle,
  Activity,
  Zap,
  MapPin,
  Crosshair,
  Navigation,
  Siren,
  Phone,
  Heart,
  ShieldCheck,
  Warning,
  Ban
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { hapticFeedback } from '../utils/mobileUtils'

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ size: number; className?: string }>
  variant?: 'default' | 'destructive' | 'secondary'
  action: () => void
}

interface ModuleQuickActionsProps {
  moduleId: string
  moduleName: string
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
}

export default function ModuleQuickActions({ 
  moduleId, 
  moduleName, 
  isOpen, 
  onClose,
  position 
}: ModuleQuickActionsProps) {
  const [isExecuting, setIsExecuting] = useState<string | null>(null)

  // Define quick actions based on module type
  const getQuickActions = (moduleId: string): QuickAction[] => {
    const commonActions: QuickAction[] = [
      {
        id: 'view-details',
        label: 'View Details',
        icon: Eye,
        action: () => {
          toast.success(`Opening ${moduleName} details`, {
            duration: 2000,
            position: 'bottom-center'
          })
        }
      },
      {
        id: 'refresh',
        label: 'Refresh Data',
        icon: RotateCcw,
        action: () => {
          setIsExecuting('refresh')
          hapticFeedback.light()
          setTimeout(() => {
            setIsExecuting(null)
            toast.success(`${moduleName} data refreshed`, {
              duration: 2000,
              position: 'bottom-center'
            })
          }, 1500)
        }
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: SettingsIcon,
        variant: 'secondary' as const,
        action: () => {
          toast.info(`Opening ${moduleName} settings`, {
            duration: 2000,
            position: 'bottom-center'
          })
        }
      }
    ]

    switch (moduleId) {
      case 'ml-optimizer':
        return [
          {
            id: 'start-optimization',
            label: 'Start Global Optimization',
            icon: Zap,
            action: () => {
              setIsExecuting('start-optimization')
              hapticFeedback.medium()
              setTimeout(() => {
                setIsExecuting(null)
                toast.success('Global ML optimization started', {
                  duration: 2000,
                  position: 'bottom-center'
                })
              }, 2000)
            }
          },
          {
            id: 'pause-training',
            label: 'Pause Training',
            icon: Pause,
            variant: 'secondary' as const,
            action: () => {
              toast.warning('ML training paused', {
                duration: 2000,
                position: 'bottom-center'
              })
            }
          },
          {
            id: 'reset-models',
            label: 'Reset Models',
            icon: RotateCcw,
            variant: 'destructive' as const,
            action: () => {
              hapticFeedback.heavy()
              toast.error('All ML models reset to baseline', {
                duration: 3000,
                position: 'bottom-center'
              })
            }
          },
          ...commonActions
        ]

      case 'network':
        return [
          {
            id: 'emergency-stop',
            label: 'Emergency Stop',
            icon: AlertTriangle,
            variant: 'destructive' as const,
            action: () => {
              hapticFeedback.heavy()
              toast.error('Emergency stop activated!', {
                duration: 3000,
                position: 'bottom-center'
              })
            }
          },
          {
            id: 'optimize-routes',
            label: 'Optimize Routes',
            icon: Zap,
            action: () => {
              setIsExecuting('optimize-routes')
              hapticFeedback.medium()
              setTimeout(() => {
                setIsExecuting(null)
                toast.success('Route optimization complete', {
                  duration: 2000,
                  position: 'bottom-center'
                })
              }, 2000)
            }
          },
          ...commonActions
        ]

      case 'emergency':
        return [
          {
            id: 'create-incident',
            label: 'Report Incident',
            icon: Siren,
            variant: 'destructive' as const,
            action: () => {
              hapticFeedback.heavy()
              toast.error('Emergency incident reporting activated!', {
                duration: 3000,
                position: 'bottom-center'
              })
            }
          },
          {
            id: 'emergency-call',
            label: 'Emergency Call',
            icon: Phone,
            variant: 'destructive' as const,
            action: () => {
              hapticFeedback.heavy()
              toast.error('Initiating emergency call to dispatch', {
                duration: 3000,
                position: 'bottom-center'
              })
            }
          },
          {
            id: 'dispatch-medical',
            label: 'Dispatch Medical',
            icon: Heart,
            action: () => {
              hapticFeedback.medium()
              toast.success('Medical team dispatched', {
                duration: 2000,
                position: 'bottom-center'
              })
            }
          },
          ...commonActions
        ]

      case 'tracking':
        return [
          {
            id: 'locate-train',
            label: 'Locate Train',
            icon: Crosshair,
            action: () => {
              hapticFeedback.medium()
              toast.success('GPS tracking activated', {
                duration: 2000,
                position: 'bottom-center'
              })
            }
          },
          {
            id: 'update-positions',
            label: 'Update Positions',
            icon: Navigation,
            action: () => {
              setIsExecuting('update-positions')
              setTimeout(() => {
                setIsExecuting(null)
                toast.success('Live positions updated', {
                  duration: 2000,
                  position: 'bottom-center'
                })
              }, 1000)
            }
          },
          {
            id: 'center-map',
            label: 'Center Map',
            icon: MapPin,
            action: () => {
              toast.info('Map centered on active trains', {
                duration: 2000,
                position: 'bottom-center'
              })
            }
          },
          ...commonActions
        ]

      case 'doors':
        return [
          {
            id: 'pause-detection',
            label: 'Pause Detection',
            icon: Pause,
            action: () => {
              toast.warning('Door detection paused', {
                duration: 2000,
                position: 'bottom-center'
              })
            }
          },
          {
            id: 'resume-detection',
            label: 'Resume Detection',
            icon: Play,
            action: () => {
              toast.success('Door detection resumed', {
                duration: 2000,
                position: 'bottom-center'
              })
            }
          },
          ...commonActions
        ]

      case 'surveillance':
        return [
          {
            id: 'alert-mode',
            label: 'High Alert Mode',
            icon: AlertTriangle,
            variant: 'destructive' as const,
            action: () => {
              hapticFeedback.heavy()
              toast.warning('High alert mode activated', {
                duration: 3000,
                position: 'bottom-center'
              })
            }
          },
          ...commonActions
        ]

      case 'weather':
        return [
          {
            id: 'update-forecast',
            label: 'Update Forecast',
            icon: Activity,
            action: () => {
              setIsExecuting('update-forecast')
              setTimeout(() => {
                setIsExecuting(null)
                toast.success('Weather forecast updated', {
                  duration: 2000,
                  position: 'bottom-center'
                })
              }, 1000)
            }
          },
          ...commonActions
        ]

      case 'medical':
        return [
          {
            id: 'emergency-alert',
            label: 'Emergency Alert',
            icon: AlertTriangle,
            variant: 'destructive' as const,
            action: () => {
              hapticFeedback.heavy()
              toast.error('Medical emergency alert sent!', {
                duration: 3000,
                position: 'bottom-center'
              })
            }
          },
          ...commonActions
        ]

      case 'collision-avoidance':
        return [
          {
            id: 'emergency-stop-all',
            label: 'Emergency Stop All',
            icon: Ban,
            variant: 'destructive' as const,
            action: () => {
              hapticFeedback.heavy()
              toast.error('Emergency stop - all drones halted!', {
                duration: 3000,
                position: 'bottom-center'
              })
            }
          },
          {
            id: 'activate-shields',
            label: 'Activate Safety Protocols',
            icon: ShieldCheck,
            action: () => {
              setIsExecuting('activate-shields')
              hapticFeedback.medium()
              setTimeout(() => {
                setIsExecuting(null)
                toast.success('Enhanced safety protocols activated', {
                  duration: 2000,
                  position: 'bottom-center'
                })
              }, 1500)
            }
          },
          {
            id: 'simulate-scenario',
            label: 'Test Collision Scenario',
            icon: Warning,
            variant: 'secondary' as const,
            action: () => {
              setIsExecuting('simulate-scenario')
              hapticFeedback.light()
              setTimeout(() => {
                setIsExecuting(null)
                toast.info('Collision scenario simulation complete', {
                  duration: 2000,
                  position: 'bottom-center'
                })
              }, 2000)
            }
          },
          ...commonActions
        ]

      default:
        return commonActions
    }
  }

  const quickActions = getQuickActions(moduleId)

  const executeAction = async (action: QuickAction) => {
    try {
      hapticFeedback.light()
      action.action()
      onClose()
    } catch (error) {
      toast.error('Action failed. Please try again.', {
        duration: 2000,
        position: 'bottom-center'
      })
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Quick Actions Panel */}
      <div 
        className="fixed z-50 animate-in fade-in-0 zoom-in-95 duration-200"
        style={{
          left: Math.min(position.x - 150, window.innerWidth - 320),
          top: Math.min(position.y - 50, window.innerHeight - 400),
        }}
      >
        <Card className="w-80 shadow-2xl border-border/50 bg-white/95 backdrop-blur-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">{moduleName}</CardTitle>
                <p className="text-sm text-muted-foreground">Quick Actions</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full hover:bg-secondary/60"
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                const isLoading = isExecuting === action.id
                
                return (
                  <Button
                    key={action.id}
                    variant={action.variant || 'default'}
                    onClick={() => executeAction(action)}
                    disabled={isLoading}
                    className="w-full justify-start gap-3 h-12 text-left rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon size={16} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <span className="font-medium text-sm">{action.label}</span>
                    </div>

                    {action.variant === 'destructive' && (
                      <Badge variant="destructive" className="text-xs">
                        High Risk
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>

            {/* Quick Tips */}
            <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                💡 Tip: Long-press any module for quick access to these actions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}