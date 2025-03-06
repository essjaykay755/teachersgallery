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
  isNewUser: boolean;
  needsOnboarding: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  isNewUser: false,
  needsOnboarding: false,
  refreshProfile: async () => {},
});

// Create a single Supabase client instance to be reused
const supabase = createClientComponentClient();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastCheckedUserId, setLastCheckedUserId] = useState<string | null>(null);

  // Function to fetch profile data that returns the profile rather than setting state
  const fetchProfileData = async (userId: string): Promise<{ profile: Profile | null, error: string | null }> => {
    try {
      console.log(`AuthProvider: Fetching profile data for user ${userId}`);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return { profile: null, error: error.message };
      }
      
      if (!data) {
        console.log(`AuthProvider: No profile found for user ${userId}`);
        return { profile: null, error: null };
      }
      
      // Debug raw data
      console.log("AuthProvider: Raw profile data:", JSON.stringify(data));
      console.log("AuthProvider: User type from DB:", data.user_type);
      
      // Clean up avatar_url - ensure it's a valid URL or default avatar
      const avatarUrl = data.avatar_url?.trim();
      
      // Ensure user_type is set
      const userType = data.user_type || "unknown";
      
      const profile = {
        ...data,
        user_type: userType, // Ensure user_type is set explicitly
        avatar_url: avatarUrl && avatarUrl !== "" ? avatarUrl : "/default-avatar.png"
      };
      
      console.log(`AuthProvider: Profile processed for user ${userId}, user_type: ${profile.user_type}, avatar:`, profile.avatar_url);
      return { profile, error: null };
    } catch (err) {
      console.error("Exception fetching profile:", err);
      return { profile: null, error: err instanceof Error ? err.message : "An error occurred" };
    }
  };

  // Function to check if user has a profile and update state accordingly
  const checkUserProfile = async (userId: string) => {
    // Don't check the same user multiple times in quick succession
    if (userId === lastCheckedUserId) {
      console.log(`AuthProvider: Already checked profile for user ${userId} recently`);
      return;
    }
    
    setLastCheckedUserId(userId);
    setIsLoading(true);
    
    const { profile: fetchedProfile, error: fetchError } = await fetchProfileData(userId);
    
    setProfile(fetchedProfile);
    setError(fetchError);
    setIsNewUser(!fetchedProfile);
    setIsLoading(false);
  };

  // Function to manually refresh the profile
  const refreshProfile = async () => {
    if (user) {
      console.log("AuthProvider: Manually refreshing profile");
      
      // Clear the lastCheckedUserId to force a fresh check
      setLastCheckedUserId(null);
      
      // Fetch fresh profile data
      const { profile: freshProfile, error: fetchError } = await fetchProfileData(user.id);
      
      if (fetchError) {
        console.error("Error refreshing profile:", fetchError);
        setError(fetchError);
      } else {
        console.log("AuthProvider: Profile refreshed successfully:", {
          hasProfile: !!freshProfile,
          userType: freshProfile?.user_type
        });
        setProfile(freshProfile);
        setError(null);
      }
    }
  };

  useEffect(() => {
    if (!mounted) {
      console.log("AuthProvider: Not mounted yet");
      return;
    }
    
    console.log("AuthProvider: Starting initialization");

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session error:", error);
          setUser(null);
          setProfile(null);
          setError(error.message);
          setNeedsOnboarding(false);
          setIsLoading(false);
          return;
        }

        const session = data.session;
        
        console.log("AuthProvider: Session result:", {
          hasSession: !!session,
          hasUser: !!session?.user,
        });

        if (session?.user) {
          setUser(session.user);
          setNeedsOnboarding(session.user.user_metadata?.needs_onboarding === true);
          await checkUserProfile(session.user.id);
        } else {
          // No session, clear state
          setUser(null);
          setProfile(null);
          setIsNewUser(false);
          setNeedsOnboarding(false);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth initialization exception:", err);
        setUser(null);
        setProfile(null);
        setIsNewUser(false);
        setNeedsOnboarding(false);
        setError("Authentication failed");
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);

        if (event === "SIGNED_IN" && session?.user) {
          console.log("AuthProvider: Auth state change - signed in");
          setUser(session.user);
          setNeedsOnboarding(session.user.user_metadata?.needs_onboarding === true);
          
          // Directly check for profile existence
          await checkUserProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          console.log("AuthProvider: Auth state change - signed out");
          setUser(null);
          setProfile(null);
          setIsNewUser(false);
          setNeedsOnboarding(false);
          setError(null);
          setIsLoading(false);
        } else if (event === "USER_UPDATED" && session?.user) {
          console.log("AuthProvider: Auth state change - user updated");
          setUser(session.user);
          setNeedsOnboarding(session.user.user_metadata?.needs_onboarding === true);
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
    isNewUser,
    needsOnboarding,
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
        isNewUser,
        needsOnboarding,
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
