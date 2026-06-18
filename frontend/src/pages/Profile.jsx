import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile, updatePassword } from '../services/userService'
import { useTitle } from '../hooks/useTitle'
import './Profile.css'

export default function Profile() {
  useTitle('Account Settings')
  const { user, updateUser } = useAuth()

  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', avatar: user?.avatar || '' })
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' })
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleProfile = (e) => setProfileForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handlePassword = (e) => setPasswordForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submitProfile = async (e) => {
    e.preventDefault()
    const errs = {}
    if (profileForm.avatar && !/^https?:\/\/.+/.test(profileForm.avatar)) errs.avatar = 'Must be a valid URL.'
    if (Object.keys(errs).length) { setProfileErrors(errs); return }
    setProfileLoading(true); setProfileMsg(''); setProfileErr('')
    try {
      const res = await updateProfile(profileForm)
      updateUser(res.data.user)
      setProfileMsg('Profile updated successfully!')
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Update failed.')
    } finally {
      setProfileLoading(false)
    }
  }

  const submitPassword = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!passwordForm.oldPassword) errs.oldPassword = 'Current password required.'
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) errs.newPassword = 'Min. 6 characters.'
    if (Object.keys(errs).length) { setPasswordErrors(errs); return }
    setPasswordLoading(true); setPasswordMsg(''); setPasswordErr('')
    try {
      await updatePassword(passwordForm)
      setPasswordMsg('Password changed successfully!')
      setPasswordForm({ oldPassword: '', newPassword: '' })
    } catch (err) {
      setPasswordErr(err.response?.data?.message || 'Password update failed.')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <h2>Account Settings</h2>
      <div className="sections">
        <section className="card">
          <h3>Profile Information</h3>
          {profileMsg && <div className="alert-success">{profileMsg}</div>}
          {profileErr && <div className="alert-error">{profileErr}</div>}
          <form onSubmit={submitProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="fullName" value={profileForm.fullName} onChange={handleProfile} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={profileForm.phone} onChange={handleProfile} placeholder="+1 555 000 0000" />
            </div>
            <div className="form-group">
              <label>Avatar URL</label>
              <input name="avatar" value={profileForm.avatar} onChange={handleProfile} placeholder="https://..." />
              {profileErrors.avatar && <span className="field-error">{profileErrors.avatar}</span>}
            </div>
            <button type="submit" className="btn-primary" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </section>

        <section className="card">
          <h3>Change Password</h3>
          {passwordMsg && <div className="alert-success">{passwordMsg}</div>}
          {passwordErr && <div className="alert-error">{passwordErr}</div>}
          <form onSubmit={submitPassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input name="oldPassword" type="password" value={passwordForm.oldPassword} onChange={handlePassword} placeholder="••••••••" />
              {passwordErrors.oldPassword && <span className="field-error">{passwordErrors.oldPassword}</span>}
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePassword} placeholder="Min. 6 characters" />
              {passwordErrors.newPassword && <span className="field-error">{passwordErrors.newPassword}</span>}
            </div>
            <button type="submit" className="btn-primary" disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}