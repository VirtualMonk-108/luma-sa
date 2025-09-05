'use client'

import { useState, useEffect } from 'react'
import { DashboardNav } from '@/components/dashboard-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Search, Filter, CheckCircle, XCircle, Clock, RefreshCw, Download } from 'lucide-react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@shared/lib/firebase'
import type { Payment, PaymentStatus } from '@shared/types'

interface PaymentWithDetails extends Payment {
  customerName?: string
  customerEmail?: string
  eventTitle?: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')

  useEffect(() => {
    const paymentsRef = collection(db, 'payments')
    let q = query(paymentsRef)

    if (statusFilter !== 'all') {
      q = query(paymentsRef, where('status', '==', statusFilter))
    }

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const paymentsData = await Promise.all(
        snapshot.docs.map(async (paymentDoc) => {
          const paymentData = paymentDoc.data()
          const payment = {
            id: paymentDoc.id,
            ...paymentData,
            createdAt: paymentData.createdAt?.toDate() || new Date(),
            completedAt: paymentData.completedAt?.toDate(),
          } as PaymentWithDetails

          // Fetch user details
          try {
            const userDoc = await import('firebase/firestore').then(({ doc, getDoc }) => 
              getDoc(doc(db, 'users', payment.userId))
            )
            if (userDoc.exists()) {
              const userData = userDoc.data()
              payment.customerName = userData.displayName || 'Unknown User'
              payment.customerEmail = userData.email
            }
          } catch (error) {
            console.error('Error fetching user:', error)
          }

          // Fetch registration and event details
          try {
            const regDoc = await import('firebase/firestore').then(({ doc, getDoc }) => 
              getDoc(doc(db, 'registrations', payment.registrationId))
            )
            if (regDoc.exists()) {
              const regData = regDoc.data()
              const eventDoc = await import('firebase/firestore').then(({ doc, getDoc }) => 
                getDoc(doc(db, 'events', regData.eventId))
              )
              if (eventDoc.exists()) {
                payment.eventTitle = eventDoc.data().title
              }
            }
          } catch (error) {
            console.error('Error fetching event:', error)
          }

          return payment
        })
      )
      
      // Sort by creation date (newest first)
      const sortedPayments = paymentsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      
      setPayments(sortedPayments)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching payments:', error)
      setPayments([])
      setLoading(false)
    })

    return () => unsubscribe()
  }, [statusFilter])

  const filteredPayments = payments.filter(payment =>
    payment.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'processing':
        return <Badge className="bg-blue-500"><RefreshCw className="w-3 h-3 mr-1" />Processing</Badge>
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>
      case 'refunded':
        return <Badge className="bg-orange-500">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'payfast':
        return <Badge variant="outline" className="text-blue-600">PayFast</Badge>
      case 'paystack':
        return <Badge variant="outline" className="text-green-600">Paystack</Badge>
      case 'manual':
        return <Badge variant="outline" className="text-gray-600">Manual</Badge>
      default:
        return <Badge variant="outline">{provider}</Badge>
    }
  }

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
              <p className="text-gray-600">Monitor transactions and payment processing</p>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">R{totalRevenue.toLocaleString()}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">R{pendingRevenue.toLocaleString()}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold">{payments.length}</p>
                  </div>
                  <RefreshCw className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold">
                      {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0}%
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payments, customers, events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="px-3 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Real-time payment processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse p-4 border rounded">
                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-sa-green to-sa-gold rounded-lg flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{payment.customerName}</h3>
                            {getStatusBadge(payment.status)}
                            {getProviderBadge(payment.provider)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{payment.customerEmail}</span>
                            <span>•</span>
                            <span>{payment.eventTitle}</span>
                            <span>•</span>
                            <span>{payment.createdAt.toLocaleDateString()}</span>
                            {payment.providerTransactionId && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-xs">{payment.providerTransactionId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          R{payment.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.currency}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredPayments.length === 0 && !loading && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms' : 'No payments have been processed yet'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}