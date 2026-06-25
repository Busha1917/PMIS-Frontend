import type { FormEvent } from 'react'
import { LockKeyhole, Mail } from 'lucide-react'
import { Button, Card, Input, Label } from '../ui'
import { Footer } from '../layout/Footer'

type LoginPageProps = {
  onLogin?: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onLogin?.()
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 rounded-3xl bg-white p-8 shadow-lg md:grid-cols-[1.1fr_0.9fr] lg:p-12">
        {/* Left Section */}
        <div className="flex flex-col justify-center gap-2 px-2 py-4">
          <div className="max-w-[320px] w-full mx-auto">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Login</p>
              <h1 className="mt-1 text-xl font-semibold text-[#161A61]">
                Partnership Management
                <br />
                Information
              </h1>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900">Welcome Back 👋</p>
              <p className="text-sm text-slate-600">
                Please enter your email and password to continue.
              </p>
            </div>

            <form className="space-y-2" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Label htmlFor="email" className="font-semibold text-slate-900">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-8 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="font-semibold text-slate-900">
                  Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-8 py-1.5 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-3 w-3 rounded border-2 border-orange-300 accent-[#ff9500]"
                  />
                  <span className="font-medium text-slate-700 text-sm">Remember me</span>
                </label>
                <button
                  type="button"
                  className="font-medium text-[#ff9500] hover:text-orange-600 text-sm"
                >
                  Forgot Password?
                </button>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#ff9500] hover:bg-orange-600 text-white font-semibold py-1.5 text-sm"
              >
                Login
              </Button>
            </form>

            <p className="text-xs text-slate-400">© 2026 EAII. All rights reserved.</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative hidden md:block">
          <div className="overflow-hidden rounded-[14px] h-full min-h-[480px]">
            <img
              src="/images/login.png"
              alt="Login illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl">
        <Footer />
      </div>
    </div>
  )
}
