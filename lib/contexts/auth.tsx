"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type User } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Profile } from "../supabase";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  refreshProfile: async () => {},
});

// Create a single Supabase client instance to be reused
const supabase = createClientComponentClient();

// Helper function to create a temporary profile
const createTempProfile = (userId: string, user: User | null): Profile => {
  return {
    id: userId,
    full_name:
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "New User",
    email: user?.email || "unknown@example.com",
    avatar_url: user?.user_metadata?.avatar_url,
    user_type: "student",
    created_at: new Date().toISOString(),
  } as Profile;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Function to fetch profile data
  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log(
        `AuthProvider: Fetching profile for user: ${userId} (attempt ${
          retryCount + 1
        })`
      );

      // Only show loading state on first attempt to prevent UI flashing
      if (retryCount === 0) {
        setIsLoading(true);
      }

      // Fetch profile with a reasonable timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single()
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (profileError) {
          throw profileError;
        }

        console.log("Profile fetched successfully:", profileData);
        setProfile(profileData);
        setError(null);
        return;
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        // Check if this was an abort error (timeout)
        const isTimeout = fetchError.name === "AbortError" || 
                          fetchError.message?.includes("timeout") ||
                          fetchError.code === "PGRST504";
        
        // Retry logic for timeouts
        if (isTimeout && retryCount < 1) {
          console.log(`AuthProvider: Retrying profile fetch in 1000ms (attempt ${retryCount + 2})`);
          setError("Connecting to database...");
          
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(fetchProfile(userId, retryCount + 1));
            }, 1000);
          });
        }
        
        // If we've exhausted retries or it's not a timeout, create a temporary profile
        console.log("Profile not found or error, creating temporary profile");
        const tempProfile = createTempProfile(userId, user);
        setProfile(tempProfile);
        
        // Try to create the real profile in the background
        createProfileInBackground(userId);
      }
    } catch (err) {
      console.error("Profile fetch exception:", err);
      
      // Create a temporary profile to prevent UI blocking
      const tempProfile = createTempProfile(userId, user);
      setProfile(tempProfile);
      setError("Using temporary profile");
    } finally {
      // Always set isLoading to false to prevent UI blocking
      setIsLoading(false);
    }
  };

  // Extract profile creation to a separate function
  const createProfileInBackground = async (userId: string) => {
    try {
      const defaultProfile = {
        id: userId,
        full_name:
          user?.user_metadata?.full_name ||
          user?.email?.split("@")[0] ||
          "New User",
        email: user?.email || "unknown@example.com",
        avatar_url: user?.user_metadata?.avatar_url,
        user_type: "student" as const,
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert([defaultProfile])
        .select()
        .single();

      if (error) {
        console.error("Failed to create profile in background:", error);
      } else {
        console.log("Profile created in background:", data);
        // Update the profile if we're still on the same user
        if (user?.id === userId) {
          setProfile(data);
          setError(null);
        }
      }
    } catch (createErr) {
      console.error("Exception creating profile in background:", createErr);
    }
  };

  // Function to manually refresh the profile
  const refreshProfile = async () => {
    if (user) {
      console.log("AuthProvider: Manually refreshing profile");
      setIsLoading(true);
      await fetchProfile(user.id, 0);
    }
  };

  useEffect(() => {
    if (!mounted) {
      console.log("AuthProvider: Not mounted yet");
      return;
    }
    
    console.log("AuthProvider: Starting initialization");

    const initializeAuth = async (retryCount = 0) => {
      try {
        // Only show loading state on first attempt to prevent UI flashing
        if (retryCount === 0) {
          setIsLoading(true);
        }

        console.log(`AuthProvider: Getting session (attempt ${retryCount + 1})`);

        // Use AbortController for timeout instead of Promise.race
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const { data, error } = await supabase.auth.getSession();
          clearTimeout(timeoutId);

          if (error) throw error;

          const session = data.session;
          
          console.log("AuthProvider: Session result:", {
            hasSession: !!session,
            hasUser: !!session?.user,
          });

          if (session?.user) {
            setUser(session.user);
            console.log("AuthProvider: Auth state change - setting user and fetching profile");
            await fetchProfile(session.user.id);
          } else {
            // No session, clear user and profile
            setUser(null);
            setProfile(null);
            setError(null);
          }
          
          setIsLoading(false);
        } catch (sessionError: any) {
          clearTimeout(timeoutId);
          
          console.error("Auth initialization error:", sessionError);
          
          // Check if this was an abort error (timeout)
          const isTimeout = sessionError.name === "AbortError" || 
                            sessionError.message?.includes("timeout");
          
          // Retry logic for timeouts
          if (isTimeout && retryCount < 2) {
            console.log(`AuthProvider: Retrying in 1000ms (attempt ${retryCount + 2})`);
            setError("Connecting to server...");
            
            setTimeout(() => {
              initializeAuth(retryCount + 1);
            }, 1000);
            return;
          }
          
          // If we've exhausted retries or it's not a timeout
          setUser(null);
          setProfile(null);
          setError(sessionError.message || "Authentication failed");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth initialization exception:", err);
        setUser(null);
        setProfile(null);
        setError("Authentication failed");
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);

        if (event === "SIGNED_IN" && session?.user) {
          console.log("AuthProvider: Auth state change - setting user and fetching profile");
          setUser(session.user);
          fetchProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          console.log("AuthProvider: Auth state change - signed out");
          setUser(null);
          setProfile(null);
          setError(null);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    // Cleanup
    return () => {
      console.log("AuthProvider: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [mounted]);

  // Set mounted state after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  console.log("AuthProvider: Rendering with state:", {
    hasUser: !!user,
    hasProfile: !!profile,
    isLoading,
    error,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        error,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
