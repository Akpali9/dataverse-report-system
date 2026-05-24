
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  message: string
  created_at: string
  sender_id: string
  receiver_id: string
  sender: { username: string; full_name: string }
  receiver: { username: string; full_name: string }
}

export default function AdminChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [users, setUsers] = useState<Map<string, { username: string; full_name: string }>>(new Map())

  useEffect(() => {
    fetchMessages()
    
    // Subscribe to new messages
    const supabase = createClient()
    const channel = supabase
      .channel('chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
        () => fetchMessages()
      )
      .subscribe()
    
    return () => { channel.unsubscribe() }
  }, [])

  async function fetchMessages() {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:sender_id(id, username, full_name),
          receiver:receiver_id(id, username, full_name)
        `)
        .order('created_at', { ascending: false })
      
      if (data) {
        setMessages(data)
        
        // Build unique users list
        const userMap = new Map()
        data.forEach(msg => {
          if (msg.sender) userMap.set(msg.sender_id, msg.sender)
          if (msg.receiver) userMap.set(msg.receiver_id, msg.receiver)
        })
        setUsers(userMap)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage() {
    if (!selectedUser || !newMessage.trim()) return
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return
      
      await supabase.from('chat_messages').insert({
        sender_id: user.id,
        receiver_id: selectedUser,
        message: newMessage,
        created_at: new Date().toISOString(),
      })
      
      setNewMessage('')
      fetchMessages()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return <div className="p-8">Loading chat...</div>
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Users sidebar */}
      <div className="w-80 border-r overflow-y-auto p-4">
        <h2 className="font-bold mb-4">Users</h2>
        {Array.from(users.entries()).map(([id, user]) => (
          <div
            key={id}
            onClick={() => setSelectedUser(id)}
            className={`p-3 mb-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedUser === id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <p className="font-semibold">{user.full_name || user.username}</p>
            <p className="text-xs text-gray-500">ID: {id.slice(0, 8)}...</p>
          </div>
        ))}
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages
                .filter(msg => 
                  (msg.sender_id === selectedUser && msg.receiver_id === selectedUser) ||
                  (msg.sender_id === selectedUser || msg.receiver_id === selectedUser)
                )
                .reverse()
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === selectedUser ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender_id === selectedUser 
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-blue-500 text-white'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="border-t p-4 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  )
}
