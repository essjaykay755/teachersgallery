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
  GraduationCap,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  Mail,
  Phone,
  Crown,
  BadgeCheck,
  Users,
  Star
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

// Teacher stats
const stats = [
  {
    title: "Total Teachers",
    value: "1,234",
    icon: GraduationCap,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Active Teachers",
    value: "1,100",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "New This Month",
    value: "45",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Featured Teachers",
    value: "134",
    icon: Crown,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  }
]

// Mock data for teachers
const teachers = [
  {
    id: "T001",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    subjects: ["Physics", "Mathematics"],
    status: "active",
    featured: true,
    rating: 4.8,
    students: 45,
    joinedDate: "2024-02-15",
    verified: true
  },
  {
    id: "T002",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43211",
    subjects: ["Chemistry", "Biology"],
    status: "pending",
    featured: false,
    rating: 4.5,
    students: 32,
    joinedDate: "2024-02-14",
    verified: false
  }
]

export default function TeachersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [teacherStatus, setTeacherStatus] = useState("all")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Teachers Management</h1>
        <p className="text-gray-500">Manage and monitor all teachers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
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
              placeholder="Search by name, email, or subject..."
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
            <Select value={teacherStatus} onValueChange={setTeacherStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Teachers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Joined Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {teacher.name}
                    {teacher.featured && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    {teacher.verified && (
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.subjects.join(", ")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{teacher.rating}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </TableCell>
                <TableCell>{teacher.joinedDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {teacher.status === 'active' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {teacher.status === 'pending' && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className={`
                      capitalize
                      ${teacher.status === 'active' && 'text-green-600'}
                      ${teacher.status === 'pending' && 'text-yellow-600'}
                    `}>
                      {teacher.status}
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
                          setSelectedTeacher(teacher)
                          setShowDetailsDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Call Teacher
                      </DropdownMenuItem>
                      {!teacher.verified && (
                        <DropdownMenuItem className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4" />
                          Verify Teacher
                        </DropdownMenuItem>
                      )}
                      {!teacher.featured && (
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          Feature Teacher
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Ban className="h-4 w-4" />
                        Block Account
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                        Delete Account
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
            Showing 1 to 10 of 100 teachers
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      {/* Teacher Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Teacher ID</p>
                  <p className="font-medium">{selectedTeacher.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{selectedTeacher.name}</p>
                    {selectedTeacher.featured && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    {selectedTeacher.verified && (
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedTeacher.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedTeacher.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subjects</p>
                  <p className="font-medium">{selectedTeacher.subjects.join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{selectedTeacher.rating}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="font-medium">{selectedTeacher.students}</p>
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full" variant="outline">Send Message</Button>
                <Button className="w-full" variant="destructive">Block Account</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 