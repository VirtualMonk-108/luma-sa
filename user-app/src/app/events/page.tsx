'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { EventCard } from '@/components/event-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, MapPin, Calendar } from 'lucide-react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@shared/lib/firebase'
import type { Event } from '@shared/types'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all')

  useEffect(() => {
    const eventsRef = collection(db, 'events')
    // Simplified query without orderBy to ensure real-time updates work
    const q = query(eventsRef, where('isPublished', '==', true))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Events snapshot received:', snapshot.size, 'events')
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Event[]
      
      // Sort events by start date
      const sortedEvents = eventsData.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      
      console.log('Setting events:', sortedEvents.length)
      setEvents(sortedEvents)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching events:', error)
      setEvents([]) // Empty array when Firebase fails
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCity = selectedCity === 'all' || event.venue.city.toLowerCase() === selectedCity.toLowerCase()
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    
    let matchesDate = true
    if (selectedDate === 'today') {
      const today = new Date()
      matchesDate = event.startDate.toDateString() === today.toDateString()
    } else if (selectedDate === 'this-week') {
      const weekFromNow = new Date()
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      matchesDate = event.startDate <= weekFromNow
    } else if (selectedDate === 'this-month') {
      const monthFromNow = new Date()
      monthFromNow.setMonth(monthFromNow.getMonth() + 1)
      matchesDate = event.startDate <= monthFromNow
    }
    
    return matchesSearch && matchesCity && matchesCategory && matchesDate
  })

  const cities = ['all', 'johannesburg', 'cape town', 'durban', 'pretoria', 'port elizabeth']
  const categories = ['all', 'technology', 'business', 'food', 'health', 'music', 'sports']

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-xl text-gray-600">
            Find amazing events happening across South Africa
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select 
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city.charAt(0).toUpperCase() + city.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select 
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select 
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="all">Any Date</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {loading ? 'Loading events...' : `${filteredEvents.length} Events Found`}
          </h2>
          {!loading && (
            <p className="text-gray-600">
              {searchTerm && `Showing results for "${searchTerm}"`}
              {selectedCity !== 'all' && ` in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </p>
          )}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="bg-white p-6 rounded-b-lg shadow-md">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-8">
              {searchTerm || selectedCity !== 'all' || selectedCategory !== 'all' || selectedDate !== 'all'
                ? 'Try adjusting your search criteria or browse all events'
                : 'Check back soon for upcoming events in South Africa!'
              }
            </p>
            {(searchTerm || selectedCity !== 'all' || selectedCategory !== 'all' || selectedDate !== 'all') && (
              <Button onClick={() => {
                setSearchTerm('')
                setSelectedCity('all')
                setSelectedCategory('all')
                setSelectedDate('all')
              }}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}