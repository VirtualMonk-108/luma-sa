'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from 'lucide-react'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'
import { db } from '@shared/lib/firebase'
import { useAuth } from '@/contexts/auth-context'
import type { Event, TicketType, Venue } from '@shared/types'

interface TicketTypeForm {
  name: string
  price: number
  quantity: number
  description: string
}

export default function CreateEventPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    capacity: 100,
    tags: '',
  })
  
  const [venue, setVenue] = useState<Partial<Venue>>({
    name: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  })
  
  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>([
    { name: 'General Admission', price: 0, quantity: 50, description: '' }
  ])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleVenueChange = (field: string, value: string) => {
    setVenue(prev => ({ ...prev, [field]: value }))
  }

  const addTicketType = () => {
    setTicketTypes(prev => [...prev, { name: '', price: 0, quantity: 0, description: '' }])
  }

  const removeTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateTicketType = (index: number, field: string, value: any) => {
    setTicketTypes(prev => prev.map((ticket, i) => 
      i === index ? { ...ticket, [field]: value } : ticket
    ))
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    
    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)
      
      // Generate slug
      const slug = generateSlug(formData.title)
      
      // Prepare ticket types
      const processedTicketTypes: TicketType[] = ticketTypes.map((ticket, index) => ({
        id: (index + 1).toString(),
        name: ticket.name,
        price: ticket.price,
        quantity: ticket.quantity,
        quantityAvailable: ticket.quantity,
        isActive: true,
        description: ticket.description
      }))

      // Create event object
      const eventData: Omit<Event, 'id'> = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        hostId: user.uid,
        hostName: user.email || 'Admin',
        category: formData.category,
        startDate: startDateTime,
        endDate: endDateTime,
        timezone: 'Africa/Johannesburg',
        venue: venue as Venue,
        capacity: formData.capacity,
        ticketTypes: processedTicketTypes,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPublished: true,
        isFeatured: false,
        registrationCount: 0,
        slug,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Save to Firestore with custom slug as ID
      await setDoc(doc(db, 'events', slug), eventData)
      
      console.log('Event created successfully!')
      router.push('/events')
      
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
                <p className="text-gray-600">Add a new event to the platform</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details about your event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder="Brief description for event cards"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed description of your event"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="food">Food & Drink</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="arts">Arts & Culture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="technology, networking, innovation"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle>Date & Time</CardTitle>
                <CardDescription>
                  When will your event take place?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                  Where will your event be held?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="venueName">Venue Name *</Label>
                  <Input
                    id="venueName"
                    value={venue.name}
                    onChange={(e) => handleVenueChange('name', e.target.value)}
                    placeholder="Sandton Convention Centre"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={venue.address}
                    onChange={(e) => handleVenueChange('address', e.target.value)}
                    placeholder="161 Maude Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={venue.city}
                      onChange={(e) => handleVenueChange('city', e.target.value)}
                      placeholder="Johannesburg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Select value={venue.province} onValueChange={(value) => handleVenueChange('province', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gauteng">Gauteng</SelectItem>
                        <SelectItem value="Western Cape">Western Cape</SelectItem>
                        <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                        <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                        <SelectItem value="Free State">Free State</SelectItem>
                        <SelectItem value="Limpopo">Limpopo</SelectItem>
                        <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                        <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                        <SelectItem value="North West">North West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={venue.postalCode}
                      onChange={(e) => handleVenueChange('postalCode', e.target.value)}
                      placeholder="2196"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Ticket Types
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTicketType}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Ticket Type
                  </Button>
                </CardTitle>
                <CardDescription>
                  Define the different types of tickets for your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticketTypes.map((ticket, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Ticket Type {index + 1}</h4>
                        {ticketTypes.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTicketType(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`ticketName${index}`}>Name *</Label>
                          <Input
                            id={`ticketName${index}`}
                            value={ticket.name}
                            onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                            placeholder="General Admission"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`ticketPrice${index}`}>Price (ZAR) *</Label>
                          <Input
                            id={`ticketPrice${index}`}
                            type="number"
                            value={ticket.price}
                            onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`ticketQuantity${index}`}>Quantity *</Label>
                          <Input
                            id={`ticketQuantity${index}`}
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => updateTicketType(index, 'quantity', parseInt(e.target.value) || 0)}
                            min="1"
                            placeholder="50"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor={`ticketDescription${index}`}>Description</Label>
                        <Input
                          id={`ticketDescription${index}`}
                          value={ticket.description}
                          onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                          placeholder="Brief description of this ticket type"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}