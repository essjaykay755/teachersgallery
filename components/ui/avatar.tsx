"use client";

import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

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
    
    // Reset status when src changes to ensure proper loading
    React.useEffect(() => {
      // Reset status when src changes
      if (src) {
        setStatus("loading");
        onLoadingStatusChange?.("loading");
      } else {
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
        setStatus("loaded");
        onLoadingStatusChange?.("loaded");
        return;
      }
    }, [src, onLoadingStatusChange]);

    // Function to transform avatar URLs to ensure default avatar is used properly
    const getAvatarSrc = (inputSrc: string) => {
      // Check if it's empty, null, or undefined
      if (!inputSrc) {
        return "/default-avatar.png";
      }
      
      // Check if it's a placeholder or refers to default avatar
      if (inputSrc === "@default-avatar.png" || 
          inputSrc === "/default-avatar.png" ||
          inputSrc.includes("default-avatar")) {
        return "/default-avatar.png"; // Always use the file from public directory
      }
      
      // Debug the URL
      console.log("Avatar rendering with URL:", inputSrc);
      
      // Return original source for all other cases
      return inputSrc;
    };

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
                setStatus("error");
                onLoadingStatusChange?.("error");
              }
            }}
            {...props}
          />
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
    if (src) {
      console.log("AvatarWithTypeIndicator: src =", src);
    }
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

  // Only use the default avatar if src is explicitly empty or a default avatar path
  const shouldUseDefaultAvatar = !src || src === "" || src === "@default-avatar.png" || src === "/default-avatar.png";
  const avatarSrc = shouldUseDefaultAvatar ? "/default-avatar.png" : src;

  return (
    <div className="relative inline-flex">
      <Avatar size={size} className={className} {...props}>
        {avatarSrc && (
          <AvatarImage
            key={avatarSrc}
            src={avatarSrc}
            alt={alt}
            onLoadingStatusChange={setImageStatus}
            onError={(e) => {
              console.error("Avatar image failed to load:", avatarSrc);
              setImageStatus("error");
              // Only replace with default if this isn't already the default avatar
              if (avatarSrc && !avatarSrc.includes("default-avatar")) {
                console.log("Falling back to default avatar");
              }
            }}
          />
        )}
        {/* Only show fallback when image status is error */}
        {imageStatus === "error" && (
          <AvatarFallback delayMs={1000}>
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