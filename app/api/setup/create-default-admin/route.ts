import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_ADMIN_USERNAME = 'admin'
const DEFAULT_ADMIN_PASSWORD = 'Admin@123'
const DEFAULT_ADMIN_EMAIL = 'admin@dataverse.edu'

export async function POST(request: NextRequest) {
  try {
    // Verify setup token (optional security measure)
    const setupToken = request.headers.get('x-setup-token')
    if (setupToken !== process.env.SETUP_TOKEN && process.env.SETUP_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('username', DEFAULT_ADMIN_USERNAME)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Default admin already exists' },
        { status: 200 }
      )
    }

    // Create default admin user via admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        username: DEFAULT_ADMIN_USERNAME,
        full_name: 'Default Admin',
        is_admin: true,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      username: DEFAULT_ADMIN_USERNAME,
      full_name: 'Default Admin',
      is_admin: true,
    })

    if (profileError) {
      // Delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(data.user.id)
      return NextResponse.json(
        { error: 'Failed to create admin profile' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: 'Default admin created successfully',
        username: DEFAULT_ADMIN_USERNAME,
        password: DEFAULT_ADMIN_PASSWORD,
        email: DEFAULT_ADMIN_EMAIL,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating default admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'To create default admin, send POST request with x-setup-token header',
      defaultUsername: DEFAULT_ADMIN_USERNAME,
      defaultPassword: DEFAULT_ADMIN_PASSWORD,
    },
    { status: 200 }
  )
}
