// components/dashboard/DashboardClientContent.tsx
'use client';

import { useState } from 'react';
import { FightAlertModal } from './FightAlertModal';
import { GeneralEmergencyModal } from './GeneralEmergencyModal';
// import { WeatherAlertModal } from './WeatherAlertModal';
import { Shield } from 'lucide-react';
import { WeatherAlertModal } from './WeatherModal';

// Define the types for the props this component will receive
interface Profile {
  full_name?: string | null;
}

interface User {
  email?: string | null;
}

// ✅ NEW: Use the FeedItem type which matches the server component
interface FeedItem {
  id: string;
  created_at: string;
  type: string;
  status: string;
  details: string;
  isEmergency: boolean;
}

interface DashboardClientContentProps {
  user: User | null;
  profile: Profile | null;
  // ✅ UPDATED: The prop is now `initialFeedItems` with the FeedItem type
  initialFeedItems: FeedItem[];
}

export function DashboardClientContent({ user, profile, initialFeedItems }: DashboardClientContentProps) {
  const [isFightModalOpen, setIsFightModalOpen] = useState(false);
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);

  const openFightModal = () => setIsFightModalOpen(true);
  const closeFightModal = () => setIsFightModalOpen(false);

  const openGeneralModal = () => setIsGeneralModalOpen(true);
  const closeGeneralModal = () => setIsGeneralModalOpen(false);
  
  const openWeatherModal = () => setIsWeatherModalOpen(true);
  const closeWeatherModal = () => setIsWeatherModalOpen(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section (No change) */}
        <header className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
           {/* ... header content ... */}
           <h1 className="text-2xl font-bold text-white">Coordinator Dashboard</h1>
           <p className="text-slate-400">Welcome back, {profile?.full_name || user?.email}!</p>
        </header>

        {/* Main Content Area */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Quick Actions (Wiring is updated) */}
          <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={openFightModal} className="w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-md transition-colors">
                Report Fight
              </button>
              <button onClick={openWeatherModal} className="w-full text-left p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-md transition-colors">
                Weather Alert
              </button>
              <button onClick={openGeneralModal} className="w-full text-left p-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-md transition-colors">
                General Emergency
              </button>
            </div>
          </div>

          {/* Column 2: Recent Items Feed (Logic updated) */}
          <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {/* ✅ UPDATED: Map over `initialFeedItems` */}
              {initialFeedItems && initialFeedItems.length > 0 ? (
                initialFeedItems.map((item) => (
                  // ✅ UPDATED: Use a dynamic border color based on the `isEmergency` flag
                  <div 
                    key={item.id} 
                    className={`p-3 bg-slate-800 rounded-md border-l-4 ${
                      item.isEmergency ? 'border-yellow-500' : 'border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      {/* ✅ UPDATED: Use the unified `type` property */}
                      <p className="font-bold">{item.type}</p>
                      <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {/* ✅ UPDATED: Use the unified `details` property */}
                    <p className="text-sm text-slate-300 mt-1">{item.details}</p>
                    <span className="text-xs font-medium mt-2 inline-block bg-slate-700 px-2 py-1 rounded-full">{item.status}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-5">No recent activity to display.</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Conditionally render all modals (No change) */}
      {isFightModalOpen && <FightAlertModal onClose={closeFightModal} />}
      {isGeneralModalOpen && <GeneralEmergencyModal onClose={closeGeneralModal} />}
      {isWeatherModalOpen && <WeatherAlertModal onClose={closeWeatherModal} />}
    </div>
  );
}