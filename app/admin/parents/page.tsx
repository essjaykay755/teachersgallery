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
  Users2,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  Mail,
  Phone
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

// Mock data for parents
const parents = [
  {
    id: "P001",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    children: 2,
    joinedDate: "2024-02-15",
    status: "active",
    lastActive: "2024-02-15 14:30"
  },
  {
    id: "P002",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43211",
    children: 1,
    joinedDate: "2024-02-14",
    status: "inactive",
    lastActive: "2024-02-10 09:15"
  }
]

// Parent stats
const stats = [
  {
    title: "Total Parents",
    value: "856",
    icon: Users2
  },
  {
    title: "Active Parents",
    value: "654",
    icon: CheckCircle
  },
  {
    title: "New This Month",
    value: "45",
    icon: AlertTriangle
  }
]

export default function ParentsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedParent, setSelectedParent] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [parentStatus, setParentStatus] = useState("all")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Parents Management</h1>
          <p className="text-gray-500">Monitor and manage parent accounts</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              placeholder="Search parents..."
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
            <Select value={parentStatus} onValueChange={setParentStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Parents Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Children</TableHead>
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
            {parents.map((parent) => (
              <TableRow key={parent.id}>
                <TableCell className="font-medium">{parent.id}</TableCell>
                <TableCell>{parent.name}</TableCell>
                <TableCell>{parent.email}</TableCell>
                <TableCell>{parent.phone}</TableCell>
                <TableCell>{parent.children}</TableCell>
                <TableCell>{parent.joinedDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {parent.status === 'active' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className={`
                      capitalize
                      ${parent.status === 'active' ? 'text-green-600' : 'text-yellow-600'}
                    `}>
                      {parent.status}
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
                          setSelectedParent(parent)
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
                        Call Parent
                      </DropdownMenuItem>
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
            Showing 1 to 10 of 100 parents
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      {/* Parent Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parent Details</DialogTitle>
          </DialogHeader>
          {selectedParent && (
            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Parent ID</p>
                  <p className="font-medium">{selectedParent.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedParent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedParent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedParent.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Children</p>
                  <p className="font-medium">{selectedParent.children}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Active</p>
                  <p className="font-medium">{selectedParent.lastActive}</p>
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