'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { EventCard } from '@/components/event-card'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@shared/lib/firebase'
import type { Event } from '@shared/types'

// Fallback mock data if Firestore fails
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join leading tech innovators and entrepreneurs for a day of networking, learning, and inspiration.',
    shortDescription: 'Leading tech innovators and entrepreneurs gathering for networking and learning.',
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
      postalCode: '2196',
      coordinates: { lat: -26.1076, lng: 28.0567 }
    },
    capacity: 500,
    ticketTypes: [
      {
        id: '1',
        name: 'Early Bird',
        price: 450,
        quantity: 100,
        quantityAvailable: 45,
        isActive: true
      }
    ],
    tags: ['tech', 'innovation', 'networking'],
    isPublished: true,
    isFeatured: true,
    registrationCount: 123,
    slug: 'tech-innovation-summit-2024',
    weather: {
      temperature: 28,
      condition: 'sunny',
      icon: 'weather-sunny',
      description: '28°C, sunny',
      updatedAt: new Date()
    },
    loadShedding: {
      stage: 0,
      isActive: false,
      updatedAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Cape Town Food & Wine Festival',
    description: 'Celebrate the best of South African cuisine and wine with renowned chefs and winemakers.',
    shortDescription: 'Celebrate SA cuisine and wine with renowned chefs and winemakers.',
    hostId: 'host2',
    hostName: 'Cape Food Events',
    category: 'food',
    startDate: new Date('2024-12-20T11:00:00'),
    endDate: new Date('2024-12-22T22:00:00'),
    timezone: 'Africa/Johannesburg',
    venue: {
      name: 'V&A Waterfront',
      address: 'Dock Road Quay',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      coordinates: { lat: -33.9025, lng: 18.4187 }
    },
    capacity: 1000,
    ticketTypes: [
      {
        id: '2',
        name: 'Weekend Pass',
        price: 850,
        quantity: 500,
        quantityAvailable: 287,
        isActive: true
      }
    ],
    tags: ['food', 'wine', 'festival'],
    isPublished: true,
    isFeatured: true,
    registrationCount: 567,
    slug: 'cape-town-food-wine-festival',
    weather: {
      temperature: 24,
      condition: 'partly-cloudy',
      icon: 'weather-partly-cloudy',
      description: '24°C, partly cloudy',
      updatedAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Durban Beach Yoga Retreat',
    description: 'Start your weekend with a peaceful yoga session on Durban\'s beautiful beaches.',
    shortDescription: 'Peaceful yoga session on Durban\'s beautiful beaches.',
    hostId: 'host3',
    hostName: 'Yoga Durban',
    category: 'health',
    startDate: new Date('2024-12-14T06:30:00'),
    endDate: new Date('2024-12-14T08:00:00'),
    timezone: 'Africa/Johannesburg',
    venue: {
      name: 'Golden Mile Beach',
      address: 'Marine Parade',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001',
      coordinates: { lat: -29.8587, lng: 31.0218 }
    },
    capacity: 50,
    ticketTypes: [
      {
        id: '3',
        name: 'Single Session',
        price: 0,
        quantity: 50,
        quantityAvailable: 12,
        isActive: true
      }
    ],
    tags: ['yoga', 'wellness', 'beach'],
    isPublished: true,
    isFeatured: false,
    registrationCount: 38,
    slug: 'durban-beach-yoga-retreat',
    weather: {
      temperature: 26,
      condition: 'sunny',
      icon: 'weather-sunny',
      description: '26°C, sunny',
      updatedAt: new Date()
    },
    loadShedding: {
      stage: 2,
      isActive: true,
      updatedAt: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const eventsRef = collection(db, 'events')
    const q = query(eventsRef, where('isPublished', '==', true))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Home page events snapshot received:', snapshot.size, 'events')
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Event[]
      
      console.log('Home page setting events:', eventsData.length)
      setEvents(eventsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching events:', error)
      setEvents([]) // Empty array when Firebase fails
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const featuredEvents = events.filter(event => event.isFeatured)
  const upcomingEvents = events.slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sa-green to-sa-blue text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Events in <span className="text-sa-gold">South Africa</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              From Johannesburg to Cape Town, find workshops, concerts, conferences, and more. 
              Stay updated with weather and load shedding information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-sa-gold text-sa-green px-8 py-3 rounded-lg font-semibold hover:bg-sa-gold/90 transition-colors">
                Browse Events
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Create Event
              </button>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : featuredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Events Yet</h3>
                <p className="text-gray-600">Check back soon for exciting featured events!</p>
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Technology', icon: '💻', color: 'from-blue-500 to-blue-600' },
                { name: 'Food & Drink', icon: '🍽️', color: 'from-orange-500 to-orange-600' },
                { name: 'Music', icon: '🎵', color: 'from-purple-500 to-purple-600' },
                { name: 'Health', icon: '🧘', color: 'from-green-500 to-green-600' },
                { name: 'Business', icon: '💼', color: 'from-gray-600 to-gray-700' },
                { name: 'Sports', icon: '⚽', color: 'from-red-500 to-red-600' },
              ].map(category => (
                <div key={category.name} className={`bg-gradient-to-br ${category.color} text-white rounded-lg p-6 text-center hover:scale-105 transition-transform cursor-pointer`}>
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-semibold">{category.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="text-center mt-12">
                  <button className="bg-sa-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-sa-green/90 transition-colors">
                    View All Events
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h3>
                <p className="text-gray-600 mb-4">Be the first to know when new events are added!</p>
                <button className="bg-sa-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-sa-green/90 transition-colors">
                  Get Notified
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}