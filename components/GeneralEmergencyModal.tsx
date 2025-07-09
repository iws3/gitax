// components/dashboard/GeneralEmergencyModal.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
// Import the NEW server action
// import { reportGeneralEmergency, type ActionState } from '@/lib/actions/incident.actions';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { ActionState } from '@/lib/actions/profile.actions';
import { reportGeneralEmergency } from '@/lib/actions/emergency.action';
// import { reportGeneralEmergency } from '@/lib/actions/incident.actions';

// A separate component for the submit button to use useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium">
      {pending ? 'Submitting...' : 'Submit Alert'}
    </button>
  );
}

export function GeneralEmergencyModal({ onClose }: { onClose: () => void }) {
  const initialState: ActionState = {};
  // Connect the form to our new server action
  const [state, formAction] = useActionState(reportGeneralEmergency, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      formRef.current?.reset();
      const timer = setTimeout(() => {
        onClose(); // Close the modal on success
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.message, onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md mx-4 shadow-2xl">
        <form ref={formRef} action={formAction} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Report General Emergency</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="emergencyType" className="block text-sm font-medium text-slate-300 mb-2">Type of Emergency</label>
              <select
                id="emergencyType"
                name="emergencyType"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {/* These values MUST match your ENUM type in the database */}
                <option value="Fire">Fire</option>
                <option value="Security Threat">Security Threat</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Lockdown">Lockdown</option>
              </select>
            </div>

            <div>
              <label htmlFor="locationDetails" className="block text-sm font-medium text-slate-300 mb-2">Location Details</label>
              <input
                id="locationDetails"
                name="locationDetails"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., 2nd Floor, Science Wing"
              />
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-slate-300 mb-2">Severity Level</label>
              <select
                id="severity"
                name="severity"
                defaultValue="High"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label htmlFor="additionalDetails" className="block text-sm font-medium text-slate-300 mb-2">Additional Details (Optional)</label>
              <textarea
                id="additionalDetails"
                name="additionalDetails"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-20 resize-none"
                placeholder="Provide any other relevant information..."
              />
            </div>
            
            <div className="flex items-center justify-end pt-4 gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                Cancel
              </button>
              <SubmitButton />
            </div>

            {state.message && (
              <p className="text-green-400 flex items-center gap-2 mt-4">
                <CheckCircle size={16}/> {state.message}
              </p>
            )}
            {state.error && (
              <p className="text-red-400 flex items-center gap-2 mt-4">
                <XCircle size={16}/> {state.error}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}