// components/dashboard/RealTimeClock.tsx
"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function RealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timerId = setInterval(() => setTime(new Date()), 1000);
    // Clean up the timer when the component is unmounted
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1">
      <Clock size={16} className="text-green-400" />
      <span className="text-sm font-mono">{time.toLocaleTimeString()}</span>
    </div>
  );
}