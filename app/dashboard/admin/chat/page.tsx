
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatClient from '@/components/chat/ChatClient'

export default async function AdminChatPage() {
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
  
  // Redirect non-admins to student chat
  if (!profile?.is_admin) {
    redirect('/dashboard/student/chat')
  }
  
  // Get all students for admin to chat with
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
