import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Heart, 
  Calendar,
  Activity,
  Smartphone,
  Wifi,
  WifiOff,
  Edit
} from 'lucide-react';
import garminApi from '../services/garminApi.js';

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [garminConnected, setGarminConnected] = useState(true);

  const userProfile = {
    name: 'Demo User',
    age: 'Adult',
    gender: 'User',
    menopauseStatus: 'Demo Status',
    joinDate: 'Demo Member',
    healthGoals: ['Better Sleep', 'Stress Management', 'Wellness Tracking'],
    allergies: ['Sample dietary restrictions'],
    medications: ['Sample Supplement 1', 'Sample Supplement 2', 'Sample Supplement 3', 'Sample Supplement 4']
  };

  const healthStats = {
    totalDays: 45,
    symptomsLogged: 128,
    mealsTracked: 89,
    supplementsTracked: 156,
    avgHRV: 7.8,
    avgSleep: 84
  };

  const handleGarminToggle = async () => {
    if (garminConnected) {
      garminApi.disconnect();
      setGarminConnected(false);
    } else {
      try {
        await garminApi.connect();
        setGarminConnected(true);
      } catch (error) {
        console.error('Failed to connect to Garmin:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold undo-text-charcoal">Profile</h2>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* User Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 undo-bg-recovery-blue rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold undo-text-charcoal">{userProfile.name}</h3>
              <p className="text-gray-600">{userProfile.age} years old • {userProfile.gender}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="undo-bg-dusty-rose text-black">{userProfile.menopauseStatus}</Badge>
                <span className="text-sm text-gray-500">Member since {userProfile.joinDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 undo-text-detox-green" />
            <span>Health Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold undo-text-charcoal">{healthStats.totalDays}</div>
              <div className="text-sm text-gray-500">Days tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold undo-text-charcoal">{healthStats.symptomsLogged}</div>
              <div className="text-sm text-gray-500">Symptoms logged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold undo-text-charcoal">{healthStats.mealsTracked}</div>
              <div className="text-sm text-gray-500">Meals tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold undo-text-charcoal">{healthStats.supplementsTracked}</div>
              <div className="text-sm text-gray-500">Supplements taken</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold undo-text-recovery-blue">{healthStats.avgHRV}</div>
                <div className="text-xs text-gray-500">Avg HRV</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold undo-text-recovery-blue">{healthStats.avgSleep}</div>
                <div className="text-xs text-gray-500">Avg Sleep Score</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 undo-text-dusty-rose" />
            <span>Health Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userProfile.healthGoals.map((goal, index) => (
              <Badge key={index} variant="outline" className="undo-text-charcoal">
                {goal}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 undo-text-recovery-blue" />
            <span>Medical Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm undo-text-charcoal mb-2">Dietary Restrictions</h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.allergies.map((allergy, index) => (
                <Badge key={index} className="undo-bg-dusty-rose text-black">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm undo-text-charcoal mb-2">Current Supplements</h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.medications.map((med, index) => (
                <Badge key={index} variant="outline" className="undo-text-charcoal">
                  {med}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 undo-text-detox-green" />
            <span>Connected Devices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              {garminConnected ? (
                <Wifi className="w-5 h-5 undo-text-detox-green" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <div>
                <div className="font-medium">Garmin Venu 3</div>
                <div className="text-sm text-gray-500">
                  {garminConnected ? 'Connected • Last sync: 2 min ago' : 'Disconnected'}
                </div>
              </div>
            </div>
            <Switch
              checked={garminConnected}
              onCheckedChange={handleGarminToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 undo-text-charcoal" />
            <span>Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 undo-text-recovery-blue" />
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-500">Get reminders and insights</div>
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 undo-text-dusty-rose" />
              <div>
                <div className="font-medium">Data Sharing</div>
                <div className="text-sm text-gray-500">Share anonymized data for research</div>
              </div>
            </div>
            <Switch
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-sm text-gray-500 space-y-1">
            <div>UNDO Health App v1.0.0</div>
            <div>Built for personalized menopause support</div>
            <div className="flex justify-center space-x-4 mt-3">
              <Button variant="ghost" size="sm" className="text-xs">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Terms of Service
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

