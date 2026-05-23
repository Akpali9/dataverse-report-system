import { redirect } from 'next/navigation'
import { getCurrentUserProfile, getStudentAssignments, getAnnouncements } from '@/lib/api-utils'
import StudentDashboardClient from '@/components/student/dashboard-client'

export default async function StudentDashboard() {
  const profile = await getCurrentUserProfile()

  if (!profile || profile.is_admin) {
    redirect('/auth/login')
  }

  const assignments = await getStudentAssignments()
  const announcements = await getAnnouncements(10)

  return (
    <div className="min-h-screen bg-background">
      <StudentDashboardClient
        profile={profile}
        assignments={assignments}
        announcements={announcements}
      />
    </div>
  )
}
