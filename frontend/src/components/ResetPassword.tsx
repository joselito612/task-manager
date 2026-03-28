import { useState } from 'react'
import { api } from '../api'

interface ResetPasswordProps {
  token: string
  onSuccess: () => void
}

export function ResetPassword({ token, onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      await api.auth.resetPassword(token, password)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Nueva Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nueva Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="form-group">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="button-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Contraseña'}
          </button>
        </div>
      </form>
    </div>
  )
}
