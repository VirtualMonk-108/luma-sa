export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  phoneNumber?: string
  bio?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
  location?: {
    city: string
    province: string
  }
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
}

export interface Event {
  id: string
  title: string
  description: string
  shortDescription: string
  coverImage?: string
  hostId: string
  hostName: string
  category: EventCategory
  startDate: Date
  endDate: Date
  timezone: string
  venue: Venue
  capacity?: number
  ticketTypes: TicketType[]
  tags: string[]
  isPublished: boolean
  isFeatured: boolean
  registrationCount: number
  slug: string
  weather?: WeatherInfo
  loadShedding?: LoadSheddingInfo
  createdAt: Date
  updatedAt: Date
}

export interface Venue {
  id?: string
  name: string
  address: string
  city: string
  province: string
  postalCode: string
  coordinates?: {
    lat: number
    lng: number
  }
  capacity?: number
  amenities?: string[]
  hasBackupPower?: boolean
}

export interface TicketType {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  quantityAvailable: number
  saleStartDate?: Date
  saleEndDate?: Date
  isActive: boolean
}

export interface Registration {
  id: string
  eventId: string
  userId: string
  ticketTypeId: string
  quantity: number
  totalAmount: number
  status: RegistrationStatus
  paymentId?: string
  attendeeInfo: AttendeeInfo[]
  customAnswers?: Record<string, any>
  createdAt: Date
  checkedInAt?: Date
}

export interface AttendeeInfo {
  name: string
  email: string
  phoneNumber?: string
}

export interface WeatherInfo {
  temperature: number
  condition: string
  icon: string
  description: string
  updatedAt: Date
  warning?: string
}

export interface LoadSheddingInfo {
  stage: number
  isActive: boolean
  schedule?: LoadSheddingSchedule[]
  updatedAt: Date
}

export interface LoadSheddingSchedule {
  startTime: string
  endTime: string
  date: string
}

export type EventCategory = 
  | 'conference'
  | 'workshop'
  | 'networking'
  | 'social'
  | 'sports'
  | 'music'
  | 'food'
  | 'business'
  | 'education'
  | 'health'
  | 'technology'
  | 'arts'
  | 'charity'
  | 'other'

export type RegistrationStatus = 
  | 'pending'
  | 'confirmed' 
  | 'cancelled'
  | 'refunded'
  | 'checked_in'

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'

export interface Payment {
  id: string
  registrationId: string
  userId: string
  amount: number
  currency: string
  provider: PaymentProvider
  status: PaymentStatus
  providerTransactionId?: string
  createdAt: Date
  completedAt?: Date
}

export type PaymentProvider = 'payfast' | 'paystack' | 'manual'

export interface Analytics {
  eventId?: string
  period: AnalyticsPeriod
  data: AnalyticsData
}

export interface AnalyticsData {
  totalEvents: number
  totalUsers: number
  totalRevenue: number
  totalRegistrations: number
  popularCategories: Array<{
    category: EventCategory
    count: number
  }>
  registrationsByDay: Array<{
    date: string
    count: number
  }>
  revenueByDay: Array<{
    date: string
    amount: number
  }>
}

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '1y'