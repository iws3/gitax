// lib/actions/emergency.actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '../server'; // Adjust to your server client path

// This is the same type definition, you can share it or redefine it
export type ActionState = { 
  error?: string;
  message?: string;
};

// Define the shape for the General Emergency form
const GeneralEmergencySchema = z.object({
  emergencyType: z.enum(['Fire', 'Security Threat', 'Medical Emergency', 'Lockdown']),
  locationDetails: z.string().min(5, { message: 'Location details must be at least 5 characters.' }),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
});

export async function reportGeneralEmergency(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to report an emergency.' };
  }

  const validatedFields = GeneralEmergencySchema.safeParse({
    emergencyType: formData.get('emergencyType'),
    locationDetails: formData.get('locationDetails'),
    severity: formData.get('severity'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(fieldErrors).flat()[0] || 'Invalid data provided.';
    return { error: errorMessage };
  }

  const { emergencyType, locationDetails, severity } = validatedFields.data;

  const { data: newEmergency, error: insertError } = await supabase.from('emergencies').insert({
    reported_by: user.id,
    emergency_type: emergencyType,
    severity: severity,
    location_details: locationDetails,
    status: 'Active', // Default status for a new emergency
  }).select().single(); // Get the newly created row back

  if (insertError) {
    console.error('Emergency Insert Error:', insertError);
    return { error: 'Failed to report emergency. Please try again.' };
  }

  if (!newEmergency) {
    console.warn('New emergency data not returned after insert, though no DB error reported. Skipping Zapier call.');
    // Proceed with success message as DB operation might have succeeded without returning data (e.g., RLS)
  }

  // --- 🚀 Send to Zapier ---
  if (newEmergency && process.env.ZAPIER_EMERGENCY_WEBHOOK_URL) {
    try {
      const payload = {
        id: newEmergency.id,
        type: newEmergency.emergency_type,
        severity: newEmergency.severity,
        location: newEmergency.location_details,
        reported_at: newEmergency.created_at,
        reported_by_email: user.email,
        status: newEmergency.status,
      };

      await fetch(process.env.ZAPIER_EMERGENCY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('Emergency data successfully sent to Zapier.');

    } catch (zapierError) {
      console.error("Failed to send emergency data to Zapier:", zapierError);
      // Log the error, but don't block the user flow.
    }
  } else if (newEmergency) { // Only log warning if newEmergency exists but URL doesn't
    console.warn("ZAPIER_EMERGENCY_WEBHOOK_URL is not set. Skipping webhook call.");
  }
  // --- End of Zapier Section ---

  revalidatePath('/coordinator/dashboard'); // Or any other relevant path
  // Consider revalidating paths where emergencies are displayed
  // e.g., revalidatePath('/emergencies');
  // revalidatePath('/alerts');

  return { message: `${emergencyType} emergency reported successfully! Key personnel have been notified.` };
}