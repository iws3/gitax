// components/admin/CreateUserForm.tsx (or wherever you have it)
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCoordinatorProfile, type ActionState } from '@/lib/actions/profile.actions'; // Make sure this path is correct
import { Shield, User, Mail, Lock, Phone, AlertTriangle, UserPlus, CheckCircle, XCircle, Clock, Eye, EyeOff, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Submit button component using useFormStatus (This component is perfect as is)
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-2xl disabled:shadow-md border border-white/20 hover:border-white/30"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative flex items-center gap-3">
        {pending ? (
          <>
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-lg">Creating Coordinator...</span>
          </>
        ) : (
          <>
            <UserPlus className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-lg">Create Emergency Coordinator</span>
          </>
        )}
      </div>
    </button>
  );
}

export function CreateUserForm() {
  const initialState: ActionState = {};
  const [state, formAction] = useActionState(createCoordinatorProfile, initialState);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  
  // CORRECTED: We need a ref to the form to reset it after successful submission.
  const formRef = useRef<HTMLFormElement>(null);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // CORRECTED: Effect to reset the form when the server action is successful.
  useEffect(() => {
    if (state.message) {
      formRef.current?.reset();
    }
  }, [state.message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* ... (Your beautiful background and header elements are perfect, no changes needed here) ... */}
      <header className="relative z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
         {/* ... Header content ... */}
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-lg">
          {/* ... (Status Banner is perfect) ... */}
          <div className="mb-6 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 border border-blue-500/30 rounded-2xl p-4 backdrop-blur-sm">
            {/* ... Status Banner content ... */}
          </div>

          {/* CORRECTED: The <form> tag is added here, wrapping all the inputs. */}
          <form ref={formRef} action={formAction}>
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* ... (Card glow and form header are perfect) ... */}
              
              <div className="space-y-6 relative z-10">
                {/* Full Name Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-3">
                    <User className="w-5 h-5 text-blue-400" />
                    Full Name<span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    {/* CORRECTED: Removed value and onChange props to make it an uncontrolled component */}
                    <input
                      name="fullName"
                      required
                      placeholder="Enter coordinator's full name"
                      className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-slate-700/50 hover:border-slate-600/50"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    Email Address<span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="coordinator@emergency.gov"
                      className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-slate-700/50 hover:border-slate-600/50"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-3">
                    <Lock className="w-5 h-5 text-blue-400" />
                    Temporary Password<span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter secure temporary password"
                      className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4 pr-14 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-slate-700/50 hover:border-slate-600/50"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <Zap className="w-4 h-4 text-yellow-400" /><p className="text-xs text-yellow-300">Coordinator must change password on first login</p>
                  </div>
                </div>

                {/* Contact Info Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-semibold mb-3">
                    <Phone className="w-5 h-5 text-blue-400" />
                    Contact Information<span className="text-slate-400 text-sm ml-2">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <input
                      name="contactInfo"
                      placeholder="Phone number or additional contact details"
                      className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-slate-700/50 hover:border-slate-600/50"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <SubmitButton />
                </div>

                {/* Status Messages */}
                {state.message && (
                  <div className="flex items-center gap-3 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl px-6 py-4 text-green-300 animate-in slide-in-from-bottom-4 duration-300">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="font-medium">{state.message}</span>
                  </div>
                )}
                {state.error && (
                  <div className="flex items-center gap-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl px-6 py-4 text-red-300 animate-in slide-in-from-bottom-4 duration-300">
                    <XCircle className="w-6 h-6 text-red-400" />
                    <span className="font-medium">{state.error}</span>
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* ... (Security Notice and Quick Stats are perfect) ... */}
        </div>
      </main>
    </div>
  );
}