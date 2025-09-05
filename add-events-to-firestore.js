// Script to add mock events to Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, setDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDMeKHXX5UxZ3B5hrZzmu83uDkVvrAcMLk",
  authDomain: "vibecodepoc.firebaseapp.com",
  projectId: "vibecodepoc",
  storageBucket: "vibecodepoc.firebasestorage.app",
  messagingSenderId: "672659810845",
  appId: "1:672659810845:web:1eac070c8f92f28d8eb4f4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mockEvents = [
  {
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
  },
  {
    id: 'cape-town-food-fest',
    title: 'Cape Town Food & Wine Festival',
    description: 'Celebrate the best of South African cuisine and wine with renowned chefs and winemakers. Experience tastings, cooking demonstrations, and exclusive dinners.',
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
        isActive: true,
        description: 'Full weekend access'
      },
      {
        id: '3',
        name: 'VIP Experience',
        price: 1500,
        quantity: 100,
        quantityAvailable: 67,
        isActive: true,
        description: 'Premium access with chef meet & greets'
      }
    ],
    tags: ['food', 'wine', 'festival', 'chefs'],
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
    id: 'durban-beach-yoga',
    title: 'Durban Beach Yoga Retreat',
    description: 'Start your weekend with a peaceful yoga session on Durban\'s beautiful beaches. Suitable for all levels.',
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
        isActive: true,
        description: 'Free beach yoga session'
      }
    ],
    tags: ['yoga', 'wellness', 'beach', 'free'],
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
];

async function addEventsToFirestore() {
  console.log('Adding events to Firestore...');
  
  try {
    for (const event of mockEvents) {
      // Use setDoc with the event ID to ensure consistent IDs across apps
      await setDoc(doc(db, 'events', event.id), event);
      console.log(`✅ Added event: ${event.title}`);
    }
    
    console.log('🎉 All events added successfully!');
    console.log('Both user app and backoffice should now show the same events.');
    
  } catch (error) {
    console.error('❌ Error adding events:', error);
  }
}

addEventsToFirestore();