'use client'

import { useState } from 'react'
import { DashboardNav } from '@/components/dashboard-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { APIService } from '@shared/lib/mock-apis'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function APIDemoPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  
  const [paymentAmount, setPaymentAmount] = useState('299.99')
  const [smsPhone, setSmsPhone] = useState('+27821234567')
  const [smsMessage, setSmsMessage] = useState('Hello from Luma SA!')
  const [weatherCity, setWeatherCity] = useState('johannesburg')
  const [email, setEmail] = useState('user@example.com')

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }))
    try {
      const result = await testFn()
      setResults(prev => ({ ...prev, [testName]: { success: true, data: result } }))
    } catch (error) {
      setResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }))
    }
    setLoading(prev => ({ ...prev, [testName]: false }))
  }

  const TestResult = ({ testName }: { testName: string }) => {
    const result = results[testName]
    const isLoading = loading[testName]

    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }

    if (!result) return null

    return (
      <div className="mt-2">
        {result.success ? (
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <pre className="text-xs bg-green-50 p-2 rounded text-green-700 overflow-auto max-h-32">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="flex items-start space-x-2">
            <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {result.error}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">API Demo</h1>
            <p className="text-gray-600">Test the South African API integrations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PayFast Payment Demo */}
            <Card>
              <CardHeader>
                <CardTitle>PayFast Payment</CardTitle>
                <CardDescription>Test payment processing with South African provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (ZAR)</Label>
                  <Input
                    id="amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="299.99"
                  />
                </div>
                <Button 
                  onClick={() => runTest('payfast', async () => {
                    return await APIService.PayFast?.processPayment(
                      parseFloat(paymentAmount),
                      `ORDER_${Date.now()}`,
                      'customer@example.com',
                      'John Doe'
                    )
                  })}
                  disabled={loading.payfast}
                  className="w-full"
                >
                  {loading.payfast && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Process Payment
                </Button>
                <TestResult testName="payfast" />
              </CardContent>
            </Card>

            {/* Clickatell SMS Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Clickatell SMS</CardTitle>
                <CardDescription>Send SMS to South African numbers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    placeholder="+27821234567"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="Hello from Luma SA!"
                  />
                </div>
                <Button 
                  onClick={() => runTest('sms', async () => {
                    return await APIService.Clickatell?.sendSMS(smsPhone, smsMessage)
                  })}
                  disabled={loading.sms}
                  className="w-full"
                >
                  {loading.sms && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send SMS
                </Button>
                <TestResult testName="sms" />
              </CardContent>
            </Card>

            {/* Weather API Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Weather API</CardTitle>
                <CardDescription>Get weather for South African cities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={weatherCity}
                    onChange={(e) => setWeatherCity(e.target.value)}
                  >
                    <option value="johannesburg">Johannesburg</option>
                    <option value="cape town">Cape Town</option>
                    <option value="durban">Durban</option>
                    <option value="pretoria">Pretoria</option>
                    <option value="port elizabeth">Port Elizabeth</option>
                  </select>
                </div>
                <Button 
                  onClick={() => runTest('weather', async () => {
                    return await APIService.Weather?.getWeatherByCity(weatherCity)
                  })}
                  disabled={loading.weather}
                  className="w-full"
                >
                  {loading.weather && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Weather
                </Button>
                <TestResult testName="weather" />
              </CardContent>
            </Card>

            {/* EskomSePush Demo */}
            <Card>
              <CardHeader>
                <CardTitle>EskomSePush (Load Shedding)</CardTitle>
                <CardDescription>Check load shedding status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => runTest('eskom', async () => {
                    return await APIService.EskomSePush?.getLoadSheddingStatus('johannesburg')
                  })}
                  disabled={loading.eskom}
                  className="w-full"
                >
                  {loading.eskom && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Check Load Shedding
                </Button>
                <TestResult testName="eskom" />
              </CardContent>
            </Card>

            {/* SendGrid Email Demo */}
            <Card>
              <CardHeader>
                <CardTitle>SendGrid Email</CardTitle>
                <CardDescription>Send confirmation emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
                <Button 
                  onClick={() => runTest('email', async () => {
                    return await APIService.SendGrid?.sendEmail(
                      email,
                      'Event Registration Confirmation',
                      '<h1>Welcome to Luma SA!</h1><p>Your registration was successful.</p>'
                    )
                  })}
                  disabled={loading.email}
                  className="w-full"
                >
                  {loading.email && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Email
                </Button>
                <TestResult testName="email" />
              </CardContent>
            </Card>

            {/* Area Info Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Area Information</CardTitle>
                <CardDescription>Get South African area details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => runTest('area', async () => {
                    return await APIService.EskomSePush?.getAreaInfo(weatherCity)
                  })}
                  disabled={loading.area}
                  className="w-full"
                >
                  {loading.area && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Area Info
                </Button>
                <TestResult testName="area" />
              </CardContent>
            </Card>
          </div>

          {/* Mock APIs Notice */}
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">🧪 Mock APIs Active</CardTitle>
              <CardDescription className="text-blue-600">
                All APIs are currently running in mock mode. Set USE_MOCK_APIS=false in .env.local to use real APIs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-700">
                <p className="mb-2"><strong>Mock Features:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>PayFast: 90% success rate with realistic transaction IDs</li>
                  <li>Clickatell: SA phone number validation (+27 format)</li>
                  <li>Weather: City-specific realistic weather data</li>
                  <li>EskomSePush: Time-based load shedding simulation</li>
                  <li>SendGrid: Email format validation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}