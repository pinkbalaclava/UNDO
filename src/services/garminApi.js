// Mock Garmin API Service
// In a real implementation, this would connect to the actual Garmin Health API

class GarminApiService {
  constructor() {
    this.isConnected = false;
    this.mockData = this.generateMockData();
  }

  // Simulate OAuth connection to Garmin
  async connect() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        resolve({ success: true, message: 'Connected to Garmin successfully' });
      }, 1000);
    });
  }

  // Get current health metrics
  async getCurrentMetrics() {
    if (!this.isConnected) {
      throw new Error('Not connected to Garmin. Please connect first.');
    }

    return {
      hrv: 7.9,
      sleep: {
        score: 82,
        duration: '7h 45m',
        deep: 2.1,
        rem: 1.8,
        light: 3.85
      },
      stress: 35,
      bodyBattery: 68,
      heartRate: {
        current: 56,
        resting: 54,
        max: 185
      },
      steps: 8492,
      vo2Max: 42,
      respirationRate: 16
    };
  }

  // Get historical HRV data for charts
  async getHrvHistory(days = 7) {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        hrv: 7.5 + Math.random() * 1.5, // Random HRV between 7.5-9.0
        readiness: Math.random() > 0.3 ? 'Ready' : 'Needs Recovery'
      });
    }
    
    return data;
  }

  // Get sleep data history
  async getSleepHistory(days = 7) {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        score: 75 + Math.random() * 20, // Sleep score 75-95
        duration: 7 + Math.random() * 2, // 7-9 hours
        deep: 1.5 + Math.random() * 1, // Deep sleep
        rem: 1.2 + Math.random() * 0.8, // REM sleep
        light: 3 + Math.random() * 2 // Light sleep
      });
    }
    
    return data;
  }

  // Get stress data history
  async getStressHistory(days = 7) {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        stress: 20 + Math.random() * 40, // Stress level 20-60
        level: Math.random() > 0.7 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low'
      });
    }
    
    return data;
  }

  // Get activity data
  async getActivityData(days = 7) {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        steps: 6000 + Math.random() * 6000, // 6k-12k steps
        calories: 1800 + Math.random() * 800, // 1800-2600 calories
        activeMinutes: 30 + Math.random() * 90 // 30-120 active minutes
      });
    }
    
    return data;
  }

  // Generate comprehensive mock data
  generateMockData() {
    return {
      user: {
        name: 'Demo User',
        age: 'Adult',
        gender: 'user',
        menopauseStatus: 'demo'
      },
      devices: [
        {
          id: 'garmin_watch_001',
          name: 'Garmin Venu 3',
          type: 'smartwatch',
          lastSync: new Date().toISOString()
        }
      ]
    };
  }

  // Simulate real-time data updates
  subscribeToRealTimeData(callback) {
    const interval = setInterval(() => {
      const updates = {
        heartRate: 50 + Math.random() * 20,
        stress: 20 + Math.random() * 40,
        timestamp: new Date().toISOString()
      };
      callback(updates);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }

  // Disconnect from Garmin
  disconnect() {
    this.isConnected = false;
    return { success: true, message: 'Disconnected from Garmin' };
  }
}

// Export singleton instance
export const garminApi = new GarminApiService();
export default garminApi;

