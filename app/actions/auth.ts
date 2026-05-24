'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  // Get user role
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user?.id)
    .single()
  
  // Redirect based on role
  if (profile?.is_admin) {
    redirect('/dashboard/admin')
  } else {
    redirect('/dashboard')
  }
}
