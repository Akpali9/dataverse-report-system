import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!adminUser?.is_admin) {
      return NextResponse.json(
        { error: 'Only admins can create student accounts' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, username, fullName, schoolName, defaultPassword } = body

    // Validate input
    if (!email || !username || !fullName || !defaultPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Create user via admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      username,
      full_name: fullName,
      school_name: schoolName || null,
      is_admin: false,
    })

    if (profileError) {
      // Delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(data.user.id)
      return NextResponse.json(
        { error: 'Failed to create student profile' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: 'Student account created successfully',
        studentId: data.user.id,
        username,
        email,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
