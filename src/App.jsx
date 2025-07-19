import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { 
  Home, 
  Plus, 
  BarChart3, 
  User, 
  Heart, 
  Moon, 
  Zap, 
  Battery,
  Mic,
  Camera,
  Scan,
  Utensils,
  Pill,
  Wifi,
  WifiOff
} from 'lucide-react'
import undoLogo from './assets/undo_logo.png'
import Insights from './components/Insights.jsx'
import Profile from './components/Profile.jsx'
import garminApi from './services/garminApi.js'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [garminConnected, setGarminConnected] = useState(false)
  const [healthData, setHealthData] = useState({
    hrv: 7.9,
    sleep: 82,
    stress: 35,
    bodyBattery: 68,
    heartRate: 56,
    steps: 8492
  })

  useEffect(() => {
    // Initialize Garmin connection and load data
    initializeGarminConnection()
  }, [])

  const initializeGarminConnection = async () => {
    try {
      await garminApi.connect()
      setGarminConnected(true)
      
      // Load current metrics
      const metrics = await garminApi.getCurrentMetrics()
      setHealthData({
        hrv: metrics.hrv,
        sleep: metrics.sleep.score,
        stress: metrics.stress,
        bodyBattery: metrics.bodyBattery,
        heartRate: metrics.heartRate.current,
        steps: metrics.steps
      })

      // Subscribe to real-time updates
      const unsubscribe = garminApi.subscribeToRealTimeData((updates) => {
        setHealthData(prev => ({
          ...prev,
          heartRate: Math.round(updates.heartRate),
          stress: Math.round(updates.stress)
        }))
      })

      // Cleanup subscription on unmount
      return () => unsubscribe()
    } catch (error) {
      console.error('Failed to connect to Garmin:', error)
      setGarminConnected(false)
    }
  }

  const connectToGarmin = async () => {
    try {
      await garminApi.connect()
      setGarminConnected(true)
      await initializeGarminConnection()
    } catch (error) {
      console.error('Failed to connect to Garmin:', error)
    }
  }

  const HRVCircle = ({ value }) => (
    <div className="relative w-32 h-32 mx-auto hrv-circle">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="var(--undo-recovery-blue)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${(value / 10) * 314} 314`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">HRV</div>
        </div>
      </div>
    </div>
  )

  const Dashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning</h1>
          <p className="text-muted-foreground">Here's your health overview</p>
        </div>
        <div className="flex items-center space-x-2">
          {garminConnected ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Wifi className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive">
              <WifiOff className="w-3 h-3 mr-1" />
              Disconnected
            </Badge>
          )}
          <img src={undoLogo} alt="UNDO" className="w-8 h-8" />
        </div>
      </div>

      {/* Garmin Connection Card */}
      {!garminConnected && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">Connect Your Garmin Device</h3>
                <p className="text-sm text-orange-600">Get real-time health data from your Garmin watch</p>
              </div>
              <Button 
                onClick={connectToGarmin}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* HRV Circle */}
      <Card className="health-card">
        <CardContent className="pt-6">
          <HRVCircle value={healthData.hrv} />
          <div className="text-center mt-4">
            <Badge className="bg-accent text-accent-foreground">Ready</Badge>
            <p className="text-sm text-muted-foreground mt-2">Your recovery looks great today</p>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="health-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Moon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Sleep</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{healthData.sleep}</div>
              <div className="text-xs text-muted-foreground">7h 45m</div>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Heart Rate</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{healthData.heartRate}</div>
              <div className="text-xs text-muted-foreground">Resting</div>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">Stress</span>
            </div>
            <div className="mt-2">
              <Progress value={healthData.stress} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">Low stress</div>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Battery className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Body Battery</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{healthData.bodyBattery}</div>
              <div className="text-xs text-muted-foreground">Good energy</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="outline"
          className="h-12 flex-col space-y-1"
          onClick={() => setActiveTab('symptoms')}
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs">Symptoms</span>
        </Button>
        
        <Button 
          variant="outline"
          className="h-12 flex-col space-y-1"
          onClick={() => setActiveTab('meals')}
        >
          <Utensils className="w-4 h-4" />
          <span className="text-xs">Meals</span>
        </Button>
        
        <Button 
          variant="outline"
          className="h-12 flex-col space-y-1"
          onClick={() => setActiveTab('supplements')}
        >
          <Pill className="w-4 h-4" />
          <span className="text-xs">Supplements</span>
        </Button>
      </div>
    </div>
  )

  const SymptomTracking = () => {
    const [hotFlashes, setHotFlashes] = useState([1])
    const [selectedMood, setSelectedMood] = useState(2)
    const [energyLevel, setEnergyLevel] = useState(2)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Daily Check-in</h2>
          <Badge variant="outline">Apr 24</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hot Flashes with shadcn/ui Slider */}
            <div>
              <label className="text-sm font-medium">Hot Flashes: {hotFlashes[0]}/5</label>
              <div className="mt-3">
                <Slider
                  value={hotFlashes}
                  onValueChange={setHotFlashes}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>None</span>
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>

            {/* Mood with shadcn/ui Buttons */}
            <div>
              <label className="text-sm font-medium">Mood</label>
              <div className="flex justify-between mt-2">
                {['😢', '😕', '😐', '🙂', '😊'].map((emoji, index) => (
                  <Button
                    key={index}
                    variant={selectedMood === index ? "default" : "ghost"}
                    size="lg"
                    className="text-2xl h-12 w-12 p-0"
                    onClick={() => setSelectedMood(index)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            {/* Energy Level with shadcn/ui Buttons */}
            <div>
              <label className="text-sm font-medium">Energy Level</label>
              <div className="flex justify-between mt-2">
                {[1, 2, 3, 4].map((level) => (
                  <Button
                    key={level}
                    variant={energyLevel === level ? "default" : "ghost"}
                    size="lg"
                    className="h-12 w-12 p-0"
                    onClick={() => setEnergyLevel(level)}
                  >
                    <Battery className={`w-6 h-6 ${level <= 2 ? 'text-red-500' : 'text-green-500'}`} />
                  </Button>
                ))}
              </div>
            </div>

            {/* Voice Input */}
            <div className="flex space-x-3">
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Mic className="w-4 h-4 mr-2" />
                Voice Input
              </Button>
              <Button variant="outline" className="flex-1">
                Quick Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'symptoms':
        return <SymptomTracking />
      case 'insights':
        return <Insights />
      case 'profile':
        return <Profile />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="pb-20 px-4 pt-6 max-w-md mx-auto">
        {renderContent()}
      </div>

      {/* Bottom Navigation with shadcn/ui styling */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around py-2 max-w-md mx-auto">
          {[
            { id: 'dashboard', icon: Home, label: 'Home' },
            { id: 'symptoms', icon: Plus, label: 'Track' },
            { id: 'insights', icon: BarChart3, label: 'Insights' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant="ghost"
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center py-2 px-4 h-auto ${
                activeTab === id 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App

