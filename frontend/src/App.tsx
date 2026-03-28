import { useState, useEffect } from 'react'
import { Auth } from './components/Auth'
import { Tasks } from './components/Tasks'
import { ForgotPassword } from './components/ForgotPassword'
import { ResetPassword } from './components/ResetPassword'

type View = 'login' | 'forgot' | 'reset'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [view, setView] = useState<View>('login')
  const [resetToken, setResetToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)

    const params = new URLSearchParams(window.location.search)
    const resetToken = params.get('token')
    if (resetToken) {
      setResetToken(resetToken)
      setView('reset')
    }
  }, [])

  const handleLogin = (_token: string) => {
    setIsAuthenticated(true)
    setView('login')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  const handleResetSuccess = () => {
    setView('login')
  }

  return (
    <div className="container">
      {isAuthenticated ? (
        <Tasks onLogout={handleLogout} />
      ) : (
        <>
          <h1>Task Manager</h1>
          {view === 'login' && (
            <Auth onLogin={handleLogin} onForgotPassword={() => setView('forgot')} />
          )}
          {view === 'forgot' && (
            <ForgotPassword onBack={() => setView('login')} />
          )}
          {view === 'reset' && resetToken && (
            <ResetPassword token={resetToken} onSuccess={handleResetSuccess} />
          )}
        </>
      )}
    </div>
  )
}

export default App
