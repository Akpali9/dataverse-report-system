import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatClient from '@/components/chat/ChatClient'

export default async function AdminChatPage() {
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
  
  if (!profile) {
    redirect('/auth/login')
  }
  
  if (!profile.is_admin) {
    redirect('/dashboard/student/chat')
  }
  
  const { data: contacts } = await supabase
    .from('users')
    .select('id, username, full_name, email, is_admin')
    .eq('is_admin', false)
    .order('full_name', { ascending: true })
  
  return (
    <ChatClient 
      currentUser={profile}
      contacts={contacts || []}
    />
  )
}
