import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/lib/api-utils'

export default async function Page() {
  const profile = await getCurrentUserProfile()

  if (profile) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="space-y-4">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-gray-900">
            Student-Admin Portal
          </h1>
          <p className="text-pretty text-gray-600">
            Manage assignments, exams, and student performance in one place.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <a href="/auth/login" className="inline-block">
            <button className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Login
            </button>
          </a>
          <a href="/auth/sign-up" className="inline-block">
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition">
              Sign Up
            </button>
          </a>
        </div>

        <p className="text-xs text-gray-500">
          Students and instructors can create their accounts here.
        </p>
      </div>
    </main>
  )
}
