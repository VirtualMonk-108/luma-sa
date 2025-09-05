'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, MapPin, Users, Clock, DollarSign, Tag, Image, Save } from 'lucide-react'

export default function CreateEventPage() {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'business',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venue: {
      name: '',
      address: '',
      city: 'johannesburg',
      province: 'gauteng',
      postalCode: ''
    },
    capacity: '',
    ticketTypes: [
      {
        name: 'General Admission',
        price: '',
        quantity: '',
        description: ''
      }
    ],
    tags: '',
    coverImage: null as File | null
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Event created successfully! (This is a demo - no actual event was created)')
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVenueChange = (field: string, value: string) => {
    setEventData(prev => ({
      ...prev,
      venue: {
        ...prev.venue,
        [field]: value
      }
    }))
  }

  const handleTicketChange = (index: number, field: string, value: string) => {
    setEventData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    }))
  }

  const addTicketType = () => {
    setEventData(prev => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        {
          name: '',
          price: '',
          quantity: '',
          description: ''
        }
      ]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Event</h1>
          <p className="text-xl text-gray-600">
            Share your event with the South African community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Tag className="mr-2 h-6 w-6 text-sa-green" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={eventData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Tech Innovation Summit 2024"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Input
                  id="shortDescription"
                  value={eventData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Brief one-line description for search results"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description">Full Description *</Label>
                <textarea
                  id="description"
                  value={eventData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of your event..."
                  className="w-full px-3 py-2 border rounded-md h-32"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={eventData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="food">Food & Drink</option>
                  <option value="health">Health & Wellness</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="arts">Arts & Culture</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={eventData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="tech, innovation, networking (comma separated)"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Clock className="mr-2 h-6 w-6 text-sa-green" />
              Date & Time
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={eventData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={eventData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={eventData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={eventData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Timezone:</strong> All times are in South African Standard Time (SAST)
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <MapPin className="mr-2 h-6 w-6 text-sa-green" />
              Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="venueName">Venue Name *</Label>
                <Input
                  id="venueName"
                  value={eventData.venue.name}
                  onChange={(e) => handleVenueChange('name', e.target.value)}
                  placeholder="e.g. Sandton Convention Centre"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={eventData.venue.address}
                  onChange={(e) => handleVenueChange('address', e.target.value)}
                  placeholder="e.g. 161 Maude Street"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="city">City *</Label>
                <select
                  id="city"
                  value={eventData.venue.city}
                  onChange={(e) => handleVenueChange('city', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="johannesburg">Johannesburg</option>
                  <option value="cape town">Cape Town</option>
                  <option value="durban">Durban</option>
                  <option value="pretoria">Pretoria</option>
                  <option value="port elizabeth">Port Elizabeth</option>
                  <option value="bloemfontein">Bloemfontein</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="province">Province *</Label>
                <select
                  id="province"
                  value={eventData.venue.province}
                  onChange={(e) => handleVenueChange('province', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="gauteng">Gauteng</option>
                  <option value="western cape">Western Cape</option>
                  <option value="kwazulu-natal">KwaZulu-Natal</option>
                  <option value="eastern cape">Eastern Cape</option>
                  <option value="free state">Free State</option>
                  <option value="limpopo">Limpopo</option>
                  <option value="mpumalanga">Mpumalanga</option>
                  <option value="north west">North West</option>
                  <option value="northern cape">Northern Cape</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={eventData.venue.postalCode}
                  onChange={(e) => handleVenueChange('postalCode', e.target.value)}
                  placeholder="e.g. 2196"
                />
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <DollarSign className="mr-2 h-6 w-6 text-sa-green" />
              Tickets & Pricing
            </h2>
            
            <div>
              <Label htmlFor="capacity">Event Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={eventData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="e.g. 500"
              />
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Ticket Types</h3>
              {eventData.ticketTypes.map((ticket, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Ticket Name *</Label>
                      <Input
                        value={ticket.name}
                        onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                        placeholder="e.g. Early Bird, VIP, General"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>Price (ZAR) *</Label>
                      <Input
                        type="number"
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                        placeholder="0 for free events"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>Quantity Available</Label>
                      <Input
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                        placeholder="Leave blank for unlimited"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={ticket.description}
                        onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                        placeholder="Optional ticket description"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button type="button" variant="outline" onClick={addTicketType}>
                Add Another Ticket Type
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>By creating this event, you agree to our terms and conditions.</p>
                <p>Your event will be reviewed before being published.</p>
              </div>
              
              <div className="flex gap-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Save className="mr-2 h-4 w-4 animate-spin" />}
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}