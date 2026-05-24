// app/dashboard/student/chat/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentChatClient from './StudentChatClient'

export default async function StudentChatPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // Check if user is student (not admin)
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  // If admin, redirect to admin chat
  if (profile?.is_admin) {
    redirect('/dashboard/admin/chat')
  }
  
  // Get all admins for student to chat with
  const { data: admins } = await supabase
    .from('users')
    .select('id, username, full_name, email')
    .eq('is_admin', true)
  
  // Get previous conversations
  const { data: conversations } = await supabase
    .from('chat_messages')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
  
  return (
    <StudentChatClient 
      currentUserId={user.id}
      admins={admins || []}
      initialConversations={conversations || []}
    />
  )
}
