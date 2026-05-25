// app/dashboard/student/chat/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatClient from '@/components/chat/ChatClient'

export default async function StudentChatPage() {
  const supabase = await createClient()
  
  // Check authentication - with error handling
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) {
    console.error('Auth error:', userError)
    redirect('/auth/login?error=auth_error')
  }
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profileError || !profile) {
    console.error('Profile error:', profileError)
    redirect('/auth/login?error=profile_not_found')
  }
  
  // If admin, redirect to admin chat
  if (profile.is_admin === true) {
    redirect('/dashboard/admin/chat')
  }
  
  // Get teachers/admins for student to chat with
  const { data: contacts } = await supabase
    .from('users')
    .select('id, username, full_name, email, is_admin')
    .eq('is_admin', true)
    .order('full_name', { ascending: true })
  
  // Pass profile safely (it's guaranteed to exist here)
  return (
    <ChatClient 
      currentUser={profile}
      contacts={contacts || []}
    />
  )
}
