"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, Search, HelpCircle, Mail, Phone, MessageSquare, UserPlus } from "lucide-react"
import Navbar from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// FAQ categories
const categories = [
  { id: 'general', name: 'General', count: 3 },
  { id: 'teachers', name: 'For Teachers', count: 4 },
  { id: 'students', name: 'For Students', count: 3 },
]

// FAQ data with categories
const faqs = {
  general: [
    {
      question: "How does TeachersGallery work?",
      answer: "TeachersGallery connects students with qualified teachers. You can search for teachers based on subject, location, fee range, and teaching mode. Read reviews from other students and check teacher profiles to find the best match for your needs."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, all payments are processed through secure payment gateways. We use industry-standard encryption to protect your financial information."
    },
    {
      question: "How are teachers verified?",
      answer: "All teachers undergo a verification process that includes document verification, background checks, and demo classes. We verify their educational qualifications and teaching experience."
    }
  ],
  teachers: [
    {
      question: "How do I create a teacher profile?",
      answer: "Register as a teacher, complete your profile with qualifications, experience, and teaching preferences. Upload a professional photo and set your hourly rate. Once verified, your profile will be visible to students."
    },
    {
      question: "What are the fees and commissions?",
      answer: "TeachersGallery charges a nominal commission on successful bookings. The exact percentage varies based on your subscription plan. Featured listings have additional benefits and costs."
    },
    {
      question: "How do I get more students?",
      answer: "Complete your profile with detailed information, maintain high ratings, respond promptly to inquiries, and consider getting a featured listing for more visibility."
    },
    {
      question: "When do I receive payments?",
      answer: "Payments are processed within 24-48 hours after each completed class. The amount is transferred directly to your registered bank account."
    }
  ],
  students: [
    {
      question: "How do I find the right teacher?",
      answer: "Use our search filters to find teachers based on subject, location, fee range, and teaching mode. Read reviews from other students and check teacher profiles to find the best match for your needs."
    },
    {
      question: "Can I take trial classes?",
      answer: "Yes! Most teachers offer trial classes at discounted rates. This helps you assess their teaching style and ensure it matches your learning needs before committing to regular classes."
    },
    {
      question: "What if I'm not satisfied with a class?",
      answer: "Your satisfaction is our priority. If you're not satisfied with a class, please contact our support team within 24 hours of the class, and we'll help resolve your concerns."
    }
  ]
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [openQuestions, setOpenQuestions] = useState<string[]>([])
  const [showContactOptions, setShowContactOptions] = useState(false)

  const toggleQuestion = (question: string) => {
    setOpenQuestions(prev => 
      prev.includes(question) 
        ? prev.filter(q => q !== question)
        : [...prev, question]
    )
  }

  const filteredFaqs = faqs[activeCategory as keyof typeof faqs].filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions about TeachersGallery, or contact our support team for more help.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        <div className="grid lg:grid-cols-[250px_1fr] gap-8 max-w-6xl mx-auto">
          {/* Categories Sidebar */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-4">Categories</h2>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center justify-between p-4 rounded-lg text-left transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-gray-500">{category.count}</span>
              </button>
            ))}

            {/* Support Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Still need help?</h3>
                  <p className="text-sm text-gray-600">We're here for you</p>
                </div>
              </div>
              <Button className="w-full flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </Card>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-6">{categories.find(c => c.id === activeCategory)?.name} Questions</h2>
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(faq.question)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h3 className="font-medium pr-8">{faq.question}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      openQuestions.includes(faq.question) ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                {openQuestions.includes(faq.question) && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Contact Options */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3">
          {/* Main Contact Button */}
          <Button
            onClick={() => setShowContactOptions(!showContactOptions)}
            className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-0 relative"
          >
            <Mail className="h-6 w-6" />
            {showContactOptions && (
              <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full"></span>
            )}
          </Button>

          {/* Contact Options */}
          <div className={`flex flex-col gap-3 transition-all duration-300 ${
            showContactOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}>
            {/* Phone Call Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white p-0"
                  title="Request Phone Call"
                >
                  <Phone className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request a Phone Call</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Your Name" />
                  <Input placeholder="Phone Number" type="tel" />
                  <Input placeholder="Preferred Time" type="time" />
                  <Button className="w-full">Request Call</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* WhatsApp Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="h-14 w-14 rounded-full shadow-lg bg-[#25D366] hover:bg-[#128C7E] text-white p-0"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start WhatsApp Chat</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Your Name" />
                  <Input placeholder="WhatsApp Number" type="tel" />
                  <textarea 
                    className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your message..."
                  ></textarea>
                  <Button className="w-full">Start Chat</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Assign Teacher Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="h-14 w-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white p-0"
                  title="Assign Teacher"
                >
                  <UserPlus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Teacher Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Your Name" />
                  <Input placeholder="Email" type="email" />
                  <Input placeholder="Phone Number" type="tel" />
                  <select className="w-full p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Subject</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="biology">Biology</option>
                    <option value="english">English</option>
                  </select>
                  <textarea 
                    className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional requirements..."
                  ></textarea>
                  <Button className="w-full">Submit Request</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </div>
  )
} 