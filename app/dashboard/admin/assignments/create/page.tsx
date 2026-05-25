import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CreateAssignmentForm from './CreateAssignmentForm'

export default async function CreateAssignmentPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  // Check if admin
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) redirect('/dashboard')
  
  return <CreateAssignmentForm adminId={user.id} />
}
