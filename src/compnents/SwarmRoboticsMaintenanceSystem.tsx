/**
 * @fileoverview Swarm-Robotics: Autonome Wartungsroboter-Schwärme
 * @author SmartRail-AI System
 * @version 2.0.0
 * 
 * Koordinierte Roboter-Schwärme für autonome Wartung, Reparatur und Inspektion
 * der Bahninfrastruktur mit kollektiver Intelligenz und Selbstorganisation
 */

import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Robot, 
  Users, 
  Wrench, 
  Target, 
  Lightning,
  Activity,
  MapPin,
  Clock,
  Battery,
  Gear,
  Eye,
  CheckCircle,
  AlertTriangle,
  Graph,
  Radio,
  Database,
  FlowArrow,
  Monitor,
  Pulse,
  Warning
} from '@phosphor-icons/react'

interface MaintenanceRobot {
  id: string
  type: 'inspector' | 'welder' | 'cleaner' | 'sensor_installer' | 'emergency_repair'
  position: { x: number; y: number; z: number; track: string }
  status: 'active' | 'charging' | 'maintenance' | 'mission' | 'standby' | 'error'
  batteryLevel: number
  capabilities: string[]
  currentTask: {
    id: string
    type: string
    progress: number
    estimatedCompletion: string
  } | null
  teamId: string
  swarmRole: 'leader' | 'follower' | 'specialist' | 'scout'
  communicationRange: number
  tools: Array<{
    name: string
    condition: number
    lastMaintenance: string
  }>
}

interface SwarmTeam {
  id: string
  name: string
  robots: string[]
  objective: string
  coordinationMode: 'hierarchical' | 'democratic' | 'emergent'
  efficiency: number
  completedTasks: number
  activeArea: string
}

interface SwarmMission {
  id: string
  title: string
  type: 'routine_inspection' | 'emergency_repair' | 'infrastructure_upgrade' | 'cleaning' | 'sensor_deployment'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTeams: string[]
  progress: number
  startTime: string
  estimatedDuration: number
  status: 'planning' | 'active' | 'completed' | 'paused' | 'failed'
}

const SwarmRoboticsMaintenanceSystem: React.FC = () => {
  const [robots, setRobots] = useKV<MaintenanceRobot[]>('maintenance-robots', [])
  const [swarmTeams, setSwarmTeams] = useKV<SwarmTeam[]>('swarm-teams', [])
  const [missions, setMissions] = useKV<SwarmMission[]>('swarm-missions', [])
  const [systemConfig, setSystemConfig] = useKV('swarm-config', {
    maxRobotsPerTeam: 8,
    communicationProtocol: 'mesh',
    autonomyLevel: 'high',
    emergencyResponseTime: 5, // Minuten
    batteryThreshold: 20 // Prozent
  })

  const [swarmData, setSwarmData] = useState({
    totalRobots: 0,
    activeRobots: 0,
    activeMissions: 0,
    avgEfficiency: 0,
    completedTasks: 0,
    emergencyResponses: 0
  })

  // Simulation der Roboter-Schwärme
  useEffect(() => {
    if (robots.length === 0) {
      const mockRobots: MaintenanceRobot[] = [
        {
          id: 'robot-inspector-001',
          type: 'inspector',
          position: { x: 125.45, y: 2.1, z: 0.8, track: 'Gleis 1' },
          status: 'mission',
          batteryLevel: 87,
          capabilities: ['visual_inspection', 'thermal_scanning', 'ultrasonic_testing', 'ai_analysis'],
          currentTask: {
            id: 'task-inspect-001',
            type: 'Schienen-Inspektion',
            progress: 67,
            estimatedCompletion: new Date(Date.now() + 1800000).toISOString()
          },
          teamId: 'team-alpha',
          swarmRole: 'leader',
          communicationRange: 500,
          tools: [
            { name: 'HD-Kamera', condition: 95, lastMaintenance: '2024-01-15' },
            { name: 'Thermosensor', condition: 89, lastMaintenance: '2024-01-10' },
            { name: 'Ultraschall-Scanner', condition: 92, lastMaintenance: '2024-01-12' }
          ]
        },
        {
          id: 'robot-welder-002',
          type: 'welder',
          position: { x: 127.89, y: 2.0, z: 0.5, track: 'Gleis 1' },
          status: 'mission',
          batteryLevel: 72,
          capabilities: ['precision_welding', 'material_analysis', 'heat_treatment', 'quality_control'],
          currentTask: {
            id: 'task-weld-001',
            type: 'Schienen-Schweißung',
            progress: 34,
            estimatedCompletion: new Date(Date.now() + 3600000).toISOString()
          },
          teamId: 'team-alpha',
          swarmRole: 'specialist',
          communicationRange: 300,
          tools: [
            { name: 'Laser-Schweißer', condition: 88, lastMaintenance: '2024-01-08' },
            { name: 'Materialprüfer', condition: 94, lastMaintenance: '2024-01-14' }
          ]
        },
        {
          id: 'robot-cleaner-003',
          type: 'cleaner',
          position: { x: 89.23, y: 1.8, z: 0.3, track: 'Gleis 2' },
          status: 'active',
          batteryLevel: 95,
          capabilities: ['debris_removal', 'surface_cleaning', 'vegetation_control', 'chemical_cleaning'],
          currentTask: {
            id: 'task-clean-001',
            type: 'Gleisbett-Reinigung',
            progress: 78,
            estimatedCompletion: new Date(Date.now() + 900000).toISOString()
          },
          teamId: 'team-beta',
          swarmRole: 'follower',
          communicationRange: 400,
          tools: [
            { name: 'Saug-System', condition: 91, lastMaintenance: '2024-01-11' },
            { name: 'Drucksprüher', condition: 85, lastMaintenance: '2024-01-09' }
          ]
        },
        {
          id: 'robot-sensor-004',
          type: 'sensor_installer',
          position: { x: 156.78, y: 2.2, z: 1.2, track: 'Gleis 3' },
          status: 'charging',
          batteryLevel: 15,
          capabilities: ['sensor_deployment', 'network_configuration', 'calibration', 'testing'],
          currentTask: null,
          teamId: 'team-gamma',
          swarmRole: 'specialist',
          communicationRange: 600,
          tools: [
            { name: 'Bohrgerät', condition: 93, lastMaintenance: '2024-01-13' },
            { name: 'Netzwerk-Konfiguration', condition: 97, lastMaintenance: '2024-01-16' }
          ]
        },
        {
          id: 'robot-emergency-005',
          type: 'emergency_repair',
          position: { x: 200.45, y: 2.0, z: 0.7, track: 'Gleis 4' },
          status: 'standby',
          batteryLevel: 98,
          capabilities: ['emergency_welding', 'structural_support', 'hazard_removal', 'rapid_deployment'],
          currentTask: null,
          teamId: 'team-emergency',
          swarmRole: 'leader',
          communicationRange: 800,
          tools: [
            { name: 'Notfall-Schweißer', condition: 100, lastMaintenance: '2024-01-17' },
            { name: 'Strukturstützen', condition: 95, lastMaintenance: '2024-01-15' },
            { name: 'Gefahrgut-Greifer', condition: 89, lastMaintenance: '2024-01-10' }
          ]
        }
      ]
      setRobots(mockRobots)

      const mockTeams: SwarmTeam[] = [
        {
          id: 'team-alpha',
          name: 'Alpha-Inspektions-Team',
          robots: ['robot-inspector-001', 'robot-welder-002'],
          objective: 'Vollständige Schienen-Inspektion und Reparatur Gleis 1',
          coordinationMode: 'hierarchical',
          efficiency: 94,
          completedTasks: 23,
          activeArea: 'Gleis 1 (km 125-130)'
        },
        {
          id: 'team-beta',
          name: 'Beta-Reinigungs-Team',
          robots: ['robot-cleaner-003'],
          objective: 'Präventive Reinigung und Wartung Gleis 2',
          coordinationMode: 'democratic',
          efficiency: 87,
          completedTasks: 31,
          activeArea: 'Gleis 2 (km 85-95)'
        },
        {
          id: 'team-gamma',
          name: 'Gamma-Sensor-Team',
          robots: ['robot-sensor-004'],
          objective: 'IoT-Sensor-Netzwerk-Ausbau',
          coordinationMode: 'emergent',
          efficiency: 92,
          completedTasks: 18,
          activeArea: 'Gleis 3 (km 150-165)'
        },
        {
          id: 'team-emergency',
          name: 'Notfall-Reaktions-Team',
          robots: ['robot-emergency-005'],
          objective: 'Sofortige Notfall-Reparaturen und Gefahrenabwehr',
          coordinationMode: 'hierarchical',
          efficiency: 99,
          completedTasks: 7,
          activeArea: 'Bereitschaftsbereich'
        }
      ]
      setSwarmTeams(mockTeams)

      const mockMissions: SwarmMission[] = [
        {
          id: 'mission-001',
          title: 'Vollständige Schienen-Inspektion Sektor A',
          type: 'routine_inspection',
          priority: 'high',
          assignedTeams: ['team-alpha'],
          progress: 67,
          startTime: new Date(Date.now() - 7200000).toISOString(),
          estimatedDuration: 180, // Minuten
          status: 'active'
        },
        {
          id: 'mission-002',
          title: 'Präventive Reinigung Herbst-Laub',
          type: 'cleaning',
          priority: 'medium',
          assignedTeams: ['team-beta'],
          progress: 78,
          startTime: new Date(Date.now() - 3600000).toISOString(),
          estimatedDuration: 120,
          status: 'active'
        },
        {
          id: 'mission-003',
          title: 'IoT-Sensor-Netzwerk Erweiterung',
          type: 'sensor_deployment',
          priority: 'high',
          assignedTeams: ['team-gamma'],
          progress: 45,
          startTime: new Date(Date.now() - 10800000).toISOString(),
          estimatedDuration: 300,
          status: 'paused'
        }
      ]
      setMissions(mockMissions)
    }

    // Echtzeit-Daten aktualisieren
    const interval = setInterval(() => {
      const activeRobots = robots.filter(r => r.status === 'active' || r.status === 'mission').length
      const activeMissions = missions.filter(m => m.status === 'active').length
      const avgEff = swarmTeams.reduce((sum, team) => sum + team.efficiency, 0) / Math.max(swarmTeams.length, 1)
      const totalTasks = swarmTeams.reduce((sum, team) => sum + team.completedTasks, 0)

      setSwarmData(prev => ({
        totalRobots: robots.length,
        activeRobots,
        activeMissions,
        avgEfficiency: avgEff,
        completedTasks: totalTasks,
        emergencyResponses: prev.emergencyResponses + (Math.random() < 0.1 ? 1 : 0)
      }))

      // Simuliere Fortschritt bei aktiven Missionen
      setMissions(currentMissions => 
        currentMissions.map(mission => 
          mission.status === 'active' 
            ? { ...mission, progress: Math.min(100, mission.progress + Math.random() * 3) }
            : mission
        )
      )

    }, 3000)

    return () => clearInterval(interval)
  }, [robots, swarmTeams, missions, setRobots, setSwarmTeams, setMissions])

  const deploySwarmTeam = async (teamId: string, missionType: string) => {
    try {
      const team = swarmTeams.find(t => t.id === teamId)
      if (!team) return

      // Aktualisiere Roboter-Status
      setRobots(currentRobots => 
        currentRobots.map(robot => 
          team.robots.includes(robot.id) && robot.batteryLevel > systemConfig.batteryThreshold
            ? { ...robot, status: 'mission' as const }
            : robot
        )
      )

      toast.success(`Schwarm-Team ${team.name} eingesetzt`, {
        description: `${team.robots.length} Roboter für ${missionType} aktiviert`
      })

    } catch (error) {
      toast.error('Fehler beim Einsetzen des Schwarm-Teams')
    }
  }

  const emergencySwarmResponse = async () => {
    try {
      // Alle verfügbaren Roboter für Notfall mobilisieren
      const availableRobots = robots.filter(r => 
        r.batteryLevel > 30 && 
        (r.status === 'standby' || r.status === 'active')
      )

      setRobots(currentRobots => 
        currentRobots.map(robot => 
          availableRobots.some(ar => ar.id === robot.id)
            ? { ...robot, status: 'mission' as const }
            : robot
        )
      )

      const newMission: SwarmMission = {
        id: `emergency-${Date.now()}`,
        title: 'Notfall-Schwarm-Einsatz',
        type: 'emergency_repair',
        priority: 'critical',
        assignedTeams: ['team-emergency'],
        progress: 0,
        startTime: new Date().toISOString(),
        estimatedDuration: 60,
        status: 'active'
      }

      setMissions(current => [newMission, ...current])

      toast.error('Notfall-Schwarm-Einsatz aktiviert', {
        description: `${availableRobots.length} Roboter für Notfall-Mission mobilisiert`
      })

    } catch (error) {
      toast.error('Fehler beim Notfall-Schwarm-Einsatz')
    }
  }

  const optimizeSwarmCoordination = async () => {
    try {
      toast.info('Schwarm-Koordination wird optimiert...', {
        description: 'KI analysiert Effizienz-Patterns'
      })

      // Simuliere Optimierung
      setTimeout(() => {
        setSwarmTeams(currentTeams => 
          currentTeams.map(team => ({
            ...team,
            efficiency: Math.min(100, team.efficiency + Math.random() * 5)
          }))
        )
        toast.success('Schwarm-Koordination optimiert')
      }, 2500)

    } catch (error) {
      toast.error('Fehler bei der Schwarm-Optimierung')
    }
  }

  const getRobotTypeColor = (type: MaintenanceRobot['type']) => {
    switch (type) {
      case 'inspector': return 'bg-blue-500'
      case 'welder': return 'bg-red-500'
      case 'cleaner': return 'bg-green-500'
      case 'sensor_installer': return 'bg-purple-500'
      case 'emergency_repair': return 'bg-orange-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'mission': return 'text-blue-600'
      case 'charging': return 'text-yellow-600'
      case 'maintenance': return 'text-orange-600'
      case 'standby': return 'text-gray-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700'
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center">
            <Robot size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Swarm-Robotics Wartungssystem</h1>
            <p className="text-muted-foreground">Autonome Wartungsroboter-Schwärme für Bahninfrastruktur</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={optimizeSwarmCoordination}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Lightning size={16} className="mr-2" />
            Koordination Optimieren
          </Button>
          <Button 
            onClick={emergencySwarmResponse}
            variant="destructive"
          >
            <AlertTriangle size={16} className="mr-2" />
            Notfall-Schwarm
          </Button>
        </div>
      </div>

      {/* System-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Gesamt-Roboter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{swarmData.totalRobots}</div>
            <p className="text-xs text-muted-foreground">Schwarm-Einheiten</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aktive Roboter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{swarmData.activeRobots}</div>
            <p className="text-xs text-muted-foreground">Im Einsatz</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aktive Missionen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{swarmData.activeMissions}</div>
            <p className="text-xs text-muted-foreground">Laufende Aufträge</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ø Effizienz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{swarmData.avgEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Schwarm-Performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Erledigte Aufgaben</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{swarmData.completedTasks}</div>
            <p className="text-xs text-muted-foreground">Gesamt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notfall-Einsätze</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{swarmData.emergencyResponses}</div>
            <p className="text-xs text-muted-foreground">24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Roboter-Schwärme & Missionen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Roboter-Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Aktive Schwarm-Roboter
            </CardTitle>
            <CardDescription>Status und Aufgaben der Wartungsroboter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {robots.map((robot) => (
              <div key={robot.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getRobotTypeColor(robot.type)}`}></div>
                    <div>
                      <h4 className="font-semibold">{robot.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        {robot.type.replace('_', ' ')} • {robot.position.track} • 
                        <span className={`ml-1 font-medium ${getStatusColor(robot.status)}`}>
                          {robot.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Badge variant={robot.swarmRole === 'leader' ? "default" : "secondary"}>
                    {robot.swarmRole}
                  </Badge>
                </div>

                {/* Batterie & Kommunikation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Batterie</span>
                      <span>{robot.batteryLevel}%</span>
                    </div>
                    <Progress value={robot.batteryLevel} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Kommunikation</span>
                      <span>{robot.communicationRange}m</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Reichweite: {robot.communicationRange}m
                    </div>
                  </div>
                </div>

                {/* Aktuelle Aufgabe */}
                {robot.currentTask && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Aktuelle Aufgabe</h5>
                    <div className="p-2 bg-secondary/50 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{robot.currentTask.type}</span>
                        <Badge variant="outline" className="text-xs">
                          {robot.currentTask.progress}%
                        </Badge>
                      </div>
                      <Progress value={robot.currentTask.progress} className="h-1 mb-1" />
                      <p className="text-xs text-muted-foreground">
                        Fertigstellung: {new Date(robot.currentTask.estimatedCompletion).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tools & Fähigkeiten */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Werkzeuge & Fähigkeiten</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Fähigkeiten:</p>
                      <div className="flex flex-wrap gap-1">
                        {robot.capabilities.slice(0, 2).map((cap, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cap.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Werkzeuge:</p>
                      <div className="space-y-1">
                        {robot.tools.slice(0, 2).map((tool, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-xs">{tool.name}</span>
                            <span className="text-xs text-green-600">{tool.condition}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={robot.status === 'mission'}
                  >
                    <Target size={14} className="mr-1" />
                    Mission Zuweisen
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={robot.batteryLevel < 20}
                  >
                    <Radio size={14} className="mr-1" />
                    Schwarm-Kommunikation
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Schwarm-Teams & Missionen */}
        <div className="space-y-6">
          {/* Schwarm-Teams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlowArrow size={20} />
                Schwarm-Teams
              </CardTitle>
              <CardDescription>Koordinierte Roboter-Teams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {swarmTeams.map((team) => (
                <div key={team.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{team.name}</h4>
                      <p className="text-sm text-muted-foreground">{team.activeArea}</p>
                    </div>
                    <Badge variant="outline">
                      {team.robots.length} Roboter
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">{team.objective}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Effizienz</p>
                        <div className="flex justify-between mb-1">
                          <span>{team.efficiency}%</span>
                        </div>
                        <Progress value={team.efficiency} className="h-2" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">Erledigte Aufgaben</p>
                        <p className="text-2xl font-bold text-green-600">{team.completedTasks}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Koordinationsmodus: <span className="font-medium">{team.coordinationMode}</span>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    onClick={() => deploySwarmTeam(team.id, 'Wartungsmission')}
                    className="w-full"
                  >
                    <Lightning size={14} className="mr-1" />
                    Team Einsetzen
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Aktive Missionen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} />
                Aktive Schwarm-Missionen
              </CardTitle>
              <CardDescription>Laufende und geplante Missionen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {missions.map((mission) => (
                <div key={mission.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{mission.title}</h4>
                      <p className="text-sm text-muted-foreground">{mission.type.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={mission.priority === 'critical' ? "destructive" : 
                                     mission.priority === 'high' ? "default" : "secondary"}>
                        {mission.priority}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {mission.assignedTeams.length} Team{mission.assignedTeams.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fortschritt</span>
                      <span>{mission.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={mission.progress} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Gestartet</p>
                        <p className="font-medium">
                          {new Date(mission.startTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Geschätzte Dauer</p>
                        <p className="font-medium">{mission.estimatedDuration} Min</p>
                      </div>
                    </div>
                  </div>

                  <Badge variant={mission.status === 'active' ? "default" : 
                                 mission.status === 'completed' ? "outline" : "secondary"}>
                    {mission.status === 'active' ? 'Aktiv' : 
                     mission.status === 'completed' ? 'Abgeschlossen' :
                     mission.status === 'paused' ? 'Pausiert' : mission.status}
                  </Badge>
                </div>
              ))}
              
              {missions.filter(m => m.status === 'active').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Keine aktiven Schwarm-Missionen</p>
                  <p className="text-sm">Teams stehen für neue Aufträge bereit</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System-Konfiguration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gear size={20} />
            Schwarm-System Konfiguration
          </CardTitle>
          <CardDescription>Einstellungen für Roboter-Schwarm-Koordination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Max. Roboter pro Team</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-600">{systemConfig.maxRobotsPerTeam}</p>
                <p className="text-xs text-muted-foreground">Optimale Schwarm-Größe</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Kommunikationsprotokoll</h4>
              <Badge variant="default">
                {systemConfig.communicationProtocol}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Schwarm-Vernetzung
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Autonomie-Level</h4>
              <Badge variant="default">
                {systemConfig.autonomyLevel}
              </Badge>
              <p className="text-xs text-muted-foreground">
                Selbstständigkeitsgrad
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Notfall-Reaktionszeit</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-red-600">{systemConfig.emergencyResponseTime}</p>
                <p className="text-xs text-muted-foreground">Minuten max.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Batterie-Schwelle</h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-yellow-600">{systemConfig.batteryThreshold}%</p>
                <p className="text-xs text-muted-foreground">Min. für Mission</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnungen */}
      {robots.filter(r => r.batteryLevel < systemConfig.batteryThreshold).length > 0 && (
        <Alert variant="destructive">
          <Warning size={16} />
          <AlertDescription>
            {robots.filter(r => r.batteryLevel < systemConfig.batteryThreshold).length} Roboter 
            haben niedrigen Batteriestand und müssen geladen werden.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default SwarmRoboticsMaintenanceSystem