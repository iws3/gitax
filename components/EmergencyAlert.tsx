
"use client"
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Cloud, Users, MapPin, Clock, Shield, Phone, Camera, Mic, Bell, Settings, User, Menu, X, ChevronRight, Zap, Eye, EyeOff } from 'lucide-react';

const EmergencyAlertInterface = () => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({ temp: 24, condition: 'Partly Cloudy', alert: false });
  const [isRecording, setIsRecording] = useState(false);
  const [anonymousMode, setAnonymousMode] = useState(false);

  // Simulated real-time updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const emergencyButtons = [
    {
      id: 'fight',
      label: 'Fight Alert',
      icon: Users,
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      description: 'Report physical altercation',
      urgency: 'high'
    },
    {
      id: 'weather',
      label: 'Weather Alert',
      icon: Cloud,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      description: 'Weather-related emergency',
      urgency: 'medium'
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      hoverColor: 'hover:from-orange-600 hover:to-red-600',
      description: 'Immediate danger/emergency',
      urgency: 'critical'
    }
  ];

  const quickActions = [
    { icon: Camera, label: 'Photo Report', action: () => {} },
    { icon: Mic, label: 'Voice Report', action: () => setIsRecording(!isRecording) },
    { icon: MapPin, label: 'Location Share', action: () => {} },
    { icon: Phone, label: 'Emergency Call', action: () => {} }
  ];

  const recentAlerts = [
    { time: '10:30 AM', type: 'Weather', status: 'resolved', location: 'Block A' },
    { time: '9:15 AM', type: 'Medical', status: 'active', location: 'Cafeteria' },
    { time: '8:45 AM', type: 'Maintenance', status: 'resolved', location: 'Block B' }
  ];

  const handleEmergencyClick = (buttonId) => {
    setActiveAlert(buttonId);
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

//   @ts-ignore

  const AlertModal = ({ alertType, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md mx-4 shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Report {alertType.charAt(0).toUpperCase() + alertType.slice(1)}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option>Block A - Floor 1</option>
                <option>Block A - Floor 2</option>
                <option>Block B - Floor 1</option>
                <option>Cafeteria</option>
                <option>Gymnasium</option>
              </select>
            </div>
            
            {alertType === 'fight' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Number of Students Involved</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option>1-2 students</option>
                    <option>3-4 students</option>
                    <option>5+ students</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Severity Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map((level) => (
                      <button key={level} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        level === 'High' ? 'bg-red-600 hover:bg-red-700 text-white' :
                        level === 'Medium' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                        'bg-green-600 hover:bg-green-700 text-white'
                      }`}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Additional Details</label>
              <textarea 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-20 resize-none"
                placeholder="Describe what you witnessed..."
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <button 
                onClick={() => setAnonymousMode(!anonymousMode)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                {anonymousMode ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="text-sm">Anonymous Report</span>
              </button>
              
              <div className="flex gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">
                  Submit Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2">
                <Shield className="text-blue-400" size={24} />
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SafeGuard
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1">
                <Cloud size={16} className="text-blue-400" />
                <span className="text-sm">{weatherData.temp}°C</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1">
                <Clock size={16} className="text-green-400" />
                <span className="text-sm font-mono">{currentTime.toLocaleTimeString()}</span>
              </div>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4 pb-20">
        {/* Status Banner */}
        <div className="mb-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">System Status: All Clear</span>
            <span className="text-sm text-slate-400 ml-auto">Last updated: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Emergency Buttons Grid */}
        <div className="grid gap-4 mb-8">
          {emergencyButtons.map((button) => {
            const IconComponent = button.icon;
            return (
              <button
                key={button.id}
                onClick={() => handleEmergencyClick(button.id)}
                className={`relative group bg-gradient-to-br ${button.color} ${button.hoverColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border border-white/10 hover:border-white/20`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-white">{button.label}</h3>
                      <p className="text-white/80 text-sm">{button.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-white/60 group-hover:text-white transition-colors" size={20} />
                </div>
                
                {/* Urgency indicator */}
                <div className="absolute top-3 right-3">
                  <div className={`w-2 h-2 rounded-full ${
                    button.urgency === 'critical' ? 'bg-red-300 animate-pulse' :
                    button.urgency === 'high' ? 'bg-yellow-300' : 'bg-green-300'
                  }`}></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl transition-all duration-200 group ${
                    action.label === 'Voice Report' && isRecording ? 'bg-red-500/20 border-red-500/50' : ''
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <IconComponent size={20} className={`group-hover:scale-110 transition-transform ${
                      action.label === 'Voice Report' && isRecording ? 'text-red-400 animate-pulse' : 'text-slate-300'
                    }`} />
                    <span className="text-xs text-slate-400 group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.status === 'active' ? 'bg-red-400 animate-pulse' : 'bg-green-400'
                    }`}></div>
                    <div>
                      <p className="font-medium">{alert.type} Alert</p>
                      <p className="text-sm text-slate-400">{alert.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-slate-300">{alert.time}</p>
                    <p className={`text-xs px-2 py-1 rounded-full ${
                      alert.status === 'active' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {alert.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-700 p-4 z-20">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors">
            <Shield size={20} className="text-blue-400" />
          </button>
          <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors">
            <MapPin size={20} className="text-slate-400" />
          </button>
          <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors">
            <Bell size={20} className="text-slate-400" />
          </button>
          <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors">
            <User size={20} className="text-slate-400" />
          </button>
          <button className="p-3 hover:bg-slate-800 rounded-xl transition-colors">
            <Settings size={20} className="text-slate-400" />
          </button>
        </div>
      </nav>

      {/* Alert Modal */}
      {activeAlert && (
        <AlertModal 
          alertType={activeAlert} 
          onClose={() => setActiveAlert(null)} 
        />
      )}

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-80 bg-slate-900 border-r border-slate-700 p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>
            {/* Sidebar content would go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlertInterface;