// // app/coordinator/dashboard/page.tsx
// import { DashboardClientContent } from '@/components/dashboard/DashboardClientContent'; // Ensure path is correct
import { DashboardClientContent } from '@/components/DashboardClientContent';
import { createClient } from '@/lib/server'; // Use your server client

// Define a common structure for items in our feed
export interface FeedItem {
  id: string; // Using string to accommodate UUIDs or bigints
  created_at: string;
  type: string;
  status: string;
  details: string;
  isEmergency: boolean; // A flag to help the client with styling
}

// This remains an async Server Component
export default async function CoordinatorDashboard() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <p>User not authenticated. Please log in.</p>;
  }

  // --- Fetch Profile (No change) ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();
  
  // --- Fetch Data from BOTH tables concurrently ---
  const [incidentsResult, emergenciesResult] = await Promise.all([
    supabase
      .from('incidents')
      .select('id, created_at, incident_type, status, location_details')
      .order('created_at', { ascending: false })
      .limit(5),
    // ✅ NEW: Fetching from the 'emergencies' table
    supabase
      .from('emergencies')
      .select('id, created_at, emergency_type, status, location_details')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  // --- Process and Combine the data ---
  // Standardize incidents into our common FeedItem structure
  const standardizedIncidents: FeedItem[] = (incidentsResult.data || []).map(item => ({
    id: `incident-${item.id}`,
    created_at: item.created_at,
    type: item.incident_type,
    status: item.status,
    details: item.location_details,
    isEmergency: false, // Mark as not an emergency
  }));

  // ✅ NEW: Standardize emergencies into our common FeedItem structure
  const standardizedEmergencies: FeedItem[] = (emergenciesResult.data || []).map(item => ({
    id: `emergency-${item.id}`,
    created_at: item.created_at,
    type: item.emergency_type,
    status: item.status,
    details: item.location_details,
    isEmergency: true, // Mark as an emergency for styling
  }));

  // Combine both arrays, sort by date, and take the 10 most recent
  const combinedFeed = [...standardizedIncidents, ...standardizedEmergencies];
  
  combinedFeed.sort((a, b) => {
    // Sort in descending order (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  
  // We'll pass the top 10 combined items to the client
  const finalFeed = combinedFeed.slice(0, 10);

  // --- Pass the final, sorted feed to the client component ---
  return (
    <DashboardClientContent
      user={{ email: user.email }}
      profile={profile ? { full_name: profile.full_name } : null}
      // Pass the new combined feed instead of just incidents
      initialFeedItems={finalFeed}
    />
  );
}