// app/actions/auth.js
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(username, password) {
  try {
    const supabase = await createClient()
    
    // First, get the user's email from username
    // Since Supabase uses email for login, we need to find the email associated with username
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()
    
    if (userError || !userData) {
      return { error: 'Invalid username or password' }
    }
    
    // Get the user's email from auth.users
    const { data: authUser, error: authError } = await supabase
      .from('users')
      .select('email')
      .eq('username', username)
      .single()
    
    // Alternative: Since we can't directly query auth.users, we need to use the email from metadata
    // The better approach is to ask for email directly, but let's work with what we have
    
    // For now, let's try a different approach - get user by username from your users table
    // and then try to sign in with email (you'll need to store email in users table)
    
    return { error: 'Please use email to login. Username login requires additional setup.' }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

// Alternative: Email-based login (recommended)
export async function loginWithEmailAction(email, password) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { error: error.message }
    }
    
    // Redirect to dashboard on success
    redirect('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

// Sign up action
export async function signUpAction(email, password, fullName, username) {
  try {
    const supabase = await createClient()
    
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
        },
      },
    })
    
    if (error) {
      return { error: error.message }
    }
    
    // The trigger will automatically create the user profile
    return { success: true }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

// Sign out action
export async function signOutAction() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  } catch (error) {
    console.error('Sign out error:', error)
    return { error: 'An error occurred during sign out' }
  }
}
