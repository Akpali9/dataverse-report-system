'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  message: string
  created_at: string
  sender_id: string
  receiver_id: string
}

interface User {
  id: string
  username: string
  full_name: string
  email: string
}

export default function StudentChatClient({ 
  currentUserId, 
  admins, 
  initialConversations 
}: { 
  currentUserId: string
  admins: User[]
  initialConversations: Message[]
}) {
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>(initialConversations)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Filter messages for selected admin
  const filteredMessages = messages.filter(msg => 
    (msg.sender_id === currentUserId && msg.receiver_id === selectedAdmin?.id) ||
    (msg.sender_id === selectedAdmin?.id && msg.receiver_id === currentUserId)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  // Send message
  const sendMessage = async () => {
    if (!selectedAdmin || !newMessage.trim()) return
    
    setLoading(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: selectedAdmin.id,
          message: newMessage,
          created_at: new Date().toISOString(),
        })
      
      if (error) throw error
      
      // Add message to local state
      setMessages([...messages, {
        id: Date.now().toString(),
        sender_id: currentUserId,
        receiver_id: selectedAdmin.id,
        message: newMessage,
        created_at: new Date().toISOString(),
      }])
      
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  // Subscribe to new messages
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase
      .channel('chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' }, 
        (payload) => {
          const newMsg = payload.new as Message
          // Only add if related to current user
          if (newMsg.sender_id === currentUserId || newMsg.receiver_id === currentUserId) {
            setMessages(prev => [...prev, newMsg])
          }
        }
      )
      .subscribe()
    
    return () => { channel.unsubscribe() }
  }, [currentUserId])

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-200px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Admins List */}
        <Card className="md:col-span-1 overflow-y-auto">
          <CardHeader>
            <CardTitle>Teachers & Admins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {admins.length === 0 ? (
              <p className="text-gray-500 text-sm">No admins available</p>
            ) : (
              admins.map((admin) => (
                <div
                  key={admin.id}
                  onClick={() => setSelectedAdmin(admin)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedAdmin?.id === admin.id
                      ? 'bg-blue-100 border-l-4 border-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="font-semibold">{admin.full_name || admin.username}</p>
                  <p className="text-xs text-gray-500">{admin.email}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 flex flex-col h-full">
          {selectedAdmin ? (
            <>
              <CardHeader>
                <CardTitle>
                  Chat with {selectedAdmin.full_name || selectedAdmin.username}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto space-y-3">
                {filteredMessages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No messages yet. Start a conversation!
                  </p>
                ) : (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender_id === currentUserId
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              
              <div className="p-4 border-t flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={loading}>
                  {loading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a teacher or admin to start chatting
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
