import { createClient as createBrowserClient } from '@/lib/supabase/client'

// Client-side only functions
export async function sendMessage(senderId: string, receiverId: string, message: string) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
      is_read: false,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function markMessagesAsRead(userId: string, otherUserId: string) {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('sender_id', otherUserId)
    .eq('receiver_id', userId)
    .eq('is_read', false)
  
  if (error) throw error
}

export async function getUnreadCount(userId: string) {
  const supabase = createBrowserClient()
  
  const { count } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false)
  
  return count || 0
}

export function subscribeToMessages(
  userId: string, 
  onNewMessage: (message: any) => void
) {
  const supabase = createBrowserClient()
  
  return supabase
    .channel('chat-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => {
        onNewMessage(payload.new)
      }
    )
    .subscribe()
}
