import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Cube, 
  PlayCircle, 
  StopCircle, 
  Eye,
  Clock,
  Trophy,
  Users,
  Brain,
  Warning,
  CheckCircle,
  Target,
  Lightning,
  Fire,
  FirstAid,
  ShieldCheck,
  UserPlus,
  Handshake,
  Microphone,
  VideoCamera,
  Chat,
  Network,
  Headphones,
  Gauge
} from '@phosphor-icons/react'

interface VRSession {
  id: string
  scenarioType: string
  scenarioName: string
  participantId: string
  participantName: string
  role?: string
  isMultiUser: boolean
  participants?: VRParticipant[]
  teamId?: string
  startTime: string // Stored as ISO string for KV compatibility
  duration: number
  score: number
  completionStatus: 'in-progress' | 'completed' | 'failed'
  performanceMetrics: {
    responseTime: number
    accuracy: number
    protocolCompliance: number
    decisionQuality: number
    teamCoordination?: number
    communicationEffectiveness?: number
  }
}

interface VRParticipant {
  id: string
  name: string
  role: string
  avatar: string
  isConnected: boolean
  joinTime: string
  performanceScore?: number
  communicationRating?: number
}

interface TeamSession {
  id: string
  name: string
  scenarioId: string
  maxParticipants: number
  currentParticipants: VRParticipant[]
  status: 'waiting' | 'in-progress' | 'completed'
  createdAt: string
  createdBy: string
  voiceChat: boolean
  videoShare: boolean
  realTimeCoordination: boolean
}

interface MultiUserScenario extends VRScenario {
  minParticipants: number
  maxParticipants: number
  roleAssignments: {
    role: string
    description: string
    requiredCertifications: string[]
  }[]
  coordinationRequirements: string[]
  communicationTools: ('voice' | 'text' | 'video' | 'spatial')[]
}

interface VRScenario {
  id: string
  name: string
  description: string
  type: 'fire-emergency' | 'medical-emergency' | 'evacuation' | 'derailment' | 'security-threat' | 'weather-emergency' | 'multi-emergency'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  duration: number
  objectives: string[]
  requiredCertifications: string[]
  isMultiUser?: boolean
  minParticipants?: number
  maxParticipants?: number
  roleAssignments?: {
    role: string
    description: string
    requiredCertifications: string[]
  }[]
  coordinationRequirements?: string[]
  communicationTools?: ('voice' | 'text' | 'video' | 'spatial')[]
}

interface TrainingProgress {
  participantId: string
  participantName: string
  role: string
  completedScenarios: number
  totalScore: number
  certifications: string[]
  lastTrainingDate: string // Stored as ISO string for KV compatibility
  weeklyHours: number
}

export default function VRTraining() {
  const [activeSessions, setActiveSessions] = useKV<VRSession[]>('vr-active-sessions', [])
  const [trainingHistory, setTrainingHistory] = useKV<VRSession[]>('vr-training-history', [])
  const [trainingProgress, setTrainingProgress] = useKV<TrainingProgress[]>('vr-training-progress', [])
  const [teamSessions, setTeamSessions] = useKV<TeamSession[]>('vr-team-sessions', [])
  const [selectedScenario, setSelectedScenario] = useState<VRScenario | null>(null)
  const [isCreatingTeamSession, setIsCreatingTeamSession] = useState(false)
  const [newTeamSession, setNewTeamSession] = useState({
    name: '',
    scenarioId: '',
    maxParticipants: 4,
    voiceChat: true,
    videoShare: false,
    realTimeCoordination: true
  })
  const [vrSystemStatus, setVrSystemStatus] = useKV('vr-system-status', {
    headsetsAvailable: 8,
    headsetsInUse: 3,
    systemHealth: 97,
    lastMaintenance: new Date().toISOString(),
    multiUserCapability: true,
    networkLatency: 12, // ms
    spatialTrackingAccuracy: 99.2 // %
  })

  const vrScenarios: VRScenario[] = [
    // Solo Training Scenarios
    {
      id: 'fire-emergency-01',
      name: 'Zugwaggon-Brand Notfall',
      description: 'Praktiziere Evakuierungsverfahren während eines Bordbrandes',
      type: 'fire-emergency',
      difficulty: 'intermediate',
      duration: 15,
      objectives: [
        'Notfallprotokolle innerhalb von 30 Sekunden einleiten',
        'Passagier-Evakuierung koordinieren',
        'Mit Kontrollzentrum kommunizieren',
        'Alle Sicherheitsprotokolle einhalten'
      ],
      requiredCertifications: ['Emergency Response Basic']
    },
    {
      id: 'medical-emergency-01',
      name: 'Passagier-Medizin-Krise',
      description: 'Behandle kritischen medizinischen Notfall während laufendem Bahnbetrieb',
      type: 'medical-emergency',
      difficulty: 'advanced',
      duration: 20,
      objectives: [
        'Medizinische Situation schnell bewerten',
        'Mit Rettungsdiensten koordinieren',
        'Routenmodifikationen entscheiden',
        'Passagierbedenken managen'
      ],
      requiredCertifications: ['First Aid Certified', 'Emergency Response Intermediate']
    },

    // Multi-User Team Coordination Scenarios
    {
      id: 'team-evacuation-01',
      name: 'Multi-Team Bahnhof-Evakuierung',
      description: 'Koordinierte Massen-Evakuierung während Stoßzeiten mit mehreren Teams',
      type: 'evacuation',
      difficulty: 'expert',
      duration: 35,
      isMultiUser: true,
      minParticipants: 3,
      maxParticipants: 6,
      objectives: [
        'Multi-Bahnsteig-Evakuierung koordinieren',
        'Menschenmassen und Panik managen',
        'Mit Rettungsdiensten koordinieren',
        'Barrierefreiheit sicherstellen',
        'Echtzeit-Teamkommunikation aufrechterhalten'
      ],
      roleAssignments: [
        {
          role: 'Evakuierungs-Koordinator',
          description: 'Leitet gesamte Evakuierung und koordiniert alle Teams',
          requiredCertifications: ['Emergency Response Advanced', 'Incident Command']
        },
        {
          role: 'Bahnsteig-Manager',
          description: 'Verwaltet spezifische Bahnsteigbereiche und Passagierfluss',
          requiredCertifications: ['Crowd Management', 'Emergency Response Intermediate']
        },
        {
          role: 'Kommunikations-Spezialist',
          description: 'Koordiniert alle interne und externe Kommunikation',
          requiredCertifications: ['Emergency Communications', 'Multi-Agency Coordination']
        },
        {
          role: 'Medizinischer Ersthelfer',
          description: 'Behandelt verletzte Personen und koordiniert Rettungsdienste',
          requiredCertifications: ['Advanced First Aid', 'Emergency Medical Response']
        }
      ],
      coordinationRequirements: [
        'Synchrone Entscheidungsfindung zwischen Teams',
        'Echzeit-Ressourcen-Allokation',
        'Cross-Team Kommunikation unter Stress',
        'Adaptive Rollenverteilung bei sich ändernden Bedingungen'
      ],
      communicationTools: ['voice', 'spatial', 'video'],
      requiredCertifications: ['Emergency Response Advanced', 'Team Coordination']
    },

    {
      id: 'team-derailment-01',
      name: 'Groß-Entgleisung Multi-Team Response',
      description: 'Koordinierte Antwort auf schwere Zugentgleisung mit mehreren Verletzten',
      type: 'derailment',
      difficulty: 'expert',
      duration: 45,
      isMultiUser: true,
      minParticipants: 4,
      maxParticipants: 8,
      objectives: [
        'Unfallstelle sofort sichern',
        'Multi-Team Rettungsoperationen koordinieren',
        'Strukturschäden bewerten',
        'Medien und Öffentlichkeitsarbeit managen',
        'Inter-Agency Koordination aufrechterhalten'
      ],
      roleAssignments: [
        {
          role: 'Incident Commander',
          description: 'Oberste Führung der gesamten Notfall-Response',
          requiredCertifications: ['Incident Command System', 'Emergency Response Expert']
        },
        {
          role: 'Rettungs-Team-Leiter',
          description: 'Koordiniert Such- und Rettungsoperationen',
          requiredCertifications: ['Technical Rescue', 'Team Leadership Emergency']
        },
        {
          role: 'Medizinischer Team-Leiter',
          description: 'Leitet medizinische Notfall-Response und Triage',
          requiredCertifications: ['Emergency Medical Leadership', 'Mass Casualty Management']
        },
        {
          role: 'Technischer Sicherheits-Experte',
          description: 'Bewertet strukturelle Integrität und Sicherheit',
          requiredCertifications: ['Structural Assessment', 'Railway Safety Engineering']
        },
        {
          role: 'Kommunikations-Koordinator',
          description: 'Verwaltet alle interne und externe Kommunikation',
          requiredCertifications: ['Crisis Communications', 'Multi-Agency Coordination']
        }
      ],
      coordinationRequirements: [
        'Hierarchische Kommando-Struktur unter extremem Stress',
        'Schnelle Entscheidungsfindung mit unvollständigen Informationen',
        'Resource-Sharing zwischen unterschiedlichen Agencies',
        'Dynamische Prioritäten-Anpassung basierend auf sich entwickelnder Situation'
      ],
      communicationTools: ['voice', 'text', 'video', 'spatial'],
      requiredCertifications: ['Emergency Response Expert', 'Multi-Agency Coordination']
    },

    {
      id: 'team-security-threat-01',
      name: 'Multi-Standort Sicherheits-Bedrohung',
      description: 'Koordinierte Response auf Sicherheitsbedrohung an mehreren Bahnhöfen',
      type: 'security-threat',
      difficulty: 'expert',
      duration: 30,
      isMultiUser: true,
      minParticipants: 3,
      maxParticipants: 5,
      objectives: [
        'Bedrohungsgrad identifizieren und bewerten',
        'Multi-Standort Sicherheitskräfte koordinieren',
        'Lockdown-Verfahren implementieren',
        'Passagier-Sicherheit an allen Standorten gewährleisten',
        'Intelligence-Sharing zwischen Teams'
      ],
      roleAssignments: [
        {
          role: 'Sicherheits-Kommandant',
          description: 'Führt gesamte Sicherheits-Operation',
          requiredCertifications: ['Security Command Advanced', 'Threat Assessment']
        },
        {
          role: 'Standort-Sicherheits-Manager',
          description: 'Verwaltet Sicherheit an spezifischen Standorten',
          requiredCertifications: ['Site Security Management', 'Emergency Lockdown Procedures']
        },
        {
          role: 'Intelligence-Analyst',
          description: 'Sammelt und analysiert Bedrohungs-Intelligence',
          requiredCertifications: ['Threat Intelligence Analysis', 'Security Assessment']
        }
      ],
      coordinationRequirements: [
        'Echtzeit Intelligence-Sharing',
        'Synchronisierte Sicherheitsmaßnahmen',
        'Schnelle Eskalations-Protokolle',
        'Inter-Agency Kommunikation'
      ],
      communicationTools: ['voice', 'text', 'spatial'],
      requiredCertifications: ['Security Protocol Advanced', 'Multi-Site Operations']
    },

    {
      id: 'team-weather-emergency-01',
      name: 'Extremwetter Multi-Netzwerk Response',
      description: 'Koordinierte Response auf schweres Wetter über mehrere Netzwerk-Bereiche',
      type: 'weather-emergency',
      difficulty: 'advanced',
      duration: 40,
      isMultiUser: true,
      minParticipants: 3,
      maxParticipants: 6,
      objectives: [
        'Wetter-Bedingungen netzwerkweit überwachen',
        'Service-Zeitpläne koordiniert anpassen',
        'Passagier-Sicherheit an allen Standorten gewährleisten',
        'Ressourcen-Allokation zwischen Bereichen',
        'Kontinuierliche Kommunikation mit Meteorologie-Team'
      ],
      roleAssignments: [
        {
          role: 'Netzwerk-Operations-Koordinator',
          description: 'Koordiniert Operations über gesamtes Netzwerk',
          requiredCertifications: ['Network Operations Management', 'Weather Emergency Response']
        },
        {
          role: 'Regional-Operations-Manager',
          description: 'Verwaltet Operations in spezifischen Regionen',
          requiredCertifications: ['Regional Operations', 'Weather Impact Assessment']
        },
        {
          role: 'Meteorologie-Liaison',
          description: 'Verbindung zu Wetter-Services und Prognose-Teams',
          requiredCertifications: ['Meteorological Analysis', 'Weather Communications']
        }
      ],
      coordinationRequirements: [
        'Cross-Regional Resource-Sharing',
        'Echzeit Wetter-Data Integration',
        'Adaptive Service-Planung',
        'Multi-Level Entscheidungsfindung'
      ],
      communicationTools: ['voice', 'text', 'video'],
      requiredCertifications: ['Weather Emergency Response', 'Network Coordination']
    },

    {
      id: 'team-multi-emergency-01',
      name: 'Simultane Multi-Notfall Koordination',
      description: 'Management mehrerer gleichzeitiger Notfälle across verschiedene Standorte',
      type: 'multi-emergency',
      difficulty: 'expert',
      duration: 50,
      isMultiUser: true,
      minParticipants: 5,
      maxParticipants: 10,
      objectives: [
        'Multiple Notfälle gleichzeitig priorisieren',
        'Ressourcen dynamisch zwischen Vorfällen allokieren',
        'Cross-Emergency Koordination aufrechterhalten',
        'Eskalations-Management bei sich verschlechternden Bedingungen',
        'Command-Unity bei komplexen Operations'
      ],
      roleAssignments: [
        {
          role: 'Emergency Operations Director',
          description: 'Oberste Führung aller simultanen Notfall-Operations',
          requiredCertifications: ['Emergency Operations Command', 'Multi-Incident Management']
        },
        {
          role: 'Incident-Specific Commanders',
          description: 'Führen spezifische Notfall-Vorfälle',
          requiredCertifications: ['Incident Command', 'Specific Emergency Type Certification']
        },
        {
          role: 'Resource-Allocation Coordinator',
          description: 'Verwaltet und allokiert Ressourcen zwischen Vorfällen',
          requiredCertifications: ['Resource Management', 'Emergency Logistics']
        },
        {
          role: 'Communications Hub Manager',
          description: 'Koordiniert alle Kommunikation zwischen Teams',
          requiredCertifications: ['Emergency Communications', 'Multi-Channel Coordination']
        }
      ],
      coordinationRequirements: [
        'Dynamic Priority-Shifting zwischen Vorfällen',
        'Real-time Resource-Reallocation',
        'Complex Information-Flow Management',
        'Stress-Testing von Command-Strukturen'
      ],
      communicationTools: ['voice', 'text', 'video', 'spatial'],
      requiredCertifications: ['Multi-Emergency Management', 'Advanced Command Coordination']
    }
  ]

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'fire-emergency': return Fire
      case 'medical-emergency': return FirstAid
      case 'evacuation': return Users
      case 'derailment': return Warning
      case 'security-threat': return ShieldCheck
      case 'weather-emergency': return Lightning
      case 'multi-emergency': return Network
      default: return Target
    }
  }

  const createTeamSession = () => {
    if (!newTeamSession.name || !newTeamSession.scenarioId) {
      toast.error('Bitte alle Felder ausfüllen')
      return
    }

    const scenario = vrScenarios.find(s => s.id === newTeamSession.scenarioId)
    if (!scenario || !scenario.isMultiUser) {
      toast.error('Ungültiges Multi-User-Szenario')
      return
    }

    const teamSession: TeamSession = {
      id: `team-${Date.now()}`,
      name: newTeamSession.name,
      scenarioId: newTeamSession.scenarioId,
      maxParticipants: newTeamSession.maxParticipants,
      currentParticipants: [{
        id: 'host-user',
        name: 'Training Coordinator',
        role: scenario.roleAssignments?.[0]?.role || 'Coordinator',
        avatar: 'TC',
        isConnected: true,
        joinTime: new Date().toISOString()
      }],
      status: 'waiting',
      createdAt: new Date().toISOString(),
      createdBy: 'Training Coordinator',
      voiceChat: newTeamSession.voiceChat,
      videoShare: newTeamSession.videoShare,
      realTimeCoordination: newTeamSession.realTimeCoordination
    }

    setTeamSessions(current => [...current, teamSession])
    setIsCreatingTeamSession(false)
    setNewTeamSession({
      name: '',
      scenarioId: '',
      maxParticipants: 4,
      voiceChat: true,
      videoShare: false,
      realTimeCoordination: true
    })

    toast.success('Team-Session erstellt', {
      description: `"${teamSession.name}" wartet auf Teilnehmer`
    })
  }

  const joinTeamSession = (sessionId: string) => {
    setTeamSessions(current => 
      current.map(session => {
        if (session.id === sessionId && session.currentParticipants.length < session.maxParticipants) {
          const newParticipant: VRParticipant = {
            id: `participant-${Date.now()}`,
            name: `Teilnehmer ${session.currentParticipants.length + 1}`,
            role: 'Team Member',
            avatar: `T${session.currentParticipants.length + 1}`,
            isConnected: true,
            joinTime: new Date().toISOString()
          }
          
          toast.success('Team beigetreten', {
            description: `Willkommen in "${session.name}"`
          })

          return {
            ...session,
            currentParticipants: [...session.currentParticipants, newParticipant]
          }
        }
        return session
      })
    )
  }

  const startTeamSession = (sessionId: string) => {
    const session = teamSessions.find(s => s.id === sessionId)
    const scenario = vrScenarios.find(s => s.id === session?.scenarioId)
    
    if (!session || !scenario) return

    if (session.currentParticipants.length < (scenario.minParticipants || 2)) {
      toast.error('Nicht genügend Teilnehmer', {
        description: `Mindestens ${scenario.minParticipants || 2} Teilnehmer erforderlich`
      })
      return
    }

    // Create individual sessions for each participant
    const teamVRSessions: VRSession[] = session.currentParticipants.map(participant => ({
      id: `team-vr-${sessionId}-${participant.id}`,
      scenarioType: scenario.type,
      scenarioName: scenario.name,
      participantId: participant.id,
      participantName: participant.name,
      role: participant.role,
      isMultiUser: true,
      participants: session.currentParticipants,
      teamId: sessionId,
      startTime: new Date().toISOString(),
      duration: scenario.duration,
      score: 0,
      completionStatus: 'in-progress',
      performanceMetrics: {
        responseTime: 0,
        accuracy: 0,
        protocolCompliance: 0,
        decisionQuality: 0,
        teamCoordination: 0,
        communicationEffectiveness: 0
      }
    }))

    setActiveSessions(current => [...current, ...teamVRSessions])
    setTeamSessions(current => 
      current.map(s => s.id === sessionId ? { ...s, status: 'in-progress' } : s)
    )

    setVrSystemStatus(current => ({
      ...current,
      headsetsInUse: current.headsetsInUse + session.currentParticipants.length
    }))

    toast.success('Team-Training gestartet', {
      description: `${session.currentParticipants.length} Teilnehmer in "${scenario.name}"`
    })

    // Simulate team session completion
    setTimeout(() => {
      completeTeamSession(sessionId)
    }, 15000) // Shortened for demo
  }

  const completeTeamSession = (teamId: string) => {
    setActiveSessions(current => {
      const teamSessions = current.filter(s => s.teamId === teamId)
      const otherSessions = current.filter(s => s.teamId !== teamId)

      if (teamSessions.length === 0) return current

      // Generate team performance metrics
      const completedTeamSessions = teamSessions.map(session => ({
        ...session,
        completionStatus: 'completed' as const,
        score: Math.floor(Math.random() * 25) + 75, // 75-100 for team scenarios
        performanceMetrics: {
          ...session.performanceMetrics,
          responseTime: Math.floor(Math.random() * 20) + 10, // 10-30 seconds
          accuracy: Math.floor(Math.random() * 15) + 85, // 85-100%
          protocolCompliance: Math.floor(Math.random() * 10) + 90, // 90-100%
          decisionQuality: Math.floor(Math.random() * 20) + 80, // 80-100%
          teamCoordination: Math.floor(Math.random() * 15) + 85, // 85-100%
          communicationEffectiveness: Math.floor(Math.random() * 20) + 80 // 80-100%
        }
      }))

      // Add to training history
      setTrainingHistory(history => [...history, ...completedTeamSessions])

      // Update team session status
      setTeamSessions(current => 
        current.map(s => s.id === teamId ? { ...s, status: 'completed' } : s)
      )

      // Update VR system status
      setVrSystemStatus(current => ({
        ...current,
        headsetsInUse: Math.max(0, current.headsetsInUse - teamSessions.length)
      }))

      const avgScore = Math.round(completedTeamSessions.reduce((acc, s) => acc + s.score, 0) / completedTeamSessions.length)
      toast.success('Team-Training abgeschlossen', {
        description: `Team-Durchschnitt: ${avgScore}/100 - Leistung protokolliert`
      })

      return otherSessions
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'expert': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const startVRSession = async (scenario: VRScenario) => {
    if (vrSystemStatus.headsetsInUse >= vrSystemStatus.headsetsAvailable) {
      toast.error('Keine VR-Headsets verfügbar', {
        description: 'Alle Headsets sind derzeit in Verwendung. Bitte warten Sie, bis eines verfügbar wird.'
      })
      return
    }

    const newSession: VRSession = {
      id: `vr-${Date.now()}`,
      scenarioType: scenario.type,
      scenarioName: scenario.name,
      participantId: 'current-user',
      participantName: 'Training Officer',
      isMultiUser: false,
      startTime: new Date().toISOString(),
      duration: scenario.duration,
      score: 0,
      completionStatus: 'in-progress',
      performanceMetrics: {
        responseTime: 0,
        accuracy: 0,
        protocolCompliance: 0,
        decisionQuality: 0
      }
    }

    setActiveSessions(current => [...current, newSession])
    setVrSystemStatus(current => ({
      ...current,
      headsetsInUse: current.headsetsInUse + 1
    }))

    toast.success('VR-Training-Session gestartet', {
      description: `Initialisierung "${scenario.name}" Simulation`
    })

    // Simulate session completion after duration
    setTimeout(() => {
      completeVRSession(newSession.id)
    }, 10000) // Shortened for demo
  }

  const completeVRSession = (sessionId: string) => {
    setActiveSessions(current => {
      const session = current.find(s => s.id === sessionId)
      if (!session) return current

      // Generate realistic performance metrics
      const completedSession: VRSession = {
        ...session,
        completionStatus: 'completed',
        score: Math.floor(Math.random() * 30) + 70, // 70-100 score
        performanceMetrics: {
          responseTime: Math.floor(Math.random() * 30) + 15, // 15-45 seconds
          accuracy: Math.floor(Math.random() * 20) + 80, // 80-100%
          protocolCompliance: Math.floor(Math.random() * 15) + 85, // 85-100%
          decisionQuality: Math.floor(Math.random() * 25) + 75 // 75-100%
        }
      }

      // Add to training history
      setTrainingHistory(history => [...history, completedSession])

      // Update VR system status
      setVrSystemStatus(current => ({
        ...current,
        headsetsInUse: Math.max(0, current.headsetsInUse - 1)
      }))

      toast.success('Training Session abgeschlossen', {
        description: `Score: ${completedSession.score}/100 - Leistung protokolliert`
      })

      return current.filter(s => s.id !== sessionId)
    })
  }

  const stopVRSession = (sessionId: string) => {
    setActiveSessions(current => current.filter(s => s.id !== sessionId))
    setVrSystemStatus(current => ({
      ...current,
      headsetsInUse: Math.max(0, current.headsetsInUse - 1)
    }))
    
    toast.info('VR-Session beendet', {
      description: 'Training-Session vom Instructor gestoppt'
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Cube size={24} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">VR Training Simulations</h1>
            <p className="text-muted-foreground">Immersive emergency response training</p>
          </div>
        </div>

        {/* VR System Status */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium">
              {vrSystemStatus.headsetsAvailable - vrSystemStatus.headsetsInUse} Headsets verfügbar
            </div>
            <div className="text-xs text-muted-foreground">
              System health: {vrSystemStatus.systemHealth}% • Multi-User: {vrSystemStatus.multiUserCapability ? 'Aktiv' : 'Inaktiv'}
            </div>
          </div>
          <Badge 
            variant={vrSystemStatus.headsetsInUse < vrSystemStatus.headsetsAvailable ? "default" : "destructive"}
            className="px-3 py-1"
          >
            {vrSystemStatus.headsetsInUse}/{vrSystemStatus.headsetsAvailable} in use
          </Badge>
        </div>
      </div>

      {/* Active Sessions Alert */}
      {activeSessions.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <PlayCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {activeSessions.length} aktive VR Training Session{activeSessions.length !== 1 ? 's' : ''} laufen
            {activeSessions.filter(s => s.isMultiUser).length > 0 && 
              ` • ${activeSessions.filter(s => s.isMultiUser).length} Team-Session${activeSessions.filter(s => s.isMultiUser).length !== 1 ? 's' : ''}`
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Team Sessions Waiting Alert */}
      {teamSessions.filter(s => s.status === 'waiting').length > 0 && (
        <Alert className="border-purple-200 bg-purple-50">
          <Users className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            {teamSessions.filter(s => s.status === 'waiting').length} Team-Session{teamSessions.filter(s => s.status === 'waiting').length !== 1 ? 's' : ''} warten auf Teilnehmer
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="scenarios">Szenarien</TabsTrigger>
          <TabsTrigger value="team-sessions">Team-Sessions</TabsTrigger>
          <TabsTrigger value="active-sessions">Aktive Sessions</TabsTrigger>
          <TabsTrigger value="progress">Fortschritt</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Training Scenarios */}
        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vrScenarios.map((scenario) => {
              const IconComponent = getScenarioIcon(scenario.type)
              return (
                <Card key={scenario.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">{scenario.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs px-2 py-0.5 ${getDifficultyColor(scenario.difficulty)}`}>
                              {scenario.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock size={12} />
                              {scenario.duration}m
                            </span>
                            {scenario.isMultiUser && (
                              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                <Users size={10} className="mr-1" />
                                Multi-User
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {scenario.description}
                    </CardDescription>
                    
                    {scenario.isMultiUser && scenario.roleAssignments && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Team-Rollen:</h4>
                        <div className="flex flex-wrap gap-1">
                          {scenario.roleAssignments.slice(0, 3).map((role, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {role.role}
                            </Badge>
                          ))}
                          {scenario.roleAssignments.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{scenario.roleAssignments.length - 3} weitere
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Ziele:</h4>
                        <ul className="space-y-1">
                          {scenario.objectives.slice(0, 2).map((objective, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                              <Target size={12} className="mt-0.5 flex-shrink-0" />
                              {objective}
                            </li>
                          ))}
                          {scenario.objectives.length > 2 && (
                            <li className="text-xs text-muted-foreground">
                              +{scenario.objectives.length - 2} weitere Ziele
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <Button 
                          onClick={() => startVRSession(scenario)}
                          className="w-full"
                          disabled={vrSystemStatus.headsetsInUse >= vrSystemStatus.headsetsAvailable || scenario.isMultiUser}
                        >
                          <PlayCircle size={16} className="mr-2" />
                          {scenario.isMultiUser ? 'Team-Session erstellen' : 'Training starten'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Team Sessions */}
        <TabsContent value="team-sessions" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Multi-User Team Sessions</h2>
              <p className="text-muted-foreground">Erstelle und verwalte Kollaborations-Training</p>
            </div>
            <Dialog open={isCreatingTeamSession} onOpenChange={setIsCreatingTeamSession}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus size={16} className="mr-2" />
                  Neue Team-Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Team-Session erstellen</DialogTitle>
                  <DialogDescription>
                    Erstelle eine neue Multi-User VR-Training Session
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-name">Session Name</Label>
                    <Input
                      id="session-name"
                      placeholder="z.B. Notfall-Koordination Team Alpha"
                      value={newTeamSession.name}
                      onChange={(e) => setNewTeamSession(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scenario-select">Szenario</Label>
                    <Select value={newTeamSession.scenarioId} onValueChange={(value) => setNewTeamSession(prev => ({ ...prev, scenarioId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Multi-User Szenario wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {vrScenarios.filter(s => s.isMultiUser).map((scenario) => (
                          <SelectItem key={scenario.id} value={scenario.id}>
                            {scenario.name} ({scenario.minParticipants}-{scenario.maxParticipants} Teilnehmer)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-participants">Max. Teilnehmer</Label>
                    <Select 
                      value={newTeamSession.maxParticipants.toString()} 
                      onValueChange={(value) => setNewTeamSession(prev => ({ ...prev, maxParticipants: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 4, 5, 6, 7, 8].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num} Teilnehmer</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Kommunikations-Features</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="voice-chat"
                          checked={newTeamSession.voiceChat}
                          onChange={(e) => setNewTeamSession(prev => ({ ...prev, voiceChat: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="voice-chat" className="text-sm">Voice Chat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="video-share"
                          checked={newTeamSession.videoShare}
                          onChange={(e) => setNewTeamSession(prev => ({ ...prev, videoShare: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="video-share" className="text-sm">Video Sharing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="real-time-coord"
                          checked={newTeamSession.realTimeCoordination}
                          onChange={(e) => setNewTeamSession(prev => ({ ...prev, realTimeCoordination: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="real-time-coord" className="text-sm">Echtzeit-Koordination</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsCreatingTeamSession(false)}
                    >
                      Abbrechen
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={createTeamSession}
                    >
                      Session erstellen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Team Sessions List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teamSessions.length === 0 ? (
              <Card className="lg:col-span-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Users size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Keine Team-Sessions</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Erstelle deine erste Multi-User Training Session
                  </p>
                  <Button onClick={() => setIsCreatingTeamSession(true)}>
                    <UserPlus size={16} className="mr-2" />
                    Team-Session erstellen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              teamSessions.map((session) => {
                const scenario = vrScenarios.find(s => s.id === session.scenarioId)
                return (
                  <Card key={session.id} className={`${
                    session.status === 'waiting' ? 'border-blue-200 bg-blue-50/50' :
                    session.status === 'in-progress' ? 'border-green-200 bg-green-50/50' :
                    'border-gray-200 bg-gray-50/50'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{session.name}</CardTitle>
                          <CardDescription>
                            {scenario?.name} • Erstellt von {session.createdBy}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={session.status === 'waiting' ? 'default' : 
                                  session.status === 'in-progress' ? 'destructive' : 'secondary'}
                        >
                          {session.status === 'waiting' ? 'Wartet' :
                           session.status === 'in-progress' ? 'Läuft' : 'Abgeschlossen'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Participants */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Teilnehmer</span>
                          <span className="text-sm text-muted-foreground">
                            {session.currentParticipants.length}/{session.maxParticipants}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {session.currentParticipants.map((participant) => (
                            <div key={participant.id} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-2 py-1">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium">
                                {participant.avatar}
                              </div>
                              <span className="text-xs font-medium">{participant.name}</span>
                              <div className={`w-2 h-2 rounded-full ${participant.isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Communication Features */}
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Features</span>
                        <div className="flex gap-2">
                          {session.voiceChat && (
                            <Badge variant="outline" className="text-xs">
                              <Microphone size={10} className="mr-1" />
                              Voice
                            </Badge>
                          )}
                          {session.videoShare && (
                            <Badge variant="outline" className="text-xs">
                              <VideoCamera size={10} className="mr-1" />
                              Video
                            </Badge>
                          )}
                          {session.realTimeCoordination && (
                            <Badge variant="outline" className="text-xs">
                              <Handshake size={10} className="mr-1" />
                              Koordination
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {session.status === 'waiting' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => joinTeamSession(session.id)}
                              disabled={session.currentParticipants.length >= session.maxParticipants}
                            >
                              <UserPlus size={14} className="mr-2" />
                              Beitreten
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => startTeamSession(session.id)}
                              disabled={session.currentParticipants.length < (scenario?.minParticipants || 2)}
                            >
                              <PlayCircle size={14} className="mr-2" />
                              Starten
                            </Button>
                          </>
                        )}
                        {session.status === 'in-progress' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              toast.info('Session überwachen', {
                                description: 'Echzeit-Team-Koordination und Leistung'
                              })
                            }}
                          >
                            <Eye size={14} className="mr-2" />
                            Überwachen
                          </Button>
                        )}
                        {session.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              toast.info('Session-Bericht', {
                                description: 'Team-Performance und Koordinations-Analytics'
                              })
                            }}
                          >
                            <Trophy size={14} className="mr-2" />
                            Bericht
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        {/* Active Sessions */}
        <TabsContent value="active-sessions" className="space-y-6">
          {activeSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Eye size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Keine aktiven Sessions</h3>
                <p className="text-muted-foreground text-center">
                  Starte ein VR-Training-Szenario um aktive Sessions zu überwachen
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeSessions.map((session) => (
                <Card key={session.id} className={`${session.isMultiUser ? 'border-purple-200 bg-purple-50/50' : 'border-blue-200 bg-blue-50/50'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{session.scenarioName}</CardTitle>
                        <CardDescription>
                          {session.isMultiUser ? (
                            <>
                              Team: {session.participants?.length || 1} Teilnehmer
                              {session.role && ` • Role: ${session.role}`}
                            </>
                          ) : (
                            `Teilnehmer: ${session.participantName}`
                          )}
                        </CardDescription>
                      </div>
                      <Badge variant={session.isMultiUser ? "secondary" : "default"} className={session.isMultiUser ? "bg-purple-600 text-white" : "bg-blue-600"}>
                        <PlayCircle size={12} className="mr-1" />
                        {session.isMultiUser ? 'Team' : 'Solo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Session Fortschritt</span>
                        <span className="font-medium">
                          {Math.floor((Date.now() - new Date(session.startTime).getTime()) / 60000)} / {session.duration} min
                        </span>
                      </div>
                      <Progress 
                        value={(Date.now() - new Date(session.startTime).getTime()) / (session.duration * 60000) * 100} 
                        className="h-2"
                      />
                    </div>

                    {session.isMultiUser && session.participants && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Team-Mitglieder</span>
                        <div className="flex flex-wrap gap-1">
                          {session.participants.map((participant) => (
                            <div key={participant.id} className="flex items-center gap-1 bg-secondary/30 rounded-md px-2 py-1">
                              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                                {participant.avatar}
                              </div>
                              <span className="text-xs">{participant.name}</span>
                              <div className={`w-1.5 h-1.5 rounded-full ${participant.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Gestartet:</span>
                        <div className="font-medium">
                          {new Date(session.startTime).toLocaleTimeString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Typ:</span>
                        <div className="font-medium capitalize">
                          {session.scenarioType.replace('-', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          toast.info('Session überwachen', {
                            description: session.isMultiUser 
                              ? 'Echzeit Team-Koordination und Leistungsmetrics'
                              : 'Echzeit-Metrics und Leistungsdaten'
                          })
                        }}
                      >
                        <Eye size={14} className="mr-2" />
                        Überwachen
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => stopVRSession(session.id)}
                      >
                        <StopCircle size={14} className="mr-2" />
                        Stop
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Training Progress */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recent Training History */}
            <Card className="md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={20} />
                  Letzte Training Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trainingHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Noch keine abgeschlossenen Training Sessions
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trainingHistory.slice(-5).reverse().map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {session.scenarioName}
                            {session.isMultiUser && (
                              <Badge variant="outline" className="text-xs">
                                <Users size={10} className="mr-1" />
                                Team
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.participantName} • {new Date(session.startTime).toLocaleDateString()}
                            {session.isMultiUser && ` • ${session.participants?.length || 1} Teilnehmer`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{session.score}</div>
                          <div className="text-xs text-muted-foreground">score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy size={20} />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainingHistory.length > 0 ? (
                  <>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {Math.round(trainingHistory.reduce((acc, s) => acc + s.score, 0) / trainingHistory.length)}
                      </div>
                      <div className="text-sm text-muted-foreground">Durchschnittsscore</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sessions abgeschlossen</span>
                        <span className="font-medium">{trainingHistory.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Bester Score</span>
                        <span className="font-medium">{Math.max(...trainingHistory.map(s => s.score))}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Abschlussrate</span>
                        <span className="font-medium">
                          {Math.round((trainingHistory.filter(s => s.completionStatus === 'completed').length / trainingHistory.length) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Team-Sessions</span>
                        <span className="font-medium">
                          {trainingHistory.filter(s => s.isMultiUser).length}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Schließe Training Sessions ab um Leistungsmetrics zu sehen
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gesamt Sessions</p>
                    <p className="text-2xl font-bold">{trainingHistory.length + activeSessions.length}</p>
                  </div>
                  <PlayCircle size={24} className="text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Erfolgsrate</p>
                    <p className="text-2xl font-bold">
                      {trainingHistory.length > 0 
                        ? Math.round((trainingHistory.filter(s => s.score >= 70).length / trainingHistory.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ø Reaktionszeit</p>
                    <p className="text-2xl font-bold">
                      {trainingHistory.length > 0 
                        ? Math.round(trainingHistory.reduce((acc, s) => acc + s.performanceMetrics.responseTime, 0) / trainingHistory.length)
                        : 0}s
                    </p>
                  </div>
                  <Lightning size={24} className="text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">System-Health</p>
                    <p className="text-2xl font-bold">{vrSystemStatus.systemHealth}%</p>
                  </div>
                  <Brain size={24} className="text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Multi-User Team Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Team-Koordinations-Analytics
                </CardTitle>
                <CardDescription>Leistungsanallyse für Multi-User Szenarien</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingHistory.filter(s => s.isMultiUser).length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {trainingHistory.filter(s => s.isMultiUser).length}
                          </div>
                          <div className="text-sm text-muted-foreground">Team-Sessions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(
                              trainingHistory
                                .filter(s => s.isMultiUser && s.performanceMetrics.teamCoordination)
                                .reduce((acc, s) => acc + (s.performanceMetrics.teamCoordination || 0), 0) /
                              trainingHistory.filter(s => s.isMultiUser && s.performanceMetrics.teamCoordination).length
                            ) || 0}%
                          </div>
                          <div className="text-sm text-muted-foreground">Ø Team-Koordination</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Kommunikations-Effektivität</span>
                            <span className="text-sm font-medium">
                              {Math.round(
                                trainingHistory
                                  .filter(s => s.isMultiUser && s.performanceMetrics.communicationEffectiveness)
                                  .reduce((acc, s) => acc + (s.performanceMetrics.communicationEffectiveness || 0), 0) /
                                trainingHistory.filter(s => s.isMultiUser && s.performanceMetrics.communicationEffectiveness).length
                              ) || 0}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.round(
                              trainingHistory
                                .filter(s => s.isMultiUser && s.performanceMetrics.communicationEffectiveness)
                                .reduce((acc, s) => acc + (s.performanceMetrics.communicationEffectiveness || 0), 0) /
                              trainingHistory.filter(s => s.isMultiUser && s.performanceMetrics.communicationEffectiveness).length
                            ) || 0} 
                            className="h-2"
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Team-Entscheidungsqualität</span>
                            <span className="text-sm font-medium">
                              {Math.round(
                                trainingHistory
                                  .filter(s => s.isMultiUser)
                                  .reduce((acc, s) => acc + s.performanceMetrics.decisionQuality, 0) /
                                trainingHistory.filter(s => s.isMultiUser).length
                              ) || 0}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.round(
                              trainingHistory
                                .filter(s => s.isMultiUser)
                                .reduce((acc, s) => acc + s.performanceMetrics.decisionQuality, 0) /
                              trainingHistory.filter(s => s.isMultiUser).length
                            ) || 0} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      Schließe Team-Sessions ab um Koordinations-Analytics zu sehen
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network size={20} />
                  Multi-User System Status
                </CardTitle>
                <CardDescription>VR-Infrastruktur und Netzwerk-Performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Netzwerk-Latenz</span>
                      <span className="font-medium text-green-600">{vrSystemStatus.networkLatency}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Spatial Tracking</span>
                      <span className="font-medium text-green-600">{vrSystemStatus.spatialTrackingAccuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Multi-User Capability</span>
                      <Badge variant={vrSystemStatus.multiUserCapability ? "default" : "destructive"}>
                        {vrSystemStatus.multiUserCapability ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Headset-Verfügbarkeit</span>
                      <span className="text-sm">
                        {vrSystemStatus.headsetsAvailable - vrSystemStatus.headsetsInUse}/{vrSystemStatus.headsetsAvailable}
                      </span>
                    </div>
                    <Progress 
                      value={((vrSystemStatus.headsetsAvailable - vrSystemStatus.headsetsInUse) / vrSystemStatus.headsetsAvailable) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{teamSessions.filter(s => s.status === 'waiting').length}</div>
                      <div className="text-xs text-muted-foreground">Wartende Teams</div>
                    </div>
                    <div className="text-center p-2 bg-secondary/30 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{teamSessions.filter(s => s.status === 'in-progress').length}</div>
                      <div className="text-xs text-muted-foreground">Aktive Teams</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scenario Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Szenario-Leistungsanalyse</CardTitle>
              <CardDescription>Leistungsaufschlüsselung nach Notfall-Szenario-Typ (Solo vs. Team)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['fire-emergency', 'medical-emergency', 'evacuation', 'derailment', 'security-threat', 'weather-emergency', 'multi-emergency'].map((type) => {
                  const soloSessions = trainingHistory.filter(s => s.scenarioType === type && !s.isMultiUser)
                  const teamSessions = trainingHistory.filter(s => s.scenarioType === type && s.isMultiUser)
                  const avgSoloScore = soloSessions.length > 0 
                    ? Math.round(soloSessions.reduce((acc, s) => acc + s.score, 0) / soloSessions.length)
                    : 0
                  const avgTeamScore = teamSessions.length > 0 
                    ? Math.round(teamSessions.reduce((acc, s) => acc + s.score, 0) / teamSessions.length)
                    : 0
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{type.replace('-', ' ')}</span>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Solo: {avgSoloScore}% • {soloSessions.length} sessions</span>
                          <span>Team: {avgTeamScore}% • {teamSessions.length} sessions</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Solo Performance</div>
                          <Progress value={avgSoloScore} className="h-2" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Team Performance</div>
                          <Progress value={avgTeamScore} className="h-2 bg-purple-100" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}