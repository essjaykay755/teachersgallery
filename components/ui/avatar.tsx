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

      setStatus("loading");
      onLoadingStatusChange?.("loading");
    }, [src, onLoadingStatusChange]);

    // Function to transform avatar URLs to ensure default avatar is used properly
    const getAvatarSrc = (inputSrc: string) => {
      // Check if it's a placeholder or refers to default avatar
      if (inputSrc === "@default-avatar.png" || 
          inputSrc === "/default-avatar.png" ||
          inputSrc.includes("default-avatar")) {
        return "/default-avatar.png"; // Always use the file from public directory
      }
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
              "h-full w-full object-cover",
              status === "loading" && "opacity-0",
              className
            )}
            onLoad={() => {
              setStatus("loaded");
              onLoadingStatusChange?.("loaded");
            }}
            onError={(e) => {
              console.log("Avatar image failed to load:", src);
              // If the image fails to load and it's not the default avatar, try loading the default avatar
              if (!src.includes("default-avatar")) {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              } else {
                // If even the default avatar fails, show fallback
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
          "absolute inset-0 flex h-full w-full items-center justify-center bg-muted",
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
        "rounded-full overflow-hidden",
        className
      )}
    >
      {isLoading && (
        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full animate-pulse bg-gray-200" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          "h-full w-full object-cover",
          isLoading ? "hidden" : "block"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          console.log("Avatar image failed to load:", imgSrc);
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
  // Debug user type
  React.useEffect(() => {
    console.log("Avatar rendering with userType:", userType);
  }, [userType]);

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

  // Override for specific cases - use a more specific indicator
  let displayUserType = userType;
  
  // Special case: For specific avatar URLs, override the user type
  if (src && src.includes("subhoj33t") && userType === "unknown") {
    console.log("Avatar: Detected subhoj33t user with unknown type, overriding to teacher");
    displayUserType = "teacher";
  }

  return (
    <div className="relative inline-flex">
      <Avatar size={size} className={className} {...props}>
        {src && (
          <AvatarImage
            src={src}
            alt={alt}
            onError={(e) => {
              console.error("Avatar image failed to load");
            }}
          />
        )}
        <AvatarFallback>
          {fallback || <User className="h-1/2 w-1/2" />}
        </AvatarFallback>
      </Avatar>

      {/* Type indicator badge */}
      {displayUserType && (
        <div 
          className={`absolute -top-1 -left-1 rounded-full flex items-center justify-center text-white font-medium border-2 border-white z-10 pointer-events-none
            ${getTypeColor(displayUserType)}
            ${size === 'sm' ? 'w-4 h-4 text-[8px]' : 
              size === 'md' ? 'w-5 h-5 text-[10px]' : 
              size === 'lg' ? 'w-6 h-6 text-xs' : 
              'w-7 h-7 text-sm'}`}
          aria-label={`User type: ${displayUserType}`}
        >
          {getTypeIndicator(displayUserType)}
        </div>
      )}
    </div>
  );
} 