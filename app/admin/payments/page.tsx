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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MoreVertical,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar
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

// Mock data for payments
const payments = [
  {
    id: "P001",
    studentName: "Rahul Sharma",
    teacherName: "Priya Verma",
    amount: "₹1,200",
    status: "completed",
    type: "class_payment",
    date: "2024-02-15",
    paymentMethod: "UPI",
    commission: "₹180",
    teacherPayout: "₹1,020"
  },
  {
    id: "P002",
    studentName: "Amit Patel",
    teacherName: "Rajesh Kumar",
    amount: "₹1,500",
    status: "pending",
    type: "subscription",
    date: "2024-02-14",
    paymentMethod: "Card",
    commission: "₹225",
    teacherPayout: "₹1,275"
  },
  {
    id: "P003",
    studentName: "Sneha Gupta",
    teacherName: "Anjali Desai",
    amount: "₹800",
    status: "failed",
    type: "class_payment",
    date: "2024-02-14",
    paymentMethod: "NetBanking",
    commission: "₹120",
    teacherPayout: "₹680"
  }
]

// Financial stats
const stats = [
  {
    title: "Total Revenue",
    value: "₹1,45,678",
    change: "+15%",
    trend: "up",
  },
  {
    title: "Commission Earned",
    value: "₹21,852",
    change: "+12%",
    trend: "up",
  },
  {
    title: "Teacher Payouts",
    value: "₹1,23,826",
    change: "+18%",
    trend: "up",
  },
  {
    title: "Pending Payments",
    value: "₹12,500",
    change: "-5%",
    trend: "down",
  }
]

export default function PaymentsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [dateRange, setDateRange] = useState("last_7_days")
  const [paymentStatus, setPaymentStatus] = useState("all")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Payments Management</h1>
          <p className="text-gray-500">Track and manage all financial transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <span className={`
                flex items-center gap-1 text-sm font-medium
                ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}
              `}>
                {stat.change}
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-500">{stat.title}</p>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search by ID, student, or teacher..."
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
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Amount
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.studentName}</TableCell>
                <TableCell>{payment.teacherName}</TableCell>
                <TableCell className="font-medium">{payment.amount}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {payment.date}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="capitalize">{payment.type.replace('_', ' ')}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {payment.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {payment.status === 'pending' && (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    {payment.status === 'failed' && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`
                      capitalize
                      ${payment.status === 'completed' && 'text-green-600'}
                      ${payment.status === 'pending' && 'text-yellow-600'}
                      ${payment.status === 'failed' && 'text-red-600'}
                    `}>
                      {payment.status}
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
                          setSelectedPayment(payment)
                          setShowDetailsDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {payment.status === 'pending' && (
                        <DropdownMenuItem className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Invoice
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
            Showing 1 to 10 of 100 payments
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-medium">{selectedPayment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedPayment.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student</p>
                  <p className="font-medium">{selectedPayment.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teacher</p>
                  <p className="font-medium">{selectedPayment.teacherName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">{selectedPayment.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Commission</p>
                  <p className="font-medium">{selectedPayment.commission}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teacher Payout</p>
                  <p className="font-medium">{selectedPayment.teacherPayout}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button className="w-full">Download Invoice</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 