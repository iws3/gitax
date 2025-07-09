// lib/actions/incident.actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '../server'; // Or your server client path

// Define the shape of our form data for strong validation
const FightSchema = z.object({
  studentNames: z.string().min(3, { message: 'Please enter at least one student name.' }),
  locationDetails: z.string().min(5, { message: 'Location details must be at least 5 characters.' }),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
});

const WeatherAlertSchema = z.object({
  location: z.string().min(1, { message: 'Location is required.' }),
  temperature: z.coerce.number(), // coerce will convert string from form to number
  condition: z.string().min(1, { message: 'Condition is required.' }),
  windSpeed: z.coerce.number(),
  humidity: z.coerce.number(),
  rawData: z.string(), // The stringified JSON from the API
});


export type ActionState = {
  error?: string;
  message?: string;
};

export async function reportFightIncident(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to report an incident.' };
  }

  const validatedFields = FightSchema.safeParse({
    studentNames: formData.get('studentNames'),
    locationDetails: formData.get('locationDetails'),
    severity: formData.get('severity'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(fieldErrors).flat()[0] || 'Invalid data provided.';
    return { error: errorMessage };
  }
  
  const { studentNames, locationDetails, severity } = validatedFields.data;

  const { data: newIncident, error: insertError } = await supabase.from('incidents').insert({
    reported_by: user.id,
    incident_type: 'Fight',
    severity: severity,
    location_details: locationDetails,
    incident_data: { student_names: studentNames.split(',').map(name => name.trim()) },
    status: 'Reported',
  }).select().single(); // Get the newly created row back

  if (insertError) {
    console.error('Database Insert Error (Fight Incident):', insertError);
    return { error: 'Failed to report incident. Please try again.' };
  }

  if (!newIncident) {
    console.warn('New fight incident data not returned after insert, though no DB error reported. Skipping Zapier call.');
    // Proceed with success message as DB operation might have succeeded without returning data (e.g., RLS)
  }

  // --- 🚀 Send to Zapier ---
  if (newIncident && process.env.ZAPIER_INCIDENT_WEBHOOK_URL) {
    try {
      const payload = {
        id: newIncident.id,
        type: newIncident.incident_type,
        severity: newIncident.severity,
        location: newIncident.location_details,
        reported_at: newIncident.created_at,
        reported_by_email: user.email,
        student_names: studentNames, // Send the original comma-separated string or parsed array
        // student_names_array: newIncident.incident_data.student_names, // If you prefer the array
        status: newIncident.status,
      };

      await fetch(process.env.ZAPIER_INCIDENT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('Fight incident data successfully sent to Zapier.');

    } catch (zapierError) {
      console.error("Failed to send fight incident data to Zapier:", zapierError);
      // Log the error, but don't block the user flow.
    }
  } else if (newIncident) { // Only log warning if newIncident exists but URL doesn't
    console.warn("ZAPIER_INCIDENT_WEBHOOK_URL is not set for fight incident. Skipping webhook call.");
  }
  // --- End of Zapier Section ---

  revalidatePath('/coordinator/dashboard');
  return { message: 'Fight incident reported successfully! The administration has been notified.' };
}

export async function confirmWeatherAlert(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to confirm an alert.' };
  }

  const validatedFields = WeatherAlertSchema.safeParse({
    location: formData.get('location'),
    temperature: formData.get('temperature'),
    condition: formData.get('condition'),
    windSpeed: formData.get('windSpeed'),
    humidity: formData.get('humidity'),
    rawData: formData.get('rawData'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(fieldErrors).flat()[0] || 'Invalid weather data received from form.';
    return { error: errorMessage };
  }

  const { location, temperature, condition, windSpeed, humidity, rawData } = validatedFields.data;

  // 1. Insert detailed data into the new 'weather_alerts' table
  const { data: newWeatherAlert, error: weatherError } = await supabase.from('weather_alerts').insert({
    reported_by: user.id,
    location: location,
    temperature_celsius: temperature,
    weather_condition: condition,
    wind_speed_kph: windSpeed,
    humidity_percent: humidity,
    raw_api_data: JSON.parse(rawData), // Parse the string back to JSON for storage
  }).select().single(); // Optionally get the new weather alert back if needed for other logic

  if (weatherError) {
    console.error("Weather Alert Insert Error:", weatherError);
    return { error: 'Failed to save detailed weather data.' };
  }
  if (!newWeatherAlert) {
    console.warn('New weather_alert data not returned after insert, though no DB error reported.');
    // This doesn't stop the incident summary creation, but good to log.
  }

  // 2. Insert a summary into the main 'incidents' table for the unified feed
  const calculatedSeverity = temperature > 35 ? 'Critical' : temperature > 30 ? 'High' : temperature > 25 ? 'Medium' : 'Low';
  const summaryLocationDetails = `Weather Alert for ${location}: ${condition}, ${temperature}°C.`;

  const { data: newSummaryIncident, error: incidentError } = await supabase.from('incidents').insert({
    reported_by: user.id,
    incident_type: 'Weather',
    severity: calculatedSeverity,
    location_details: summaryLocationDetails,
    incident_data: { // Store key weather details also in incident_data for direct access if needed
        original_location: location,
        temperature_celsius: temperature,
        condition: condition,
        wind_speed_kph: windSpeed,
        humidity_percent: humidity,
        // weather_alert_id: newWeatherAlert?.id // Link to the detailed weather alert if newWeatherAlert is fetched
    },
    status: 'Reported',
  }).select().single(); // Get the newly created summary incident back

  if (incidentError) {
    console.error("Incident Insert Error (Weather Summary):", incidentError);
    // Potentially consider rolling back the weather_alerts insert or marking it as unlinked
    return { error: 'Failed to create summary incident for weather alert.' };
  }

  if (!newSummaryIncident) {
    console.warn('New summary incident data for weather alert not returned after insert, though no DB error reported. Skipping Zapier call.');
  }

  // --- 🚀 Send to Zapier ---
  if (newSummaryIncident && process.env.ZAPIER_INCIDENT_WEBHOOK_URL) {
    try {
      const payload = {
        id: newSummaryIncident.id,
        type: newSummaryIncident.incident_type, // 'Weather'
        severity: newSummaryIncident.severity,
        summary_description: newSummaryIncident.location_details,
        reported_at: newSummaryIncident.created_at,
        reported_by_email: user.email,
        status: newSummaryIncident.status,
        weather_details: { // Nesting specific details
            location_name: location,
            temperature_celsius: temperature,
            condition: condition,
            wind_speed_kph: windSpeed,
            humidity_percent: humidity,
            // raw_weather_api_data: JSON.parse(rawData) // Optionally send, can be large
        },
        // detailed_weather_alert_id: newWeatherAlert?.id // If you want to link in Zapier
      };

      await fetch(process.env.ZAPIER_INCIDENT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('Weather alert summary successfully sent to Zapier.');

    } catch (zapierError) {
      console.error("Failed to send weather alert data to Zapier:", zapierError);
      // Log the error, but don't block the user flow.
    }
  } else if (newSummaryIncident) { // Only log warning if newSummaryIncident exists but URL doesn't
    console.warn("ZAPIER_INCIDENT_WEBHOOK_URL is not set for weather alert. Skipping webhook call.");
  }
  // --- End of Zapier Section ---

  revalidatePath('/coordinator/dashboard');
  return { message: 'Weather alert confirmed and reported successfully!' };
}