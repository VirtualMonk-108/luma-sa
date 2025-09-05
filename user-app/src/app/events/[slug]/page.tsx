'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthModal } from '@/components/auth/auth-modal'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Share2, 
  Heart,
  Cloud,
  Zap,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { doc, getDoc, collection, addDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '@shared/lib/firebase'
import { useAuth } from '@/contexts/auth-context'
import { APIService } from '@shared/lib/mock-apis'
import type { Event, Registration, TicketType } from '@shared/types'

export default function EventDetailPage() {
  const params = useParams()
  const { user, userProfile } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  
  // Registration form data
  const [attendeeData, setAttendeeData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  })

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.slug) return
      
      try {
        const eventDoc = await getDoc(doc(db, 'events', params.slug as string))
        if (eventDoc.exists()) {
          const eventData = eventDoc.data()
          setEvent({
            ...eventData,
            id: eventDoc.id,
            startDate: eventData.startDate?.toDate() || new Date(),
            endDate: eventData.endDate?.toDate() || new Date(),
            createdAt: eventData.createdAt?.toDate() || new Date(),
            updatedAt: eventData.updatedAt?.toDate() || new Date(),
          } as Event)
          
          // Set default ticket type
          if (eventData.ticketTypes && eventData.ticketTypes.length > 0) {
            setSelectedTicketType(eventData.ticketTypes[0])
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error)
        // Show mock event if Firebase fails
        setEvent({
          id: 'tech-summit-2024',
          title: 'Tech Innovation Summit 2024',
          description: 'Join leading tech innovators and entrepreneurs for a day of networking, learning, and inspiration. This premier event brings together the brightest minds in South African tech, featuring keynote speakers from major companies, startup pitch sessions, interactive workshops, and extensive networking opportunities.',
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
              isActive: true,
              description: 'Limited time early bird pricing'
            },
            {
              id: '2',
              name: 'Regular',
              price: 650,
              quantity: 300,
              quantityAvailable: 287,
              isActive: true,
              description: 'Standard admission'
            }
          ],
          tags: ['tech', 'innovation', 'networking', 'startups'],
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
        })
        if (event?.ticketTypes && event.ticketTypes.length > 0) {
          setSelectedTicketType(event.ticketTypes[0])
        }
      }
      setLoading(false)
    }

    fetchEvent()
  }, [params.slug])

  useEffect(() => {
    if (user && userProfile) {
      setAttendeeData({
        name: userProfile.displayName || '',
        email: user.email || '',
        phoneNumber: userProfile.phoneNumber || ''
      })
    }
  }, [user, userProfile])

  const handleRegister = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (!event || !selectedTicketType) return

    setRegistering(true)

    try {
      // Create registration
      const registration: Omit<Registration, 'id'> = {
        eventId: event.id,
        userId: user.uid,
        ticketTypeId: selectedTicketType.id,
        quantity,
        totalAmount: selectedTicketType.price * quantity,
        status: selectedTicketType.price > 0 ? 'pending' : 'confirmed',
        attendeeInfo: [{
          name: attendeeData.name,
          email: attendeeData.email,
          phoneNumber: attendeeData.phoneNumber
        }],
        createdAt: new Date()
      }

      const docRef = await addDoc(collection(db, 'registrations'), registration)

      // If it's a paid event, process payment
      if (selectedTicketType.price > 0) {
        try {
          const paymentResult = await APIService.PayFast?.processPayment(
            registration.totalAmount,
            docRef.id,
            attendeeData.email,
            attendeeData.name
          )

          if (paymentResult?.status === 'completed') {
            // Create payment record
            await addDoc(collection(db, 'payments'), {
              registrationId: docRef.id,
              userId: user.uid,
              amount: registration.totalAmount,
              currency: 'ZAR',
              provider: 'payfast',
              status: 'completed',
              providerTransactionId: paymentResult.transactionId,
              createdAt: new Date(),
              completedAt: new Date()
            })

            // Update registration status
            await updateDoc(doc(db, 'registrations', docRef.id), {
              status: 'confirmed',
              paymentId: paymentResult.transactionId
            })
          }
        } catch (paymentError) {
          console.error('Payment failed:', paymentError)
          // Update registration status to failed
          await updateDoc(doc(db, 'registrations', docRef.id), {
            status: 'cancelled'
          })
          throw new Error('Payment processing failed')
        }
      }

      // Update event registration count and ticket availability
      await updateDoc(doc(db, 'events', event.id), {
        registrationCount: increment(quantity)
      })

      // Send confirmation email (mock)
      await APIService.SendGrid?.sendEmail(
        attendeeData.email,
        `Registration Confirmed: ${event.title}`,
        `
          <h1>Welcome to ${event.title}!</h1>
          <p>Hi ${attendeeData.name},</p>
          <p>Your registration has been confirmed for the event on ${event.startDate.toLocaleDateString()}.</p>
          <p><strong>Event Details:</strong></p>
          <ul>
            <li>Date: ${event.startDate.toLocaleDateString()}</li>
            <li>Time: ${event.startDate.toLocaleTimeString()}</li>
            <li>Location: ${event.venue.name}, ${event.venue.city}</li>
            <li>Ticket: ${selectedTicketType.name} x ${quantity}</li>
            <li>Total: R${registration.totalAmount}</li>
          </ul>
          <p>We look forward to seeing you there!</p>
        `
      )

      // Send SMS confirmation (mock)
      if (attendeeData.phoneNumber) {
        await APIService.Clickatell?.sendSMS(
          attendeeData.phoneNumber,
          `Hi ${attendeeData.name}! Your registration for ${event.title} on ${event.startDate.toLocaleDateString()} is confirmed. See you there! - Luma SA`
        )
      }

      setRegistrationComplete(true)

    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    return <Cloud className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  if (registrationComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
            <p className="text-gray-600 mb-6">
              You've successfully registered for <strong>{event.title}</strong>. 
              A confirmation email has been sent to {attendeeData.email}.
            </p>
            <div className="space-y-2 mb-6 text-sm text-gray-600">
              <p><strong>Date:</strong> {event.startDate.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {event.startDate.toLocaleTimeString()}</p>
              <p><strong>Location:</strong> {event.venue.name}</p>
              <p><strong>Ticket:</strong> {selectedTicketType?.name} x {quantity}</p>
              <p><strong>Total:</strong> R{selectedTicketType ? selectedTicketType.price * quantity : 0}</p>
            </div>
            <Button onClick={() => window.location.href = '/events'} className="w-full">
              Browse More Events
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-br from-sa-green/20 to-sa-gold/20 flex items-center justify-center relative">
            <Calendar className="h-24 w-24 text-gray-400" />
            
            {/* Weather & Load Shedding Indicators */}
            <div className="absolute top-4 right-4 flex space-x-2">
              {event.weather && (
                <div className="bg-white/90 rounded-full px-3 py-1 flex items-center space-x-1">
                  {getWeatherIcon(event.weather.condition)}
                  <span className="text-sm font-medium">{event.weather.temperature}°C</span>
                </div>
              )}
              {event.loadShedding?.isActive && (
                <div className="bg-red-100 text-red-600 rounded-full px-3 py-1 flex items-center space-x-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Stage {event.loadShedding.stage}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <p className="text-gray-600">Hosted by {event.hostName}</p>
              </div>
              <div className="flex space-x-2 mt-4 sm:mt-0">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{event.startDate.toLocaleDateString()} at {event.startDate.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.venue.name}, {event.venue.city}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{event.registrationCount} registered</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-gray-600">
                      {event.startDate.toLocaleDateString('en-ZA', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-gray-600">
                      {event.startDate.toLocaleTimeString()} - {event.endDate.toLocaleTimeString()} SAST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{event.venue.name}</p>
                    <p className="text-gray-600">{event.venue.address}</p>
                    <p className="text-gray-600">{event.venue.city}, {event.venue.province}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-6">Register for Event</h2>
            
            {event.ticketTypes.length > 0 && (
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">Select Ticket Type</Label>
                <div className="space-y-3">
                  {event.ticketTypes.map(ticket => (
                    <div 
                      key={ticket.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTicketType?.id === ticket.id 
                          ? 'border-sa-green bg-sa-green/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTicketType(ticket)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{ticket.name}</h3>
                        <p className="font-semibold text-lg">
                          {ticket.price === 0 ? 'FREE' : `R${ticket.price}`}
                        </p>
                      </div>
                      {ticket.description && (
                        <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {ticket.quantityAvailable} of {ticket.quantity} remaining
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTicketType && (
              <>
                <div className="mb-6">
                  <Label htmlFor="quantity" className="text-base font-medium mb-2 block">
                    Quantity
                  </Label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {[...Array(Math.min(5, selectedTicketType.quantityAvailable))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'ticket' : 'tickets'}
                      </option>
                    ))}
                  </select>
                </div>

                {user && (
                  <div className="mb-6 space-y-4">
                    <h3 className="font-medium">Attendee Information</h3>
                    
                    <div>
                      <Label htmlFor="attendeeName">Full Name *</Label>
                      <Input
                        id="attendeeName"
                        value={attendeeData.name}
                        onChange={(e) => setAttendeeData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="attendeeEmail">Email Address *</Label>
                      <Input
                        id="attendeeEmail"
                        type="email"
                        value={attendeeData.email}
                        onChange={(e) => setAttendeeData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="attendeePhone">Phone Number (SA format)</Label>
                      <Input
                        id="attendeePhone"
                        placeholder="+27821234567"
                        value={attendeeData.phoneNumber}
                        onChange={(e) => setAttendeeData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>R{selectedTicketType.price * quantity}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleRegister} 
                  disabled={registering || !selectedTicketType || selectedTicketType.quantityAvailable === 0}
                  className="w-full"
                >
                  {registering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {selectedTicketType.quantityAvailable === 0 
                    ? 'Sold Out' 
                    : registering 
                      ? 'Processing...' 
                      : selectedTicketType.price === 0 
                        ? 'Register for Free' 
                        : `Register - R${selectedTicketType.price * quantity}`
                  }
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}