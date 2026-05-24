
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Login action - handles both admin and student login
export async function loginAction(email: string, password: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Login error:', error)
      return { error: error.message }
    }
    
    // Get user role from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('is_admin, role, username, full_name')
      .eq('id', data.user.id)
      .single()
    
    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // If no profile exists, try to create one
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: email,
          username: email.split('@')[0],
          full_name: data.user.user_metadata?.full_name || '',
          is_admin: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      
      if (insertError) {
        console.error('Profile creation error:', insertError)
        return { error: 'User profile not found' }
      }
      
      // Redirect non-admin users to student dashboard
      redirect('/dashboard')
    }
    
    // Redirect based on role
    if (profile?.is_admin === true) {
      redirect('/dashboard/admin')
    } else {
      redirect('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
    // Allow NEXT_REDIRECT to propagate
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}

// Student sign up action
export async function studentSignUpAction(email: string, password: string, fullName: string, username: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signUp({
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
      console.error('Student signup error:', error)
      return { error: error.message }
    }
    
    // Profile will be created by database trigger
    return { success: true }
  } catch (error) {
    console.error('Student signup error:', error)
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}

// Admin sign up action (for creating admin users)
export async function adminSignUpAction(email: string, password: string, fullName: string) {
  try {
    const supabase = await createClient()
    
    // First, check if current user is admin (if called from existing session)
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    if (currentUser) {
      const { data: currentProfile } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', currentUser.id)
        .single()
      
      // Only allow existing admins to create new admins
      if (!currentProfile?.is_admin) {
        return { error: 'Unauthorized: Only existing admins can create admin accounts' }
      }
    }
    
    const { data, error } = await supabase.auth.signUp({
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
      console.error('Admin signup error:', error)
      return { error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Admin signup error:', error)
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}

// Logout action
export async function logoutAction() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  } catch (error) {
    // Allow NEXT_REDIRECT to propagate
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Logout error:', error)
    redirect('/')
  }
}

// Generic sign up action (for backwards compatibility)
export async function signUpAction(email: string, password: string, fullName: string, username: string) {
  return studentSignUpAction(email, password, fullName, username)
}

// Get current user session
export async function getSession() {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Session error:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('User fetch error:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('User fetch error:', error)
    return null
  }
}

// Check if current user is admin
export async function isUserAdmin() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false
    
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    return profile?.is_admin === true
  } catch (error) {
    console.error('Admin check error:', error)
    return false
  }
}
