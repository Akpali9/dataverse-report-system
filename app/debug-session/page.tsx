import { createClient } from '@/lib/supabase/server'

export default async function DebugSessionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify({ 
          isLoggedIn: !!user,
          userId: user?.id || null,
          email: user?.email || null,
        }, null, 2)}
      </pre>
    </div>
  )
}
