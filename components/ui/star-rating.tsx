import * as React from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
}

const StarRating = React.memo(({ 
  rating, 
  interactive = false, 
  onRatingChange,
  size = "md" 
}: StarRatingProps) => {
  const starSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }[size]

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          onClick={() => interactive && onRatingChange?.(star)}
          type={interactive ? "button" : undefined}
          aria-label={interactive ? `Rate ${star} stars` : `Rated ${star} stars`}
        >
          <Star
            className={`${starSize} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
})

StarRating.displayName = "StarRating"

export { StarRating } 