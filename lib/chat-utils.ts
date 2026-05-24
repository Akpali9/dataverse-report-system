'use client'

import { createClient } from '@/lib/supabase/client'

export interface User {
  id: string
  username: string
  full_name: string
  email: string
  is_admin: boolean
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  is_read: boolean
  created_at: string
}

// Get messages between two users
export async function getMessages(userId: string, otherUserId: string): Promise<Message[]> {
  const supabase = createClient()
  
  const { data: messages, error } = await supabase
    .from('chat_messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }
  
  return messages || []
}

// Send a message
export async function sendMessage(senderId: string, receiverId: string, message: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
      is_read: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Mark messages as read
export async function markMessagesAsRead(userId: string, otherUserId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('sender_id', otherUserId)
    .eq('receiver_id', userId)
    .eq('is_read', false)
  
  if (error) throw error
}

// Get unread message count for a user
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient()
  
  const { count, error } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false)
  
  if (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
  
  return count || 0
}

// Subscribe to new messages (real-time)
export function subscribeToMessages(
  userId: string, 
  onNewMessage: (message: Message) => void
) {
  const supabase = createClient()
  
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
        onNewMessage(payload.new as Message)
      }
    )
    .subscribe()
}

// Get all contacts for a user (who they can chat with)
export async function getChatContacts(userId: string, isAdmin: boolean): Promise<User[]> {
  const supabase = createClient()
  
  if (isAdmin) {
    // Admin sees all students
    const { data: students } = await supabase
      .from('users')
      .select('id, username, full_name, email, is_admin')
      .eq('is_admin', false)
      .order('full_name', { ascending: true })
    
    return students || []
  } else {
    // Student sees all admins/teachers
    const { data: admins } = await supabase
      .from('users')
      .select('id, username, full_name, email, is_admin')
      .eq('is_admin', true)
      .order('full_name', { ascending: true })
    
    return admins || []
  }
}
