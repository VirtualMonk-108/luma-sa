'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { MapPin, Search, User, Menu, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { AuthModal } from './auth/auth-modal'

function UserMenu() {
  const { user, userProfile, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (!user) {
    return (
      <>
        <Button onClick={() => setShowAuthModal(true)}>
          Sign In
        </Button>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-sa-green to-sa-gold rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {userProfile?.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block text-sm font-medium">
          {userProfile?.displayName || 'User'}
        </span>
      </button>

      {showUserMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{userProfile?.displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setShowUserMenu(false)}
          >
            My Profile
          </Link>
          <Link
            href="/my-events"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setShowUserMenu(false)}
          >
            My Events
          </Link>
          <button
            onClick={() => {
              signOut()
              setShowUserMenu(false)
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sa-green to-sa-gold rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-sa-green">Luma SA</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, locations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Location Selector - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Johannesburg</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/events" className="text-gray-600 hover:text-sa-green">
              Browse Events
            </Link>
            <Link href="/create-event" className="text-gray-600 hover:text-sa-green">
              Create Event
            </Link>
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Search - Visible on mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              <Link href="/events" className="text-gray-600 hover:text-sa-green py-2">
                Browse Events
              </Link>
              <Link href="/create-event" className="text-gray-600 hover:text-sa-green py-2">
                Create Event
              </Link>
              <div className="flex items-center space-x-2 py-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Johannesburg</span>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" className="flex-1">
                  Sign In
                </Button>
                <Button className="flex-1">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}