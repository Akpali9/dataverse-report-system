
'use client'

import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUnreadCount } from '@/lib/chat-utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

export default function StudentDashboardClient({
  profile,
  assignments,
  exams,
  announcements,
}: {
  profile: any
  assignments: any[]
  exams: any[]
  announcements: any[]
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (profile?.id) {
        const count = await getUnreadCount(profile.id)
        setUnreadCount(count)
      }
    }
    
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [profile?.id])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logoutAction()
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
            <p className="text-sm text-gray-500">Welcome, {profile?.full_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student/chat">
              <Button variant="outline" className="relative">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Your pending and completed assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <p className="text-sm text-gray-500">No assignments yet</p>
              ) : (
                <div className="space-y-3">
                  {assignments.slice(0, 5).map((assignment) => (
                    <div key={assignment.id} className="border-b pb-2">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <p className="text-xs text-gray-500">
                        Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exams */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
              <CardDescription>Scheduled exams and tests</CardDescription>
            </CardHeader>
            <CardContent>
              {exams.length === 0 ? (
                <p className="text-sm text-gray-500">No exams scheduled</p>
              ) : (
                <div className="space-y-3">
                  {exams.slice(0, 5).map((exam) => (
                    <div key={exam.id} className="border-b pb-2">
                      <h3 className="font-semibold">{exam.title}</h3>
                      <p className="text-xs text-gray-500">
                        Duration: {exam.duration_minutes} minutes
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Latest updates from administrators</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-sm text-gray-500">No announcements yet</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-b pb-3">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Posted on {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
