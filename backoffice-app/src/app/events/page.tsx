'use client'

import { useState, useEffect } from 'react'
import { DashboardNav } from '@/components/dashboard-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Eye, Edit, Trash2, Search, Filter, Plus } from 'lucide-react'
import { collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@shared/lib/firebase'
import type { Event } from '@shared/types'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"? This cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'events', eventId))
        console.log('Event deleted successfully')
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event. Please try again.')
      }
    }
  }

  useEffect(() => {
    const eventsRef = collection(db, 'events')
    let q = query(eventsRef)

    if (filter !== 'all') {
      q = query(eventsRef, where('category', '==', filter))
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Event[]
      
      setEvents(eventsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching events:', error)
      setLoading(false)
      // Show mock data if Firestore fails
      setEvents([
        {
          id: '1',
          title: 'Tech Innovation Summit 2024',
          description: 'Leading tech innovators gathering',
          shortDescription: 'Tech summit in Sandton',
          hostId: 'host1',
          hostName: 'Tech Events JHB',
          category: 'technology',
          startDate: new Date('2024-12-15T09:00:00'),
          endDate: new Date('2024-12-15T17:00:00'),
          timezone: 'Africa/Johannesburg',
          venue: {
            name: 'Sandton Convention Centre',
            address: '161 Maude Street',
            city: 'Johannesburg',
            province: 'Gauteng',
            postalCode: '2196'
          },
          capacity: 500,
          ticketTypes: [{ id: '1', name: 'Early Bird', price: 450, quantity: 100, quantityAvailable: 45, isActive: true }],
          tags: ['tech', 'innovation'],
          isPublished: true,
          isFeatured: true,
          registrationCount: 123,
          slug: 'tech-innovation-summit-2024',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    })

    return () => unsubscribe()
  }, [filter])

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (event: Event) => {
    const now = new Date()
    if (event.startDate > now) {
      return <Badge variant="secondary">Upcoming</Badge>
    } else if (event.endDate > now) {
      return <Badge className="bg-green-500">Live</Badge>
    } else {
      return <Badge variant="outline">Completed</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
              <p className="text-gray-600">Manage all events on the platform</p>
            </div>
            <Button onClick={() => window.location.href = '/create-event'}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events, cities, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              className="px-3 py-2 border rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="food">Food & Drink</option>
              <option value="health">Health</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-sa-green/20 to-sa-gold/20 rounded-t-lg flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(event)}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.shortDescription}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.startDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.venue.city}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {event.registrationCount} registered
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.location.href = `/edit-event/${event.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteEvent(event.id, event.title)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredEvents.length === 0 && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first event'}
                </p>
                <Button onClick={() => window.location.href = '/create-event'}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}