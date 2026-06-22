import type { FormEvent } from 'react'
import { LockKeyhole, Mail } from 'lucide-react'
import { Button, Card, CardContent, Input, Label } from '../ui'

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
        <div className="flex flex-col justify-center gap-8 px-4 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Login</p>
            <h1 className="mt-4 text-4xl font-bold text-[#161A61]">
              Partnership Management<br />Information
            </h1>
          </div>

          <div className="space-y-2">
            <p className="text-xl font-bold text-slate-900">Welcome Back 👋</p>
            <p className="max-w-xs text-sm text-slate-600">
              Please enter your email and password to continue.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Label htmlFor="email" className="font-semibold text-slate-900">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-12 py-3 text-base"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="font-semibold text-slate-900">Password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-12 py-3 text-base"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="h-5 w-5 rounded border-2 border-orange-300 accent-[#ff9500]" />
                <span className="font-medium text-slate-700">Remember me</span>
              </label>
              <button type="button" className="font-semibold text-[#ff9500] hover:text-orange-600">
                Forgot Password?
              </button>
            </div>
            <Button type="submit" className="w-full bg-[#ff9500] hover:bg-orange-600 text-white font-bold py-3 text-base">
              Login
            </Button>
          </form>

          <p className="text-xs text-slate-400">© 2026 EAII. All rights reserved.</p>
        </div>

        {/* Right Section */}
        <div className="relative hidden overflow-hidden rounded-3xl bg-[#161A61] p-8 text-white md:block">
          <div className="mb-6 flex justify-center">
            <img src="/images/logo.png" alt="EAII logo" className="h-24 w-24 rounded-full border-4 border-white bg-white/5" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,149,0,0.2),_transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,149,0,0.15),_transparent_40%)]" />
          
          <div className="relative flex h-full flex-col justify-end gap-6 pt-20">
            {/* Animated pattern */}
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="h-3 w-3 rounded-full bg-[#ff9500]/60" />
                  <div className="h-2 flex-1 rounded-full bg-[#ff9500]/40" />
                  <div className="h-3 w-3 rounded-full bg-[#ff9500]/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
