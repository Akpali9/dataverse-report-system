
'use client'

import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUnreadCount } from '@/lib/chat-utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

export default function AdminDashboardClient({
  profile,
  students,
  announcements,
}: {
  profile: any
  students: any[]
  announcements: any[]
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (profile?.id) {
        const count = await getUnreadCount(profile.id)
        setUnreadCount(count)
      }
    }
    
    fetchUnreadCount()
    
    // Poll for new messages every 30 seconds
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
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-sm text-gray-500">Welcome, {profile?.full_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin/chat">
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

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 py-4">
            <Link href="/dashboard/admin/students">
              <Button variant="outline" size="sm">
                Manage Students
              </Button>
            </Link>
            <Link href="/dashboard/admin/assignments">
              <Button variant="outline" size="sm">
                Assignments
              </Button>
            </Link>
            <Link href="/dashboard/admin/exams">
              <Button variant="outline" size="sm">
                Exams
              </Button>
            </Link>
            <Link href="/dashboard/admin/announcements">
              <Button variant="outline" size="sm">
                Announcements
              </Button>
            </Link>
            <Link href="/dashboard/admin/performance">
              <Button variant="outline" size="sm">
                Performance
              </Button>
            </Link>
            <Link href="/dashboard/admin/chat">
              <Button variant="outline" size="sm" className="relative">
                Messages
                {unreadCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{students.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{announcements.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{unreadCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/dashboard/admin/chat">
                  <Button size="sm" variant="outline" className="w-full">
                    Go to Messages
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>Latest registered students</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-gray-500">No students yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-semibold">Name</th>
                      <th className="text-left py-2 px-2 font-semibold">School</th>
                      <th className="text-left py-2 px-2 font-semibold">Joined</th>
                      <th className="text-right py-2 px-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 10).map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-semibold">{student.full_name}</p>
                            <p className="text-xs text-gray-500">@{student.username}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs">{student.school_name || '-'}</td>
                        <td className="py-3 px-2 text-xs">
                          {new Date(student.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Link href={`/dashboard/admin/students/${student.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {students.length > 10 && (
              <div className="mt-4 text-center">
                <Link href="/dashboard/admin/students">
                  <Button variant="outline">View All Students</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
