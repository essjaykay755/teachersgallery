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
  const supabase = createClientComponentClient();

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

      // Set a timeout to prevent infinite loading - reduce timeout to 8 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Profile fetch timed out")), 8000);
      });

      const fetchPromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // Race between fetch and timeout
      const { data: profileData, error: profileError } = (await Promise.race([
        fetchPromise,
        timeoutPromise.then(() => ({
          data: null,
          error: new Error("Profile fetch timed out"),
        })),
      ])) as any;

      if (profileError) {
        console.error("Profile fetch error:", profileError);

        // Retry only once with a shorter delay
        if (
          retryCount < 1 &&
          (profileError.message === "Profile fetch timed out" ||
            profileError.message === "Timeout" ||
            profileError.message.includes("timeout"))
        ) {
          const delay = 1000; // Fixed 1s delay for retry
          console.log(
            `AuthProvider: Retrying profile fetch in ${delay}ms (attempt ${
              retryCount + 2
            })`
          );

          // Don't set error state during retries to prevent UI flashing
          if (retryCount === 0) {
            // Only set a temporary error message for the first retry
            setError("Connecting to database...");
          }

          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(fetchProfile(userId, retryCount + 1));
            }, delay);
          });
        }

        // If the profile doesn't exist or we hit a timeout, create a temporary one immediately
        console.log(
          "Profile not found or timed out, creating temporary profile"
        );

        // Create a temporary profile to prevent UI blocking
        const tempProfile = createTempProfile(userId, user);
        setProfile(tempProfile);

        // Try to create the real profile in the background
        try {
          const defaultProfile = {
            id: userId,
            full_name:
              user?.user_metadata?.full_name ||
              user?.email?.split("@")[0] ||
              "New User",
            email: user?.email || "unknown@example.com",
            avatar_url: user?.user_metadata?.avatar_url,
            user_type: "student" as const, // Default to student
          };

          // Create profile in background without waiting
          (async () => {
            try {
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
            } catch (err) {
              console.error("Exception creating profile in background:", err);
            }
          })();
        } catch (createErr) {
          console.error("Exception setting up profile creation:", createErr);
          // We already set a temporary profile above, so no need to do it again
        }
      } else {
        console.log("Profile fetched successfully:", profileData);
        setProfile(profileData);
        setError(null);
      }
    } catch (err) {
      console.error("Profile fetch exception:", err);

      // Only retry once with a shorter delay
      if (retryCount < 1) {
        const delay = 1000; // Fixed 1s delay
        console.log(
          `AuthProvider: Retrying profile fetch in ${delay}ms (attempt ${
            retryCount + 2
          })`
        );

        // Don't set error state during retries to prevent UI flashing
        if (retryCount === 0) {
          // Only set a temporary error message for the first retry
          setError("Connecting to database...");
        }

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(fetchProfile(userId, retryCount + 1));
          }, delay);
        });
      }

      // Create a temporary profile to prevent UI blocking
      const tempProfile = createTempProfile(userId, user);
      setProfile(tempProfile);
      setError("Using temporary profile");
      console.log("Using temporary profile due to exception");
    } finally {
      // Always set isLoading to false to prevent UI blocking
      setIsLoading(false);
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
    console.log("AuthProvider: Starting initialization");
    setMounted(true);

    const initializeAuth = async (retryCount = 0) => {
      try {
        // Only show loading state on first attempt to prevent UI flashing
        if (retryCount === 0) {
          setIsLoading(true);
        }

        console.log(
          `AuthProvider: Getting session (attempt ${retryCount + 1})`
        );

        // Set a timeout to prevent infinite loading - reduce timeout to 5 seconds
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Session fetch timed out")), 5000);
        });

        const sessionPromise = supabase.auth.getSession();

        // Race between fetch and timeout
        const { data: { session } = { session: null }, error: sessionError } =
          (await Promise.race([
            sessionPromise,
            timeoutPromise.then(() => ({
              data: { session: null },
              error: new Error("Session fetch timed out"),
            })),
          ])) as any;

        console.log("AuthProvider: Session result:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          error: sessionError,
        });

        if (sessionError) {
          console.error("Session error:", sessionError);

          // Only retry once with a shorter delay
          if (retryCount < 1) {
            const delay = 1000; // Fixed 1s delay
            console.log(
              `AuthProvider: Retrying in ${delay}ms (attempt ${retryCount + 2})`
            );

            // Don't set error state during retries to prevent UI flashing
            if (retryCount === 0) {
              // Only set a temporary error message for the first retry
              setError("Connecting to server...");
            }

            setTimeout(() => {
              initializeAuth(retryCount + 1);
            }, delay);

            return;
          }

          // If we still have an error after retry, just proceed with null user
          setError(sessionError.message);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log("AuthProvider: Setting user and fetching profile");
          setUser(session.user);
          await fetchProfile(session.user.id, 0);
          // fetchProfile will set isLoading to false in its finally block
        } else {
          console.log("AuthProvider: No session found");
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);

        // Only retry once with a shorter delay
        if (retryCount < 1) {
          const delay = 1000; // Fixed 1s delay
          console.log(
            `AuthProvider: Retrying in ${delay}ms (attempt ${retryCount + 2})`
          );

          // Don't set error state during retries to prevent UI flashing
          if (retryCount === 0) {
            // Only set a temporary error message for the first retry
            setError("Connecting to server...");
          }

          setTimeout(() => {
            initializeAuth(retryCount + 1);
          }, delay);

          return;
        }

        // If we still have an error after retry, just proceed with null user
        setError(
          err instanceof Error ? err.message : "Failed to initialize auth"
        );
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    };

    initializeAuth(0);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.id);
      setIsLoading(true);

      try {
        if (session?.user) {
          console.log(
            "AuthProvider: Auth state change - setting user and fetching profile"
          );
          setUser(session.user);
          await fetchProfile(session.user.id, 0);
          // fetchProfile will set isLoading to false in its finally block
        } else {
          console.log(
            "AuthProvider: Auth state change - clearing user and profile"
          );
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        setIsLoading(false);
      }
    });

    return () => {
      console.log("AuthProvider: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [supabase]); // Removed user from dependency array to prevent potential loops

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    console.log("AuthProvider: Not mounted yet");
    return null;
  }

  console.log("AuthProvider: Rendering with state:", {
    hasUser: !!user,
    hasProfile: !!profile,
    isLoading,
    error,
  });

  return (
    <AuthContext.Provider
      value={{ user, profile, isLoading, error, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
