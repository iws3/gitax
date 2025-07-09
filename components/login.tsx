// components/Login.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/client'; // Your public client (lib/supabaseClient.ts)

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Attempting to log in with:', { email, password });

    // signInWithPassword returns an object with { data, error }
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      console.error('Supabase login error:', signInError);
      setError(signInError.message);
    } else if (data.user) {
      console.log('Login successful, user:', data.user);
      // On successful login, Supabase client sets a cookie.
      // The middleware will help ensure this cookie is readable by server components.
      // Forcing a full page reload can sometimes help ensure cookies are picked up,
      // but router.push() followed by middleware handling should be sufficient.
      router.push("/coordinator/dashboard");
      // Optionally, to be absolutely sure the server re-evaluates with the new cookie:
      // window.location.href = "/coordinator/dashboard";
      // However, router.push() should work with the SSR setup.
    } else {
      // Should not happen if signInError is null and no user, but good to handle
      setError("Login failed. Please try again.");
      console.error('Login failed: No user data and no error returned.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        disabled={isLoading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}