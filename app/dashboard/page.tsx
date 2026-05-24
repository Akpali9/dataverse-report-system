import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // Check user role
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  // Redirect to appropriate dashboard
  if (profile?.is_admin) {
    redirect('/dashboard/admin')
  } else {
    redirect('/dashboard/student')
  }
}
