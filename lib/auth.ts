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

  return { error: null };
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
