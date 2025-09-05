'use client'

import { useState, useEffect } from 'react'
import { DashboardNav } from '@/components/dashboard-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegistrationsChart, RevenueChart, CategoryChart, LocationChart } from '@/components/analytics-charts'
import { Calendar, Users, DollarSign, TrendingUp, MapPin, Zap, Cloud, AlertTriangle } from 'lucide-react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@shared/lib/firebase'

export default function BackofficeDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeUsers: 0,
    totalRevenue: 0,
    ticketsSold: 0,
    recentRegistrations: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Events listener
    const eventsQuery = query(collection(db, 'events'), where('isPublished', '==', true))
    const eventsUnsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, totalEvents: snapshot.size }))
    })

    // Users listener
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStats(prev => ({ ...prev, activeUsers: snapshot.size }))
    })

    // Registrations listener for revenue and tickets
    const registrationsQuery = query(collection(db, 'registrations'), where('status', '==', 'confirmed'))
    const registrationsUnsubscribe = onSnapshot(registrationsQuery, (snapshot) => {
      let totalRevenue = 0
      let ticketsSold = 0
      
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        totalRevenue += data.totalAmount || 0
        ticketsSold += data.quantity || 1
      })
      
      setStats(prev => ({ 
        ...prev, 
        totalRevenue,
        ticketsSold,
        recentRegistrations: snapshot.size
      }))
    })

    setLoading(false)

    return () => {
      eventsUnsubscribe()
      usersUnsubscribe()
      registrationsUnsubscribe()
    }
  }, [])
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to your Luma SA analytics dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    <p className="text-xs text-muted-foreground">
                      Published events
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Confirmed revenue
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.ticketsSold}</div>
                <p className="text-xs text-muted-foreground">
                  Total tickets sold
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Registrations</CardTitle>
                <CardDescription>Monthly registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <RegistrationsChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue in ZAR</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Event distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Events by Location</CardTitle>
                <CardDescription>Geographic distribution of events</CardDescription>
              </CardHeader>
              <CardContent>
                <LocationChart />
              </CardContent>
            </Card>
          </div>

          {/* South African Specific Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Load Shedding Impact</CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">Stage 2</div>
                <p className="text-xs text-muted-foreground">
                  23 events affected today
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weather Alerts</CardTitle>
                <Cloud className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">3</div>
                <p className="text-xs text-muted-foreground">
                  Active weather warnings
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">2</div>
                <p className="text-xs text-muted-foreground">
                  PayFast gateway issues
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest events and registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New event: Tech Innovation Summit 2024</p>
                    <p className="text-xs text-gray-500">Created by Tech Events JHB • 2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">125 new registrations today</p>
                    <p className="text-xs text-gray-500">Across 23 different events • 3 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Load shedding warning issued</p>
                    <p className="text-xs text-gray-500">Stage 2 scheduled for 16:00-18:30 • 4 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}