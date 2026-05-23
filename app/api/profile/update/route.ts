import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { full_name, school_name, github_link } = await request.json()

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: full_name || null,
        school_name: school_name || null,
        github_link: github_link || null,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
