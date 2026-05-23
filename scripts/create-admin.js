// scripts/create-admin.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
)

async function createAdminUser() {
  const adminEmail = 'admin@dataverse.com'
  const adminPassword = 'Admin123!@#'
  const adminUsername = 'admin'
  const adminFullName = 'System Administrator'

  try {
    // Check if admin already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', adminUsername)
      .single()

    if (existingUser) {
      console.log('Admin user already exists!')
      return
    }

    // Create admin user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        username: adminUsername,
        full_name: adminFullName,
        is_admin: true,
      },
    })

    if (authError) {
      console.error('Error creating admin:', authError)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log(`Email: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)
    console.log(`User ID: ${authData.user.id}`)
    
    // The trigger will automatically create the profile in users table
    console.log('✅ Admin profile will be auto-created by trigger')
  } catch (error) {
    console.error('Error:', error)
  }
}

createAdminUser()
