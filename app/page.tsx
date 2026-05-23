import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/lib/api-utils'

export default async function Page() {
  const profile = await getCurrentUserProfile()

  if (profile) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen bg-background">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-blue-700 flex-col justify-center px-12 py-12">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-block">
              <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                📚
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Learning Made Simple
            </h1>
            <p className="text-xl text-blue-100 max-w-lg">
              Manage courses, assignments, and student progress all in one unified platform.
            </p>
          </div>
          <div className="space-y-3 pt-8">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">✓</span>
              </div>
              <p className="text-blue-50">Create and manage assignments with ease</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">✓</span>
              </div>
              <p className="text-blue-50">Track student performance in real-time</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-primary">✓</span>
              </div>
              <p className="text-blue-50">Communicate with students directly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Options */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-12 lg:py-0">
        <div className="space-y-8 max-w-sm mx-auto w-full">
          {/* Heading */}
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground">Choose how you want to continue</p>
          </div>

          {/* Login Card */}
          <a href="/auth/login" className="block group">
            <div className="border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all bg-white">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">Sign In</h3>
                  <p className="text-sm text-muted-foreground">Return to your account</p>
                </div>
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </a>

          {/* Student Registration Card */}
          <a href="/auth/sign-up" className="block group">
            <div className="border-2 border-border rounded-xl p-6 hover:border-secondary hover:shadow-lg transition-all bg-white">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">Student Registration</h3>
                  <p className="text-sm text-muted-foreground">Create your student account</p>
                </div>
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </a>

          {/* Instructor Registration Card */}
          <a href="/auth/admin-register" className="block group">
            <div className="border-2 border-secondary rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all bg-secondary/5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">Instructor Registration</h3>
                  <p className="text-sm text-muted-foreground">Create your instructor account</p>
                </div>
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </a>

          {/* Footer Info */}
          <div className="pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
