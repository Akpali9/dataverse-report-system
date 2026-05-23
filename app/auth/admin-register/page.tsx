'use client'

import { adminSignUpAction } from '@/app/actions/auth'
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
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
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

    if (!username || !fullName || !email) {
      setError('All fields are required')
      setIsLoading(false)
      return
    }

    try {
      const result = await adminSignUpAction(email, password, username, fullName)
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-700 flex-col justify-between p-12">
        <div>
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg">
            👨‍🏫
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white max-w-lg">
            Empower your teaching
          </h1>
          <p className="text-lg text-blue-100">
            Manage assignments, track student progress, and create engaging learning experiences.
          </p>
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-blue-50">
              <span>✓</span> Organize and manage courses effortlessly
            </div>
            <div className="flex items-center gap-3 text-blue-50">
              <span>✓</span> Create assignments and grading rubrics
            </div>
            <div className="flex items-center gap-3 text-blue-50">
              <span>✓</span> Monitor student progress in real-time
            </div>
            <div className="flex items-center gap-3 text-blue-50">
              <span>✓</span> Communicate with students instantly
            </div>
          </div>
        </div>
        <p className="text-sm text-blue-100">© 2024 Learning Platform. All rights reserved.</p>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground">Instructor Registration</h2>
              <p className="text-muted-foreground">Create your account to start teaching</p>
            </div>

            {/* Form Card */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <form onSubmit={handleSignUp} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@school.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 rounded-lg border-border bg-muted focus:border-primary"
                    />
                  </div>

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
                      className="h-10 rounded-lg border-border bg-muted focus:border-primary"
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
                      className="h-10 rounded-lg border-border bg-muted focus:border-primary"
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
                      className="h-10 rounded-lg border-border bg-muted focus:border-primary"
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
                      className="h-10 rounded-lg border-border bg-muted focus:border-primary"
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
                    className="w-full h-10 bg-primary hover:bg-primary text-primary-foreground font-semibold rounded-lg transition-all mt-2"
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
                <Link href="/auth/login" className="text-primary hover:underline font-semibold">
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
