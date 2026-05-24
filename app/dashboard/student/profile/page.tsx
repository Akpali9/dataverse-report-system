
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentProfileClient from './StudentProfileClient'

export default async function StudentProfilePage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile) {
    redirect('/dashboard')
  }
  
  return <StudentProfileClient profile={profile} />
}
