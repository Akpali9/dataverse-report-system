import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function FixAdminPage() {
  const supabase = await createClient()
  
  // Update admin status
  const { error } = await supabase
    .from('users')
    .update({ is_admin: true })
    .eq('email', 'admin@dataverse.com')
  
  if (error) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-500">Admin Fixed!</h1>
      <p>is_admin has been set to true for admin@dataverse.com</p>
      <a href="/auth/login" className="text-blue-500 mt-4 inline-block">Go to Login</a>
    </div>
  )
}
