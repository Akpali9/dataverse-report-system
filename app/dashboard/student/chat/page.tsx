import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/lib/api-utils'

export default async function StudentChatPage() {
  const profile = await getCurrentUserProfile()

  if (!profile || profile.is_admin) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Chat with Admin</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Real-time chat with instructors coming soon...</p>
        </div>
      </main>
    </div>
  )
}
