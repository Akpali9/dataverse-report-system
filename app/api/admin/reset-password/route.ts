import { createClient } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

// Default password for reset
const DEFAULT_PASSWORD = 'Password123!'

export async function POST(request: Request) {
  try {
    const profile = await getCurrentUserProfile()

    if (!profile || !profile.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Reset password using Supabase admin API
    const { data, error } = await supabase.auth.admin.updateUserById(studentId, {
      password: DEFAULT_PASSWORD,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Password reset successfully',
      defaultPassword: DEFAULT_PASSWORD,
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
