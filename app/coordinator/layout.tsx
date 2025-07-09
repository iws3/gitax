// app/coordinator/layout.tsx
import { createClient } from '@/lib/server';
import { redirect } from 'next/navigation';
// Import our new, correct SERVER client


export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // Get the current user session
  const { data: { user } } = await supabase.auth.getUser();
  console.log("user logged in is: ", user)

  // If there is no user, they are not logged in.
  // Kick them back to the login page.
  if (!user) {
    redirect('/login');
  }
  
  // If we want to be extra sure, we can check their role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'Coordinator' && profile?.role !== 'Admin') {
    // This person is logged in, but isn't a coordinator or admin.
    // Kick them out. You could redirect to an "unauthorized" page.
    redirect('/');
  }

  // If they pass all checks, show them the page.
  return <>{children}</>;
}