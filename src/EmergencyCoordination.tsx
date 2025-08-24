import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  Siren, 
  Lightning, 
  Heart, 
  Fire, 
  Phone, 
  MapPin, 
  Clock, 
  Users,
  RadioButton,
  Truck,
  Hospital,
  Shield,
  Warning,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  Activity,
  Target,
  Navigation,
  BookOpen,
  GraduationCap,
  Play,
  Pause,
  CheckSquare,
  FileText,
  VideoCamera,
  Headphones,
  Calendar,
  ChartLine,
  Flag,
  Alarm,
  Gauge,
  Eye
} from '@phosphor-icons/react'

interface EmergencyProtocol {
  id: string
  title: string
  type: EmergencyIncident['type']
  severity: EmergencyIncident['severity']
  steps: ProtocolStep[]
  estimatedDuration: number // minutes
  requiredCertifications: string[]
  lastUpdated: string
  version: string
}

interface ProtocolStep {
  id: string
  order: number
  title: string
  description: string
  isCompleted?: boolean
  estimatedTime: number // minutes
  requiredRole?: string
  criticalStep: boolean
  dependencies?: string[] // other step IDs
  resources?: string[]
}

interface TrainingModule {
  id: string
  title: string
  description: string
  type: 'video' | 'interactive' | 'assessment' | 'drill'
  duration: number // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  objectives: string[]
  content: TrainingContent
  assessmentScore?: number
  completedAt?: string
  certification?: string
}

interface TrainingContent {
  sections: TrainingSection[]
  totalSteps: number
  currentStep: number
}

interface TrainingSection {
  id: string
  title: string
  type: 'text' | 'video' | 'quiz' | 'simulation'
  content: string
  duration: number
  completed: boolean
}

interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  certifications: string[]
  trainingProgress: {
    completed: string[]
    inProgress: string[]
    scheduled: string[]
  }
  emergencyRole: string
  contactInfo: {
    phone: string
    radio: string
    email: string
  }
  availability: 'available' | 'busy' | 'off_duty' | 'emergency_only'
  lastTraining: string
}

interface EmergencyDrill {
  id: string
  title: string
  scenario: string
  type: EmergencyIncident['type']
  scheduledDate: string
  duration: number
  participants: string[]
  objectives: string[]
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  results?: DrillResults
}

interface DrillResults {
  responseTime: number
  protocolCompliance: number
  participantScores: { [staffId: string]: number }
  improvements: string[]
  nextDrillDate: string
}
interface EmergencyIncident {
  id: string
  type: 'medical' | 'fire' | 'collision' | 'evacuation' | 'security' | 'weather' | 'infrastructure'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'responding' | 'contained' | 'resolved' | 'escalated'
  title: string
  description: string
  location: {
    line: string
    station: string
    coordinates: { lat: number; lng: number }
    trainId?: string
  }
  timestamp: string
  estimatedImpact: {
    affectedTrains: number
    delayMinutes: number
    passengersAffected: number
  }
  resources: EmergencyResource[]
  responseTeam: ResponseTeamMember[]
  timeline: TimelineEvent[]
  priority: number
  activeProtocol?: string // Protocol ID being followed
  protocolProgress?: number // 0-100
}

interface EmergencyResource {
  id: string
  type: 'ambulance' | 'fire_truck' | 'police' | 'technical' | 'evacuation'
  status: 'dispatched' | 'en_route' | 'on_scene' | 'available' | 'unavailable'
  eta: string
  location: string
  contact: string
}

interface ResponseTeamMember {
  id: string
  name: string
  role: string
  department: string
  status: 'assigned' | 'en_route' | 'on_scene' | 'available'
  contact: string
}

interface TimelineEvent {
  id: string
  timestamp: string
  event: string
  source: string
  priority: 'info' | 'warning' | 'critical'
}

function EmergencyCoordination() {
  const [activeIncidents, setActiveIncidents] = useKV<EmergencyIncident[]>('emergency-incidents', [])
  const [emergencyProtocols, setEmergencyProtocols] = useKV<EmergencyProtocol[]>('emergency-protocols', [
    {
      id: 'medical-critical',
      title: 'Critical Medical Emergency Response',
      type: 'medical',
      severity: 'critical',
      estimatedDuration: 15,
      requiredCertifications: ['First Aid', 'Emergency Response'],
      lastUpdated: new Date().toISOString(),
      version: '2.1',
      steps: [
        {
          id: 'step-1',
          order: 1,
          title: 'Immediate Assessment',
          description: 'Assess victim consciousness, breathing, and pulse. Call for medical assistance immediately.',
          estimatedTime: 2,
          criticalStep: true,
          resources: ['First Aid Kit', 'AED']
        },
        {
          id: 'step-2',
          order: 2,
          title: 'Scene Safety',
          description: 'Ensure scene is safe for responders. Evacuate surrounding area if necessary.',
          estimatedTime: 3,
          criticalStep: true,
          dependencies: ['step-1']
        },
        {
          id: 'step-3',
          order: 3,
          title: 'Emergency Services Contact',
          description: 'Contact emergency medical services with precise location and victim status.',
          estimatedTime: 2,
          criticalStep: true,
          resources: ['Emergency Phone']
        },
        {
          id: 'step-4',
          order: 4,
          title: 'Medical Intervention',
          description: 'Provide CPR or other life-saving measures as trained. Use AED if available.',
          estimatedTime: 5,
          requiredRole: 'Certified First Aider',
          criticalStep: true,
          dependencies: ['step-2', 'step-3']
        },
        {
          id: 'step-5',
          order: 5,
          title: 'Traffic Control',
          description: 'Coordinate with dispatch to halt train traffic and manage passenger flow.',
          estimatedTime: 3,
          requiredRole: 'Dispatcher',
          criticalStep: false,
          dependencies: ['step-2']
        }
      ]
    },
    {
      id: 'fire-emergency',
      title: 'Fire Emergency Protocol',
      type: 'fire',
      severity: 'high',
      estimatedDuration: 20,
      requiredCertifications: ['Fire Safety', 'Emergency Response'],
      lastUpdated: new Date().toISOString(),
      version: '3.0',
      steps: [
        {
          id: 'fire-1',
          order: 1,
          title: 'Fire Detection & Alarm',
          description: 'Activate fire alarm system and notify all personnel immediately.',
          estimatedTime: 1,
          criticalStep: true
        },
        {
          id: 'fire-2',
          order: 2,
          title: 'Evacuation Initiation',
          description: 'Begin immediate evacuation of affected areas using emergency routes.',
          estimatedTime: 5,
          criticalStep: true,
          dependencies: ['fire-1']
        },
        {
          id: 'fire-3',
          order: 3,
          title: 'Fire Department Contact',
          description: 'Contact fire department with location, type of fire, and evacuation status.',
          estimatedTime: 2,
          criticalStep: true,
          resources: ['Emergency Phone']
        },
        {
          id: 'fire-4',
          order: 4,
          title: 'Suppression Attempt',
          description: 'If safe, attempt to suppress fire using available fire suppression equipment.',
          estimatedTime: 8,
          requiredRole: 'Fire Warden',
          criticalStep: false,
          dependencies: ['fire-2'],
          resources: ['Fire Extinguisher', 'Fire Blanket']
        },
        {
          id: 'fire-5',
          order: 5,
          title: 'System Isolation',
          description: 'Isolate electrical systems and gas lines in affected areas.',
          estimatedTime: 4,
          requiredRole: 'Technical Staff',
          criticalStep: true,
          dependencies: ['fire-2']
        }
      ]
    }
  ])

  const [trainingModules, setTrainingModules] = useKV<TrainingModule[]>('training-modules', [
    {
      id: 'emergency-basics',
      title: 'Emergency Response Fundamentals',
      description: 'Core principles and procedures for railway emergency response',
      type: 'interactive',
      duration: 45,
      difficulty: 'beginner',
      prerequisites: [],
      objectives: [
        'Understand emergency classification system',
        'Learn initial response procedures',
        'Master communication protocols',
        'Practice decision-making skills'
      ],
      content: {
        sections: [
          {
            id: 'intro',
            title: 'Introduction to Emergency Response',
            type: 'video',
            content: 'Overview of emergency types and response hierarchy',
            duration: 10,
            completed: false
          },
          {
            id: 'classification',
            title: 'Emergency Classification',
            type: 'text',
            content: 'Learn to classify emergencies by type and severity',
            duration: 15,
            completed: false
          },
          {
            id: 'protocols',
            title: 'Standard Operating Procedures',
            type: 'interactive',
            content: 'Step-by-step protocol walkthrough',
            duration: 15,
            completed: false
          },
          {
            id: 'assessment',
            title: 'Knowledge Assessment',
            type: 'quiz',
            content: '10 questions on emergency response basics',
            duration: 5,
            completed: false
          }
        ],
        totalSteps: 4,
        currentStep: 0
      }
    },
    {
      id: 'medical-response',
      title: 'Medical Emergency Response',
      description: 'Specialized training for medical emergencies in railway environments',
      type: 'video',
      duration: 60,
      difficulty: 'intermediate',
      prerequisites: ['emergency-basics'],
      objectives: [
        'Assess medical emergency severity',
        'Provide appropriate first aid',
        'Coordinate with medical services',
        'Manage crowd control during medical incidents'
      ],
      content: {
        sections: [
          {
            id: 'med-assessment',
            title: 'Medical Emergency Assessment',
            type: 'video',
            content: 'Rapid assessment techniques for railway medical emergencies',
            duration: 20,
            completed: false
          },
          {
            id: 'first-aid',
            title: 'First Aid Procedures',
            type: 'simulation',
            content: 'Hands-on first aid training simulation',
            duration: 25,
            completed: false
          },
          {
            id: 'coordination',
            title: 'Medical Service Coordination',
            type: 'text',
            content: 'Protocols for working with emergency medical services',
            duration: 10,
            completed: false
          },
          {
            id: 'med-quiz',
            title: 'Medical Response Assessment',
            type: 'quiz',
            content: 'Comprehensive medical emergency scenarios',
            duration: 5,
            completed: false
          }
        ],
        totalSteps: 4,
        currentStep: 0
      }
    }
  ])

  const [staffMembers, setStaffMembers] = useKV<StaffMember[]>('staff-members', [
    {
      id: 'staff-001',
      name: 'Sarah Chen',
      role: 'Emergency Coordinator',
      department: 'Safety',
      certifications: ['Emergency Response', 'First Aid', 'Fire Safety'],
      emergencyRole: 'Incident Commander',
      contactInfo: {
        phone: '+1-555-0101',
        radio: 'CH-1',
        email: 'sarah.chen@smartrail.ai'
      },
      availability: 'available',
      lastTraining: '2024-01-15',
      trainingProgress: {
        completed: ['emergency-basics', 'medical-response'],
        inProgress: ['fire-response'],
        scheduled: ['evacuation-procedures']
      }
    },
    {
      id: 'staff-002',
      name: 'Marcus Rodriguez',
      role: 'Station Manager',
      department: 'Operations',
      certifications: ['Emergency Response', 'Crowd Management'],
      emergencyRole: 'Evacuation Coordinator',
      contactInfo: {
        phone: '+1-555-0102',
        radio: 'CH-2',
        email: 'marcus.rodriguez@smartrail.ai'
      },
      availability: 'available',
      lastTraining: '2024-01-10',
      trainingProgress: {
        completed: ['emergency-basics'],
        inProgress: ['medical-response'],
        scheduled: ['fire-response', 'evacuation-procedures']
      }
    }
  ])

  const [emergencyDrills, setEmergencyDrills] = useKV<EmergencyDrill[]>('emergency-drills', [
    {
      id: 'drill-001',
      title: 'Station Evacuation Drill',
      scenario: 'Fire emergency in central station requiring full evacuation',
      type: 'fire',
      scheduledDate: '2024-02-15T10:00:00',
      duration: 120,
      participants: ['staff-001', 'staff-002'],
      objectives: [
        'Test evacuation procedures',
        'Evaluate response times',
        'Assess coordination effectiveness',
        'Practice crowd management'
      ],
      status: 'scheduled'
    }
  ])

  const [emergencyContacts, setEmergencyContacts] = useKV('emergency-contacts', {
    fire: '+1-911-FIRE',
    medical: '+1-911-MEDICAL',
    police: '+1-911-POLICE',
    technical: '+1-800-RAIL-TECH',
    management: '+1-800-RAIL-MGT'
  })

  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null)
  const [activeTraining, setActiveTraining] = useState<string | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)

  const [newIncidentForm, setNewIncidentForm] = useState({
    type: 'medical' as EmergencyIncident['type'],
    severity: 'medium' as EmergencyIncident['severity'],
    title: '',
    description: '',
    line: '',
    station: '',
    trainId: ''
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update incident statuses and timelines
      setActiveIncidents(current => 
        current.map(incident => {
          if (incident.status === 'active' && Math.random() > 0.8) {
            const newEvent: TimelineEvent = {
              id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
              event: 'Status update received from field team',
              source: 'Field Coordinator',
              priority: 'info'
            }
            
            return {
              ...incident,
              timeline: [...incident.timeline, newEvent],
              protocolProgress: incident.activeProtocol 
                ? Math.min((incident.protocolProgress || 0) + Math.random() * 15, 100)
                : undefined
            }
          }
          return incident
        })
      )
    }, 15000)

    return () => clearInterval(interval)
  }, [setActiveIncidents])

  const activateProtocol = (incidentId: string, protocolId: string) => {
    const protocol = emergencyProtocols.find(p => p.id === protocolId)
    if (!protocol) return

    setActiveIncidents(current =>
      current.map(incident =>
        incident.id === incidentId
          ? {
              ...incident,
              activeProtocol: protocolId,
              protocolProgress: 0,
              timeline: [
                ...incident.timeline,
                {
                  id: `evt_${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  event: `Emergency protocol "${protocol.title}" activated`,
                  source: 'Control Center',
                  priority: 'warning'
                }
              ]
            }
          : incident
      )
    )
    toast.success(`Protocol "${protocol.title}" activated`)
  }

  const updateProtocolStep = (incidentId: string, stepId: string, completed: boolean) => {
    setActiveIncidents(current =>
      current.map(incident => {
        if (incident.id !== incidentId || !incident.activeProtocol) return incident

        const protocol = emergencyProtocols.find(p => p.id === incident.activeProtocol)
        if (!protocol) return incident

        const updatedSteps = protocol.steps.map(step =>
          step.id === stepId ? { ...step, isCompleted: completed } : step
        )

        const completedSteps = updatedSteps.filter(s => s.isCompleted).length
        const progress = (completedSteps / protocol.steps.length) * 100

        return {
          ...incident,
          protocolProgress: progress,
          timeline: [
            ...incident.timeline,
            {
              id: `evt_${Date.now()}`,
              timestamp: new Date().toISOString(),
              event: `Protocol step "${protocol.steps.find(s => s.id === stepId)?.title}" ${completed ? 'completed' : 'reset'}`,
              source: 'Field Team',
              priority: 'info'
            }
          ]
        }
      })
    )

    // Update the protocol in the protocols array
    setEmergencyProtocols(current =>
      current.map(protocol => ({
        ...protocol,
        steps: protocol.steps.map(step =>
          step.id === stepId ? { ...step, isCompleted: completed } : step
        )
      }))
    )
  }

  const startTrainingModule = (moduleId: string) => {
    setActiveTraining(moduleId)
    
    // Update training progress
    setTrainingModules(current =>
      current.map(module =>
        module.id === moduleId
          ? {
              ...module,
              content: {
                ...module.content,
                currentStep: 0,
                sections: module.content.sections.map((section, index) => ({
                  ...section,
                  completed: index === 0 ? true : section.completed
                }))
              }
            }
          : module
      )
    )
    toast.success('Training module started')
  }

  const completeTrainingSection = (moduleId: string, sectionId: string) => {
    setTrainingModules(current =>
      current.map(module => {
        if (module.id !== moduleId) return module

        const updatedSections = module.content.sections.map(section =>
          section.id === sectionId ? { ...section, completed: true } : section
        )

        const completedCount = updatedSections.filter(s => s.completed).length
        const isModuleComplete = completedCount === module.content.totalSteps

        return {
          ...module,
          content: {
            ...module.content,
            sections: updatedSections,
            currentStep: Math.min(completedCount, module.content.totalSteps)
          },
          completedAt: isModuleComplete ? new Date().toISOString() : module.completedAt,
          assessmentScore: isModuleComplete ? 85 + Math.random() * 15 : module.assessmentScore
        }
      })
    )
    toast.success('Section completed')
  }

  const scheduleEmergencyDrill = (drillData: Partial<EmergencyDrill>) => {
    const newDrill: EmergencyDrill = {
      id: `drill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: drillData.title || 'Emergency Drill',
      scenario: drillData.scenario || 'Standard emergency scenario',
      type: drillData.type || 'medical',
      scheduledDate: drillData.scheduledDate || new Date(Date.now() + 86400000).toISOString(),
      duration: drillData.duration || 60,
      participants: drillData.participants || [],
      objectives: drillData.objectives || [],
      status: 'scheduled'
    }

    setEmergencyDrills(current => [newDrill, ...current])
    toast.success('Emergency drill scheduled')
  }

  const createIncident = () => {
    if (!newIncidentForm.title || !newIncidentForm.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const newIncident: EmergencyIncident = {
      id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: newIncidentForm.type,
      severity: newIncidentForm.severity,
      status: 'active',
      title: newIncidentForm.title,
      description: newIncidentForm.description,
      location: {
        line: newIncidentForm.line,
        station: newIncidentForm.station,
        coordinates: { lat: 40.7128 + Math.random() * 0.1, lng: -74.0060 + Math.random() * 0.1 },
        trainId: newIncidentForm.trainId || undefined
      },
      timestamp: new Date().toISOString(),
      estimatedImpact: {
        affectedTrains: Math.floor(Math.random() * 5) + 1,
        delayMinutes: Math.floor(Math.random() * 30) + 5,
        passengersAffected: Math.floor(Math.random() * 500) + 50
      },
      resources: [],
      responseTeam: [],
      timeline: [{
        id: `evt_${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: 'Incident reported and logged',
        source: 'Control Center',
        priority: 'info'
      }],
      priority: newIncidentForm.severity === 'critical' ? 1 : 
                newIncidentForm.severity === 'high' ? 2 : 
                newIncidentForm.severity === 'medium' ? 3 : 4
    }

    setActiveIncidents(current => [newIncident, ...current])
    
    // Reset form
    setNewIncidentForm({
      type: 'medical',
      severity: 'medium',
      title: '',
      description: '',
      line: '',
      station: '',
      trainId: ''
    })

    toast.success(`Emergency incident ${newIncident.id} created and dispatched`)
  }

  const updateIncidentStatus = (incidentId: string, newStatus: EmergencyIncident['status']) => {
    setActiveIncidents(current =>
      current.map(incident =>
        incident.id === incidentId
          ? {
              ...incident,
              status: newStatus,
              timeline: [
                ...incident.timeline,
                {
                  id: `evt_${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  event: `Status changed to ${newStatus}`,
                  source: 'Control Center',
                  priority: 'info'
                }
              ]
            }
          : incident
      )
    )
    toast.success(`Incident status updated to ${newStatus}`)
  }

  const dispatchResource = (incidentId: string, resourceType: EmergencyResource['type']) => {
    const resource: EmergencyResource = {
      id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: resourceType,
      status: 'dispatched',
      eta: new Date(Date.now() + Math.random() * 900000 + 300000).toLocaleTimeString(), // 5-20 min ETA
      location: 'Central Dispatch',
      contact: emergencyContacts[resourceType === 'ambulance' ? 'medical' : 
                                resourceType === 'fire_truck' ? 'fire' : 
                                resourceType === 'police' ? 'police' : 'technical']
    }

    setActiveIncidents(current =>
      current.map(incident =>
        incident.id === incidentId
          ? {
              ...incident,
              resources: [...incident.resources, resource],
              timeline: [
                ...incident.timeline,
                {
                  id: `evt_${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  event: `${resourceType} dispatched - ETA ${resource.eta}`,
                  source: 'Dispatch Center',
                  priority: 'warning'
                }
              ]
            }
          : incident
      )
    )
    toast.success(`${resourceType} dispatched`)
  }

  const getIncidentIcon = (type: EmergencyIncident['type']) => {
    switch (type) {
      case 'medical': return Heart
      case 'fire': return Fire
      case 'collision': return Lightning
      case 'evacuation': return Users
      case 'security': return Shield
      case 'weather': return Warning
      case 'infrastructure': return Target
      default: return AlertTriangle
    }
  }

  const getSeverityColor = (severity: EmergencyIncident['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: EmergencyIncident['status']) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-50'
      case 'responding': return 'text-orange-600 bg-orange-50'
      case 'contained': return 'text-blue-600 bg-blue-50'
      case 'resolved': return 'text-green-600 bg-green-50'
      case 'escalated': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const criticalIncidents = activeIncidents.filter(i => i.severity === 'critical').length
  const activeCount = activeIncidents.filter(i => i.status === 'active').length

  return (
    <div className="space-y-6 p-6">
      {/* Emergency Overview */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Siren size={20} className="text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Emergency Response Coordination</h1>
            <p className="text-muted-foreground">Real-time incident management and resource dispatch</p>
          </div>
        </div>

        {/* Alert Status */}
        {criticalIncidents > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>{criticalIncidents} critical incident{criticalIncidents !== 1 ? 's' : ''}</strong> requiring immediate attention
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{activeCount}</div>
              <div className="text-sm text-muted-foreground">Active Incidents</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{criticalIncidents}</div>
              <div className="text-sm text-muted-foreground">Critical Level</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {activeIncidents.reduce((sum, i) => sum + i.resources.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Resources Deployed</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {activeIncidents.reduce((sum, i) => sum + i.estimatedImpact.passengersAffected, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Passengers Affected</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="incidents" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="incidents" className="text-xs md:text-sm">Incidents</TabsTrigger>
          <TabsTrigger value="protocols" className="text-xs md:text-sm">Protocols</TabsTrigger>
          <TabsTrigger value="training" className="text-xs md:text-sm">Training</TabsTrigger>
          <TabsTrigger value="staff" className="text-xs md:text-sm">Staff</TabsTrigger>
          <TabsTrigger value="drills" className="text-xs md:text-sm">Drills</TabsTrigger>
        </TabsList>

        {/* Active Incidents Tab */}
        <TabsContent value="incidents" className="space-y-4">
          {activeIncidents.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Incidents</h3>
                <p className="text-muted-foreground">All systems operating normally</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeIncidents
                .sort((a, b) => a.priority - b.priority)
                .map((incident) => {
                const IncidentIcon = getIncidentIcon(incident.type)
                return (
                  <Card key={incident.id} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)} mt-2`}></div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <IncidentIcon size={20} className="text-muted-foreground" />
                                <h3 className="font-semibold">{incident.title}</h3>
                                <Badge className={getStatusColor(incident.status)} variant="secondary">
                                  {incident.status}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {incident.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{incident.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {incident.location.line} - {incident.location.station}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {new Date(incident.timestamp).toLocaleTimeString()}
                                </div>
                                {incident.location.trainId && (
                                  <div className="flex items-center gap-1">
                                    <Navigation size={12} />
                                    Train {incident.location.trainId}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {incident.status === 'active' && (
                                <>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <FileText size={14} className="mr-1" />
                                        Protocol
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>Activate Emergency Protocol</DialogTitle>
                                        <DialogDescription>
                                          Select and activate appropriate protocol for this incident
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="space-y-4">
                                        {emergencyProtocols
                                          .filter(p => p.type === incident.type || p.severity === incident.severity)
                                          .map(protocol => (
                                            <Card key={protocol.id} className="border-0 shadow-sm">
                                              <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                  <div className="space-y-2">
                                                    <h4 className="font-semibold">{protocol.title}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                      <Badge variant="outline" className="capitalize">
                                                        {protocol.type}
                                                      </Badge>
                                                      <Badge variant="outline" className="capitalize">
                                                        {protocol.severity}
                                                      </Badge>
                                                      <span>{protocol.estimatedDuration} min</span>
                                                      <span>v{protocol.version}</span>
                                                    </div>
                                                    <p className="text-sm">
                                                      {protocol.steps.length} steps • {protocol.steps.filter(s => s.criticalStep).length} critical
                                                    </p>
                                                  </div>
                                                  <Button
                                                    size="sm"
                                                    onClick={() => activateProtocol(incident.id, protocol.id)}
                                                    disabled={incident.activeProtocol === protocol.id}
                                                  >
                                                    {incident.activeProtocol === protocol.id ? 'Active' : 'Activate'}
                                                  </Button>
                                                </div>
                                              </CardContent>
                                            </Card>
                                          ))}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateIncidentStatus(incident.id, 'responding')}
                                  >
                                    Mark Responding
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => setSelectedIncident(incident.id)}
                                  >
                                    Manage
                                  </Button>
                                </>
                              )}
                              {incident.status === 'responding' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateIncidentStatus(incident.id, 'contained')}
                                >
                                  Mark Contained
                                </Button>
                              )}
                              {incident.status === 'contained' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                                >
                                  Mark Resolved
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Protocol Progress */}
                          {incident.activeProtocol && (
                            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Flag size={16} className="text-blue-600" />
                                  <span className="font-medium text-blue-900">
                                    Active Protocol: {emergencyProtocols.find(p => p.id === incident.activeProtocol)?.title}
                                  </span>
                                </div>
                                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                                  {Math.round(incident.protocolProgress || 0)}% Complete
                                </Badge>
                              </div>
                              <Progress value={incident.protocolProgress || 0} className="h-2" />
                              
                              {/* Protocol Steps */}
                              <div className="space-y-2">
                                {emergencyProtocols
                                  .find(p => p.id === incident.activeProtocol)?.steps
                                  .slice(0, 3)
                                  .map(step => (
                                    <div key={step.id} className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${step.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <span className={step.isCompleted ? 'line-through text-muted-foreground' : ''}>
                                          {step.title}
                                        </span>
                                        {step.criticalStep && (
                                          <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                                        )}
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => updateProtocolStep(incident.id, step.id, !step.isCompleted)}
                                      >
                                        {step.isCompleted ? 'Undo' : 'Complete'}
                                      </Button>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Impact Summary */}
                          <div className="grid grid-cols-3 gap-4 p-3 bg-secondary/30 rounded-lg">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-destructive">
                                {incident.estimatedImpact.affectedTrains}
                              </div>
                              <div className="text-xs text-muted-foreground">Trains Affected</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-orange-600">
                                {incident.estimatedImpact.delayMinutes}min
                              </div>
                              <div className="text-xs text-muted-foreground">Est. Delay</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-600">
                                {incident.estimatedImpact.passengersAffected}
                              </div>
                              <div className="text-xs text-muted-foreground">Passengers</div>
                            </div>
                          </div>

                          {/* Resources */}
                          {incident.resources.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Deployed Resources</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {incident.resources.map((resource) => (
                                  <div key={resource.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="text-sm capitalize">{resource.type.replace('_', ' ')}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      ETA: {resource.eta}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Resource Dispatch */}
                          {incident.status === 'active' && (
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => dispatchResource(incident.id, 'ambulance')}
                              >
                                <Heart size={14} className="mr-1" />
                                Medical
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => dispatchResource(incident.id, 'fire_truck')}
                              >
                                <Fire size={14} className="mr-1" />
                                Fire
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => dispatchResource(incident.id, 'police')}
                              >
                                <Shield size={14} className="mr-1" />
                                Police
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => dispatchResource(incident.id, 'technical')}
                              >
                                <Truck size={14} className="mr-1" />
                                Technical
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Emergency Protocols Tab */}
        <TabsContent value="protocols" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Emergency Response Protocols</h3>
              <p className="text-sm text-muted-foreground">Standardized procedures for different emergency types</p>
            </div>
            <Button onClick={() => toast.info('Protocol editor coming soon')}>
              <FileText size={16} className="mr-2" />
              Create Protocol
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyProtocols.map(protocol => (
              <Card key={protocol.id} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{protocol.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">{protocol.type}</Badge>
                        <Badge variant="outline" className="capitalize">{protocol.severity}</Badge>
                        <span className="text-xs text-muted-foreground">v{protocol.version}</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{protocol.title}</DialogTitle>
                          <DialogDescription>
                            {protocol.type} • {protocol.severity} • Est. {protocol.estimatedDuration} minutes
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Required Certifications:</span>
                              <div className="mt-1 space-y-1">
                                {protocol.requiredCertifications.map(cert => (
                                  <Badge key={cert} variant="secondary" className="mr-1">{cert}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Last Updated:</span>
                              <p className="text-muted-foreground">
                                {new Date(protocol.lastUpdated).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <h4 className="font-medium">Protocol Steps</h4>
                            {protocol.steps
                              .sort((a, b) => a.order - b.order)
                              .map((step, index) => (
                                <div key={step.id} className="flex gap-4 p-4 border border-border rounded-lg">
                                  <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                      step.criticalStep 
                                        ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      {step.order}
                                    </div>
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-medium">{step.title}</h5>
                                      {step.criticalStep && (
                                        <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                                      )}
                                      <Badge variant="outline" className="text-xs">
                                        {step.estimatedTime} min
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                    
                                    {(step.requiredRole || step.resources) && (
                                      <div className="flex gap-4 text-xs">
                                        {step.requiredRole && (
                                          <div>
                                            <span className="font-medium">Role:</span> {step.requiredRole}
                                          </div>
                                        )}
                                        {step.resources && (
                                          <div>
                                            <span className="font-medium">Resources:</span> {step.resources.join(', ')}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-semibold">{protocol.steps.length}</div>
                      <div className="text-muted-foreground text-xs">Steps</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-600">
                        {protocol.steps.filter(s => s.criticalStep).length}
                      </div>
                      <div className="text-muted-foreground text-xs">Critical</div>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-600">{protocol.estimatedDuration}</div>
                      <div className="text-muted-foreground text-xs">Minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play size={14} className="mr-1" />
                      Simulate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Staff Training & Certification</h3>
              <p className="text-sm text-muted-foreground">Interactive training modules and progress tracking</p>
            </div>
            <Button onClick={() => toast.info('Training builder coming soon')}>
              <GraduationCap size={16} className="mr-2" />
              Create Module
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingModules.map(module => {
              const completedSections = module.content.sections.filter(s => s.completed).length
              const progressPercent = (completedSections / module.content.totalSteps) * 100
              
              return (
                <Card key={module.id} className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">{module.type}</Badge>
                          <Badge variant="outline" className="capitalize">{module.difficulty}</Badge>
                          <span className="text-xs text-muted-foreground">{module.duration} min</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {module.completedAt ? (
                          <div className="space-y-1">
                            <Badge variant="default" className="bg-green-100 text-green-700">
                              <CheckCircle size={12} className="mr-1" />
                              Completed
                            </Badge>
                            {module.assessmentScore && (
                              <div className="text-xs text-muted-foreground">
                                Score: {Math.round(module.assessmentScore)}%
                              </div>
                            )}
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => startTrainingModule(module.id)}
                            disabled={activeTraining === module.id}
                          >
                            {activeTraining === module.id ? 'Active' : progressPercent > 0 ? 'Continue' : 'Start'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{completedSections}/{module.content.totalSteps} sections</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    {/* Prerequisites */}
                    {module.prerequisites.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-sm font-medium">Prerequisites:</span>
                        <div className="flex flex-wrap gap-1">
                          {module.prerequisites.map(prereq => (
                            <Badge key={prereq} variant="secondary" className="text-xs">{prereq}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Objectives */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Learning Objectives:</span>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {module.objectives.slice(0, 2).map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            {objective}
                          </li>
                        ))}
                        {module.objectives.length > 2 && (
                          <li className="text-xs text-muted-foreground">
                            +{module.objectives.length - 2} more objectives
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Training Sections */}
                    {activeTraining === module.id && (
                      <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-900">Training Sections</h5>
                        <div className="space-y-2">
                          {module.content.sections.map((section, index) => (
                            <div key={section.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${section.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className={`text-sm ${section.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {section.title}
                                </span>
                                <Badge variant="outline" className="text-xs">{section.duration}m</Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => completeTrainingSection(module.id, section.id)}
                                disabled={section.completed}
                              >
                                {section.completed ? <CheckCircle size={14} /> : <Play size={14} />}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Staff Management Tab */}
        <TabsContent value="staff" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Emergency Response Staff</h3>
              <p className="text-sm text-muted-foreground">Staff certifications, availability, and training progress</p>
            </div>
            <Button onClick={() => toast.info('Staff management coming soon')}>
              <Users size={16} className="mr-2" />
              Add Staff
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staffMembers.map(staff => (
              <Card key={staff.id} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{staff.name}</CardTitle>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{staff.role} • {staff.department}</p>
                        <p className="text-sm font-medium text-blue-600">{staff.emergencyRole}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge 
                        variant={staff.availability === 'available' ? 'default' : 'secondary'}
                        className={staff.availability === 'available' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {staff.availability.replace('_', ' ')}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Phone size={14} className="mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Certifications */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Certifications:</span>
                    <div className="flex flex-wrap gap-1">
                      {staff.certifications.map(cert => (
                        <Badge key={cert} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Training Progress */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Training Progress:</span>
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="p-2 bg-green-50 rounded">
                        <div className="font-semibold text-green-700">{staff.trainingProgress.completed.length}</div>
                        <div className="text-green-600">Completed</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-700">{staff.trainingProgress.inProgress.length}</div>
                        <div className="text-blue-600">In Progress</div>
                      </div>
                      <div className="p-2 bg-orange-50 rounded">
                        <div className="font-semibold text-orange-700">{staff.trainingProgress.scheduled.length}</div>
                        <div className="text-orange-600">Scheduled</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm font-medium">Emergency Contact:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Phone:</span> {staff.contactInfo.phone}
                      </div>
                      <div>
                        <span className="font-medium">Radio:</span> {staff.contactInfo.radio}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <BookOpen size={14} className="mr-1" />
                      Training
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Activity size={14} className="mr-1" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Emergency Drills Tab */}
        <TabsContent value="drills" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Emergency Drills & Simulations</h3>
              <p className="text-sm text-muted-foreground">Practice scenarios and readiness assessments</p>
            </div>
            <Button onClick={() => 
              scheduleEmergencyDrill({
                title: 'Fire Evacuation Drill',
                scenario: 'Station fire requiring full evacuation',
                type: 'fire',
                duration: 90,
                participants: staffMembers.map(s => s.id),
                objectives: ['Test evacuation speed', 'Verify communication', 'Assess coordination']
              })
            }>
              <Calendar size={16} className="mr-2" />
              Schedule Drill
            </Button>
          </div>

          <div className="space-y-4">
            {emergencyDrills.map(drill => (
              <Card key={drill.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Alarm size={20} className="text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{drill.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="capitalize">{drill.type}</Badge>
                            <span>{drill.duration} minutes</span>
                            <span>{new Date(drill.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{drill.scenario}</p>
                      
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Objectives:</span>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {drill.objectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="font-medium">Participants:</span> {drill.participants.length} staff
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <Badge variant={
                            drill.status === 'completed' ? 'default' :
                            drill.status === 'active' ? 'destructive' :
                            drill.status === 'scheduled' ? 'secondary' : 'outline'
                          } className="ml-1 capitalize">
                            {drill.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {drill.status === 'scheduled' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Play size={14} className="mr-1" />
                            Start
                          </Button>
                          <Button size="sm" variant="outline">
                            <Users size={14} className="mr-1" />
                            Manage
                          </Button>
                        </>
                      )}
                      {drill.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <ChartLine size={14} className="mr-1" />
                          Results
                        </Button>
                      )}
                    </div>
                  </div>

                  {drill.results && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-900 mb-2">Drill Results</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Response Time:</span> {drill.results.responseTime} seconds
                        </div>
                        <div>
                          <span className="font-medium">Protocol Compliance:</span> {drill.results.protocolCompliance}%
                        </div>
                      </div>
                      {drill.results.improvements.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">Improvements Needed:</span>
                          <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                            {drill.results.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Legacy tabs for backward compatibility */}
        <TabsContent value="dispatch" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RadioButton size={20} />
                Emergency Contacts
              </CardTitle>
              <CardDescription>Quick access to emergency services and coordination teams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(emergencyContacts).map(([service, contact]) => (
                  <div key={service} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        {service === 'fire' && <Fire size={16} className="text-red-600" />}
                        {service === 'medical' && <Heart size={16} className="text-red-600" />}
                        {service === 'police' && <Shield size={16} className="text-blue-600" />}
                        {service === 'technical' && <Truck size={16} className="text-orange-600" />}
                        {service === 'management' && <Users size={16} className="text-green-600" />}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{service}</div>
                        <div className="text-sm text-muted-foreground">{contact}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone size={14} className="mr-1" />
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Incident Tab */}
        <TabsContent value="create" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Report New Emergency Incident</CardTitle>
              <CardDescription>Create and dispatch emergency response for immediate incidents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident Type</Label>
                  <Select
                    value={newIncidentForm.type}
                    onValueChange={(value) => 
                      setNewIncidentForm(prev => ({ ...prev, type: value as EmergencyIncident['type'] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical Emergency</SelectItem>
                      <SelectItem value="fire">Fire/Explosion</SelectItem>
                      <SelectItem value="collision">Train Collision</SelectItem>
                      <SelectItem value="evacuation">Emergency Evacuation</SelectItem>
                      <SelectItem value="security">Security Threat</SelectItem>
                      <SelectItem value="weather">Weather Emergency</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure Failure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select
                    value={newIncidentForm.severity}
                    onValueChange={(value) => 
                      setNewIncidentForm(prev => ({ ...prev, severity: value as EmergencyIncident['severity'] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Impact</SelectItem>
                      <SelectItem value="medium">Medium Impact</SelectItem>
                      <SelectItem value="high">High Impact</SelectItem>
                      <SelectItem value="critical">Critical - Immediate Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Incident Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the emergency"
                  value={newIncidentForm.title}
                  onChange={(e) => 
                    setNewIncidentForm(prev => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the emergency situation..."
                  rows={4}
                  value={newIncidentForm.description}
                  onChange={(e) => 
                    setNewIncidentForm(prev => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="line">Railway Line</Label>
                  <Input
                    id="line"
                    placeholder="e.g., Blue Line"
                    value={newIncidentForm.line}
                    onChange={(e) => 
                      setNewIncidentForm(prev => ({ ...prev, line: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="station">Station/Location</Label>
                  <Input
                    id="station"
                    placeholder="e.g., Central Station"
                    value={newIncidentForm.station}
                    onChange={(e) => 
                      setNewIncidentForm(prev => ({ ...prev, station: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="train-id">Train ID (Optional)</Label>
                  <Input
                    id="train-id"
                    placeholder="e.g., TR-4501"
                    value={newIncidentForm.trainId}
                    onChange={(e) => 
                      setNewIncidentForm(prev => ({ ...prev, trainId: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={createIncident}
                  className="flex-1"
                  variant={newIncidentForm.severity === 'critical' ? 'destructive' : 'default'}
                >
                  <Siren size={16} className="mr-2" />
                  {newIncidentForm.severity === 'critical' ? 'EMERGENCY DISPATCH' : 'Create Incident'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setNewIncidentForm({
                    type: 'medical',
                    severity: 'medium',
                    title: '',
                    description: '',
                    line: '',
                    station: '',
                    trainId: ''
                  })}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EmergencyCoordination