import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DebugPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Not Logged In</h1>
        <p>Please go to <a href="/auth/login" className="text-blue-500">/auth/login</a></p>
      </div>
    )
  }
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify({ user, profile }, null, 2)}
      </pre>
    </div>
  )
}
