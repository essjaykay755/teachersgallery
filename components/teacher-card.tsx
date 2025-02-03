"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, MapPin } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
  avatarIndex: number
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
  avatarIndex 
}) => {
  const router = useRouter()

  const handleDetailsClick = () => {
    router.push(`/teachers/${id}`)
  }

  return (
    <div className={`border rounded-2xl ${color} flex flex-col h-[320px] ${featured ? 'ring-2 ring-yellow-400' : ''}`}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-4">
          <div className="w-[56px] h-[56px] relative rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={getAvatarPath(avatarIndex)}
              alt={name}
              fill
              className="object-cover rounded-full"
              priority
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
              <p className="text-sm text-gray-600 mb-2">{subject}</p>
              {featured ? (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium w-fit">
                  Featured
                </span>
              ) : (
                <div className="h-6" />
              )}
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="hover:bg-black/5 flex-shrink-0 ml-2">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mt-4 min-h-[32px]">
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-white/50 rounded-full text-xs whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{location}</span>
              </div>
              <span className="text-sm font-semibold px-3 py-1 bg-black/5 rounded-full">
                {fee}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <span className="text-xs text-gray-500">{date}</span>
              <Button 
                variant="default" 
                className="h-8 rounded-lg bg-black text-white hover:bg-black/90"
                onClick={handleDetailsClick}
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherCard

