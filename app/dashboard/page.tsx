import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/lib/api-utils'

export default async function Page() {
  const profile = await getCurrentUserProfile()

  if (!profile) {
    redirect('/auth/login')
  }

  // Route to appropriate dashboard based on role
  if (profile.is_admin) {
    redirect('/dashboard/admin')
  } else {
    redirect('/dashboard/student')
  }
}
