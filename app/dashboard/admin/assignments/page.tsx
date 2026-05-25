// app/dashboard/admin/assignments/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'

export default async function AssignmentsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) redirect('/dashboard')
  
  // Fetch assignments created by this admin
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('admin_id', user.id)
    .order('created_at', { ascending: false })
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Link href="/dashboard/admin/assignments/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Assignment
          </Button>
        </Link>
      </div>
      
      {assignments?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No assignments created yet.</p>
            <Link href="/dashboard/admin/assignments/create">
              <Button variant="outline" className="mt-4">
                Create Your First Assignment
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments?.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle className="text-xl">{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{assignment.description || 'No description'}</p>
                {assignment.due_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4" />
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </div>
                )}
                <div className="flex gap-2">
                  <Link href={`/dashboard/admin/assignments/${assignment.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admin/assignments/${assignment.id}/submissions`}>
                    <Button variant="outline" size="sm">
                      View Submissions
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
