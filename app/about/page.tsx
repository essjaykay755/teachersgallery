import { Metadata } from 'next'
import Image from 'next/image'
import { Users, BookOpen, Award, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | TeachersGallery',
  description: 'Learn more about TeachersGallery and our mission to transform education',
}

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About TeachersGallery</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connecting passionate teachers with eager students to create meaningful learning experiences.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="relative h-[400px] rounded-2xl overflow-hidden">
          <Image
            src="/about-hero.jpg"
            alt="Teachers and students learning together"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To revolutionize education by creating a platform that connects the best teachers with students who are eager to learn, making quality education accessible to everyone.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To be the world's leading platform for educational connections, where every student can find their perfect teacher and every teacher can reach their full potential.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-gray-600">Building strong relationships between teachers and students</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600">Maintaining high standards in education delivery</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Innovation</h3>
            <p className="text-gray-600">Embracing new teaching methods and technologies</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Passion</h3>
            <p className="text-gray-600">Fostering a love for learning and teaching</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/team/ceo.jpg"
                alt="CEO"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="font-semibold text-xl mb-1">John Smith</h3>
            <p className="text-gray-600 mb-2">CEO & Founder</p>
            <p className="text-gray-600 text-sm">
              Former educator with 15+ years of experience in EdTech
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/team/cto.jpg"
                alt="CTO"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="font-semibold text-xl mb-1">Sarah Johnson</h3>
            <p className="text-gray-600 mb-2">CTO</p>
            <p className="text-gray-600 text-sm">
              Tech innovator with a passion for educational technology
            </p>
          </div>
          
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <Image
                src="/team/coo.jpg"
                alt="COO"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <h3 className="font-semibold text-xl mb-1">Michael Chen</h3>
            <p className="text-gray-600 mb-2">COO</p>
            <p className="text-gray-600 text-sm">
              Operations expert specializing in educational platforms
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 