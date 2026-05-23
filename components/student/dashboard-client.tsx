'use client'

import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'

export default function StudentDashboardClient({
  profile,
  assignments,
  announcements,
}: {
  profile: any
  assignments: any[]
  announcements: any[]
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logoutAction()
  }

  const pendingAssignments = assignments.filter((a) => {
    const dueDate = new Date(a.due_date)
    return dueDate > new Date()
  })

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
            <Link href="/dashboard/student/profile">
              <Button variant="outline">My Profile</Button>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Assignments and Exams */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Assignments</CardTitle>
                <CardDescription>You have {pendingAssignments.length} active assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingAssignments.length === 0 ? (
                  <p className="text-sm text-gray-500">No pending assignments</p>
                ) : (
                  <div className="space-y-4">
                    {pendingAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-600">{assignment.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Link href={`/dashboard/student/assignments/${assignment.id}`}>
                          <Button size="sm">Submit</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exams */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Exams</CardTitle>
                <CardDescription>Your upcoming and available exams</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Coming soon...</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Announcements */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Latest updates from instructors</CardDescription>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <p className="text-sm text-gray-500">No announcements yet</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{announcement.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{announcement.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat with Admin */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/student/chat" className="w-full">
                  <Button className="w-full">Chat with Admin</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
