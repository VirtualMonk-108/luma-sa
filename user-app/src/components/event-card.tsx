import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users, Cloud, Zap } from 'lucide-react'
import { format } from 'date-fns'
import type { Event } from '@shared/types'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (date: Date) => {
    return format(date, 'EEE, MMM d • h:mm a')
  }

  const getWeatherColor = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'text-yellow-500'
      case 'cloudy': return 'text-gray-500'
      case 'rainy': return 'text-blue-500'
      case 'thunderstorms': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getLoadSheddingColor = (stage: number) => {
    if (stage === 0) return 'text-green-500'
    if (stage <= 2) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <Link href={`/events/${event.id || event.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* Event Image */}
        <div className="relative h-48 bg-gray-200">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sa-green/20 to-sa-gold/20 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          
          {/* Weather & Load Shedding Indicators */}
          <div className="absolute top-2 right-2 flex space-x-1">
            {event.weather && (
              <div className={`bg-white/90 rounded-full p-1 ${getWeatherColor(event.weather.condition)}`}>
                <Cloud className="h-4 w-4" />
              </div>
            )}
            {event.loadShedding && event.loadShedding.isActive && (
              <div className={`bg-white/90 rounded-full p-1 ${getLoadSheddingColor(event.loadShedding.stage)}`}>
                <Zap className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.shortDescription}</p>
          
          {/* Date */}
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.venue.name}, {event.venue.city}</span>
          </div>
          
          {/* Registration Count */}
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <Users className="h-4 w-4 mr-2" />
            <span>{event.registrationCount} registered</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              {event.ticketTypes.length > 0 ? (
                <span className="text-lg font-semibold text-sa-green">
                  {event.ticketTypes[0].price === 0 
                    ? 'Free' 
                    : `R${event.ticketTypes[0].price.toFixed(2)}`
                  }
                </span>
              ) : (
                <span className="text-gray-500">No tickets</span>
              )}
            </div>
            
            {/* Category Badge */}
            <span className="bg-sa-green/10 text-sa-green text-xs px-2 py-1 rounded-full capitalize">
              {event.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}