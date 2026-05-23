import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/lib/api-utils'
import { createClient } from '@/lib/supabase/server'
import AssignmentSubmissionClient from '@/components/student/assignment-submission-client'

export default async function AssignmentPage({ params }: { params: { id: string } }) {
  const profile = await getCurrentUserProfile()

  if (!profile || profile.is_admin) {
    redirect('/auth/login')
  }

  const supabase = await createClient()
  const { data: assignment } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!assignment) {
    return <div className="p-4">Assignment not found</div>
  }

  const { data: submission } = await supabase
    .from('submissions')
    .select('*')
    .eq('assignment_id', params.id)
    .eq('student_id', profile.id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <AssignmentSubmissionClient
        assignment={assignment}
        submission={submission}
        studentId={profile.id}
      />
    </div>
  )
}
