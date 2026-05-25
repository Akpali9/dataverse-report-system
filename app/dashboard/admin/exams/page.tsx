// app/dashboard/admin/exams/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Clock } from 'lucide-react'

export default async function ExamsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) redirect('/dashboard')
  
  // Fetch exams created by this admin
  const { data: exams } = await supabase
    .from('exams')
    .select('*')
    .eq('admin_id', user.id)
    .order('created_at', { ascending: false })
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exams</h1>
        <Link href="/dashboard/admin/exams/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Exam
          </Button>
        </Link>
      </div>
      
      {exams?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No exams created yet.</p>
            <Link href="/dashboard/admin/exams/create">
              <Button variant="outline" className="mt-4">
                Create Your First Exam
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {exams?.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <CardTitle className="text-xl">{exam.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{exam.description || 'No description'}</p>
                {exam.duration_minutes && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4" />
                    Duration: {exam.duration_minutes} minutes
                  </div>
                )}
                <div className="flex gap-2">
                  <Link href={`/dashboard/admin/exams/${exam.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admin/exams/${exam.id}/questions`}>
                    <Button variant="outline" size="sm">
                      Manage Questions
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admin/exams/${exam.id}/results`}>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
