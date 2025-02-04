import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  description?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, description, id, "aria-describedby": ariaDescribedby, ...props }, ref) => {
    const descriptionId = description ? `${id}-description` : undefined
    const errorId = error ? `${id}-error` : undefined
    const ariaDescribedbyIds = [ariaDescribedby, descriptionId, errorId].filter(Boolean).join(" ")

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={ariaDescribedbyIds || undefined}
          {...props}
        />
        {description && (
          <p 
            id={descriptionId}
            className="mt-1 text-sm text-gray-500"
          >
            {description}
          </p>
        )}
        {error && (
          <p 
            id={errorId}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input } 