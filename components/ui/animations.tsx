import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const fadeIn = "animate-in fade-in duration-300";
export const slideDown = "animate-in slide-in-from-top duration-300";
export const slideUp = "animate-in slide-in-from-bottom duration-300";
export const slideLeft = "animate-in slide-in-from-left duration-300";
export const slideRight = "animate-in slide-in-from-right duration-300";
export const zoomIn = "animate-in zoom-in duration-300";

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: string;
  className?: string;
  delay?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const AnimatedContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps
>(function AnimatedContainer(
  { children, animation = fadeIn, className, delay = "delay-0", onMouseEnter, onMouseLeave },
  ref
) {
  return (
    <div 
      className={cn(animation, delay, className)} 
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
});
