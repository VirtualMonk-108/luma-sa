'use client'

export function FirebaseDebug() {
  if (typeof window === 'undefined') {
    return null // Don't render on server
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded z-50">
      <div>API Key: {config.apiKey ? 'Set' : 'Missing'}</div>
      <div>Domain: {config.authDomain ? 'Set' : 'Missing'}</div>
      <div>Project: {config.projectId ? 'Set' : 'Missing'}</div>
    </div>
  )
}