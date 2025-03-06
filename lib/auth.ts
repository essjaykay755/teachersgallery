import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Provider } from "@supabase/supabase-js";

export type AuthError = {
  message: string;
  status: number;
};

export async function signInWithGoogle() {
  const supabase = createClientComponentClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google" as Provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: { message: error.message, status: 500 } };
  }

  // Don't return success here as the user will be redirected to the callback URL
  return { error: null };
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClientComponentClient();
  
  // Try to sign in with the provided credentials
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Check if the error is because the email doesn't exist
    if (error.message.includes("Invalid login credentials") || 
        error.message.includes("Email not confirmed") ||
        error.message.includes("Invalid email or password")) {
      
      // Check if the email exists in the profiles table
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('email', email);
      
      // If the email doesn't exist in profiles table, suggest sign up
      if (!countError && count === 0) {
        return { 
          data: null, 
          error: { 
            message: "Email does not exist. Would you like to sign up?", 
            status: 404,
            isNonExistentEmail: true
          } 
        };
      }
    }
    
    return { data: null, error: { message: error.message, status: 500 } };
  }

  return { data, error: null };
}

export async function signOut() {
  const supabase = createClientComponentClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: { message: error.message, status: 500 } };
  }

  return { error: null };
}

export async function getCurrentUser() {
  const supabase = createClientComponentClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      error: error ? { message: error.message, status: 500 } : null,
    };
  }

  return { user, error: null };
}
