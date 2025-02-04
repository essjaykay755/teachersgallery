"use client"

import * as React from "react"
import { MapPin, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AnimatedContainer, fadeIn } from "@/components/ui/animations"
import { StarRating } from "@/components/ui/star-rating"

const getAvatarPath = (index: number) => `/avatars/avatar${(index % 8) + 1}.jpg`

interface TeacherCardProps {
  teacher: {
    id: string
    name: string
    subject: string
    location: string
    rating: number
    reviewsCount: number
    fee: string
    avatarIndex: number
    isVerified?: boolean
    tags?: string[]
  }
}

const TeacherCard = React.memo(({ teacher }: TeacherCardProps) => {
  const router = useRouter()

  // Memoize the handler since it only depends on teacher.id
  const handleClick = React.useCallback(() => {
    router.push(`/teachers/${teacher.id}`)
  }, [router, teacher.id])

  return (
    <AnimatedContainer animation={fadeIn}>
      <div 
        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleClick}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
            <Image
              src={getAvatarPath(teacher.avatarIndex)}
              alt={teacher.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{teacher.name}</h3>
                  {teacher.isVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500" aria-label="Verified teacher" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{teacher.subject} Teacher</p>
                <div className="flex items-center gap-1 text-gray-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{teacher.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-blue-600">{teacher.fee}</div>
                <div className="text-sm text-gray-500">per hour</div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <StarRating rating={teacher.rating} size="sm" />
                <span className="text-sm text-gray-500">({teacher.reviewsCount} reviews)</span>
              </div>
              {teacher.tags && teacher.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {teacher.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  )
})

TeacherCard.displayName = "TeacherCard"

export default TeacherCard

