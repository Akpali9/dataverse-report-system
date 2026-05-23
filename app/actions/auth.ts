'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(username: string, password: string) {
  const supabase = await createClient()

  // Get user by username from the users table
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single()

  if (fetchError || !users) {
    return { error: 'Invalid username or password' }
  }

  // Get the user's email from auth.users
  const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers()

  const authUser = authUsers?.find(u => u.id === users.id)
  if (!authUser?.email) {
    return { error: 'Invalid username or password' }
  }

  // Sign in with the email
  const { data, error } = await supabase.auth.signInWithPassword({
    email: authUser.email,
    password,
  })

  if (error) {
    return { error: 'Invalid username or password' }
  }

  return { data }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function adminSignUpAction(
  email: string,
  password: string,
  username: string,
  fullName: string
) {
  const supabase = await createClient()

  // Check if username already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single()

  if (existingUser) {
    return { error: 'Username already exists' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/auth/callback`,
      data: {
        username,
        full_name: fullName,
        is_admin: true,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function resetPasswordAction(email: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updatePasswordAction(
  newPassword: string,
  accessToken: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.updateUser(
    { password: newPassword },
    { tokens: { access_token: accessToken, refresh_token: '' } }
  )

  if (error) {
    return { error: error.message }
  }

  return { data }
}
