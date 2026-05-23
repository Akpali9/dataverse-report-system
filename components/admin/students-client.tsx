'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function AdminStudentsClient({
  profile,
  students: initialStudents,
}: {
  profile: any
  students: any[]
}) {
  const [students, setStudents] = useState(initialStudents)
  const [searchTerm, setSearchTerm] = useState('')
  const [resetingPassword, setResetingPassword] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creatingStudent, setCreatingStudent] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    schoolName: '',
    defaultPassword: 'Password123!',
  })

  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleResetPassword = async (studentId: string, studentEmail: string) => {
    setResetingPassword(studentId)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentEmail,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setSuccess(`Password reset to default for ${studentEmail}`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setResetingPassword(null)
    }
  }

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingStudent(true)
    setError(null)
    setSuccess(null)

    if (!formData.email || !formData.username || !formData.fullName || !formData.defaultPassword) {
      setError('All required fields must be filled')
      setCreatingStudent(false)
      return
    }

    try {
      const response = await fetch('/api/admin/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create student')
      }

      setSuccess(`Student ${formData.username} created successfully!`)
      setFormData({
        email: '',
        username: '',
        fullName: '',
        schoolName: '',
        defaultPassword: 'Password123!',
      })
      setShowCreateForm(false)
      
      // Refresh students list
      const studentsResponse = await fetch('/api/admin/students')
      const studentsData = await studentsResponse.json()
      setStudents(studentsData.students || [])
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setCreatingStudent(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-green-600 hover:bg-green-700">
              {showCreateForm ? 'Cancel' : '+ Add Student'}
            </Button>
            <Link href="/dashboard/admin">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {showCreateForm && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle>Create New Student Account</CardTitle>
              <CardDescription>Fill in the details to create a new student account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <Input
                      type="email"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                    <Input
                      type="text"
                      placeholder="studentusername"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    <Input
                      type="text"
                      placeholder="Your School"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Password *</label>
                    <Input
                      type="text"
                      placeholder="Password123!"
                      value={formData.defaultPassword}
                      onChange={(e) => setFormData({ ...formData, defaultPassword: e.target.value })}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Student can change this password after first login</p>
                  </div>
                </div>
                <Button type="submit" disabled={creatingStudent} className="w-full bg-green-600 hover:bg-green-700">
                  {creatingStudent ? 'Creating...' : 'Create Student Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>Manage all registered students and reset their passwords</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div>
              <Input
                placeholder="Search by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Messages */}
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}
            {success && <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">{success}</div>}

            {/* Table */}
            {filteredStudents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No students found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Username</th>
                      <th className="text-left py-3 px-4 font-semibold">School</th>
                      <th className="text-left py-3 px-4 font-semibold">Joined</th>
                      <th className="text-right py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{student.full_name}</p>
                            <p className="text-xs text-gray-500">{student.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">@{student.username}</td>
                        <td className="py-3 px-4 text-gray-600">{student.school_name || '-'}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(student.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link href={`/dashboard/admin/students/${student.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleResetPassword(student.id, student.email)}
                            disabled={resetingPassword === student.id}
                          >
                            {resetingPassword === student.id ? 'Resetting...' : 'Reset Pwd'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-4 border-t">
              Total: {filteredStudents.length} of {students.length} students
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
