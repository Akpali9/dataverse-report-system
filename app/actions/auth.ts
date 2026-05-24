// app/actions/auth.ts - Updated loginAction
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
    
    // Try to get profile
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
          is_admin: data.user.user_metadata?.is_admin || false,
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
    
    // Redirect based on role
    if (profile?.is_admin === true) {
      redirect('/dashboard/admin')
    } else {
      redirect('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}
