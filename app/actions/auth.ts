
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Login action - handles both admin and student login
export async function loginAction(email: string, password: string) {
  try {
    const supabase = await createClient()
    
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Login error:', error)
      return { error: error.message }
    }
    
    if (!data.user) {
      return { error: 'User not found' }
    }
    
    // Wait a moment for the trigger to create profile if needed
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get user profile from database
    let { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    // If profile doesn't exist, create it
    if (profileError && profileError.code === 'PGRST116') {
      console.log('Profile not found, creating...')
      
      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          username: data.user.email?.split('@')[0] || 'user',
          full_name: data.user.user_metadata?.full_name || '',
          email: data.user.email,
          is_admin: email === 'admin@dataverse.com', // Auto-set admin for this email
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (insertError) {
        console.error('Profile creation error:', insertError)
        return { error: 'Failed to create user profile' }
      }
      
      profile = newProfile
    } else if (profileError) {
      console.error('Profile fetch error:', profileError)
      return { error: 'Error fetching user profile' }
    }
    
    console.log('User profile:', { id: profile.id, is_admin: profile.is_admin, email: profile.email })
    
    // Redirect based on admin status
    if (profile.is_admin === true) {
      redirect('/dashboard/admin')
    } else {
      redirect('/dashboard')
    }
  } catch (error) {
    // Allow NEXT_REDIRECT to propagate
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Login error:', error)
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
    
    return { success: true }
  } catch (error) {
    console.error('Student signup error:', error)
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}

// Admin sign up action
export async function adminSignUpAction(email: string, password: string, fullName: string) {
  try {
    const supabase = await createClient()
    
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

// Force set admin status (for fixing admin users)
export async function forceSetAdmin(email: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('email', email)
    
    if (error) {
      console.error('Force set admin error:', error)
      return { error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Force set admin error:', error)
    return { error: error instanceof Error ? error.message : 'An error occurred' }
  }
}
