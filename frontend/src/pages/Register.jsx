import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useTitle } from '../hooks/useTitle'

export default function Register() {
  useTitle('Register')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.'
    if (!form.username || form.username.length < 3) errs.username = 'Username must be at least 3 characters.'
    if (!form.email || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters.'
    return errs
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setServerError('')
    try {
      const res = await registerApi(form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join PropSpace today</p>
        {serverError && <div className="alert-error">{serverError}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handle} placeholder="Jane Doe" />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handle} placeholder="janedoe" />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="jane@example.com" />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min. 6 characters" />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="switch-link">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  )
}