import { useState } from 'react'
import { api } from '../api'

interface AuthProps {
  onLogin: (token: string) => void
  onForgotPassword: () => void
}

export function Auth({ onLogin, onForgotPassword }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { token } = await api.auth.login({
          email: formData.email,
          password: formData.password,
        })
        localStorage.setItem('token', token)
        onLogin(token)
      } else {
        await api.auth.register(formData)
        setIsLogin(true)
        setFormData({ name: '', email: '', password: '' })
        setError('Registration successful! Please login.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="card">
      <div className="auth-tabs">

       
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div className="button-group">
        {error && <p className="error">{error}</p>}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
                </button>
                
                <button
                  className={`btn ${!isLogin ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
        </div>
        
      </form>
      {isLogin && (
        <button className="btn-link" onClick={onForgotPassword}>
          ¿Olvidaste tu contraseña?
        </button>
      )}
    </div>
  )
}
