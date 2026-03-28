const API_URL = 'http://localhost:3000'


export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  userId: string
  createdAt: string
}

export interface AuthResponse {
  token: string
}


const apiFetch = (endpoint: string, options?: RequestInit) => {
  return fetch(`${API_URL}${endpoint}`, options)
}

const getToken = (): string | null => localStorage.getItem('token')

const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const api = {
  auth: {
    register: async (data: { name: string; email: string; password: string }) => {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Registration failed')
      }
      return res.json()
    },

    login: async (data: { email: string; password: string }) => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Login failed')
      }
      return res.json() as Promise<AuthResponse>
    },

    forgotPassword: async (email: string) => {
      const res = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to send reset email')
      }
      return res.json()
    },

    resetPassword: async (token: string, password: string) => {
      const res = await apiFetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to reset password')
      }
      return res.json()
    },
  },

  tasks: {
    getAll: async () => {
      const res = await apiFetch('/tasks', {
        headers: getAuthHeaders(),
      })
      if (!res.ok) throw new Error('Failed to fetch tasks')
      return res.json() as Promise<Task[]>
    },

    create: async (data: { title: string; description?: string }) => {
      const res = await apiFetch('/tasks', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create task')
      return res.json() as Promise<Task>
    },

    update: async (id: string, data: { title?: string; description?: string; completed?: boolean }) => {
      const res = await apiFetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update task')
      return res.json() as Promise<Task>
    },

    delete: async (id: string) => {
      const res = await apiFetch(`/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      if (!res.ok) throw new Error('Failed to delete task')
    },
  },
}
