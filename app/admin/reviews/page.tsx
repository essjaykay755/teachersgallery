"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  MoreVertical,
  Search,
  Filter,
  Star,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ThumbsUp,
  MessageSquare,
  ArrowUpDown,
  Flag
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebounce } from "@/hooks/useDebounce"

// Mock data for reviews
const reviews = [
  {
    id: "R001",
    studentName: "Rahul Sharma",
    teacherName: "Priya Verma",
    rating: 5,
    content: "Excellent teaching style! Very patient and explains concepts clearly.",
    subject: "Physics",
    timestamp: "2024-02-15",
    status: "approved",
    reported: false,
    helpful: 12,
    replies: 2
  },
  {
    id: "R002",
    studentName: "Amit Patel",
    teacherName: "Rajesh Kumar",
    rating: 2,
    content: "Not satisfied with the teaching approach...",
    subject: "Mathematics",
    timestamp: "2024-02-14",
    status: "flagged",
    reported: true,
    helpful: 3,
    replies: 1
  },
  {
    id: "R003",
    studentName: "Sneha Gupta",
    teacherName: "Anjali Desai",
    rating: 4,
    content: "Great teacher! Helped me improve my understanding of organic chemistry.",
    subject: "Chemistry",
    timestamp: "2024-02-14",
    status: "pending",
    reported: false,
    helpful: 8,
    replies: 0
  }
]

// Review stats
const stats = [
  {
    title: "Total Reviews",
    value: "1,234",
    icon: MessageSquare
  },
  {
    title: "Average Rating",
    value: "4.5",
    icon: Star
  },
  {
    title: "Pending Reviews",
    value: "45",
    icon: AlertTriangle
  },
  {
    title: "Flagged Reviews",
    value: "23",
    icon: Flag
  }
]

export default function ReviewsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [reviewStatus, setReviewStatus] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reviews Management</h1>
          <p className="text-gray-500">Monitor and moderate teacher reviews</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reviewStatus} onValueChange={setReviewStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Reviews Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.id}</TableCell>
                <TableCell>{review.studentName}</TableCell>
                <TableCell>{review.teacherName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {review.content}
                </TableCell>
                <TableCell>{review.timestamp}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {review.status === 'approved' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {review.status === 'flagged' && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    {review.status === 'pending' && (
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                    )}
                    <span className={`
                      capitalize
                      ${review.status === 'approved' && 'text-green-600'}
                      ${review.status === 'flagged' && 'text-yellow-600'}
                      ${review.status === 'pending' && 'text-blue-600'}
                    `}>
                      {review.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="flex items-center gap-2"
                        onClick={() => {
                          setSelectedReview(review)
                          setShowDetailsDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {review.status === 'pending' && (
                        <DropdownMenuItem className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Approve Review
                        </DropdownMenuItem>
                      )}
                      {!review.reported && (
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          Flag Review
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                        Delete Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-gray-500">
            Showing 1 to 10 of 100 reviews
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      {/* Review Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Review ID</p>
                  <p className="font-medium">{selectedReview.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student</p>
                  <p className="font-medium">{selectedReview.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teacher</p>
                  <p className="font-medium">{selectedReview.teacherName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Review</p>
                  <p className="mt-2 p-4 bg-gray-50 rounded-lg">{selectedReview.content}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Helpful Votes</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ThumbsUp className="h-4 w-4 text-gray-500" />
                      <span>{selectedReview.helpful}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Replies</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <span>{selectedReview.replies}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                {selectedReview.status === 'pending' && (
                  <Button className="w-full" variant="outline">Approve Review</Button>
                )}
                <Button className="w-full" variant="destructive">Delete Review</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 