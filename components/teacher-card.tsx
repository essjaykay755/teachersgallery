"use client"

import * as React from "react"
import { MapPin, Star, Calendar, BadgeCheck } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AnimatedContainer, fadeIn } from "@/components/ui/animations"

const getAvatarPath = (index: number) => `/avatars/avatar${(index % 8) + 1}.jpg`

interface TeacherCardProps {
  id?: string
  name: string
  subject: string
  location: string
  fee: string
  tags: string[]
  date: string
  color: string
  featured?: boolean
  verified?: boolean
  avatarIndex: number
  rating?: number
}

const TeacherCard: React.FC<TeacherCardProps> = ({ 
  id = '1',
  name, 
  subject, 
  location, 
  fee, 
  tags, 
  date, 
  color, 
  featured,
  verified = true, 
  avatarIndex,
  rating = 4.8
}) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/teachers/${id}`)
  }

  return (
    <AnimatedContainer animation={fadeIn} className="group">
      <div 
        onClick={handleCardClick}
        className={`${color} rounded-2xl p-6 transition-all hover:shadow-lg cursor-pointer relative border border-gray-100/50`}
      >
        {featured && (
          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full animate-pulse">
            Featured
          </span>
        )}

        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm transition-transform group-hover:scale-110">
            <Image
              src={getAvatarPath(avatarIndex)}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{name}</h3>
              {verified && (
                <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-600">{subject}</p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-white/50 hover:bg-white/60 rounded-full text-xs text-gray-600 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{fee}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{rating}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default TeacherCard

