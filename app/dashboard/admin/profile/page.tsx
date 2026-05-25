// app/dashboard/admin/profile/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminProfileForm from './AdminProfileForm'

export default async function AdminProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) redirect('/dashboard')
  
  return <AdminProfileForm profile={profile} />
}
