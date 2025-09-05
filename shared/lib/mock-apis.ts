import { WeatherInfo, LoadSheddingInfo, PaymentStatus } from '../types'

export class MockPayFastAPI {
  static async processPayment(
    amount: number, 
    orderId: string, 
    customerEmail: string,
    customerName: string
  ): Promise<{ 
    status: PaymentStatus; 
    transactionId: string;
    paymentUrl?: string;
    reference?: string;
  }> {
    console.log(`[MOCK PAYFAST] Processing payment: R${amount} for order ${orderId}`)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 90% success rate for mock
    const success = Math.random() > 0.1
    const transactionId = `PF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    if (success) {
      return {
        status: 'completed',
        transactionId,
        reference: `REF${Date.now()}`,
        paymentUrl: `https://mock-payfast.co.za/payment/${transactionId}`
      }
    } else {
      return {
        status: 'failed',
        transactionId,
        reference: `REF${Date.now()}`
      }
    }
  }

  static async verifyPayment(transactionId: string): Promise<{ verified: boolean; amount?: number }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log(`[MOCK PAYFAST] Verifying payment: ${transactionId}`)
    
    return {
      verified: true,
      amount: Math.floor(Math.random() * 1000) + 100
    }
  }
}

export class MockClickatellAPI {
  static async sendSMS(
    phoneNumber: string, 
    message: string,
    reference?: string
  ): Promise<{ 
    success: boolean; 
    messageId: string;
    cost?: number;
    status: string;
  }> {
    console.log(`[MOCK CLICKATELL] Sending SMS to ${phoneNumber}: ${message.substring(0, 50)}...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Validate South African phone number format
    const isValidSANumber = /^(\+27|0)[6-8][0-9]{8}$/.test(phoneNumber)
    
    if (!isValidSANumber) {
      return {
        success: false,
        messageId: '',
        status: 'invalid_number'
      }
    }
    
    const messageId = `CLK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      success: true,
      messageId,
      cost: 0.15, // ZAR
      status: 'delivered'
    }
  }

  static async getDeliveryStatus(messageId: string): Promise<{ status: string; timestamp?: Date }> {
    console.log(`[MOCK CLICKATELL] Checking delivery status for: ${messageId}`)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const statuses = ['delivered', 'pending', 'failed']
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    return {
      status,
      timestamp: new Date()
    }
  }
}

export class MockOpenWeatherAPI {
  static async getWeatherByCity(city: string): Promise<WeatherInfo> {
    console.log(`[MOCK WEATHER] Getting weather for: ${city}`)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // South African cities with realistic weather
    const cityWeather: Record<string, any> = {
      'johannesburg': { temp: [15, 28], conditions: ['sunny', 'partly-cloudy', 'thunderstorms'] },
      'cape town': { temp: [12, 25], conditions: ['sunny', 'windy', 'rainy'] },
      'durban': { temp: [18, 30], conditions: ['sunny', 'humid', 'rainy'] },
      'pretoria': { temp: [14, 27], conditions: ['sunny', 'partly-cloudy', 'thunderstorms'] },
      'port elizabeth': { temp: [16, 24], conditions: ['sunny', 'windy', 'cloudy'] }
    }
    
    const cityKey = city.toLowerCase()
    const cityData = cityWeather[cityKey] || { temp: [10, 35], conditions: ['sunny', 'cloudy'] }
    
    const temperature = Math.floor(Math.random() * (cityData.temp[1] - cityData.temp[0])) + cityData.temp[0]
    const condition = cityData.conditions[Math.floor(Math.random() * cityData.conditions.length)]
    
    let warning
    if (condition === 'thunderstorms') {
      warning = 'Severe thunderstorm warning in effect for Gauteng'
    } else if (condition === 'rainy' && temperature < 15) {
      warning = 'Cold front bringing heavy rain'
    }
    
    return {
      temperature,
      condition,
      icon: `weather-${condition}`,
      description: `${temperature}°C, ${condition}`,
      updatedAt: new Date(),
      warning
    }
  }

  static async get5DayForecast(city: string): Promise<WeatherInfo[]> {
    console.log(`[MOCK WEATHER] Getting 5-day forecast for: ${city}`)
    const forecast = []
    
    for (let i = 0; i < 5; i++) {
      const weather = await this.getWeatherByCity(city)
      forecast.push({
        ...weather,
        updatedAt: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
      })
    }
    
    return forecast
  }
}

export class MockEskomSePushAPI {
  static async getLoadSheddingStatus(area: string = 'johannesburg'): Promise<LoadSheddingInfo> {
    console.log(`[MOCK ESKOM] Getting load shedding status for: ${area}`)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Realistic load shedding simulation
    const currentHour = new Date().getHours()
    const isBusinessHours = currentHour >= 8 && currentHour <= 17
    
    // Higher chance of load shedding during peak hours
    const stageChances = isBusinessHours ? [0.3, 0.25, 0.2, 0.15, 0.1] : [0.5, 0.2, 0.15, 0.1, 0.05]
    let stage = 0
    
    const random = Math.random()
    let cumulative = 0
    
    for (let i = 0; i < stageChances.length; i++) {
      cumulative += stageChances[i]
      if (random > cumulative) {
        stage = i + 1
        break
      }
    }
    
    const isActive = stage > 0
    let schedule = []
    
    if (isActive) {
      // Generate realistic schedule
      const today = new Date().toISOString().split('T')[0]
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      schedule = [
        { startTime: '06:00', endTime: '08:30', date: today },
        { startTime: '16:00', endTime: '18:30', date: today },
        { startTime: '20:00', endTime: '22:30', date: today },
        { startTime: '04:00', endTime: '06:30', date: tomorrow },
        { startTime: '12:00', endTime: '14:30', date: tomorrow }
      ]
    }
    
    return {
      stage,
      isActive,
      schedule: schedule.slice(0, stage * 2), // More slots for higher stages
      updatedAt: new Date()
    }
  }

  static async getAreaInfo(area: string): Promise<{ area: string; region: string; municipality: string }> {
    console.log(`[MOCK ESKOM] Getting area info for: ${area}`)
    
    const areaData: Record<string, any> = {
      'johannesburg': { region: 'Gauteng', municipality: 'City of Johannesburg' },
      'cape town': { region: 'Western Cape', municipality: 'City of Cape Town' },
      'durban': { region: 'KwaZulu-Natal', municipality: 'eThekwini' },
      'pretoria': { region: 'Gauteng', municipality: 'City of Tshwane' }
    }
    
    const info = areaData[area.toLowerCase()] || { region: 'Unknown', municipality: 'Unknown' }
    
    return {
      area,
      ...info
    }
  }
}

export class MockSendGridAPI {
  static async sendEmail(
    to: string, 
    subject: string, 
    htmlContent: string,
    textContent?: string,
    templateId?: string
  ): Promise<{ 
    success: boolean; 
    messageId: string;
    status: string;
  }> {
    console.log(`[MOCK SENDGRID] Sending email to: ${to}, Subject: ${subject}`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Validate email format
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)
    
    if (!isValidEmail) {
      return {
        success: false,
        messageId: '',
        status: 'invalid_email'
      }
    }
    
    const messageId = `SG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      success: true,
      messageId,
      status: 'delivered'
    }
  }

  static async sendTemplateEmail(
    to: string,
    templateId: string,
    dynamicData: Record<string, any>
  ): Promise<{ success: boolean; messageId: string }> {
    console.log(`[MOCK SENDGRID] Sending template email: ${templateId} to ${to}`)
    console.log('Template data:', dynamicData)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return {
      success: true,
      messageId: `SG_TPL_${Date.now()}`
    }
  }
}

// API Service Router - determines whether to use mock or real APIs
export class APIService {
  static useMockAPIs = process.env.USE_MOCK_APIS === 'true'

  static get PayFast() {
    return this.useMockAPIs ? MockPayFastAPI : null // Real implementation would go here
  }

  static get Clickatell() {
    return this.useMockAPIs ? MockClickatellAPI : null
  }

  static get Weather() {
    return this.useMockAPIs ? MockOpenWeatherAPI : null
  }

  static get EskomSePush() {
    return this.useMockAPIs ? MockEskomSePushAPI : null
  }

  static get SendGrid() {
    return this.useMockAPIs ? MockSendGridAPI : null
  }
}