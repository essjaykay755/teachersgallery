import { cn } from "@/lib/utils"

export const fadeIn = "animate-in fade-in duration-300"
export const slideDown = "animate-in slide-in-from-top duration-300"
export const slideUp = "animate-in slide-in-from-bottom duration-300"
export const slideLeft = "animate-in slide-in-from-left duration-300"
export const slideRight = "animate-in slide-in-from-right duration-300"
export const zoomIn = "animate-in zoom-in duration-300"

interface AnimatedContainerProps {
  children: React.ReactNode
  animation?: string
  className?: string
  delay?: string
}

export function AnimatedContainer({
  children,
  animation = fadeIn,
  className,
  delay = "delay-0",
}: AnimatedContainerProps) {
  return (
    <div className={cn(animation, delay, className)}>
      {children}
    </div>
  )
} 