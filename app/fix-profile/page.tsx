// app/fix-profile/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function FixProfilePage() {
  const [status, setStatus] = useState('Checking...')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fixProfile() {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setStatus('Not logged in. Please login first.')
          return
        }
        
        setUser(user)
        setStatus('User found, checking profile...')
        
        // Check if profile exists
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setStatus(`Profile exists! Admin: ${profile.is_admin}`)
          return
        }
        
        setStatus('Profile missing, creating...')
        
        // Create profile
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            username: user.email?.split('@')[0] || 'user',
            full_name: user.user_metadata?.full_name || '',
            email: user.email,
            is_admin: user.email === 'admin@dataverse.com',
            created_at: new Date().toISOString(),
          })
        
        if (insertError) {
          setStatus(`Error: ${insertError.message}`)
        } else {
          setStatus('Profile created successfully! You can now use the app.')
        }
      } catch (error) {
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    fixProfile()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Profile Fix Tool</h1>
        {user && (
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        <div className={`p-4 rounded ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {status}
        </div>
        {status.includes('success') && (
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  )
}
