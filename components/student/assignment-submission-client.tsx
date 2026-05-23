'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AssignmentSubmissionClient({
  assignment,
  submission,
  studentId,
}: {
  assignment: any
  submission: any
  studentId: string
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to submit')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('assignmentId', assignment.id)
      formData.append('studentId', studentId)

      const response = await fetch('/api/submissions/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assignment')
      }

      setSuccess(true)
      setTimeout(() => router.refresh(), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const dueDate = new Date(assignment.due_date)
  const isOverdue = dueDate < new Date()
  const isSubmitted = !!submission

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
          <Link href="/dashboard/student">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600 mt-2">{assignment.description}</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-sm font-semibold">{dueDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                        {isOverdue ? 'Overdue' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submission Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Submission</CardTitle>
                <CardDescription>
                  {isSubmitted ? 'Already submitted' : 'Submit your work'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSubmitted && submission.marked && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs font-semibold text-blue-900">Marks Awarded</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{submission.marks}</p>
                    {submission.feedback && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs font-semibold text-blue-900">Feedback</p>
                        <p className="text-xs text-blue-700 mt-2">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                )}

                {!isSubmitted && (
                  <>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="hover:underline"
                      >
                        <p className="text-sm font-semibold text-gray-900">Click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, or ZIP</p>
                      </button>
                      {file && <p className="text-xs text-green-600 mt-4 font-semibold">{file.name}</p>}
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}
                    {success && <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">Submitted successfully!</div>}

                    <Button
                      onClick={handleSubmit}
                      disabled={!file || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
