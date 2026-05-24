
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentDashboardClient from '@/components/student/dashboard-client'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // Redirect if admin (shouldn't be here)
  if (profile?.is_admin) {
    redirect('/dashboard/admin')
  }
  
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .order('due_date', { ascending: true })
  
  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false })
  
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*, users(full_name)')
    .order('created_at', { ascending: false })
    .limit(5)
  
  return (
    <StudentDashboardClient
      profile={profile}
      assignments={assignments || []}
      exams={exams || []}
      announcements={announcements || []}
    />
  )
}
