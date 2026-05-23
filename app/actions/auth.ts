'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function signUpAction(
  email: string,
  password: string,
  username: string,
  fullName: string,
  schoolName: string,
  isAdmin: boolean
) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/auth/callback`,
      data: {
        username,
        full_name: fullName,
        school_name: schoolName,
        is_admin: isAdmin,
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
