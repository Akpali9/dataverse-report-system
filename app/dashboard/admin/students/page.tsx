import { redirect } from 'next/navigation'
import { getCurrentUserProfile, getAllStudents } from '@/lib/api-utils'
import AdminStudentsClient from '@/components/admin/students-client'

export default async function AdminStudentsPage() {
  const profile = await getCurrentUserProfile()

  if (!profile || !profile.is_admin) {
    redirect('/auth/login')
  }

  const students = await getAllStudents()

  return (
    <div className="min-h-screen bg-background">
      <AdminStudentsClient profile={profile} students={students} />
    </div>
  )
}
