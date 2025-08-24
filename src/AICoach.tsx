import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Brain, 
  Microphone,
  MessageCircle,
  Trophy,
  Target,
  Clock,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  TrendUp,
  Zap,
  Eye,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Crown,
  HandPointing,
  Fire,
  Shield,
  Heart,
  ChatCircle,
  Gauge,
  Robot,
  SpeakerHigh,
  Waveform,
  BookOpen,
  GraduationCap,
  Path,
  FlaskConical,
  BarChart3,
  PresentationChart,
  UserCheck,
  TreeStructure,
  Crosshair,
  Pulse,
  Speedometer,
  CircleWavyCheck,
  Clipboard,
  PersonSimpleRun
} from '@phosphor-icons/react'

interface AICoachingSession {
  id: string
  multiplayerSessionId: string
  scenarioName: string
  participants: string[]
  startTime: Date
  status: 'active' | 'paused' | 'completed'
  coachingLevel: 'minimal' | 'standard' | 'intensive' | 'custom'
  feedbackMode: 'real-time' | 'interval' | 'on-demand' | 'post-action'
  totalFeedbackGiven: number
  avgParticipantResponse: number
  improvementDetected: boolean
}

interface AIFeedback {
  id: string
  sessionId: string
  participantId: string
  participantName: string
  timestamp: Date
  type: 'encouragement' | 'correction' | 'strategy' | 'teamwork' | 'leadership' | 'technical' | 'safety'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'individual' | 'team' | 'scenario-specific'
  message: string
  context: string
  actionTaken: boolean
  improvementObserved: boolean
  effectiveness: number // 1-5 scale
  deliveryMethod: 'voice' | 'visual' | 'haptic' | 'mixed'
}

interface CoachingMetrics {
  sessionId: string
  totalInterventions: number
  participantEngagement: { [participantId: string]: number }
  skillImprovements: { [skill: string]: number }
  teamCohesion: number
  responseRate: number
  stressLevels: { [participantId: string]: number }
  learningVelocity: number
  objectiveCompletion: number
}

interface CoachingPersonality {
  id: string
  name: string
  description: string
  style: 'supportive' | 'direct' | 'analytical' | 'motivational'
  voiceCharacteristics: {
    tone: string
    pace: string
    volume: string
  }
  feedbackPatterns: {
    frequency: 'high' | 'medium' | 'low'
    timing: 'immediate' | 'delayed' | 'strategic'
    focus: 'individual' | 'team' | 'balanced'
  }
}

interface LearningPath {
  id: string
  name: string
  description: string
  participantId: string
  currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  targetLevel: 'intermediate' | 'advanced' | 'expert' | 'master'
  progress: number
  modules: LearningModule[]
  estimatedCompletion: Date
  adaptiveAdjustments: string[]
  personalizedRecommendations: string[]
}

interface LearningModule {
  id: string
  name: string
  description: string
  type: 'scenario' | 'skill-drill' | 'theory' | 'assessment' | 'peer-review'
  difficulty: number
  duration: number
  prerequisites: string[]
  completed: boolean
  score?: number
  attempts: number
  lastAttempt?: Date
  adaptiveContent: string[]
  weaknessAreas: string[]
  strengthAreas: string[]
}

interface WeaknessAnalysis {
  participantId: string
  participantName: string
  identifiedWeaknesses: WeaknessArea[]
  improvementPlan: ImprovementPlan
  trackingMetrics: TrackingMetric[]
  lastAnalysis: string // Stored as ISO string for KV compatibility
  progressSinceLastAnalysis: number
}

interface WeaknessArea {
  id: string
  category: 'communication' | 'decision-making' | 'technical-skills' | 'leadership' | 'stress-management' | 'teamwork' | 'protocol-compliance'
  severity: 'minor' | 'moderate' | 'significant' | 'critical'
  description: string
  evidencePoints: string[]
  impact: 'low' | 'medium' | 'high' | 'critical'
  trends: 'improving' | 'stable' | 'declining'
  contextualFactors: string[]
}

interface ImprovementPlan {
  id: string
  targetWeaknesses: string[]
  recommendedModules: string[]
  practiceSchedule: PracticeSession[]
  mentoringSessions: MentoringSession[]
  milestones: Milestone[]
  adaptiveStrategies: string[]
  estimatedTimeframe: number
}

interface PracticeSession {
  id: string
  type: 'solo-drill' | 'peer-practice' | 'simulation' | 'theory-review'
  focus: string
  duration: number
  frequency: 'daily' | 'weekly' | 'bi-weekly'
  prerequisites: string[]
  expectedOutcomes: string[]
}

interface MentoringSession {
  id: string
  mentorType: 'ai-coach' | 'human-expert' | 'peer-mentor'
  focus: string[]
  duration: number
  frequency: 'weekly' | 'bi-weekly' | 'monthly'
  format: 'one-on-one' | 'group' | 'hybrid'
}

interface Milestone {
  id: string
  description: string
  targetDate: Date
  measurableOutcome: string
  completed: boolean
  actualCompletionDate?: Date
  notes?: string
}

interface TrackingMetric {
  id: string
  name: string
  category: string
  currentValue: number
  targetValue: number
  trend: 'improving' | 'stable' | 'declining'
  lastMeasurement: Date
  measurements: { date: Date; value: number }[]
}

export default function AICoach() {
  const [activeCoachingSessions, setActiveCoachingSessions] = useKV<AICoachingSession[]>('ai-coaching-sessions', [])
  const [recentFeedback, setRecentFeedback] = useKV<AIFeedback[]>('ai-feedback-history', [])
  const [coachingMetrics, setCoachingMetrics] = useKV<CoachingMetrics[]>('coaching-metrics', [])
  const [learningPaths, setLearningPaths] = useKV<LearningPath[]>('ai-learning-paths', [])
  const [weaknessAnalyses, setWeaknessAnalyses] = useKV<WeaknessAnalysis[]>('weakness-analyses', [])
  const [coachSettings, setCoachSettings] = useKV('ai-coach-settings', {
    defaultPersonality: 'supportive-mentor',
    adaptiveMode: true,
    realTimeFeedback: true,
    stressMonitoring: true,
    teamDynamicsTracking: true,
    learningStyleAdaptation: true,
    multilingualSupport: false,
    feedbackIntensity: 70,
    interventionThreshold: 60,
    personalizedLearning: true,
    weaknessAnalysisEnabled: true,
    adaptiveDifficulty: true
  })

  const [showCreateSession, setShowCreateSession] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'recent' | 'critical' | 'effective'>('recent')
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null)
  const [showLearningPathDialog, setShowLearningPathDialog] = useState(false)
  const [showWeaknessAnalysis, setShowWeaknessAnalysis] = useState(false)

  const coachingPersonalities: CoachingPersonality[] = [
    {
      id: 'supportive-mentor',
      name: 'Supportive Mentor',
      description: 'Encouraging and patient, focuses on building confidence',
      style: 'supportive',
      voiceCharacteristics: {
        tone: 'warm and encouraging',
        pace: 'measured and calm',
        volume: 'gentle but clear'
      },
      feedbackPatterns: {
        frequency: 'medium',
        timing: 'strategic',
        focus: 'individual'
      }
    },
    {
      id: 'tactical-commander',
      name: 'Tactical Commander',
      description: 'Direct and decisive, emphasizes quick decision-making',
      style: 'direct',
      voiceCharacteristics: {
        tone: 'authoritative and clear',
        pace: 'quick and decisive',
        volume: 'commanding but respectful'
      },
      feedbackPatterns: {
        frequency: 'high',
        timing: 'immediate',
        focus: 'team'
      }
    },
    {
      id: 'analytical-advisor',
      name: 'Analytical Advisor',
      description: 'Data-driven insights with strategic recommendations',
      style: 'analytical',
      voiceCharacteristics: {
        tone: 'thoughtful and precise',
        pace: 'deliberate and clear',
        volume: 'moderate and professional'
      },
      feedbackPatterns: {
        frequency: 'low',
        timing: 'delayed',
        focus: 'balanced'
      }
    },
    {
      id: 'motivational-coach',
      name: 'Motivational Coach',
      description: 'High-energy inspiration to drive peak performance',
      style: 'motivational',
      voiceCharacteristics: {
        tone: 'energetic and inspiring',
        pace: 'dynamic and engaging',
        volume: 'elevated and passionate'
      },
      feedbackPatterns: {
        frequency: 'high',
        timing: 'immediate',
        focus: 'team'
      }
    }
  ]

  // Generate personalized learning path
  const generateLearningPath = async (participantId: string, currentLevel: string, targetLevel: string) => {
    try {
      const prompt = spark.llmPrompt`
        Create a personalized learning path for a railway emergency response trainee.
        
        Current Level: ${currentLevel}
        Target Level: ${targetLevel}
        Training Focus: Railway emergency response, crisis management, team coordination
        
        Generate a structured learning path with:
        1. 5-7 progressive learning modules
        2. Each module should build on previous ones
        3. Mix of theory, practice, and assessment
        4. Specific focus areas for railway emergencies
        5. Estimated timeframes
        
        Return as JSON with modules array containing: name, description, type, duration, prerequisites
      `
      
      const pathData = await spark.llm(prompt, 'gpt-4o-mini', true)
      const parsedPath = JSON.parse(pathData)
      
      const learningPath: LearningPath = {
        id: `path-${Date.now()}-${participantId}`,
        name: `${currentLevel} zu ${targetLevel} Lernpfad`,
        description: `Personalisierter Lernpfad für Bahnnotfall-Training`,
        participantId,
        currentLevel: currentLevel as any,
        targetLevel: targetLevel as any,
        progress: 0,
        modules: parsedPath.modules.map((module: any, index: number) => ({
          id: `module-${index + 1}`,
          name: module.name,
          description: module.description,
          type: module.type,
          difficulty: index + 1,
          duration: module.duration || 30,
          prerequisites: module.prerequisites || [],
          completed: false,
          attempts: 0,
          adaptiveContent: [],
          weaknessAreas: [],
          strengthAreas: []
        })),
        estimatedCompletion: new Date(Date.now() + (parsedPath.modules.length * 7 * 24 * 60 * 60 * 1000)), // weeks
        adaptiveAdjustments: [],
        personalizedRecommendations: []
      }
      
      setLearningPaths(current => [...current, learningPath])
      
      toast.success('Lernpfad erstellt', {
        description: `${parsedPath.modules.length} Module für ${currentLevel}-${targetLevel} Fortschritt`
      })
      
      return learningPath
    } catch (error) {
      console.error('Error generating learning path:', error)
      
      // Fallback learning path
      const fallbackPath: LearningPath = {
        id: `path-${Date.now()}-${participantId}`,
        name: `${currentLevel} zu ${targetLevel} Lernpfad`,
        description: 'Strukturierter Lernpfad für Bahnnotfall-Training',
        participantId,
        currentLevel: currentLevel as any,
        targetLevel: targetLevel as any,
        progress: 0,
        modules: [
          {
            id: 'module-1',
            name: 'Grundlagen der Notfallreaktion',
            description: 'Basics der Bahnnotfall-Protokolle',
            type: 'theory',
            difficulty: 1,
            duration: 30,
            prerequisites: [],
            completed: false,
            attempts: 0,
            adaptiveContent: [],
            weaknessAreas: [],
            strengthAreas: []
          },
          {
            id: 'module-2',
            name: 'Kommunikation unter Druck',
            description: 'Effektive Kommunikation in Krisensituationen',
            type: 'skill-drill',
            difficulty: 2,
            duration: 45,
            prerequisites: ['module-1'],
            completed: false,
            attempts: 0,
            adaptiveContent: [],
            weaknessAreas: [],
            strengthAreas: []
          },
          {
            id: 'module-3',
            name: 'Team-Koordination Simulation',
            description: 'Praktische Übungen in Teamführung',
            type: 'scenario',
            difficulty: 3,
            duration: 60,
            prerequisites: ['module-1', 'module-2'],
            completed: false,
            attempts: 0,
            adaptiveContent: [],
            weaknessAreas: [],
            strengthAreas: []
          }
        ],
        estimatedCompletion: new Date(Date.now() + (21 * 24 * 60 * 60 * 1000)), // 3 weeks
        adaptiveAdjustments: [],
        personalizedRecommendations: []
      }
      
      setLearningPaths(current => [...current, fallbackPath])
      return fallbackPath
    }
  }

  // Analyze participant weaknesses using AI
  const analyzeWeaknesses = async (participantId: string, recentSessions: any[]) => {
    try {
      const prompt = spark.llmPrompt`
        Analyze railway emergency training performance to identify weakness areas.
        
        Training Sessions Data: ${JSON.stringify(recentSessions)}
        
        Identify specific weakness areas in:
        1. Communication effectiveness
        2. Decision-making under pressure
        3. Technical skill application
        4. Leadership capabilities
        5. Stress management
        6. Team coordination
        7. Protocol compliance
        
        For each weakness found, provide:
        - Severity level (minor/moderate/significant/critical)
        - Specific evidence from sessions
        - Impact assessment
        - Improvement trend
        
        Return as JSON with weaknesses array.
      `
      
      const analysisData = await spark.llm(prompt, 'gpt-4o-mini', true)
      const parsedAnalysis = JSON.parse(analysisData)
      
      const analysis: WeaknessAnalysis = {
        participantId,
        participantName: `Trainee ${participantId.slice(-3)}`,
        identifiedWeaknesses: parsedAnalysis.weaknesses.map((w: any, index: number) => ({
          id: `weakness-${index + 1}`,
          category: w.category,
          severity: w.severity,
          description: w.description,
          evidencePoints: w.evidence || [],
          impact: w.impact,
          trends: w.trend || 'stable',
          contextualFactors: w.factors || []
        })),
        improvementPlan: {
          id: `plan-${Date.now()}`,
          targetWeaknesses: parsedAnalysis.weaknesses.map((_: any, index: number) => `weakness-${index + 1}`),
          recommendedModules: [],
          practiceSchedule: [],
          mentoringSessions: [],
          milestones: [],
          adaptiveStrategies: [],
          estimatedTimeframe: 4
        },
        trackingMetrics: [],
        lastAnalysis: new Date().toISOString(),
        progressSinceLastAnalysis: 0
      }
      
      setWeaknessAnalyses(current => [...current.filter(a => a.participantId !== participantId), analysis])
      
      toast.success('Schwachstellenanalyse abgeschlossen', {
        description: `${parsedAnalysis.weaknesses.length} Verbesserungsbereiche identifiziert`
      })
      
      return analysis
    } catch (error) {
      console.error('Error analyzing weaknesses:', error)
      
      // Fallback analysis
      const fallbackAnalysis: WeaknessAnalysis = {
        participantId,
        participantName: `Trainee ${participantId.slice(-3)}`,
        identifiedWeaknesses: [
          {
            id: 'weakness-1',
            category: 'communication',
            severity: 'moderate',
            description: 'Verbesserungsbedarf bei Stresskom munikation',
            evidencePoints: ['Verzögerung bei Notfallmeldungen', 'Unklare Anweisungen unter Druck'],
            impact: 'medium',
            trends: 'stable',
            contextualFactors: ['Hoher Stress', 'Zeitdruck']
          }
        ],
        improvementPlan: {
          id: `plan-${Date.now()}`,
          targetWeaknesses: ['weakness-1'],
          recommendedModules: [],
          practiceSchedule: [],
          mentoringSessions: [],
          milestones: [],
          adaptiveStrategies: [],
          estimatedTimeframe: 4
        },
        trackingMetrics: [],
        lastAnalysis: new Date().toISOString(),
        progressSinceLastAnalysis: 0
      }
      
      setWeaknessAnalyses(current => [...current.filter(a => a.participantId !== participantId), fallbackAnalysis])
      return fallbackAnalysis
    }
  }

  // Generate realistic AI feedback based on scenario context
  const generateAIFeedback = async (sessionId: string, participantId: string, context: string) => {
    try {
      const prompt = spark.llmPrompt`
        You are an AI coach providing real-time feedback during a railway emergency training simulation.
        
        Context: ${context}
        Training Scenario: Emergency response training
        Participant Role: Team member in crisis situation
        
        Generate a brief, actionable coaching message (20-30 words) that:
        1. Is specific to the railway emergency context
        2. Provides immediate value
        3. Is encouraging but constructive
        4. Focuses on team coordination and safety protocols
        
        Respond with just the coaching message, no additional formatting.
      `
      
      const aiMessage = await spark.llm(prompt, 'gpt-4o-mini')
      
      const feedback: AIFeedback = {
        id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        participantId,
        participantName: `Trainee ${participantId.slice(-3)}`,
        timestamp: new Date(),
        type: Math.random() > 0.7 ? 'strategy' : Math.random() > 0.5 ? 'teamwork' : 'encouragement',
        priority: Math.random() > 0.8 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low',
        category: Math.random() > 0.6 ? 'team' : 'individual',
        message: aiMessage.trim(),
        context,
        actionTaken: false,
        improvementObserved: false,
        effectiveness: 0,
        deliveryMethod: 'voice'
      }
      
      setRecentFeedback(current => [feedback, ...current.slice(0, 49)]) // Keep last 50 feedback items
      
      // Show toast notification for high priority feedback
      if (feedback.priority === 'high' || feedback.priority === 'critical') {
        toast.info('AI Coach Intervention', {
          description: feedback.message,
          duration: 3000,
        })
      }
      
      return feedback
    } catch (error) {
      console.error('Error generating AI feedback:', error)
      
      // Fallback feedback
      const fallbackMessages = [
        "Great communication with your team. Keep coordinating those safety protocols.",
        "Consider the passenger evacuation sequence. Team coordination is key here.",
        "Excellent response time. Now focus on maintaining clear communication channels.",
        "Remember your emergency checklist. Your team is counting on systematic approach.",
        "Strong leadership shown. Guide your team through the next critical decision."
      ]
      
      const feedback: AIFeedback = {
        id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        participantId,
        participantName: `Trainee ${participantId.slice(-3)}`,
        timestamp: new Date(),
        type: 'encouragement',
        priority: 'medium',
        category: 'individual',
        message: fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)],
        context,
        actionTaken: false,
        improvementObserved: false,
        effectiveness: 0,
        deliveryMethod: 'voice'
      }
      
      setRecentFeedback(current => [feedback, ...current.slice(0, 49)])
      return feedback
    }
  }

  // Start AI coaching for a multiplayer session
  const startAICoaching = async (multiplayerSessionId: string, scenarioName: string, participants: string[]) => {
    const newSession: AICoachingSession = {
      id: `coach-${Date.now()}`,
      multiplayerSessionId,
      scenarioName,
      participants,
      startTime: new Date(),
      status: 'active',
      coachingLevel: 'standard',
      feedbackMode: 'real-time',
      totalFeedbackGiven: 0,
      avgParticipantResponse: 0,
      improvementDetected: false
    }

    setActiveCoachingSessions(current => [...current, newSession])

    // Initialize coaching metrics
    const metrics: CoachingMetrics = {
      sessionId: newSession.id,
      totalInterventions: 0,
      participantEngagement: participants.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}),
      skillImprovements: {},
      teamCohesion: 50,
      responseRate: 0,
      stressLevels: participants.reduce((acc, p) => ({ ...acc, [p]: 30 }), {}),
      learningVelocity: 0,
      objectiveCompletion: 0
    }

    setCoachingMetrics(current => [...current, metrics])

    toast.success('AI Coach Activated', {
      description: `Monitoring ${participants.length} participants in "${scenarioName}"`
    })

    // Start generating periodic feedback
    simulateRealtimeFeedback(newSession.id, participants)
  }

  // Simulate real-time AI coaching feedback
  const simulateRealtimeFeedback = async (sessionId: string, participants: string[]) => {
    const contexts = [
      'Participant is coordinating evacuation procedures',
      'Team member is managing communication with control center',
      'Trainee is following emergency response protocols',
      'Participant is demonstrating leadership during crisis',
      'Team is working together on safety assessments',
      'Individual is handling passenger communication',
      'Group is executing emergency response plan',
      'Trainee is managing stress under pressure'
    ]

    const feedbackInterval = setInterval(async () => {
      const session = activeCoachingSessions.find(s => s.id === sessionId)
      if (!session || session.status !== 'active') {
        clearInterval(feedbackInterval)
        return
      }

      // Randomly select participant and context for feedback
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)]
      const randomContext = contexts[Math.floor(Math.random() * contexts.length)]

      await generateAIFeedback(sessionId, randomParticipant, randomContext)

      // Update session metrics
      setActiveCoachingSessions(current =>
        current.map(s =>
          s.id === sessionId
            ? { ...s, totalFeedbackGiven: s.totalFeedbackGiven + 1 }
            : s
        )
      )

      // Update coaching metrics
      setCoachingMetrics(current =>
        current.map(m =>
          m.sessionId === sessionId
            ? {
                ...m,
                totalInterventions: m.totalInterventions + 1,
                teamCohesion: Math.min(100, m.teamCohesion + Math.random() * 5),
                learningVelocity: Math.min(100, m.learningVelocity + Math.random() * 3)
              }
            : m
        )
      )
    }, 8000 + Math.random() * 7000) // 8-15 second intervals

    // Stop after 5 minutes (demo)
    setTimeout(() => {
      clearInterval(feedbackInterval)
      completeCoachingSession(sessionId)
    }, 300000)
  }

  const completeCoachingSession = (sessionId: string) => {
    setActiveCoachingSessions(current =>
      current.map(session =>
        session.id === sessionId
          ? { ...session, status: 'completed' }
          : session
      )
    )

    const session = activeCoachingSessions.find(s => s.id === sessionId)
    if (session) {
      toast.success('AI Coaching Session Completed', {
        description: `${session.totalFeedbackGiven} coaching interventions provided`
      })
    }
  }

  const pauseCoachingSession = (sessionId: string) => {
    setActiveCoachingSessions(current =>
      current.map(session =>
        session.id === sessionId
          ? { ...session, status: 'paused' }
          : session
      )
    )
  }

  const resumeCoachingSession = (sessionId: string) => {
    setActiveCoachingSessions(current =>
      current.map(session =>
        session.id === sessionId
          ? { ...session, status: 'active' }
          : session
      )
    )
  }

  const getFeedbackTypeIcon = (type: string) => {
    switch (type) {
      case 'encouragement': return ThumbsUp
      case 'correction': return Target
      case 'strategy': return Lightbulb
      case 'teamwork': return Users
      case 'leadership': return Crown
      case 'technical': return Settings
      case 'safety': return Shield
      default: return MessageCircle
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const filteredFeedback = recentFeedback.filter(feedback => {
    switch (feedbackFilter) {
      case 'recent':
        return Date.now() - feedback.timestamp.getTime() < 10 * 60 * 1000 // Last 10 minutes
      case 'critical':
        return feedback.priority === 'critical' || feedback.priority === 'high'
      case 'effective':
        return feedback.effectiveness >= 4
      default:
        return true
    }
  }).slice(0, 20) // Show max 20 items

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Erweiterte AI-Coach-Funktionen</h1>
            <p className="text-muted-foreground">Personalisierte Lernpfade, Schwachstellenanalyse und intelligente Anpassung</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings size={16} className="mr-2" />
            Konfiguration
          </Button>
          
          <Button onClick={() => setShowCreateSession(true)}>
            <Robot size={16} className="mr-2" />
            AI-Coaching starten
          </Button>
        </div>
      </div>

      {/* Active Coaching Sessions Alert */}
      {activeCoachingSessions.filter(s => s.status === 'active').length > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <Brain className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>{activeCoachingSessions.filter(s => s.status === 'active').length}</strong> aktive AI-Coaching-Sessions mit Echtzeit-Feedback und personalisierten Lernpfaden
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="coaching" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="coaching">Live Coaching</TabsTrigger>
          <TabsTrigger value="learning-paths">Lernpfade</TabsTrigger>
          <TabsTrigger value="weakness-analysis">Schwachstellenanalyse</TabsTrigger>
          <TabsTrigger value="feedback-history">Feedback-Verlauf</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Live Coaching Tab */}
        <TabsContent value="coaching" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Sessions */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play size={20} />
                    Aktive Coaching-Sessions
                  </CardTitle>
                  <CardDescription>
                    Echtzeit-AI-Führung für laufende VR-Training-Szenarien
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeCoachingSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Robot size={48} className="mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Keine aktiven Coaching-Sessions</h3>
                      <p className="text-muted-foreground mb-4">
                        Starten Sie eine AI-Coaching-Session für Echtzeit-Feedback während des VR-Trainings
                      </p>
                      <Button onClick={() => setShowCreateSession(true)}>
                        <Brain size={16} className="mr-2" />
                        AI-Coaching starten
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeCoachingSessions.map((session) => (
                        <Card key={session.id} className={`border-2 ${
                          session.status === 'active' ? 'border-green-200 bg-green-50/50' :
                          session.status === 'paused' ? 'border-yellow-200 bg-yellow-50/50' :
                          'border-gray-200 bg-gray-50/50'
                        }`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{session.scenarioName}</CardTitle>
                                <CardDescription>
                                  {session.participants.length} Teilnehmer • Gestartet {session.startTime.toLocaleTimeString()}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  session.status === 'active' ? 'default' :
                                  session.status === 'paused' ? 'secondary' : 'outline'
                                }>
                                  {session.status === 'active' && <Waveform size={12} className="mr-1" />}
                                  {session.status === 'paused' && <Pause size={12} className="mr-1" />}
                                  {session.status === 'completed' && <CheckCircle size={12} className="mr-1" />}
                                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Session Stats */}
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-xl font-bold text-purple-600">{session.totalFeedbackGiven}</div>
                                <div className="text-muted-foreground">Feedback gegeben</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold text-blue-600">
                                  {coachingMetrics.find(m => m.sessionId === session.id)?.teamCohesion.toFixed(0) || 0}%
                                </div>
                                <div className="text-muted-foreground">Team-Kohäsion</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold text-green-600">
                                  {coachingMetrics.find(m => m.sessionId === session.id)?.learningVelocity.toFixed(0) || 0}%
                                </div>
                                <div className="text-muted-foreground">Lerngeschwindigkeit</div>
                              </div>
                            </div>

                            {/* Session Controls */}
                            <div className="flex gap-2 pt-2 border-t border-border">
                              {session.status === 'active' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => pauseCoachingSession(session.id)}
                                >
                                  <Pause size={14} className="mr-2" />
                                  Pausieren
                                </Button>
                              )}
                              {session.status === 'paused' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => resumeCoachingSession(session.id)}
                                >
                                  <Play size={14} className="mr-2" />
                                  Fortsetzen
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedSession(session.id)}
                              >
                                <Eye size={14} className="mr-2" />
                                Überwachen
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => completeCoachingSession(session.id)}
                                disabled={session.status === 'completed'}
                              >
                                <CheckCircle size={14} className="mr-2" />
                                Beenden
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Coaching Analytics & Settings */}
            <div className="space-y-6">
              {/* Coaching Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendUp size={18} />
                    Coaching-Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center space-y-1 p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        {recentFeedback.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Gesamt-Feedback
                      </div>
                    </div>
                    <div className="text-center space-y-1 p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {recentFeedback.filter(f => f.effectiveness >= 4).length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Effektiv
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Antwortrate</span>
                        <span className="font-medium">
                          {recentFeedback.length > 0 
                            ? Math.round((recentFeedback.filter(f => f.actionTaken).length / recentFeedback.length) * 100)
                            : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={recentFeedback.length > 0 
                          ? (recentFeedback.filter(f => f.actionTaken).length / recentFeedback.length) * 100
                          : 0} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Verbesserungsrate</span>
                        <span className="font-medium">
                          {recentFeedback.length > 0 
                            ? Math.round((recentFeedback.filter(f => f.improvementObserved).length / recentFeedback.length) * 100)
                            : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={recentFeedback.length > 0 
                          ? (recentFeedback.filter(f => f.improvementObserved).length / recentFeedback.length) * 100
                          : 0} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap size={18} />
                    Schnellaktionen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => {
                      // Generate sample coaching session for demo
                      const demoParticipants = ['participant-1', 'participant-2', 'participant-3', 'participant-4']
                      startAICoaching('demo-multiplayer-session', 'Notfall-Feuer-Response-Übung', demoParticipants)
                    }}
                  >
                    <Robot size={16} className="mr-2" />
                    Demo-Session starten
                  </Button>
                  
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowLearningPathDialog(true)}
                  >
                    <Path size={16} className="mr-2" />
                    Lernpfad erstellen
                  </Button>
                  
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setShowWeaknessAnalysis(true)}
                  >
                    <FlaskConical size={16} className="mr-2" />
                    Schwachstellen analysieren
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="learning-paths" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Personalisierte Lernpfade</h2>
              <p className="text-sm text-muted-foreground">AI-gestützte individuelle Trainingsprogramme</p>
            </div>
            <Button onClick={() => setShowLearningPathDialog(true)}>
              <Path size={16} className="mr-2" />
              Neuen Lernpfad erstellen
            </Button>
          </div>

          {learningPaths.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <BookOpen size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Keine Lernpfade erstellt</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Erstellen Sie personalisierte Lernpfade basierend auf individuellen Stärken und Schwächen
                </p>
                <Button onClick={() => setShowLearningPathDialog(true)}>
                  <Path size={16} className="mr-2" />
                  Ersten Lernpfad erstellen
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {learningPaths.map((path) => (
                <Card key={path.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{path.name}</CardTitle>
                        <CardDescription>
                          {path.description} • Teilnehmer {path.participantId.slice(-3)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {path.currentLevel} → {path.targetLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Overview */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fortschritt</span>
                        <span className="font-medium">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {path.modules.filter(m => m.completed).length} von {path.modules.length} Module abgeschlossen
                      </div>
                    </div>

                    {/* Module Overview */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Aktuelle Module:</h4>
                      <div className="space-y-1">
                        {path.modules.slice(0, 3).map((module) => (
                          <div key={module.id} className="flex items-center gap-2 text-sm">
                            {module.completed ? (
                              <CircleWavyCheck size={16} className="text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-muted rounded-full" />
                            )}
                            <span className={module.completed ? 'line-through text-muted-foreground' : ''}>
                              {module.name}
                            </span>
                            {module.completed && module.score && (
                              <Badge variant="outline" className="text-xs">
                                {module.score}%
                              </Badge>
                            )}
                          </div>
                        ))}
                        {path.modules.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{path.modules.length - 3} weitere Module
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Adaptive Recommendations */}
                    {path.personalizedRecommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Brain size={14} className="text-purple-600" />
                          AI-Empfehlungen:
                        </h4>
                        <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="text-sm text-purple-900">
                            {path.personalizedRecommendations[0]}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye size={14} className="mr-2" />
                        Details anzeigen
                      </Button>
                      <Button size="sm" className="flex-1">
                        <PersonSimpleRun size={14} className="mr-2" />
                        Training fortsetzen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Weakness Analysis Tab */}
        <TabsContent value="weakness-analysis" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI-Schwachstellenanalyse</h2>
              <p className="text-sm text-muted-foreground">Detaillierte Analyse von Verbesserungsmöglichkeiten</p>
            </div>
            <Button onClick={() => {
              // Demo weakness analysis
              const demoParticipant = 'participant-demo'
              const demoSessions = [
                { score: 75, scenario: 'fire-emergency', weakPoints: ['communication', 'stress-management'] },
                { score: 82, scenario: 'medical-emergency', weakPoints: ['decision-making'] }
              ]
              analyzeWeaknesses(demoParticipant, demoSessions)
            }}>
              <FlaskConical size={16} className="mr-2" />
              Demo-Analyse erstellen
            </Button>
          </div>

          {weaknessAnalyses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <BarChart3 size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Keine Schwachstellenanalysen verfügbar</h3>
                <p className="text-muted-foreground text-center mb-4">
                  AI analysiert Trainingsergebnisse um individuelle Verbesserungsbereiche zu identifizieren
                </p>
                <Button onClick={() => {
                  const demoParticipant = 'participant-demo'
                  const demoSessions = [{ score: 75, scenario: 'fire-emergency', weakPoints: ['communication'] }]
                  analyzeWeaknesses(demoParticipant, demoSessions)
                }}>
                  <FlaskConical size={16} className="mr-2" />
                  Demo-Analyse starten
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {weaknessAnalyses.map((analysis) => (
                <Card key={analysis.participantId} className="border-l-4 border-l-orange-400">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <UserCheck size={20} />
                          {analysis.participantName}
                        </CardTitle>
                        <CardDescription>
                          Letzte Analyse: {new Date(analysis.lastAnalysis).toLocaleDateString()} • 
                          {analysis.identifiedWeaknesses.length} Verbesserungsbereiche
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {analysis.progressSinceLastAnalysis >= 0 ? 'Verbesserung' : 'Stagnation'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Weakness Areas */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Identifizierte Schwachstellen:</h4>
                      {analysis.identifiedWeaknesses.map((weakness) => (
                        <Card key={weakness.id} className={`border-l-4 ${
                          weakness.severity === 'critical' ? 'border-l-red-500 bg-red-50/50' :
                          weakness.severity === 'significant' ? 'border-l-orange-500 bg-orange-50/50' :
                          weakness.severity === 'moderate' ? 'border-l-yellow-500 bg-yellow-50/50' :
                          'border-l-blue-500 bg-blue-50/50'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-medium capitalize">{weakness.category.replace('-', ' ')}</h5>
                                <p className="text-sm text-muted-foreground">{weakness.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${
                                  weakness.severity === 'critical' ? 'bg-red-100 text-red-800 border-red-200' :
                                  weakness.severity === 'significant' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                  weakness.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  'bg-blue-100 text-blue-800 border-blue-200'
                                }`}>
                                  {weakness.severity}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {weakness.impact} Impact
                                </Badge>
                              </div>
                            </div>
                            
                            {weakness.evidencePoints.length > 0 && (
                              <div className="mt-3">
                                <h6 className="text-xs font-medium text-muted-foreground mb-1">Belege:</h6>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {weakness.evidencePoints.slice(0, 2).map((evidence, index) => (
                                    <li key={index} className="flex items-start gap-1">
                                      <span className="text-primary">•</span>
                                      {evidence}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Clipboard size={14} className="mr-2" />
                        Detailbericht
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => {
                        generateLearningPath(analysis.participantId, 'intermediate', 'advanced')
                      }}>
                        <Path size={14} className="mr-2" />
                        Lernpfad generieren
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Feedback History Tab */}
        <TabsContent value="feedback-history" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI-Feedback-Verlauf</h2>
              <p className="text-sm text-muted-foreground">Echtzeit-Coaching-Interventionen und Teilnehmerreaktionen</p>
            </div>
            <Select value={feedbackFilter} onValueChange={(value: any) => setFeedbackFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="recent">Aktuell</SelectItem>
                <SelectItem value="critical">Kritisch</SelectItem>
                <SelectItem value="effective">Effektiv</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <MessageCircle size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Kein AI-Feedback verfügbar</h3>
                <p className="text-muted-foreground text-center">
                  Kein AI-Feedback für den ausgewählten Filter verfügbar
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredFeedback.map((feedback) => {
                const IconComponent = getFeedbackTypeIcon(feedback.type)
                return (
                  <Card key={feedback.id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent size={16} className="text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">{feedback.participantName}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {feedback.type}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(feedback.priority)}`}>
                              {feedback.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {feedback.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{feedback.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Kontext: {feedback.context}</span>
                            <div className="flex items-center gap-1">
                              <SpeakerHigh size={12} />
                              {feedback.deliveryMethod}
                            </div>
                            {feedback.effectiveness > 0 && (
                              <div className="flex items-center gap-1">
                                <Star size={12} />
                                {feedback.effectiveness}/5
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gesamt-Feedback</p>
                    <p className="text-2xl font-bold">{recentFeedback.length}</p>
                  </div>
                  <MessageCircle size={24} className="text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aktive Lernpfade</p>
                    <p className="text-2xl font-bold">{learningPaths.length}</p>
                  </div>
                  <Path size={24} className="text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Schwachstellenanalysen</p>
                    <p className="text-2xl font-bold">{weaknessAnalyses.length}</p>
                  </div>
                  <FlaskConical size={24} className="text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Effektivitätsrate</p>
                    <p className="text-2xl font-bold">
                      {recentFeedback.length > 0 
                        ? Math.round((recentFeedback.filter(f => f.effectiveness >= 4).length / recentFeedback.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <TrendUp size={24} className="text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Progress Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lernfortschritt-Übersicht</CardTitle>
                <CardDescription>Durchschnittlicher Fortschritt der Lernpfade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningPaths.length > 0 ? (
                  learningPaths.map((path) => (
                    <div key={path.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{path.name}</span>
                        <span className="text-sm text-muted-foreground">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen size={48} className="mx-auto mb-4" />
                    <p>Keine Lernpfade erstellt</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback-Kategorien</CardTitle>
                <CardDescription>Verteilung der AI-Coaching-Interventionen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['encouragement', 'correction', 'strategy', 'teamwork', 'leadership'].map((type) => {
                  const count = recentFeedback.filter(f => f.type === type).length
                  const percentage = recentFeedback.length > 0 ? (count / recentFeedback.length) * 100 : 0
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{type}</span>
                        <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Coaching Session Dialog */}
      <Dialog open={showCreateSession} onOpenChange={setShowCreateSession}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI-Coaching-Session starten</DialogTitle>
            <DialogDescription>
              Konfigurieren Sie AI-Coaching für ein Multiplayer-VR-Training-Szenario
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Coaching-Persönlichkeit</Label>
              <Select defaultValue="supportive-mentor">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {coachingPersonalities.map(personality => (
                    <SelectItem key={personality.id} value={personality.id}>
                      <div className="flex flex-col items-start">
                        <span>{personality.name}</span>
                        <span className="text-xs text-muted-foreground">{personality.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Feedback-Modus</Label>
              <Select defaultValue="real-time">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real-time">Echtzeit-Feedback</SelectItem>
                  <SelectItem value="interval">Intervall-basiert</SelectItem>
                  <SelectItem value="on-demand">Nur auf Anfrage</SelectItem>
                  <SelectItem value="post-action">Nachbearbeitung</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Coaching-Intensität</Label>
              <div className="px-3">
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  defaultValue="70" 
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Minimal</span>
                  <span>Standard</span>
                  <span>Intensiv</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateSession(false)}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button 
                onClick={() => {
                  // Demo: Start coaching for a sample multiplayer session
                  const demoParticipants = ['participant-1', 'participant-2', 'participant-3']
                  startAICoaching('demo-session-' + Date.now(), 'Medizinischer Notfall-Response', demoParticipants)
                  setShowCreateSession(false)
                }}
                className="flex-1"
              >
                <Brain size={16} className="mr-2" />
                Coaching starten
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Learning Path Dialog */}
      <Dialog open={showLearningPathDialog} onOpenChange={setShowLearningPathDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Personalisierten Lernpfad erstellen</DialogTitle>
            <DialogDescription>
              AI-gestützter Lernpfad basierend auf individuellen Fähigkeiten und Zielen
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Teilnehmer ID</Label>
              <Input 
                placeholder="z.B. participant-123"
                value={selectedParticipant || ''}
                onChange={(e) => setSelectedParticipant(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Aktuelles Level</Label>
              <Select defaultValue="beginner">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Anfänger</SelectItem>
                  <SelectItem value="intermediate">Fortgeschritten</SelectItem>
                  <SelectItem value="advanced">Erfahren</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ziel-Level</Label>
              <Select defaultValue="intermediate">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intermediate">Fortgeschritten</SelectItem>
                  <SelectItem value="advanced">Erfahren</SelectItem>
                  <SelectItem value="expert">Experte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLearningPathDialog(false)}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button 
                onClick={() => {
                  if (selectedParticipant) {
                    generateLearningPath(selectedParticipant, 'beginner', 'intermediate')
                    setShowLearningPathDialog(false)
                    setSelectedParticipant(null)
                  }
                }}
                className="flex-1"
                disabled={!selectedParticipant}
              >
                <Path size={16} className="mr-2" />
                Lernpfad erstellen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coaching Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AI-Coach-Konfiguration</DialogTitle>
            <DialogDescription>
              Passen Sie das AI-Coaching-Verhalten und die Einstellungen an
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Adaptives Lernen</Label>
                <Button
                  variant={coachSettings.adaptiveMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCoachSettings(prev => ({ ...prev, adaptiveMode: !prev.adaptiveMode }))}
                >
                  {coachSettings.adaptiveMode ? 'Aktiviert' : 'Deaktiviert'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Personalisierte Lernpfade</Label>
                <Button
                  variant={coachSettings.personalizedLearning ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCoachSettings(prev => ({ ...prev, personalizedLearning: !prev.personalizedLearning }))}
                >
                  {coachSettings.personalizedLearning ? 'Aktiviert' : 'Deaktiviert'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Schwachstellenanalyse</Label>
                <Button
                  variant={coachSettings.weaknessAnalysisEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCoachSettings(prev => ({ ...prev, weaknessAnalysisEnabled: !prev.weaknessAnalysisEnabled }))}
                >
                  {coachSettings.weaknessAnalysisEnabled ? 'Aktiviert' : 'Deaktiviert'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Stress-Überwachung</Label>
                <Button
                  variant={coachSettings.stressMonitoring ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCoachSettings(prev => ({ ...prev, stressMonitoring: !prev.stressMonitoring }))}
                >
                  {coachSettings.stressMonitoring ? 'Aktiv' : 'Inaktiv'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm">Team-Dynamik</Label>
                <Button
                  variant={coachSettings.teamDynamicsTracking ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCoachSettings(prev => ({ ...prev, teamDynamicsTracking: !prev.teamDynamicsTracking }))}
                >
                  {coachSettings.teamDynamicsTracking ? 'Verfolgen' : 'Aus'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Adaptive Schwierigkeit</Label>
                <Button
                  variant={coachSettings.adaptiveDifficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCoachSettings(prev => ({ ...prev, adaptiveDifficulty: !prev.adaptiveDifficulty }))}
                >
                  {coachSettings.adaptiveDifficulty ? 'Aktiviert' : 'Deaktiviert'}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm">Interventions-Schwellenwert</Label>
              <div className="px-3">
                <input 
                  type="range" 
                  min="30" 
                  max="90" 
                  value={coachSettings.interventionThreshold}
                  onChange={(e) => setCoachSettings(prev => ({ ...prev, interventionThreshold: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Niedrig</span>
                  <span>{coachSettings.interventionThreshold}%</span>
                  <span>Hoch</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button 
                onClick={() => {
                  toast.success('Coaching-Einstellungen aktualisiert')
                  setShowSettings(false)
                }}
                className="flex-1"
              >
                Änderungen speichern
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}