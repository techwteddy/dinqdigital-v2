import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { APP_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Sign In',
  description: `Sign in to your ${APP_NAME} account.`,
}

/** Email/password + OAuth sign-in. Redirect after login is handled in LoginForm. */
export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
