import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/lib/api-utils'
import StudentProfileClient from '@/components/student/profile-client'

export default async function StudentProfilePage() {
  const profile = await getCurrentUserProfile()

  if (!profile || profile.is_admin) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentProfileClient profile={profile} />
    </div>
  )
}
