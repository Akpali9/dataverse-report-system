// app/api/debug/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      return NextResponse.json({ 
        error: 'Auth error', 
        details: userError.message 
      }, { status: 500 })
    }
    
    // Test database access
    const { data: users, error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (dbError) {
      return NextResponse.json({ 
        error: 'Database error', 
        details: dbError.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      user: user ? { id: user.id, email: user.email } : null,
      message: 'Debug endpoint working'
    })
    
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
