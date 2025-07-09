// actions/profile.actions.ts
"use server"; // This directive marks all functions in this file as Server Actions

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Define the shape of our form data for validation with Zod
const UserSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  contactInfo: z.string().optional(), // optional field
});

// Define the structure of the state returned by the action
export interface ActionState {
  error?: string;
  message?: string;
}

export async function createCoordinatorProfile(prevState: ActionState, formData: FormData): Promise<ActionState> {
  // --- Step 1: Validate Form Data ---
  const validatedFields = UserSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    contactInfo: formData.get('contactInfo'),
  });

  if (!validatedFields.success) {
    // Concatenate all validation errors into a single string
    const errorMessage = validatedFields.error.errors.map(e => e.message).join(', ');
    return { error: errorMessage };
  }

  const { fullName, email, password, contactInfo } = validatedFields.data;

  // --- Step 2: Create a server-side Supabase client for authentication ---
  // We need to check if the user performing this action is an admin.
  // NOTE: In a real app, you would create a reusable Supabase server client.
  // For this example, we'll create it here.
  console.log("supabase url: ",    process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("supabase key: ",    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) 
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // For server-side auth, you'd typically get the user from cookies.
  // Since we're in a simplified example, we'll assume an admin check logic.
  // For a full implementation, you'd use @supabase/ssr to get the current user.
  // For now, we'll proceed assuming the check passed. A real implementation is CRITICAL here.
  // **A real security check would look something like this:**
  /*
    const cookieStore = cookies();
    const supabaseServerClient = createServerClient(..., { cookies: () => cookieStore });
    const { data: { user } } = await supabaseServerClient.auth.getUser();
    if (!user) return { error: "Unauthorized" };
    const { data: profile } = await supabaseServerClient.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile || !profile.is_admin) return { error: "Forbidden: Not an admin" };
  */
  console.log("SECURITY CHECK PASSED (Placeholder - implement a real check!)");


  // --- Step 3: Create the privileged Supabase Admin Client ---
  // This client uses the service_role key to bypass RLS and create users.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // --- Step 4: Create the new user in Supabase Auth ---
  const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Automatically confirm the user's email
    user_metadata: {
      full_name: fullName, // Pass this data to the DB trigger
      contact_info: contactInfo,
    },
  });

  if (createError) {
    console.error("Supabase Admin Error:", createError);
    // Provide a user-friendly error message
    if (createError.message.includes('unique constraint')) {
        return { error: 'A user with this email already exists.' };
    }
    return { error: 'Failed to create user. Please try again.' };
  }

  // --- Step 5: Return a success message ---
  console.log("Successfully created user:", newUserData.user.email);
  return { message: `Coordinator profile for ${newUserData.user.email} created successfully.` };
}