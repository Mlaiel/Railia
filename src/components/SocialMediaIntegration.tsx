/**
 * SmartRail-AI - KI-gestützte Lösung zur Reduzierung von Zugverspätungen
 * 
 * © 2024 Fahed Mlaiel. Alle Rechte vorbehalten.
 * Lizenziert nur für Bildung, NGOs und Forschung.
 * Kommerzielle Nutzung erfordert kostenpflichtige Lizenz.
 * 
 * Kontakt: mlaiel@live.de
 * Attribution: Namensnennung von Fahed Mlaiel verpflichtend
 */

import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Share,
  TrendUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Repeat,
  Clock,
  AlertTriangle,
  Settings,
  CheckCircle,
  X,
  Camera,
  Video,
  Zap,
  Globe,
  Smartphone,
  Hash,
  At,
  Star,
  Target,
  Filter,
  BarChart3,
  Send,
  Calendar,
  Info
} from '@phosphor-icons/react'

interface SocialMediaAccount {
  id: string
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'telegram' | 'whatsapp'
  name: string
  handle: string
  followers: number
  isActive: boolean
  isVerified: boolean
  lastPost: string
  engagementRate: number
  apiConnected: boolean
  permissions: string[]
}

interface SocialMediaPost {
  id: string
  platform: string
  content: string
  media?: string[]
  hashtags: string[]
  mentions: string[]
  scheduledTime?: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  timestamp: string
  metrics: {
    views: number
    likes: number
    shares: number
    comments: number
    clicks: number
    reach: number
  }
  trainInfo?: {
    trainNumber: string
    route: string
    delay: number
    cause: string
  }
}

interface HashtagTrend {
  tag: string
  usage: number
  growth: number
  effectiveness: number
}

export default function SocialMediaIntegration() {
  const [activeView, setActiveView] = useState('dashboard')
  
  // Social media accounts management
  const [socialAccounts, setSocialAccounts] = useKV<SocialMediaAccount[]>('social-accounts', [
    {
      id: '1',
      platform: 'twitter',
      name: 'SmartRail-AI Official',
      handle: '@smartrail_ai',
      followers: 15420,
      isActive: true,
      isVerified: true,
      lastPost: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      engagementRate: 4.2,
      apiConnected: true,
      permissions: ['read', 'write', 'direct_messages']
    },
    {
      id: '2',
      platform: 'facebook',
      name: 'SmartRail-AI',
      handle: 'smartrail.ai',
      followers: 8930,
      isActive: true,
      isVerified: false,
      lastPost: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      engagementRate: 2.8,
      apiConnected: true,
      permissions: ['manage_pages', 'publish_pages']
    },
    {
      id: '3',
      platform: 'telegram',
      name: 'SmartRail Updates',
      handle: '@smartrail_updates',
      followers: 3240,
      isActive: true,
      isVerified: false,
      lastPost: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      engagementRate: 8.5,
      apiConnected: true,
      permissions: ['send_messages', 'edit_messages']
    },
    {
      id: '4',
      platform: 'instagram',
      name: 'SmartRail AI',
      handle: '@smartrail.ai',
      followers: 5680,
      isActive: false,
      isVerified: false,
      lastPost: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      engagementRate: 3.5,
      apiConnected: false,
      permissions: []
    }
  ])

  // Social media posts history
  const [socialPosts, setSocialPosts] = useKV<SocialMediaPost[]>('social-posts', [])

  // Hashtag trends
  const [hashtagTrends] = useKV<HashtagTrend[]>('hashtag-trends', [
    { tag: '#Zugverspätung', usage: 156, growth: 12.5, effectiveness: 87 },
    { tag: '#BahnInfo', usage: 89, growth: -3.2, effectiveness: 92 },
    { tag: '#SmartRail', usage: 234, growth: 24.8, effectiveness: 95 },
    { tag: '#ÖPNVUpdate', usage: 67, growth: 8.1, effectiveness: 78 },
    { tag: '#ZugAusfall', usage: 123, growth: 15.3, effectiveness: 84 }
  ])

  // Draft post state
  const [draftPost, setDraftPost] = useState({
    content: '',
    platforms: [] as string[],
    hashtags: [] as string[],
    mentions: [] as string[],
    media: [] as string[],
    scheduledTime: '',
    isUrgent: false
  })

  // Social media statistics
  const [socialStats] = useKV('social-stats', {
    totalFollowers: 33270,
    totalPosts: 1247,
    avgEngagement: 4.1,
    reachLastWeek: 89430,
    clicksLastWeek: 2340,
    growthRate: 5.8
  })

  const platformIcons = {
    twitter: Share,
    facebook: Share,
    instagram: Camera,
    linkedin: Share,
    telegram: Send,
    whatsapp: MessageCircle
  }

  const platformColors = {
    twitter: 'text-blue-400',
    facebook: 'text-blue-600',
    instagram: 'text-pink-500',
    linkedin: 'text-blue-700',
    telegram: 'text-blue-500',
    whatsapp: 'text-green-500'
  }

  const generateAIPost = async (trainInfo: any, urgency: 'normal' | 'urgent' | 'critical' = 'normal') => {
    try {
      toast.info('KI generiert Social Media Content...', { duration: 2000 })
      
      const prompt = spark.llmPrompt`
        Generiere einen professionellen Social Media Post für deutsche Bahnkunden.
        
        Zuginformationen:
        - Zug: ${trainInfo.trainNumber || 'Verschiedene Züge'}
        - Route: ${trainInfo.route || 'Mehrere Strecken'}
        - Verspätung: ${trainInfo.delay || 0} Minuten
        - Ursache: ${trainInfo.cause || 'Betriebsstörung'}
        
        Dringlichkeit: ${urgency}
        
        Der Post soll:
        - Höflich und professionell sein
        - Kurz und prägnant (max. 240 Zeichen)
        - Empathie für betroffene Fahrgäste zeigen
        - Bei Bedarf alternative Lösungen vorschlagen
        - Hashtags inkludieren
        
        Gib nur den fertigen Post-Text zurück, ohne zusätzliche Erklärungen.
      `
      
      const generatedContent = await spark.llm(prompt)
      
      // Extract hashtags from generated content
      const hashtagMatches = generatedContent.match(/#[\w]+/g) || []
      const suggestedHashtags = [...new Set([...hashtagMatches, '#SmartRail', '#BahnInfo'])]
      
      setDraftPost(prev => ({
        ...prev,
        content: generatedContent.replace(/#[\w]+/g, '').trim(),
        hashtags: suggestedHashtags,
        isUrgent: urgency === 'urgent' || urgency === 'critical'
      }))
      
      toast.success('KI-Post generiert', {
        description: 'Post-Inhalt wurde automatisch erstellt'
      })
    } catch (error) {
      toast.error('Fehler bei der KI-Generierung')
    }
  }

  const publishPost = async () => {
    if (!draftPost.content.trim() || draftPost.platforms.length === 0) {
      toast.error('Bitte Content und Plattformen auswählen')
      return
    }

    try {
      const newPost: SocialMediaPost = {
        id: Date.now().toString(),
        platform: draftPost.platforms.join(', '),
        content: draftPost.content,
        hashtags: draftPost.hashtags,
        mentions: draftPost.mentions,
        media: draftPost.media,
        scheduledTime: draftPost.scheduledTime || undefined,
        status: draftPost.scheduledTime ? 'scheduled' : 'published',
        timestamp: new Date().toISOString(),
        metrics: {
          views: Math.floor(Math.random() * 5000) + 500,
          likes: Math.floor(Math.random() * 200) + 20,
          shares: Math.floor(Math.random() * 50) + 5,
          comments: Math.floor(Math.random() * 30) + 3,
          clicks: Math.floor(Math.random() * 100) + 10,
          reach: Math.floor(Math.random() * 8000) + 1000
        }
      }

      setSocialPosts(prev => [newPost, ...prev.slice(0, 49)])
      
      // Reset draft
      setDraftPost({
        content: '',
        platforms: [],
        hashtags: [],
        mentions: [],
        media: [],
        scheduledTime: '',
        isUrgent: false
      })

      toast.success('Post erfolgreich veröffentlicht!', {
        description: `Auf ${draftPost.platforms.length} Plattform(en) publiziert`
      })

    } catch (error) {
      toast.error('Fehler beim Veröffentlichen')
    }
  }

  const addHashtag = (tag: string) => {
    if (!draftPost.hashtags.includes(tag)) {
      setDraftPost(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, tag]
      }))
    }
  }

  const removeHashtag = (tag: string) => {
    setDraftPost(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== tag)
    }))
  }

  const togglePlatform = (platformId: string) => {
    setDraftPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const totalReach = socialAccounts
    .filter(acc => acc.isActive && draftPost.platforms.includes(acc.id))
    .reduce((sum, acc) => sum + acc.followers, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social Media Integration</h2>
          <p className="text-muted-foreground">
            Erweiterte Fahrgastkommunikation über soziale Medien
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Globe size={14} className="mr-1" />
            {socialAccounts.filter(acc => acc.isActive).length} Kanäle aktiv
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'post', label: 'Neuer Post', icon: Send },
          { id: 'accounts', label: 'Konten', icon: Settings },
          { id: 'analytics', label: 'Analytik', icon: TrendUp },
          { id: 'history', label: 'Verlauf', icon: Calendar }
        ].map(view => (
          <Button
            key={view.id}
            variant={activeView === view.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView(view.id)}
            className="flex items-center gap-2"
          >
            <view.icon size={16} />
            <span className="hidden sm:inline">{view.label}</span>
          </Button>
        ))}
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{socialStats.totalFollowers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Gesamte Follower</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Eye size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{socialStats.reachLastWeek.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Reichweite (7 Tage)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{socialStats.avgEngagement}%</p>
                    <p className="text-xs text-muted-foreground">Durchschn. Engagement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendUp size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">+{socialStats.growthRate}%</p>
                    <p className="text-xs text-muted-foreground">Wachstumsrate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Accounts Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share size={20} />
                Aktive Social Media Konten
              </CardTitle>
              <CardDescription>
                Übersicht über verbundene Plattformen und deren Performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialAccounts.filter(acc => acc.isActive).map(account => {
                  const PlatformIcon = platformIcons[account.platform]
                  const platformColor = platformColors[account.platform]
                  
                  return (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100`}>
                          <PlatformIcon size={20} className={platformColor} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{account.name}</p>
                            {account.isVerified && (
                              <CheckCircle size={14} className="text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{account.handle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{account.followers.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{account.engagementRate}% Engagement</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Trending Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash size={20} />
                Trending Hashtags
              </CardTitle>
              <CardDescription>
                Beliebte und effektive Hashtags für Bahnkommunikation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hashtagTrends.map(trend => (
                  <div key={trend.tag} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        {trend.tag}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {trend.usage} Verwendungen
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          trend.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Wachstum</div>
                      </div>
                      <div className="w-20">
                        <Progress value={trend.effectiveness} className="h-2" />
                        <div className="text-xs text-center text-muted-foreground mt-1">
                          {trend.effectiveness}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Emergency Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle size={20} />
                Aktuelle Notfall-Posts
              </CardTitle>
              <CardDescription>
                Kürzlich veröffentlichte wichtige Mitteilungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {socialPosts.filter(post => post.status === 'published').slice(0, 3).map(post => (
                <div key={post.id} className="flex items-start gap-3 p-3 border rounded-lg mb-3 last:mb-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Share size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.hashtags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{new Date(post.timestamp).toLocaleString()}</span>
                      <span>{post.metrics.views} Aufrufe</span>
                      <span>{post.metrics.likes} Likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Post View */}
      {activeView === 'post' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send size={20} />
                Neuen Social Media Post erstellen
              </CardTitle>
              <CardDescription>
                Erstelle intelligente Posts für mehrere Plattformen gleichzeitig
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Quick Generation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => generateAIPost({
                    trainNumber: 'ICE 123',
                    route: 'Hamburg → München',
                    delay: 15,
                    cause: 'Signalstörung'
                  }, 'normal')}
                  className="flex items-center gap-2"
                >
                  <Zap size={16} />
                  Standard-Verspätung
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => generateAIPost({
                    trainNumber: 'Mehrere Züge',
                    route: 'Fernverkehr',
                    delay: 45,
                    cause: 'Unwetter'
                  }, 'urgent')}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle size={16} />
                  Dringende Störung
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => generateAIPost({
                    trainNumber: 'Regionalnetz',
                    route: 'Gesamtnetz',
                    delay: 0,
                    cause: 'Präventivmaßnahme'
                  }, 'normal')}
                  className="flex items-center gap-2"
                >
                  <Info size={16} />
                  Allgemeine Info
                </Button>
              </div>

              <Separator />

              {/* Post Content */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="post-content">Post-Inhalt</Label>
                  <Textarea
                    id="post-content"
                    placeholder="Schreibe deine Nachricht für die Fahrgäste..."
                    value={draftPost.content}
                    onChange={(e) => setDraftPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{draftPost.content.length}/280 Zeichen</span>
                    <span>Empfohlene Länge für alle Plattformen</span>
                  </div>
                </div>

                {/* Platform Selection */}
                <div>
                  <Label>Ziel-Plattformen</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {socialAccounts.filter(acc => acc.isActive).map(account => {
                      const PlatformIcon = platformIcons[account.platform]
                      const platformColor = platformColors[account.platform]
                      
                      return (
                        <Button
                          key={account.id}
                          variant={draftPost.platforms.includes(account.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => togglePlatform(account.id)}
                          className="flex items-center gap-2 h-12"
                        >
                          <PlatformIcon size={16} className={!draftPost.platforms.includes(account.id) ? platformColor : ''} />
                          <div className="text-left">
                            <div className="text-xs font-medium">{account.platform}</div>
                            <div className="text-xs opacity-70">{account.followers.toLocaleString()}</div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                  {totalReach > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Geschätzte Reichweite: <strong>{totalReach.toLocaleString()}</strong> Follower
                    </div>
                  )}
                </div>

                {/* Hashtags */}
                <div>
                  <Label>Hashtags</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {draftPost.hashtags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="cursor-pointer"
                        onClick={() => removeHashtag(tag)}
                      >
                        {tag} <X size={12} className="ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtagTrends.slice(0, 5).map(trend => (
                      <Button
                        key={trend.tag}
                        variant="outline"
                        size="sm"
                        onClick={() => addHashtag(trend.tag)}
                        disabled={draftPost.hashtags.includes(trend.tag)}
                        className="text-xs"
                      >
                        {trend.tag}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schedule-time">Zeitplan (optional)</Label>
                    <Input
                      id="schedule-time"
                      type="datetime-local"
                      value={draftPost.scheduledTime}
                      onChange={(e) => setDraftPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      min={new Date().toISOString().slice(0, 16)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="urgent-post"
                        checked={draftPost.isUrgent}
                        onCheckedChange={(checked) => setDraftPost(prev => ({ ...prev, isUrgent: checked }))}
                      />
                      <Label htmlFor="urgent-post" className="text-sm">
                        Dringender Post (höhere Priorität)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Publishing Actions */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {draftPost.scheduledTime ? 'Post wird geplant für: ' + new Date(draftPost.scheduledTime).toLocaleString() : 'Post wird sofort veröffentlicht'}
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setDraftPost({
                      content: '',
                      platforms: [],
                      hashtags: [],
                      mentions: [],
                      media: [],
                      scheduledTime: '',
                      isUrgent: false
                    })}
                  >
                    Zurücksetzen
                  </Button>
                  <Button 
                    onClick={publishPost}
                    disabled={!draftPost.content.trim() || draftPost.platforms.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Send size={16} />
                    {draftPost.scheduledTime ? 'Planen' : 'Veröffentlichen'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Accounts Management View */}
      {activeView === 'accounts' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Social Media Konten verwalten
              </CardTitle>
              <CardDescription>
                Verbinde und konfiguriere deine Social Media Plattformen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialAccounts.map(account => {
                  const PlatformIcon = platformIcons[account.platform]
                  const platformColor = platformColors[account.platform]
                  
                  return (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100`}>
                          <PlatformIcon size={24} className={platformColor} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{account.name}</h3>
                            {account.isVerified && (
                              <CheckCircle size={16} className="text-blue-500" />
                            )}
                            <Badge 
                              variant={account.apiConnected ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {account.apiConnected ? 'Verbunden' : 'Getrennt'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{account.handle}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{account.followers.toLocaleString()} Follower</span>
                            <span>{account.engagementRate}% Engagement</span>
                            <span>Letzter Post: {new Date(account.lastPost).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={account.isActive}
                          onCheckedChange={(checked) => {
                            setSocialAccounts(prev => 
                              prev.map(acc => 
                                acc.id === account.id ? { ...acc, isActive: checked } : acc
                              )
                            )
                          }}
                        />
                        <Button variant="outline" size="sm">
                          {account.apiConnected ? 'Konfigurieren' : 'Verbinden'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp size={20} />
                Social Media Analytik
              </CardTitle>
              <CardDescription>
                Performance-Analyse deiner Social Media Aktivitäten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Engagement by Platform */}
                <div className="space-y-3">
                  <h4 className="font-medium">Engagement nach Plattform</h4>
                  {socialAccounts.filter(acc => acc.isActive).map(account => (
                    <div key={account.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{account.platform}</span>
                        <span className="font-medium">{account.engagementRate}%</span>
                      </div>
                      <Progress value={account.engagementRate * 10} className="h-2" />
                    </div>
                  ))}
                </div>

                {/* Top Performing Posts */}
                <div className="space-y-3">
                  <h4 className="font-medium">Top Performance</h4>
                  {socialPosts.slice(0, 3).map((post, index) => (
                    <div key={post.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {post.metrics.views} Aufrufe
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Growth Metrics */}
                <div className="space-y-3">
                  <h4 className="font-medium">Wachstums-Metriken</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Follower-Wachstum</span>
                      <span className="text-sm font-medium text-green-600">+{socialStats.growthRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Reichweiten-Zunahme</span>
                      <span className="text-sm font-medium text-blue-600">+12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement-Rate</span>
                      <span className="text-sm font-medium text-purple-600">+2.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History View */}
      {activeView === 'history' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Post-Verlauf
              </CardTitle>
              <CardDescription>
                Übersicht über alle veröffentlichten Social Media Posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {socialPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <Share size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Noch keine Posts veröffentlicht</p>
                    <p className="text-sm text-muted-foreground">
                      Erstelle deinen ersten Social Media Post im "Neuer Post" Tab
                    </p>
                  </div>
                ) : (
                  socialPosts.map(post => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm">{post.content}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.hashtags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge 
                          variant={post.status === 'published' ? 'default' : 
                                  post.status === 'scheduled' ? 'secondary' : 'destructive'}
                          className="ml-3"
                        >
                          {post.status === 'published' ? 'Veröffentlicht' :
                           post.status === 'scheduled' ? 'Geplant' : 'Fehlgeschlagen'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold">{post.metrics.views}</p>
                          <p className="text-xs text-muted-foreground">Aufrufe</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{post.metrics.likes}</p>
                          <p className="text-xs text-muted-foreground">Likes</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{post.metrics.shares}</p>
                          <p className="text-xs text-muted-foreground">Shares</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{post.metrics.comments}</p>
                          <p className="text-xs text-muted-foreground">Kommentare</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{post.metrics.clicks}</p>
                          <p className="text-xs text-muted-foreground">Klicks</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{post.metrics.reach}</p>
                          <p className="text-xs text-muted-foreground">Reichweite</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                        <span>Plattformen: {post.platform}</span>
                        <span>{new Date(post.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}