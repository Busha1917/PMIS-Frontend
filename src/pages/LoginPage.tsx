import { useState, type FormEvent } from 'react'
import { EyeOff, Eye, Mail, Loader2 } from 'lucide-react'
import { Button, Input, Label } from '../ui'
import { useLoginMutation } from '../store/apiSlice'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

type LoginPageProps = {
  onLogin?: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loginApi, { isLoading }] = useLoginMutation()
  const { login } = useAuth()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email || !password) {
      toast.error('Please enter your email and password.')
      return
    }

    try {
      const rawResult = await loginApi({ email, password }).unwrap()

      // The backend might wrap the payload in { data: ... }
      const result = (rawResult as any)?.data || rawResult

      const token = result?.accessToken || result?.access_token || result?.token
      const refreshToken = result?.refreshToken || result?.refresh_token

      if (!token) {
        console.error('No token found in response:', rawResult)
        toast.error('Login failed: Invalid server response format')
        return
      }

      // Persist refresh token for silent renewal
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
      }

      // Store the token and user in Redux + localStorage
      login({
        user: {
          id: result.user?.id ?? 'unknown',
          name: result.user?.fullName ?? result.user?.email ?? email,
          email: result.user?.email ?? email,
          role: result.user?.role?.name ?? result.user?.roles?.[0]?.name ?? 'Officer',
        },
        token,
      })

      toast.success('Login successful!')
      onLogin?.()
    } catch (err: any) {
      const msg = err?.data?.message ?? err?.message ?? 'Invalid credentials. Please try again.'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr] bg-white rounded-[28px] p-3 shadow-xl relative overflow-hidden min-h-[500px]">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center py-6 px-4 sm:px-6 relative w-full h-full">
          <div className="w-full max-w-[320px] flex flex-col items-center justify-center h-full">
            <div className="text-center mb-10 w-full">
              <h1 className="text-[16px] lg:text-[18px] font-extrabold text-[#161A61] uppercase tracking-wider leading-snug">
                Partnership Management
                <br />
                Information
              </h1>
            </div>

            <div className="text-center space-y-1 mb-8">
              <p className="text-lg font-bold text-[#161A61]">Welcome Back 👋</p>
              <p className="text-xs text-slate-500 font-medium">
                Please enter your email and password to continue
              </p>
            </div>

            <form className="w-full space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5 text-left">
                <Label htmlFor="email" className="font-semibold text-slate-700 text-xs ml-1">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="pl-9 py-2.5 text-xs bg-slate-50 border-slate-200 focus:border-[#F58A27] focus:ring-[#F58A27] rounded-md h-10 w-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="password" className="font-semibold text-slate-700 text-xs ml-1">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="px-3 pr-9 py-2.5 text-xs bg-slate-50 border-slate-200 focus:border-[#F58A27] focus:ring-[#F58A27] rounded-md h-10 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#F58A27]"></div>
                  <span className="ml-2 text-xs font-medium text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="font-medium text-[#4C6FFF] hover:text-blue-800 text-xs"
                >
                  Forget Password?
                </button>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#F58A27] hover:bg-[#e07b22] text-white font-bold py-2.5 rounded-lg text-sm h-10 transition-colors uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'LOGIN'
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="absolute bottom-4 w-full text-center">
            <p className="text-[11px] font-medium text-slate-400">
              © 2026 EAII. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-full h-full relative items-center justify-center bg-[#161A61] rounded-[24px]">
          <img
            src="/images/login.png"
            alt="Login illustration"
            className="w-full h-full object-contain p-2"
          />
        </div>
      </div>
    </div>
  )
}
