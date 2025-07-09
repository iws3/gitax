// components/FloatingAdminAccess.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export function FloatingAdminAccess() {
  
  return (
    <>
      {/* Floating Admin Access Button */}
      <Link
        href="/"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-4 focus:ring-purple-500/30 z-50 group flex items-center justify-center"
        title="Admin Access"
        aria-label="Admin Access"
      >
        <Github className="w-6 h-6 transition-transform group-hover:scale-110" />
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </Link>
    </>
  );
}