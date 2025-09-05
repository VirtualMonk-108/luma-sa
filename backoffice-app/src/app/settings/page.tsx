'use client'

import { DashboardNav } from '@/components/dashboard-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Settings, Key, Globe, Bell, Shield, Database, Zap } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage platform configuration and API settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Manage South African service integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="payfast">PayFast API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="payfast" placeholder="merchant_key_here" type="password" />
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="clickatell">Clickatell API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="clickatell" placeholder="clickatell_api_key" type="password" />
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="weather">OpenWeather API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="weather" placeholder="weather_api_key" type="password" />
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="eskom">EskomSePush API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="eskom" placeholder="eskom_api_key" type="password" />
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
                
                <Button>Save API Settings</Button>
              </CardContent>
            </Card>

            {/* Platform Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Platform Settings
                </CardTitle>
                <CardDescription>
                  General platform configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="Luma SA" />
                </div>
                
                <div>
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" defaultValue="support@lumasa.co.za" />
                </div>
                
                <div>
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="ZAR">ZAR (South African Rand)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                  </select>
                </div>
                
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            {/* Feature Flags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Feature Flags
                </CardTitle>
                <CardDescription>
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mock APIs</Label>
                    <p className="text-sm text-gray-500">Use mock services for development</p>
                  </div>
                  <Badge className="bg-green-500">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weather Integration</Label>
                    <p className="text-sm text-gray-500">Show weather info on events</p>
                  </div>
                  <Badge className="bg-green-500">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Load Shedding Alerts</Label>
                    <p className="text-sm text-gray-500">Display load shedding warnings</p>
                  </div>
                  <Badge className="bg-green-500">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Send SMS confirmations</p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                
                <Button>Update Features</Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Security & Access
                </CardTitle>
                <CardDescription>
                  Manage security and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                  </div>
                  <Badge variant="outline">Optional</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-gray-500">Auto logout after inactivity</p>
                  </div>
                  <span className="text-sm">24 hours</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Admin IP Whitelist</Label>
                    <p className="text-sm text-gray-500">Restrict admin access by IP</p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                
                <Button>Security Settings</Button>
              </CardContent>
            </Card>

            {/* Database Status */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription>
                  Current status of platform services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Firebase Database</div>
                      <div className="text-sm text-gray-500">vibecodepoc</div>
                    </div>
                    <Badge className="bg-green-500">Connected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Authentication</div>
                      <div className="text-sm text-gray-500">Firebase Auth</div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">File Storage</div>
                      <div className="text-sm text-gray-500">Firebase Storage</div>
                    </div>
                    <Badge className="bg-green-500">Available</Badge>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">🇿🇦 South African Services Status</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>PayFast API</span>
                      <Badge variant="secondary">Mock Mode</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Clickatell SMS</span>
                      <Badge variant="secondary">Mock Mode</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Weather API</span>
                      <Badge variant="secondary">Mock Mode</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>EskomSePush</span>
                      <Badge variant="secondary">Mock Mode</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}