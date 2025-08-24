/**
 * AR Maintenance Guide Component - Augmented Reality für Techniker-Wartungsanleitungen
 * Provides immersive AR-based maintenance instructions for rail technicians
 */

import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  CubeTransparent,
  Camera,
  Play,
  Pause,
  Stop,
  ArrowClockwise,
  CheckCircle,
  Warning,
  Eye,
  Target,
  Wrench,
  Clock,
  User,
  MapPin,
  CircleNotch,
  VideoCamera,
  ScanLine,
  Crosshair,
  ThreeDimensional,
  Timer,
  Users,
  Microphone,
  MicrophoneSlash,
  Phone,
  PhoneX,
  ShareNetwork,
  Record,
  HandPointing,
  ChatCircle,
  PaperPlaneTilt,
  UserCircle,
  Crown,
  Broadcast,
  Circle
} from '@phosphor-icons/react'

interface ARSession {
  id: string
  technicianId: string
  equipmentId: string
  procedure: string
  status: 'active' | 'paused' | 'completed' | 'failed'
  startTime: string
  currentStep: number
  totalSteps: number
  accuracy: number
  location: string
  isCollaborative: boolean
  participants: Participant[]
  leadTechnician: string
  sharedAnnotations: Annotation[]
  audioEnabled: boolean
  videoEnabled: boolean
  chatMessages: ChatMessage[]
}

interface Participant {
  id: string
  name: string
  role: 'lead' | 'assistant' | 'observer' | 'expert'
  status: 'online' | 'offline' | 'busy'
  location: string
  permissions: {
    canAnnotate: boolean
    canControl: boolean
    canSpeak: boolean
  }
  audioEnabled: boolean
  videoEnabled: boolean
  lastSeen: string
}

interface Annotation {
  id: string
  technicianId: string
  technicianName: string
  type: 'arrow' | 'circle' | 'text' | 'warning' | 'checkmark'
  position: { x: number; y: number }
  content: string
  timestamp: string
  visible: boolean
  color: string
}

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
  type: 'text' | 'system' | 'voice-note'
  duration?: number // for voice notes
}

interface MaintenanceProcedure {
  id: string
  name: string
  equipmentType: string
  complexity: 'low' | 'medium' | 'high'
  estimatedTime: number
  steps: MaintenanceStep[]
  requiredTools: string[]
  safetyWarnings: string[]
}

interface MaintenanceStep {
  id: string
  title: string
  description: string
  arMarkers: string[]
  visualCues: string[]
  checkpoints: string[]
  duration: number
  completed: boolean
}

const ARMaintenanceGuide = () => {
  const [activeSessions, setActiveSessions] = useKV<ARSession[]>('ar-maintenance-sessions', [])
  const [currentParticipants, setCurrentParticipants] = useKV<Participant[]>('ar-participants', [
    {
      id: 'tech-001',
      name: 'Max Schneider',
      role: 'lead',
      status: 'online',
      location: 'Wartungshalle 2, Stand A3',
      permissions: { canAnnotate: true, canControl: true, canSpeak: true },
      audioEnabled: true,
      videoEnabled: true,
      lastSeen: new Date().toISOString()
    },
    {
      id: 'tech-002',
      name: 'Anna Mueller',
      role: 'assistant',
      status: 'online',
      location: 'Wartungshalle 2, Stand B1',
      permissions: { canAnnotate: true, canControl: false, canSpeak: true },
      audioEnabled: false,
      videoEnabled: true,
      lastSeen: new Date().toISOString()
    },
    {
      id: 'expert-001',
      name: 'Dr. Klaus Weber',
      role: 'expert',
      status: 'online',
      location: 'Remote - Hauptzentrale',
      permissions: { canAnnotate: true, canControl: true, canSpeak: true },
      audioEnabled: true,
      videoEnabled: false,
      lastSeen: new Date().toISOString()
    }
  ])
  
  const [selectedProcedure, setSelectedProcedure] = useState<string>('')
  const [arMode, setArMode] = useState<'inactive' | 'scanning' | 'active' | 'calibrating'>('inactive')
  const [currentSession, setCurrentSession] = useState<ARSession | null>(null)
  const [cameraStream, setCameraStream] = useState<boolean>(false)
  const [collaborationMode, setCollaborationMode] = useState<boolean>(false)
  const [localAudioEnabled, setLocalAudioEnabled] = useState<boolean>(true)
  const [localVideoEnabled, setLocalVideoEnabled] = useState<boolean>(true)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [showCollaborationPanel, setShowCollaborationPanel] = useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [procedures] = useKV<MaintenanceProcedure[]>('maintenance-procedures', [
    {
      id: 'brake-inspection',
      name: 'Bremssystem-Inspektion',
      equipmentType: 'ICE 3',
      complexity: 'high',
      estimatedTime: 45,
      steps: [
        {
          id: 'step-1',
          title: 'Sicherheitsprüfung',
          description: 'Überprüfung der Druckluftanlage und Sicherheitsventile',
          arMarkers: ['brake-valve-1', 'pressure-gauge-main'],
          visualCues: ['Roter Rahmen um Ventile', 'Druckanzeige hervorheben'],
          checkpoints: ['Druck > 8 bar', 'Ventile geschlossen', 'Keine Leckagen'],
          duration: 8,
          completed: false
        },
        {
          id: 'step-2',
          title: 'Bremsscheiben-Kontrolle',
          description: 'Visuelle und taktile Prüfung der Bremsscheiben auf Verschleiß',
          arMarkers: ['brake-disc-front', 'brake-disc-rear'],
          visualCues: ['3D-Messanzeige', 'Verschleißgrenzmarkierung'],
          checkpoints: ['Dicke > 32mm', 'Keine Risse', 'Gleichmäßiger Verschleiß'],
          duration: 12,
          completed: false
        },
        {
          id: 'step-3',
          title: 'Bremsbelag-Messung',
          description: 'Messung der Bremsbelagdicke mit AR-gestützter Anzeige',
          arMarkers: ['brake-pad-left', 'brake-pad-right'],
          visualCues: ['Digitale Messskala', 'Toleranzbereich-Anzeige'],
          checkpoints: ['Mindestdicke 8mm', 'Gleichmäßiger Abrieb', 'Befestigung OK'],
          duration: 10,
          completed: false
        }
      ],
      requiredTools: ['Druckmessgerät', 'Schieblehre', 'Taschenlampe', 'Sicherheitsbrille'],
      safetyWarnings: [
        'Zug muss vollständig entlüftet sein',
        'Sicherheitsabschaltung aktivieren',
        'Persönliche Schutzausrüstung tragen'
      ]
    },
    {
      id: 'wheel-inspection',
      name: 'Radsatz-Wartung',
      equipmentType: 'Regional Express',
      complexity: 'medium',
      estimatedTime: 30,
      steps: [
        {
          id: 'wheel-step-1',
          title: 'Radprofil-Scan',
          description: 'AR-gestützte Vermessung des Radprofils und Verschleißanalyse',
          arMarkers: ['wheel-left', 'wheel-right'],
          visualCues: ['3D-Profildarstellung', 'Verschleißheatmap'],
          checkpoints: ['Flanschdicke OK', 'Spurkranz intakt', 'Rundlauf gemessen'],
          duration: 15,
          completed: false
        }
      ],
      requiredTools: ['Profilmessgerät', 'Rundlaufprüfer'],
      safetyWarnings: ['Fahrzeug sicher aufgebockt', 'Räder blockiert']
    }
  ])

  // AR Statistics
  const [arStats] = useKV('ar-maintenance-stats', {
    totalSessions: 127,
    completedProcedures: 89,
    averageAccuracy: 94.2,
    timeSaved: 347, // minutes
    activeTechnicians: 12,
    errorReduction: 73.5,
    collaborativeSessions: 34,
    remoteExpertConsultations: 23
  })

  const startCollaborativeSession = async (procedureId: string) => {
    const procedure = procedures.find(p => p.id === procedureId)
    if (!procedure) return

    try {
      setCameraStream(true)
      setArMode('scanning')
      setCollaborationMode(true)
      setShowCollaborationPanel(true)
      
      const collaborativeSession: ARSession = {
        id: `ar-collab-${Date.now()}`,
        technicianId: 'tech-001',
        equipmentId: 'train-ice3-047',
        procedure: procedure.name,
        status: 'active',
        startTime: new Date().toISOString(),
        currentStep: 0,
        totalSteps: procedure.steps.length,
        accuracy: 0,
        location: 'Wartungshalle 2, Stand A3',
        isCollaborative: true,
        participants: currentParticipants.filter(p => p.status === 'online'),
        leadTechnician: 'tech-001',
        sharedAnnotations: [],
        audioEnabled: true,
        videoEnabled: true,
        chatMessages: [
          {
            id: `msg-${Date.now()}`,
            senderId: 'system',
            senderName: 'System',
            message: 'Kollaborative AR-Session gestartet. Alle Teilnehmer sind verbunden.',
            timestamp: new Date().toISOString(),
            type: 'system'
          }
        ]
      }

      setCurrentSession(collaborativeSession)
      setActiveSessions(sessions => [...sessions, collaborativeSession])
      setChatMessages(collaborativeSession.chatMessages)
      
      // Simulate AR initialization
      setTimeout(() => {
        setArMode('active')
        toast.success('Kollaborative AR-Session aktiv', {
          description: `${currentParticipants.filter(p => p.status === 'online').length} Teilnehmer verbunden`
        })
        
        // Add system message about participants
        const participantMessage: ChatMessage = {
          id: `msg-${Date.now()}-participants`,
          senderId: 'system',
          senderName: 'System',
          message: `Teilnehmer: ${currentParticipants.filter(p => p.status === 'online').map(p => p.name).join(', ')}`,
          timestamp: new Date().toISOString(),
          type: 'system'
        }
        setChatMessages(prev => [...prev, participantMessage])
      }, 2000)

    } catch (error) {
      toast.error('Fehler beim Starten der kollaborativen Session')
      setArMode('inactive')
      setCameraStream(false)
      setCollaborationMode(false)
    }
  }

  const addAnnotation = (x: number, y: number, type: Annotation['type'], content: string) => {
    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      technicianId: 'tech-001',
      technicianName: 'Max Schneider',
      type,
      position: { x, y },
      content,
      timestamp: new Date().toISOString(),
      visible: true,
      color: '#3b82f6'
    }
    
    setAnnotations(prev => [...prev, newAnnotation])
    
    // Broadcast to other participants
    toast.info(`Markierung hinzugefügt: ${content}`, { duration: 2000 })
  }

  const sendChatMessage = () => {
    if (!newMessage.trim() || !currentSession) return
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'tech-001',
      senderName: 'Max Schneider',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    }
    
    setChatMessages(prev => [...prev, message])
    setNewMessage('')
    
    // Update session chat
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        chatMessages: [...currentSession.chatMessages, message]
      })
    }
  }

  const toggleParticipantAudio = (participantId: string) => {
    setCurrentParticipants(participants => 
      participants.map(p => 
        p.id === participantId 
          ? { ...p, audioEnabled: !p.audioEnabled }
          : p
      )
    )
    
    const participant = currentParticipants.find(p => p.id === participantId)
    toast.info(`${participant?.name} ${participant?.audioEnabled ? 'stumm geschaltet' : 'Stumm aufgehoben'}`)
  }

  const inviteExpert = async () => {
    // Simulate expert invitation
    const expertMessage: ChatMessage = {
      id: `msg-${Date.now()}-expert`,
      senderId: 'system',
      senderName: 'System',
      message: 'Experte Dr. Klaus Weber zur Session eingeladen und verbunden.',
      timestamp: new Date().toISOString(),
      type: 'system'
    }
    
    setChatMessages(prev => [...prev, expertMessage])
    toast.success('Experte erfolgreich eingeladen')
  }

  const startARSession = async (procedureId: string) => {
    const procedure = procedures.find(p => p.id === procedureId)
    if (!procedure) return

    try {
      // Request camera access for AR
      setCameraStream(true)
      setArMode('scanning')
      
      const newSession: ARSession = {
        id: `ar-${Date.now()}`,
        technicianId: 'tech-001',
        equipmentId: 'train-ice3-047',
        procedure: procedure.name,
        status: 'active',
        startTime: new Date().toISOString(),
        currentStep: 0,
        totalSteps: procedure.steps.length,
        accuracy: 0,
        location: 'Wartungshalle 2, Stand A3',
        isCollaborative: false,
        participants: [],
        leadTechnician: 'tech-001',
        sharedAnnotations: [],
        audioEnabled: false,
        videoEnabled: false,
        chatMessages: []
      }

      setCurrentSession(newSession)
      setActiveSessions(sessions => [...sessions, newSession])
      
      // Simulate AR initialization
      setTimeout(() => {
        setArMode('active')
        toast.success('AR-Session gestartet', {
          description: `${procedure.name} - Schritt 1 von ${procedure.steps.length}`
        })
      }, 2000)

    } catch (error) {
      toast.error('Kamera-Zugriff fehlgeschlagen')
      setArMode('inactive')
      setCameraStream(false)
    }
  }

  const completeStep = (stepIndex: number) => {
    if (!currentSession) return

    const procedure = procedures.find(p => p.name === currentSession.procedure)
    if (!procedure) return

    // Update step completion
    const updatedProcedure = {
      ...procedure,
      steps: procedure.steps.map((step, index) => 
        index === stepIndex ? { ...step, completed: true } : step
      )
    }

    // Update session
    const updatedSession = {
      ...currentSession,
      currentStep: Math.min(stepIndex + 1, procedure.steps.length),
      accuracy: ((stepIndex + 1) / procedure.steps.length) * 100
    }

    setCurrentSession(updatedSession)
    
    if (stepIndex + 1 >= procedure.steps.length) {
      // Session completed
      setCurrentSession({ ...updatedSession, status: 'completed' })
      setArMode('inactive')
      setCameraStream(false)
      toast.success('Wartung erfolgreich abgeschlossen!', {
        description: `Alle ${procedure.steps.length} Schritte durchgeführt`
      })
    } else {
      toast.success(`Schritt ${stepIndex + 1} abgeschlossen`, {
        description: `Weiter zu Schritt ${stepIndex + 2}`
      })
    }
  }

  const stopARSession = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, status: 'paused' })
    }
    setArMode('inactive')
    setCameraStream(false)
    toast.info('AR-Session beendet')
  }

  useEffect(() => {
    // Simulate camera stream
    if (cameraStream && videoRef.current) {
      // In a real implementation, this would connect to device camera
      videoRef.current.style.background = 'linear-gradient(45deg, #1a1a2e, #16213e)'
    }
  }, [cameraStream])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CubeTransparent size={20} className="text-white" />
            </div>
            AR Wartungsanleitungen
          </h2>
          <p className="text-muted-foreground mt-1">
            Augmented Reality-gestützte Wartungsprozeduren für Eisenbahntechnik
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Eye size={12} className="mr-1" />
            {arStats.activeTechnicians} Aktive Techniker
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Users size={12} className="mr-1" />
            {arStats.collaborativeSessions} Kollaborative Sessions
          </Badge>
          <Badge variant={arMode === 'active' ? 'default' : 'secondary'}>
            <CircleNotch size={12} className={`mr-1 ${arMode === 'active' ? 'animate-spin' : ''}`} />
            AR {arMode === 'active' ? 'Aktiv' : 'Bereit'}
          </Badge>
        </div>
      </div>

      {/* AR Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Abgeschlossene Wartungen</p>
                <p className="text-2xl font-bold text-green-600">{arStats.completedProcedures}</p>
              </div>
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Durchschnittliche Genauigkeit</p>
                <p className="text-2xl font-bold text-blue-600">{arStats.averageAccuracy}%</p>
              </div>
              <Target size={24} className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kollaborative Sessions</p>
                <p className="text-2xl font-bold text-purple-600">{arStats.collaborativeSessions}</p>
              </div>
              <Users size={24} className="text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Experten-Konsultationen</p>
                <p className="text-2xl font-bold text-orange-600">{arStats.remoteExpertConsultations}</p>
              </div>
              <Phone size={24} className="text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fehlerreduzierung</p>
                <p className="text-2xl font-bold text-red-600">{arStats.errorReduction}%</p>
              </div>
              <ThreeDimensional size={24} className="text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AR Camera View & Controls */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <VideoCamera size={20} />
                    AR Kamera-Ansicht
                    {collaborationMode && (
                      <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700">
                        <Users size={12} className="mr-1" />
                        Kollaborativ
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Live-Kamerastream mit AR-Overlay für Wartungsanleitungen
                    {collaborationMode && ' • Geteilte Ansicht für alle Teilnehmer'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {collaborationMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCollaborationPanel(!showCollaborationPanel)}
                      className="bg-purple-50 hover:bg-purple-100"
                    >
                      <Users size={14} className="mr-1" />
                      {showCollaborationPanel ? 'Panel ausblenden' : 'Teilnehmer'}
                    </Button>
                  )}
                  {arMode === 'scanning' && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      <ScanLine size={12} className="mr-1 animate-pulse" />
                      Scannen...
                    </Badge>
                  )}
                  {arMode === 'active' && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Crosshair size={12} className="mr-1" />
                      AR Aktiv
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera Viewport */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {cameraStream ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      style={{
                        background: 'linear-gradient(45deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)'
                      }}
                    />
                    
                    {/* AR Overlays */}
                    {arMode === 'active' && currentSession && (
                      <>
                        {/* Equipment Recognition Overlay */}
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            Equipment erkannt: ICE 3 Bremssystem
                            {collaborationMode && (
                              <Badge variant="outline" className="ml-2 text-xs text-white border-white/30">
                                <ShareNetwork size={10} className="mr-1" />
                                Geteilt
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Collaborative Participant Indicators */}
                        {collaborationMode && (
                          <div className="absolute top-4 right-4 space-y-2">
                            {currentParticipants.filter(p => p.status === 'online').map((participant, index) => (
                              <div key={participant.id} className="flex items-center gap-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                                <div className={`w-2 h-2 rounded-full ${
                                  participant.role === 'lead' ? 'bg-yellow-400' :
                                  participant.role === 'expert' ? 'bg-purple-400' :
                                  'bg-blue-400'
                                }`}></div>
                                <span>{participant.name}</span>
                                {participant.audioEnabled && <Microphone size={10} />}
                                {!participant.audioEnabled && <MicrophoneSlash size={10} />}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Shared Annotations */}
                        {annotations.map(annotation => (
                          <div
                            key={annotation.id}
                            className="absolute"
                            style={{
                              left: `${annotation.position.x}%`,
                              top: `${annotation.position.y}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            {annotation.type === 'circle' && (
                              <div className={`w-12 h-12 border-2 rounded-full animate-pulse border-[${annotation.color}]`}>
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                  {annotation.content}
                                  <div className="text-xs opacity-70">{annotation.technicianName}</div>
                                </div>
                              </div>
                            )}
                            {annotation.type === 'arrow' && (
                              <div className="relative">
                                <HandPointing size={24} style={{ color: annotation.color }} />
                                <div className="absolute -top-8 left-6 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                  {annotation.content}
                                  <div className="text-xs opacity-70">{annotation.technicianName}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Step Instructions Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">
                              Schritt {currentSession.currentStep + 1} von {currentSession.totalSteps}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-white border-white/30">
                                {Math.round((currentSession.currentStep / currentSession.totalSteps) * 100)}%
                              </Badge>
                              {collaborationMode && (
                                <Badge variant="outline" className="text-white border-white/30">
                                  <Users size={10} className="mr-1" />
                                  {currentParticipants.filter(p => p.status === 'online').length}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {procedures.find(p => p.name === currentSession.procedure)?.steps[currentSession.currentStep] && (
                            <div>
                              <p className="text-sm font-medium mb-1">
                                {procedures.find(p => p.name === currentSession.procedure)?.steps[currentSession.currentStep].title}
                              </p>
                              <p className="text-xs text-gray-300">
                                {procedures.find(p => p.name === currentSession.procedure)?.steps[currentSession.currentStep].description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* AR Markers/Highlights */}
                        <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-green-400 rounded-lg animate-pulse">
                          <div className="absolute -top-6 left-0 text-green-400 text-xs font-bold">
                            Bremsventil
                          </div>
                        </div>
                        
                        <div className="absolute top-1/2 right-1/3 w-20 h-12 border-2 border-blue-400 rounded-lg animate-pulse">
                          <div className="absolute -top-6 right-0 text-blue-400 text-xs font-bold">
                            Druckanzeige
                          </div>
                        </div>
                      </>
                    )}

                    {arMode === 'scanning' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <CircleNotch size={48} className="animate-spin mx-auto mb-4" />
                          <p className="text-lg font-semibold">Equipment wird gescannt...</p>
                          <p className="text-sm text-gray-300">Positionieren Sie die Kamera auf das Wartungsobjekt</p>
                          {collaborationMode && (
                            <p className="text-xs text-purple-300 mt-2">Alle Teilnehmer können den Scan verfolgen</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Camera size={48} className="mx-auto mb-4" />
                      <p className="text-lg font-semibold">Kamera nicht aktiv</p>
                      <p className="text-sm">Starten Sie eine AR-Session um die Kamera zu aktivieren</p>
                    </div>
                  </div>
                )}
              </div>

              {/* AR Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!currentSession ? (
                    <div className="flex gap-2">
                      <Button 
                        disabled={!selectedProcedure}
                        onClick={() => startARSession(selectedProcedure)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Play size={16} className="mr-2" />
                        Solo AR Session
                      </Button>
                      <Button 
                        disabled={!selectedProcedure}
                        onClick={() => startCollaborativeSession(selectedProcedure)}
                        variant="outline"
                        className="border-purple-200 hover:bg-purple-50"
                      >
                        <Users size={16} className="mr-2" />
                        Kollaborative Session
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {currentSession.status === 'active' && (
                        <Button 
                          variant="outline"
                          onClick={() => completeStep(currentSession.currentStep)}
                          disabled={currentSession.currentStep >= currentSession.totalSteps}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Schritt abschließen
                        </Button>
                      )}
                      
                      {collaborationMode && (
                        <>
                          <Button 
                            variant="outline"
                            onClick={() => addAnnotation(Math.random() * 80 + 10, Math.random() * 60 + 20, 'circle', 'Hier prüfen')}
                            size="sm"
                          >
                            <Target size={14} className="mr-1" />
                            Markieren
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={inviteExpert}
                            size="sm"
                          >
                            <Phone size={14} className="mr-1" />
                            Experte einladen
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        variant="destructive"
                        onClick={stopARSession}
                      >
                        <Stop size={16} className="mr-2" />
                        Session beenden
                      </Button>
                    </div>
                  )}
                </div>

                {/* Audio/Video Controls for Collaboration */}
                {collaborationMode && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant={localAudioEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLocalAudioEnabled(!localAudioEnabled)}
                    >
                      {localAudioEnabled ? <Microphone size={14} /> : <MicrophoneSlash size={14} />}
                    </Button>
                    <Button
                      variant={localVideoEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLocalVideoEnabled(!localVideoEnabled)}
                    >
                      <VideoCamera size={14} />
                    </Button>
                  </div>
                )}

                {currentSession && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {Math.round((Date.now() - new Date(currentSession.startTime).getTime()) / 60000)}min
                    </div>
                    <div className="flex items-center gap-1">
                      <Target size={14} />
                      {Math.round(currentSession.accuracy)}% Genauigkeit
                    </div>
                    {collaborationMode && (
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        {currentParticipants.filter(p => p.status === 'online').length} online
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Current Session Progress */}
              {currentSession && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fortschritt</span>
                    <span>{currentSession.currentStep} / {currentSession.totalSteps} Schritte</span>
                  </div>
                  <Progress 
                    value={(currentSession.currentStep / currentSession.totalSteps) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Procedures, Sessions, and Collaboration */}
        <div className="lg:col-span-2 space-y-6">
          {showCollaborationPanel && collaborationMode && (
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users size={18} />
                  Kollaborations-Panel
                </CardTitle>
                <CardDescription>
                  Teilnehmer-Management und Live-Kommunikation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Participants List */}
                <div>
                  <h4 className="font-medium text-sm mb-3">Aktive Teilnehmer ({currentParticipants.filter(p => p.status === 'online').length})</h4>
                  <div className="space-y-2">
                    {currentParticipants.filter(p => p.status === 'online').map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <UserCircle size={24} className={
                              participant.role === 'lead' ? 'text-yellow-600' :
                              participant.role === 'expert' ? 'text-purple-600' :
                              'text-blue-600'
                            } />
                            {participant.role === 'lead' && (
                              <Crown size={12} className="absolute -top-1 -right-1 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{participant.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  participant.role === 'lead' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  participant.role === 'expert' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                              >
                                {participant.role}
                              </Badge>
                              <span>{participant.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant={participant.audioEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleParticipantAudio(participant.id)}
                            className="w-8 h-8 p-0"
                          >
                            {participant.audioEnabled ? <Microphone size={12} /> : <MicrophoneSlash size={12} />}
                          </Button>
                          <div className={`w-2 h-2 rounded-full ${
                            participant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Chat */}
                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <ChatCircle size={16} />
                    Live-Chat
                  </h4>
                  <div className="bg-white rounded-lg border h-48 flex flex-col">
                    <div className="flex-1 p-3 overflow-y-auto space-y-2">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={`text-xs ${
                          message.type === 'system' ? 'text-center text-muted-foreground italic' : ''
                        }`}>
                          {message.type === 'system' ? (
                            <p>{message.message}</p>
                          ) : (
                            <div className="flex items-start gap-2">
                              <span className="font-medium text-primary">
                                {message.senderName}:
                              </span>
                              <span>{message.message}</span>
                              <span className="text-muted-foreground ml-auto">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="border-t p-2 flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                        placeholder="Nachricht eingeben..."
                        className="flex-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <Button size="sm" onClick={sendChatMessage} disabled={!newMessage.trim()}>
                        <PaperPlaneTilt size={12} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="font-medium text-sm mb-3">Schnellaktionen</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addAnnotation(50, 40, 'arrow', 'Aufmerksamkeit hier')}
                    >
                      <HandPointing size={12} className="mr-1" />
                      Zeigen
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addAnnotation(60, 50, 'circle', 'Problembereic')}
                    >
                      <Circle size={12} className="mr-1" />
                      Markieren
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={inviteExpert}
                    >
                      <Phone size={12} className="mr-1" />
                      Experte
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.info('Bildschirm wird geteilt...')}
                    >
                      <Broadcast size={12} className="mr-1" />
                      Teilen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Procedure Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wartungsprozeduren</CardTitle>
              <CardDescription>Verfügbare AR-gestützte Anleitungen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {procedures.map((procedure) => (
                <div 
                  key={procedure.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-secondary/50 ${
                    selectedProcedure === procedure.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedProcedure(procedure.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{procedure.name}</h4>
                        <Badge 
                          variant={
                            procedure.complexity === 'high' ? 'destructive' :
                            procedure.complexity === 'medium' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {procedure.complexity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {procedure.equipmentType}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {procedure.estimatedTime}min
                        </div>
                        <div className="flex items-center gap-1">
                          <Wrench size={12} />
                          {procedure.steps.length} Schritte
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Sessions */}
          {activeSessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User size={18} />
                  Aktive Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeSessions.slice(-3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{session.procedure}</p>
                        <Badge 
                          variant={
                            session.status === 'active' ? 'default' :
                            session.status === 'completed' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {session.status}
                        </Badge>
                        {session.isCollaborative && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                            <Users size={10} className="mr-1" />
                            Kollaborativ
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {session.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          {session.technicianId}
                        </div>
                        {session.isCollaborative && (
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            {session.participants.length} Teilnehmer
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Procedure Details */}
          {selectedProcedure && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prozedur-Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const procedure = procedures.find(p => p.id === selectedProcedure)
                  if (!procedure) return null

                  return (
                    <>
                      {/* Safety Warnings */}
                      <Alert>
                        <Warning size={16} />
                        <AlertDescription>
                          <div className="space-y-1">
                            <p className="font-medium">Sicherheitshinweise:</p>
                            <ul className="text-sm space-y-1">
                              {procedure.safetyWarnings.map((warning, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-destructive">•</span>
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>

                      {/* Required Tools */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Benötigte Werkzeuge:</h4>
                        <div className="flex flex-wrap gap-2">
                          {procedure.requiredTools.map((tool, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Steps Overview */}
                      <div>
                        <h4 className="font-medium text-sm mb-3">Arbeitsschritte:</h4>
                        <div className="space-y-2">
                          {procedure.steps.map((step, index) => (
                            <div 
                              key={step.id} 
                              className={`text-xs p-2 rounded border ${
                                step.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">Schritt {index + 1}:</span>
                                <span>{step.title}</span>
                                {step.completed && <CheckCircle size={12} className="text-green-600" />}
                              </div>
                              <p className="text-muted-foreground">{step.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ARMaintenanceGuide