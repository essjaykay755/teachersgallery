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
      "loading"
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
    
    // Reset status when src changes
    React.useEffect(() => {
      if (!src) {
        setStatus("error");
        onLoadingStatusChange?.("error");
        return;
      }

      // If src is a default avatar or data URL, set to loaded immediately
      if (
        src === "@default-avatar.png" || 
        src === "/default-avatar.png" ||
        src.startsWith("data:image/")
      ) {
        setStatus("loaded");
        onLoadingStatusChange?.("loaded");
        return;
      }

      // Only show loading state for actual URLs that need to be fetched
      setStatus("loading");
      onLoadingStatusChange?.("loading");
      setRetryCount(0);
      
      // Reset debug info
      setDebugInfo({
        originalSrc: src,
        processedSrc: null,
        loadAttempts: 0,
        errors: [],
      });
    }, [src, onLoadingStatusChange]);

    // Function to transform avatar URLs to ensure default avatar is used properly
    const getAvatarSrc = (inputSrc: string) => {
      try {
        // Use our utility function to fix common URL issues
        const fixedUrl = fixAvatarUrl(inputSrc);
        logAvatarUrl(inputSrc, "AvatarImage.getAvatarSrc");
        return fixedUrl;
      } catch (error) {
        console.error("Error processing avatar URL:", error);
        return "/default-avatar.png";
      }
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
              "h-full w-full object-cover z-0 relative",
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
              
              // Only use default avatar if the URL is completely invalid
              // and is not already the default avatar
              if (src && !src.includes("default-avatar")) {
                const target = e.target as HTMLImageElement;
                if (!target.dataset.fallbackAttempted) {
                  target.dataset.fallbackAttempted = "true";
                  target.src = "/default-avatar.png";
                  return;
                }
              }
              
              setStatus("error");
              onLoadingStatusChange?.("error");
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
  ({ className, children, delayMs = 0, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(delayMs === 0);

    React.useEffect(() => {
      if (delayMs === 0) {
        setIsVisible(true);
        return;
      }
      
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
  const [imageStatus, setImageStatus] = React.useState<"loading" | "loaded" | "error">("loading");
  const [processedSrc, setProcessedSrc] = React.useState<string | undefined>(undefined);
  
  // Preload the image when the component mounts or src changes
  React.useEffect(() => {
    if (!src) {
      setImageStatus("error");
      return;
    }
    
    // Process the source URL
    const fixedSrc = processAvatarSrc(src);
    setProcessedSrc(fixedSrc);
    
    // Preload the image
    const img = new Image();
    img.onload = () => {
      setImageStatus("loaded");
    };
    img.onerror = () => {
      console.error("Failed to preload avatar:", fixedSrc);
      // Try with default avatar if not already using it
      if (!fixedSrc?.includes("default-avatar")) {
        setProcessedSrc("/default-avatar.png");
      } else {
        setImageStatus("error");
      }
    };
    img.src = fixedSrc || "/default-avatar.png";
    
    // Log for debugging
    logAvatarUrl(src, "AvatarWithTypeIndicator.preload");
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Process user type in useEffect to ensure it only runs client-side
  const [effectiveUserType, setEffectiveUserType] = React.useState<string | undefined>(userType);
  React.useEffect(() => {
    // Special case: For specific avatar URLs, override the user type
    if (src && src.includes("subhoj33t") && userType === "unknown") {
      setEffectiveUserType("teacher");
    } else {
      setEffectiveUserType(userType);
    }
  }, [src, userType]);

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
    if (!inputSrc) return undefined;
    
    try {
      // Always use fixAvatarUrl utility for consistency
      const fixedUrl = fixAvatarUrl(inputSrc);
      
      // Add a cache buster if not already present
      if (!fixedUrl.includes('_cb=') && !fixedUrl.includes('default-avatar')) {
        const separator = fixedUrl.includes('?') ? '&' : '?';
        return `${fixedUrl}${separator}_cb=${Date.now()}`;
      }
      
      return fixedUrl;
    } catch (error) {
      console.error("Error processing avatar URL:", error);
      return "/default-avatar.png";
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar size={size} {...props}>
        {processedSrc ? (
          <AvatarImage 
            src={processedSrc} 
            alt={alt}
            onLoadingStatusChange={setImageStatus}
          />
        ) : null}
        {(imageStatus === "error" || !processedSrc) && (
          <AvatarFallback>
            {fallback || <User className="h-1/2 w-1/2" />}
          </AvatarFallback>
        )}
      </Avatar>
      
      {userType && (
        <div
          className={cn(
            "absolute top-0 left-0 rounded-full flex items-center justify-center text-[7px] font-medium text-white border-2 border-white",
            getTypeColor(userType),
            size === "sm" ? "h-3 w-3" : 
            size === "md" ? "h-4 w-4" : 
            size === "lg" ? "h-5 w-5" : "h-6 w-6"
          )}
        >
          {getTypeIndicator(userType)}
        </div>
      )}
    </div>
  );
} 