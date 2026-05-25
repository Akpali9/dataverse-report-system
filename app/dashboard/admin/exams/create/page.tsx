import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CreateExamForm from './CreateExamForm'

export default async function CreateExamPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) redirect('/dashboard')
  
  return <CreateExamForm adminId={user.id} />
}
