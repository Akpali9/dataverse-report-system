
'use client'

import { createClient } from '@/lib/supabase/client'
import { getMessages, sendMessage, markMessagesAsRead, subscribeToMessages } from '@/lib/chat-utils'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, Send } from 'lucide-react'

interface User {
  id: string
  username: string
  full_name: string
  email: string
  is_admin: boolean
}

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  is_read: boolean
  created_at: string
}

export default function ChatClient({ 
  currentUser, 
  contacts 
}: { 
  currentUser: User
  contacts: User[]
}) {
  const [selectedContact, setSelectedContact] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Load messages when contact is selected
  useEffect(() => {
    if (selectedContact) {
      loadMessages()
      markMessagesAsRead(currentUser.id, selectedContact.id)
    }
  }, [selectedContact])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Subscribe to new messages
  useEffect(() => {
    const subscription = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          // Update unread count for the sender
          setUnreadCounts(prev => ({
            ...prev,
            [newMsg.sender_id]: (prev[newMsg.sender_id] || 0) + 1
          }))
          // Add to messages if this conversation is open
          if (selectedContact?.id === newMsg.sender_id) {
            setMessages(prev => [...prev, newMsg])
            markMessagesAsRead(currentUser.id, newMsg.sender_id)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [currentUser.id, selectedContact])

  const loadMessages = async () => {
    if (!selectedContact) return
    const msgs = await getMessages(currentUser.id, selectedContact.id)
    setMessages(msgs)
  }

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return
    
    setLoading(true)
    try {
      const message = await sendMessage(currentUser.id, selectedContact.id, newMessage)
      setMessages(prev => [...prev, message])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container mx-auto h-[calc(100vh-120px)] p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Contacts Sidebar */}
        <Card className="md:col-span-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {currentUser.is_admin ? 'Students' : 'Teachers & Admins'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <ScrollArea className="h-full">
              {contacts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No {currentUser.is_admin ? 'students' : 'teachers'} available
                </p>
              ) : (
                <div className="space-y-1 p-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                        selectedContact?.id === contact.id
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Avatar>
                        <AvatarFallback className="bg-blue-500 text-white">
                          {getInitials(contact.full_name || contact.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {contact.full_name || contact.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.email}
                        </p>
                      </div>
                      {unreadCounts[contact.id] > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCounts[contact.id]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 flex flex-col h-full">
          {selectedContact ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-500 text-white">
                      {getInitials(selectedContact.full_name || selectedContact.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {selectedContact.full_name || selectedContact.username}
                    </CardTitle>
                    <p className="text-xs text-gray-500">
                      {selectedContact.is_admin ? 'Teacher/Admin' : 'Student'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4">
                <ScrollArea className="h-full">
                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No messages yet. Start a conversation!
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.sender_id === currentUser.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender_id === currentUser.id 
                                ? 'text-blue-100' 
                                : 'text-gray-500'
                            }`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              
              <div className="p-4 border-t flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={loading}>
                  {loading ? 'Sending...' : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
              <p>Select a {currentUser.is_admin ? 'student' : 'teacher'} to start chatting</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
