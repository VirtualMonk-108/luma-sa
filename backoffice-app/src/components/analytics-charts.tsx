'use client'

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const registrationData = [
  { name: 'Jan', registrations: 120, revenue: 45000 },
  { name: 'Feb', registrations: 190, revenue: 67000 },
  { name: 'Mar', registrations: 300, revenue: 89000 },
  { name: 'Apr', registrations: 280, revenue: 95000 },
  { name: 'May', registrations: 450, revenue: 125000 },
  { name: 'Jun', registrations: 380, revenue: 115000 },
  { name: 'Jul', registrations: 520, revenue: 140000 },
]

const categoryData = [
  { name: 'Technology', value: 35, color: '#3B82F6' },
  { name: 'Business', value: 25, color: '#10B981' },
  { name: 'Food & Drink', value: 20, color: '#F59E0B' },
  { name: 'Health', value: 12, color: '#EF4444' },
  { name: 'Music', value: 8, color: '#8B5CF6' },
]

const locationData = [
  { city: 'Johannesburg', events: 145 },
  { city: 'Cape Town', events: 98 },
  { city: 'Durban', events: 67 },
  { city: 'Pretoria', events: 43 },
  { city: 'Port Elizabeth', events: 28 },
]

export function RegistrationsChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={registrationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="registrations" 
            stroke="#22c55e" 
            fill="#22c55e" 
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RevenueChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={registrationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`R${value.toLocaleString()}`, 'Revenue']} />
          <Bar dataKey="revenue" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CategoryChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LocationChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={locationData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="city" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="events" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}