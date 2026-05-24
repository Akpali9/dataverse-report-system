'use server'

import { createClient } from '@/lib/supabase/server'

export async function getChatContacts(userId: string, isAdmin: boolean) {
  const supabase = await createClient()
  
  if (isAdmin) {
    const { data: students } = await supabase
      .from('users')
      .select('id, username, full_name, email, is_admin')
      .eq('is_admin', false)
      .order('full_name', { ascending: true })
    
    return students || []
  } else {
    const { data: admins } = await supabase
      .from('users')
      .select('id, username, full_name, email, is_admin')
      .eq('is_admin', true)
      .order('full_name', { ascending: true })
    
    return admins || []
  }
}

export async function getMessages(userId: string, otherUserId: string) {
  const supabase = await createClient()
  
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true })
  
  return messages || []
}
