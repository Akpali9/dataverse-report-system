import { redirect } from 'next/navigation'
import { getCurrentUserProfile, getAllStudents, getAnnouncements } from '@/lib/api-utils'
import AdminDashboardClient from '@/components/admin/dashboard-client'

export default async function AdminDashboard() {
  const profile = await getCurrentUserProfile()

  if (!profile || !profile.is_admin) {
    redirect('/auth/login')
  }

  const students = await getAllStudents()
  const announcements = await getAnnouncements(10)

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboardClient
        profile={profile}
        students={students}
        announcements={announcements}
      />
    </div>
  )
}
