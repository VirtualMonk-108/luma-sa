// Script to initialize Firestore with sample data
// Run with: node scripts/init-firestore.js

const { initializeApp } = require('firebase/app')
const { getFirestore, collection, doc, setDoc, Timestamp } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyDMeKHXX5UxZ3B5hrZzmu83uDkVvrAcMLk",
  authDomain: "vibecodepoc.firebaseapp.com",
  projectId: "vibecodepoc",
  storageBucket: "vibecodepoc.firebasestorage.app",
  messagingSenderId: "672659810845",
  appId: "1:672659810845:web:1eac070c8f92f28d8eb4f4"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleEvents = [
  {
    id: 'tech-summit-2024',
    title: 'Tech Innovation Summit 2024',
    description: 'Join leading tech innovators and entrepreneurs for a day of networking, learning, and inspiration. Featuring keynote speakers from major SA tech companies, startup pitch sessions, and hands-on workshops.',
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
      },
      {
        id: '2',
        name: 'Regular',
        price: 650,
        quantity: 300,
        quantityAvailable: 287,
        isActive: true
      }
    ],
    tags: ['tech', 'innovation', 'networking', 'startups'],
    isPublished: true,
    isFeatured: true,
    registrationCount: 123,
    slug: 'tech-innovation-summit-2024',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cape-town-food-fest',
    title: 'Cape Town Food & Wine Festival',
    description: 'Celebrate the best of South African cuisine and wine with renowned chefs and winemakers. Experience tastings, cooking demonstrations, and cultural performances.',
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
        id: '3',
        name: 'Weekend Pass',
        price: 850,
        quantity: 500,
        quantityAvailable: 287,
        isActive: true
      },
      {
        id: '4',
        name: 'VIP Experience',
        price: 1500,
        quantity: 50,
        quantityAvailable: 12,
        isActive: true
      }
    ],
    tags: ['food', 'wine', 'festival', 'culture'],
    isPublished: true,
    isFeatured: true,
    registrationCount: 567,
    slug: 'cape-town-food-wine-festival',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'durban-yoga-retreat',
    title: 'Durban Beach Yoga Retreat',
    description: 'Start your weekend with a peaceful yoga session on Durban\'s beautiful beaches. Suitable for all levels, led by certified instructors.',
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
        id: '5',
        name: 'Single Session',
        price: 0,
        quantity: 50,
        quantityAvailable: 12,
        isActive: true
      }
    ],
    tags: ['yoga', 'wellness', 'beach', 'health'],
    isPublished: true,
    isFeatured: false,
    registrationCount: 38,
    slug: 'durban-beach-yoga-retreat',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const sampleUsers = [
  {
    uid: 'user1',
    email: 'john.doe@example.com',
    displayName: 'John Doe',
    phoneNumber: '+27821234567',
    bio: 'Event enthusiast from Johannesburg. Love tech conferences and networking events.',
    location: { city: 'Johannesburg', province: 'Gauteng' },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      website: 'https://johndoe.dev'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    isVerified: true
  },
  {
    uid: 'user2', 
    email: 'sarah.smith@example.com',
    displayName: 'Sarah Smith',
    phoneNumber: '+27837654321',
    bio: 'Food blogger and wine enthusiast. Always looking for the next great culinary experience.',
    location: { city: 'Cape Town', province: 'Western Cape' },
    socialLinks: {
      website: 'https://sarahsfoodblog.co.za'
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date(),
    isVerified: true
  },
  {
    uid: 'user3',
    email: 'mike.johnson@example.com', 
    displayName: 'Mike Johnson',
    phoneNumber: '+27843456789',
    bio: 'Wellness coach and yoga instructor. Passionate about mindfulness and healthy living.',
    location: { city: 'Durban', province: 'KwaZulu-Natal' },
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date(),
    isVerified: false
  }
]

const sampleRegistrations = [
  {
    id: 'reg1',
    eventId: 'tech-summit-2024',
    userId: 'user1',
    ticketTypeId: '1',
    quantity: 1,
    totalAmount: 450,
    status: 'confirmed',
    paymentId: 'pay1',
    attendeeInfo: [{
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+27821234567'
    }],
    createdAt: new Date(),
    checkedInAt: null
  },
  {
    id: 'reg2',
    eventId: 'cape-town-food-fest',
    userId: 'user2',
    ticketTypeId: '3',
    quantity: 2,
    totalAmount: 1700,
    status: 'confirmed',
    paymentId: 'pay2',
    attendeeInfo: [
      {
        name: 'Sarah Smith',
        email: 'sarah.smith@example.com'
      },
      {
        name: 'Alex Smith',
        email: 'alex.smith@example.com'
      }
    ],
    createdAt: new Date()
  }
]

const samplePayments = [
  {
    id: 'pay1',
    registrationId: 'reg1',
    userId: 'user1',
    amount: 450,
    currency: 'ZAR',
    provider: 'payfast',
    status: 'completed',
    providerTransactionId: 'PF_1234567890',
    createdAt: new Date('2024-12-01T10:30:00'),
    completedAt: new Date('2024-12-01T10:31:00')
  },
  {
    id: 'pay2',
    registrationId: 'reg2',
    userId: 'user2',
    amount: 1700,
    currency: 'ZAR',
    provider: 'payfast',
    status: 'completed',
    providerTransactionId: 'PF_1234567891',
    createdAt: new Date('2024-12-01T14:15:00'),
    completedAt: new Date('2024-12-01T14:16:00')
  }
]

async function initializeFirestore() {
  try {
    console.log('🚀 Initializing Firestore with sample data...')

    // Add events
    console.log('📅 Adding sample events...')
    for (const event of sampleEvents) {
      await setDoc(doc(db, 'events', event.id), {
        ...event,
        startDate: Timestamp.fromDate(event.startDate),
        endDate: Timestamp.fromDate(event.endDate),
        createdAt: Timestamp.fromDate(event.createdAt),
        updatedAt: Timestamp.fromDate(event.updatedAt)
      })
    }

    // Add users
    console.log('👥 Adding sample users...')
    for (const user of sampleUsers) {
      await setDoc(doc(db, 'users', user.uid), {
        ...user,
        createdAt: Timestamp.fromDate(user.createdAt),
        updatedAt: Timestamp.fromDate(user.updatedAt)
      })
    }

    // Add registrations
    console.log('🎫 Adding sample registrations...')
    for (const registration of sampleRegistrations) {
      await setDoc(doc(db, 'registrations', registration.id), {
        ...registration,
        createdAt: Timestamp.fromDate(registration.createdAt)
      })
    }

    // Add payments
    console.log('💳 Adding sample payments...')
    for (const payment of samplePayments) {
      await setDoc(doc(db, 'payments', payment.id), {
        ...payment,
        createdAt: Timestamp.fromDate(payment.createdAt),
        completedAt: payment.completedAt ? Timestamp.fromDate(payment.completedAt) : null
      })
    }

    console.log('✅ Firestore initialization complete!')
    console.log('\n📊 Sample data added:')
    console.log(`   - ${sampleEvents.length} events`)
    console.log(`   - ${sampleUsers.length} users`)
    console.log(`   - ${sampleRegistrations.length} registrations`)
    console.log(`   - ${samplePayments.length} payments`)
    console.log('\n🌐 You can now view this data in:')
    console.log('   - User App: http://localhost:3000/events')
    console.log('   - Backoffice: http://localhost:3001 (all tabs should work)')
    
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error)
  }
}

// Run the initialization
initializeFirestore().then(() => {
  console.log('\n🎉 Ready to go! Both apps should now show real-time data.')
  process.exit(0)
})