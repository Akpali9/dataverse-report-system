'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Login action
export async function loginAction(email: string, password: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { error: error.message }
    }
    
    // Get user role
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', data.user.id)
      .single()
    
    if (profile?.is_admin) {
      redirect('/dashboard/admin')
    } else {
      redirect('/dashboard')
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

// Student sign up
export async function studentSignUpAction(email: string, password: string, fullName: string, username: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          is_admin: false,
        },
      },
    })
    
    if (error) {
      return { error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

// Admin sign up
export async function adminSignUpAction(email: string, password: string, fullName: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: email.split('@')[0],
          is_admin: true,
        },
      },
    })
    
    if (error) {
      return { error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

// Logout action
export async function logoutAction() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    redirect('/')
  }
}

// Generic sign up
export async function signUpAction(email: string, password: string, fullName: string, username: string) {
  return studentSignUpAction(email, password, fullName, username)
}
