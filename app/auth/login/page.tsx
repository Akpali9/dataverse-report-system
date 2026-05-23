// app/auth/login/page.js (updated)
'use client'

import { loginWithEmailAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await loginWithEmailAction(email, password)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
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
            📚
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white max-w-lg">
            Welcome back to your learning platform
          </h1>
          <p className="text-lg text-blue-100">
            Access your courses, assignments, and track your progress.
          </p>
        </div>
        <p className="text-sm text-blue-100">© 2024 Learning Platform. All rights reserved.</p>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground">Sign In</h2>
              <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            {/* Form Card */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 rounded-lg border-border bg-muted focus:border-primary"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                        Password
                      </Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    className="w-full h-10 bg-primary hover:bg-primary text-primary-foreground font-semibold rounded-lg transition-all"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">New here?</span>
                </div>
              </div>

              <Link href="/auth/sign-up" className="block">
                <Button variant="outline" className="w-full h-10 border-border hover:border-primary hover:bg-background text-foreground">
                  Create Student Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
