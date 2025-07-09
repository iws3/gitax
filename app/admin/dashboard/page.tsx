// app/admin/dashboard/page.tsx
import { CreateUserForm } from "@/components/admin/CreateUserForm"; // Adjust path if needed

export default function AdminDashboardPage() {
  // IMPORTANT: You must add server-side logic here to protect this route
  // and ensure only authenticated admins can access it.
  // Example: Redirect non-admins to the home page.

  return (
    <div>
      
      <CreateUserForm />
    </div>
  );
}