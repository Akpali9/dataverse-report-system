// app/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function studentSignUpAction(email: string, password: string, fullName: string, username: string) {
  try {
    const supabase = await createClient()
    
    console.log('Attempting to sign up:', { email, fullName, username })
    
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
      console.error('Signup error:', error)
      return { error: error.message }
    }
    
    console.log('Signup successful:', data)
    
    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return { success: true }
  } catch (error) {
    console.error('Student signup error:', error)
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}
