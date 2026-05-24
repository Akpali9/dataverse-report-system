export async function studentSignUpAction(email: string, password: string, fullName: string, username: string) {
  try {
    const supabase = await createClient()
    
    // Create the auth user
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
    
    if (data.user) {
      // Manually create the profile if trigger didn't work
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          username: username,
          full_name: fullName,
          is_admin: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      
      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't return error here, as user was created
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Student signup error:', error)
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}
