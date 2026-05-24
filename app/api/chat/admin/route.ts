import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    // Get all chat conversations for admin
    const { data: conversations } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:sender_id(id, username, full_name),
        receiver:receiver_id(id, username, full_name)
      `)
      .order('created_at', { ascending: false })
    
    return NextResponse.json(conversations)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
