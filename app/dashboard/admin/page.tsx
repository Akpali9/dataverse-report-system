// app/dashboard/admin/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    redirect('/dashboard')
  }
  
  // Fetch all students (non-admin users)
  const { data: students } = await supabase
    .from('users')
    .select('*')
    .eq('is_admin', false)
    .order('created_at', { ascending: false })
  
  // Fetch announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  
  return (
    <AdminDashboardClient 
      profile={profile}
      students={students || []}
      announcements={announcements || []}
    />
  )
}
