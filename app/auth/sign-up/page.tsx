'use client'

import { studentSignUpAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!username || !fullName) {
      setError('Username and full name are required')
      setIsLoading(false)
      return
    }

    try {
      const result = await studentSignUpAction(password, username, fullName, schoolName)
      
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/auth/sign-up-success')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary to-green-600 flex-col justify-between p-12">
        <div>
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg">
            🎓
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white max-w-lg">
            Join thousands of students learning today
          </h1>
          <p className="text-lg text-green-100">
            Submit assignments, take exams, and track your academic progress.
          </p>
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-green-50">
              <span>✓</span> Access course materials anytime
            </div>
            <div className="flex items-center gap-3 text-green-50">
              <span>✓</span> Submit assignments and get instant feedback
            </div>
            <div className="flex items-center gap-3 text-green-50">
              <span>✓</span> Chat directly with instructors
            </div>
          </div>
        </div>
        <p className="text-sm text-green-100">© 2024 Learning Platform. All rights reserved.</p>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground">Create Your Account</h2>
              <p className="text-muted-foreground">Register to start your learning journey</p>
            </div>

            {/* Form Card */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <form onSubmit={handleSignUp} className="space-y-5">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                      Username <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-10 rounded-lg border-border bg-muted focus:border-secondary"
                    />
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your full name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-10 rounded-lg border-border bg-muted focus:border-secondary"
                    />
                  </div>

                  {/* School Name */}
                  <div className="space-y-2">
                    <Label htmlFor="schoolName" className="text-sm font-semibold text-foreground">
                      School Name
                    </Label>
                    <Input
                      id="schoolName"
                      type="text"
                      placeholder="Your school (optional)"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="h-10 rounded-lg border-border bg-muted focus:border-secondary"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 rounded-lg border-border bg-muted focus:border-secondary"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="repeat-password" className="text-sm font-semibold text-foreground">
                      Confirm Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      placeholder="Confirm your password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="h-10 rounded-lg border-border bg-muted focus:border-secondary"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-secondary hover:bg-secondary text-secondary-foreground font-semibold rounded-lg transition-all mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-secondary hover:underline font-semibold">
                  Sign in here
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
