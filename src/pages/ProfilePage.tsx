import { useState } from 'react'
import { Mail, Building, Shield, Key, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button, Card, CardContent, RightModal, Input, Label } from '../ui'
import { useChangePasswordMutation, useLogoutApiMutation } from '../store/apiSlice'
import { toast } from 'sonner'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()
  const [logoutApi] = useLogoutApiMutation()

  // Generate user initials
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap()
      toast.success('Password changed successfully')
      setShowPasswordModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      const msg = err?.data?.message ?? 'Failed to change password'
      toast.error(msg)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap()
    } catch {
      // Ignore backend errors on logout — still clear local state
    } finally {
      logout()
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account information and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - User Info & Security */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Card */}
          <Card className="rounded-[2xl]">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#161A61] to-[#2a309c] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {initials}
                  </div>
                  <div
                    className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 border-2 border-white rounded-full"
                    title="Active"
                  ></div>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1">
                  <Mail size={14} />
                  {user?.email}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-700 mb-3">
                  <Shield size={16} className="text-[#ff9500]" />
                  <span className="font-medium">Role:</span>
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-xs font-semibold capitalize">
                    {user?.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Building size={16} className="text-[#ff9500]" />
                  <span className="font-medium">Department:</span>
                  <span>Head Office</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="rounded-[2xl]">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Key size={18} className="text-slate-500" />
                Security
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Ensure your account uses a strong password to stay secure.
              </p>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center mt-2 text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Permissions & Activity */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="rounded-[2xl]">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Your Permissions</h3>

              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
                    <CheckCircle size={18} className="text-green-500" />
                    System Administration
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                      Manage Users
                    </span>
                    <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                      Manage Roles
                    </span>
                    <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                      View System Logs
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
                    <CheckCircle size={18} className="text-green-500" />
                    Partnership Management
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                      Create Partners
                    </span>
                    <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                      Edit Agreements
                    </span>
                    <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                      Delete Opportunities
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RightModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        subtitle="Enter your current and new password below."
      >
        <div className="p-6">
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <div className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-[#ff9500] hover:bg-[#e68a00] text-white flex items-center gap-2"
              >
                {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </RightModal>
    </div>
  )
}
