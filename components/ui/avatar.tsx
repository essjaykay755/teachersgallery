"use client";

import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { fixAvatarUrl, logAvatarUrl } from "@/lib/avatar-debugger";

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

// Root Avatar component
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          sizeMap[size],
          "relative flex shrink-0 overflow-hidden rounded-full aspect-square",
          className
        )}
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";

// Avatar Image component
interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt = "", onLoadingStatusChange, ...props }, ref) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
      src ? "loading" : "error"
    );
    
    // Track retries to prevent infinite retry loops
    const [retryCount, setRetryCount] = React.useState(0);
    const MAX_RETRIES = 2;
    
    // Debug mode state
    const [debugInfo, setDebugInfo] = React.useState<{
      originalSrc: string | null;
      processedSrc: string | null;
      loadAttempts: number;
      errors: string[];
    }>({
      originalSrc: src || null,
      processedSrc: null,
      loadAttempts: 0,
      errors: [],
    });
    
    // Reset status when src changes to ensure proper loading
    React.useEffect(() => {
      // Reset status when src changes
      if (src) {
        console.log("AvatarImage: src changed to", src, "setting status to loading");
        setStatus("loading");
        onLoadingStatusChange?.("loading");
        
        // Reset retry count when src changes
        setRetryCount(0);
        
        // Reset debug info
        setDebugInfo({
          originalSrc: src,
          processedSrc: null,
          loadAttempts: 0,
          errors: [],
        });
      } else {
        console.log("AvatarImage: src is empty, setting status to error");
        setStatus("error");
        onLoadingStatusChange?.("error");
      }
    }, [src, onLoadingStatusChange]);

    React.useEffect(() => {
      if (!src) {
        setStatus("error");
        onLoadingStatusChange?.("error");
        return;
      }

      // If src is a default avatar, set to loaded immediately
      if (src === "@default-avatar.png" || src === "/default-avatar.png") {
        console.log("AvatarImage: default avatar detected, setting status to loaded immediately");
        setStatus("loaded");
        onLoadingStatusChange?.("loaded");
        return;
      }
      
      // Process the source URL and update debug info
      try {
        const fixedUrl = fixAvatarUrl(src);
        
        // Update debug info in an effect, not during render
        setDebugInfo(prev => ({
          ...prev,
          processedSrc: fixedUrl,
          loadAttempts: prev.loadAttempts + 1,
        }));
        
        // Log the URL for debugging
        logAvatarUrl(src, "AvatarImage.useEffect");
      } catch (error) {
        console.error("Error processing avatar URL:", error);
        
        // Update debug info with error
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors, error instanceof Error ? error.message : String(error)],
        }));
      }
    }, [src, onLoadingStatusChange]);

    // Function to transform avatar URLs to ensure default avatar is used properly
    const getAvatarSrc = (inputSrc: string) => {
      try {
        // Use our utility function to fix common URL issues but don't update state here
        const fixedUrl = fixAvatarUrl(inputSrc);
        
        // Log the URL for debugging but don't update state
        logAvatarUrl(inputSrc, "AvatarImage.getAvatarSrc");
        
        return fixedUrl;
      } catch (error) {
        console.error("Error processing avatar URL:", error);
        
        // Return default avatar on error but don't update state here
        return "/default-avatar.png";
      }
    };

    // Handle retry logic
    const handleRetry = React.useCallback(() => {
      if (retryCount < MAX_RETRIES && src) {
        console.log(`AvatarImage: Retrying image load (${retryCount + 1}/${MAX_RETRIES})`);
        
        // Increment retry count
        setRetryCount(prev => prev + 1);
        
        // Force a reload by resetting status
        setStatus("loading");
        onLoadingStatusChange?.("loading");
        
        // Update debug info but via a separate state update
        setDebugInfo(prev => ({
          ...prev,
          loadAttempts: prev.loadAttempts + 1,
        }));
      } else {
        console.log("AvatarImage: Max retries reached, showing default avatar");
        setStatus("error");
        onLoadingStatusChange?.("error");
      }
    }, [retryCount, src, onLoadingStatusChange, MAX_RETRIES]);

    return (
      <>
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-1/2 w-1/2 rounded-full animate-pulse bg-muted-foreground/50" />
          </div>
        )}
        {src && (
          <img
            ref={ref}
            src={getAvatarSrc(src)}
            alt={alt}
            className={cn(
              "h-full w-full object-cover z-10 relative",
              status === "loading" && "opacity-0",
              className
            )}
            onLoad={() => {
              console.log("Avatar loaded successfully:", src);
              setStatus("loaded");
              onLoadingStatusChange?.("loaded");
            }}
            onError={(e) => {
              console.error("Avatar image failed to load:", src);
              
              // Update debug info with error but in a separate callback to avoid render-phase updates
              setTimeout(() => {
                setDebugInfo(prev => ({
                  ...prev,
                  errors: [...prev.errors, `Failed to load image: ${src}`],
                }));
              }, 0);
              
              // Only use default avatar if the URL is completely invalid or fails to load
              // and is not already the default avatar
              if (src && !src.includes("default-avatar")) {
                console.log("Replacing with default avatar");
                
                // Track whether we're already falling back to prevent infinite loops
                const target = e.target as HTMLImageElement;
                if (!target.dataset.fallbackAttempted) {
                  target.dataset.fallbackAttempted = "true";
                  target.src = "/default-avatar.png";
                } else {
                  console.error("Default avatar also failed to load, showing fallback");
                  setStatus("error");
                  onLoadingStatusChange?.("error");
                }
              } else {
                // If this is the default avatar or we've already tried a fallback, show fallback component
                // But first try a retry if we haven't reached the limit
                if (retryCount < MAX_RETRIES) {
                  // Delay retry to avoid immediate failures
                  setTimeout(handleRetry, 500 * (retryCount + 1));
                } else {
                  setStatus("error");
                  onLoadingStatusChange?.("error");
                }
              }
            }}
            {...props}
          />
        )}
        
        {/* Add debug overlay in development - not visible in production */}
        {process.env.NODE_ENV === "development" && status === "error" && debugInfo.errors.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 z-20">
            <div>Debug: {debugInfo.errors.length} errors</div>
          </div>
        )}
      </>
    );
  }
);
AvatarImage.displayName = "AvatarImage";

// Avatar Fallback component
interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, delayMs = 600, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, delayMs);

      return () => clearTimeout(timeout);
    }, [delayMs]);

    if (!isVisible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center bg-muted z-0",
          className
        )}
        {...props}
      >
        {children || <User className="h-1/2 w-1/2 text-muted-foreground" />}
      </div>
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

// Legacy Avatar component for backward compatibility
export function LegacyAvatar({
  src,
  alt = "Avatar",
  size = "md",
  className,
}: {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // Update image source when src prop changes
  React.useEffect(() => {
    if (src === "@default-avatar.png") {
      // Use direct path for default avatar
      setImgSrc("/default-avatar.png");
    } else if (src) {
      setImgSrc(src);
    } else {
      setImgSrc(null);
    }
    
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // Show fallback if no source or error
  if (!imgSrc || hasError) {
    return (
      <div
        className={cn(
          sizeMap[size],
          "rounded-full bg-gray-100 flex items-center justify-center",
          className
        )}
      >
        <User className="w-1/2 h-1/2 text-gray-400" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeMap[size],
        "rounded-full overflow-hidden relative",
        className
      )}
    >
      {isLoading && (
        <div className="h-full w-full bg-gray-100 flex items-center justify-center absolute inset-0 z-0">
          <div className="w-1/2 h-1/2 rounded-full animate-pulse bg-gray-200" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          "h-full w-full object-cover relative z-10",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => {
          console.log("LegacyAvatar: Image loaded successfully:", imgSrc);
          setIsLoading(false);
        }}
        onError={(e) => {
          console.error("LegacyAvatar: Image failed to load:", imgSrc);
          setHasError(true);
        }}
      />
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };

// Add a new component for avatar with type indicator
interface AvatarWithTypeIndicatorProps extends AvatarProps {
  userType?: 'teacher' | 'student' | 'parent' | string;
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

export function AvatarWithTypeIndicator({
  userType,
  size = "md",
  src,
  alt = "User avatar",
  fallback,
  className,
  ...props
}: AvatarWithTypeIndicatorProps) {
  // Keep track of loading state
  const [imageStatus, setImageStatus] = React.useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error"
  );
  const [effectiveUserType, setEffectiveUserType] = React.useState<string | undefined>(userType);
  
  // Process user type in useEffect to ensure it only runs client-side
  React.useEffect(() => {
    // Special case: For specific avatar URLs, override the user type
    if (src && src.includes("subhoj33t") && userType === "unknown") {
      setEffectiveUserType("teacher");
    } else {
      setEffectiveUserType(userType);
    }
  }, [src, userType]);

  // For debugging
  React.useEffect(() => {
    console.log("AvatarWithTypeIndicator: rendering with src =", src);
  }, [src]);

  // Map user type to display letter
  const getTypeIndicator = (type?: string): string => {
    if (!type) return 'U';
    
    switch (type.toLowerCase()) {
      case 'teacher': return 'T';
      case 'student': return 'S';
      case 'parent': return 'P';
      case 'admin': return 'A';
      default: return 'U'; // Unknown
    }
  };

  // Get background color based on user type
  const getTypeColor = (type?: string): string => {
    if (!type) return 'bg-gray-400';
    
    switch (type.toLowerCase()) {
      case 'teacher': return 'bg-blue-500';
      case 'student': return 'bg-green-500';
      case 'parent': return 'bg-purple-500';
      case 'admin': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Process the avatar source
  const processAvatarSrc = (inputSrc?: string): string | undefined => {
    if (!inputSrc) {
      logAvatarUrl(inputSrc, "AvatarWithTypeIndicator.processAvatarSrc (empty)");
      return "/default-avatar.png";
    }
    
    const fixedUrl = fixAvatarUrl(inputSrc);
    logAvatarUrl(inputSrc, "AvatarWithTypeIndicator.processAvatarSrc");
    
    return fixedUrl;
  };

  const avatarSrc = processAvatarSrc(src);
  
  return (
    <div className="relative inline-flex">
      <Avatar size={size} className={className} {...props}>
        {avatarSrc && (
          <AvatarImage
            src={avatarSrc}
            alt={alt}
            onLoadingStatusChange={(status) => {
              console.log(`Avatar image status changed to ${status} for src: ${avatarSrc}`);
              setImageStatus(status);
            }}
            onError={(e) => {
              console.error("Avatar image failed to load:", avatarSrc);
              setImageStatus("error");
            }}
          />
        )}
        {/* Show fallback when image status is error */}
        {imageStatus === "error" && (
          <AvatarFallback delayMs={100}>
            {fallback || <User className="h-1/2 w-1/2" />}
          </AvatarFallback>
        )}
      </Avatar>

      {/* Type indicator badge */}
      {effectiveUserType && (
        <div 
          className={`absolute -top-1 -left-1 rounded-full flex items-center justify-center text-white font-medium border-2 border-white z-20 pointer-events-none
            ${getTypeColor(effectiveUserType)}
            ${size === 'sm' ? 'w-4 h-4 text-[8px]' : 
              size === 'md' ? 'w-5 h-5 text-[10px]' : 
              size === 'lg' ? 'w-6 h-6 text-xs' : 
              'w-7 h-7 text-sm'}`}
          aria-label={`User type: ${effectiveUserType}`}
        >
          {getTypeIndicator(effectiveUserType)}
        </div>
      )}
    </div>
  );
} 