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
            src={src === "@default-avatar.png" ? "/default-avatar.png" : src}
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
            onError={() => {
              console.log("Avatar image failed to load:", src);
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