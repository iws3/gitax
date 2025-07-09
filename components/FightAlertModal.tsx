// components/dashboard/FightAlertModal.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { reportFightIncident, type ActionState } from '@/lib/actions/incident.actions'; // Ensure this path is correct
import { X, CheckCircle, XCircle } from 'lucide-react';

// ... (SubmitButton remains the same)
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-medium">
      {pending ? 'Submitting...' : 'Submit Alert'}
    </button>
  );
}


export function FightAlertModal({ onClose }: { onClose: () => void }) {
  const initialState: ActionState = {};
  // Make sure ActionState is imported or defined correctly if it comes from incident.actions
  const [state, formAction] = useActionState(reportFightIncident, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      formRef.current?.reset();
      const timer = setTimeout(() => {
        onClose(); // Call the onClose passed from the parent
      }, 2000); // Close after 2 seconds
      return () => clearTimeout(timer);
    }
    // If there's an error, you might not want to automatically close the modal,
    // so the user can see the error and try again.
  }, [state.message, state.error, onClose]); // Added state.error to dependencies if you want to react to it

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md mx-4 shadow-2xl">
        <form ref={formRef} action={formAction} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Report Fight</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="studentNames" className="block text-sm font-medium text-slate-300 mb-2">Student(s) Involved</label>
              <input
                id="studentNames" // Added id for label association
                name="studentNames"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., John Doe, Jane Smith"
              />
            </div>

            <div>
              <label htmlFor="locationDetails" className="block text-sm font-medium text-slate-300 mb-2">Location Details</label>
              <textarea
                id="locationDetails" // Added id
                name="locationDetails"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-20 resize-none"
                placeholder="Describe the location..."
              />
            </div>
            
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-slate-300 mb-2">Severity Level</label>
              <select
                id="severity" // Added id
                name="severity"
                defaultValue="Medium"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
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