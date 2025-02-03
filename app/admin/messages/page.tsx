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
  MessageSquare,
  Flag,
  Eye,
  Trash2,
  Ban,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpDown
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

// Mock data for messages
const messages = [
  {
    id: "M001",
    from: "Rahul Sharma",
    to: "Priya Verma",
    content: "Hello, I'm interested in your Physics classes...",
    timestamp: "2024-02-15 14:30",
    status: "active",
    reported: false,
    type: "inquiry"
  },
  {
    id: "M002",
    from: "Amit Patel",
    to: "Rajesh Kumar",
    content: "When can we schedule the trial class?",
    timestamp: "2024-02-15 13:45",
    status: "flagged",
    reported: true,
    type: "scheduling"
  },
  {
    id: "M003",
    from: "Sneha Gupta",
    to: "Anjali Desai",
    content: "Thank you for the wonderful Chemistry class!",
    timestamp: "2024-02-15 12:15",
    status: "resolved",
    reported: false,
    type: "feedback"
  }
]

// Message stats
const stats = [
  {
    title: "Total Messages",
    value: "1,234",
    icon: MessageSquare
  },
  {
    title: "Flagged Messages",
    value: "23",
    icon: Flag
  },
  {
    title: "Response Rate",
    value: "95%",
    icon: CheckCircle
  },
  {
    title: "Avg Response Time",
    value: "30 min",
    icon: Clock
  }
]

export default function MessagesManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [messageType, setMessageType] = useState("all")
  const [messageStatus, setMessageStatus] = useState("all")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Messages Management</h1>
          <p className="text-gray-500">Monitor and moderate user communications</p>
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
              placeholder="Search messages..."
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
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Message Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="inquiry">Inquiries</SelectItem>
                <SelectItem value="scheduling">Scheduling</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
            <Select value={messageStatus} onValueChange={setMessageStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Messages Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Time
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium">{message.id}</TableCell>
                <TableCell>{message.from}</TableCell>
                <TableCell>{message.to}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {message.content}
                </TableCell>
                <TableCell>{message.timestamp}</TableCell>
                <TableCell>
                  <span className="capitalize">{message.type}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {message.status === 'active' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {message.status === 'flagged' && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    {message.status === 'resolved' && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    )}
                    <span className={`
                      capitalize
                      ${message.status === 'active' && 'text-green-600'}
                      ${message.status === 'flagged' && 'text-yellow-600'}
                      ${message.status === 'resolved' && 'text-blue-600'}
                    `}>
                      {message.status}
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
                          setSelectedMessage(message)
                          setShowDetailsDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {message.status !== 'resolved' && (
                        <DropdownMenuItem className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Mark as Resolved
                        </DropdownMenuItem>
                      )}
                      {!message.reported && (
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          Flag Message
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Ban className="h-4 w-4" />
                        Block User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                        Delete Message
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
            Showing 1 to 10 of 100 messages
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      {/* Message Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Message ID</p>
                  <p className="font-medium">{selectedMessage.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{selectedMessage.from}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="font-medium">{selectedMessage.to}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{selectedMessage.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="mt-2 p-4 bg-gray-50 rounded-lg">{selectedMessage.content}</p>
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full" variant="outline">Mark as Resolved</Button>
                <Button className="w-full" variant="destructive">Delete Message</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 