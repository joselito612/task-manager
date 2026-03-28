import { useState, useEffect } from 'react'
import { api, Task } from '../api'

interface TasksProps {
  onLogout: () => void
}

export function Tasks({ onLogout }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const data = await api.tasks.getAll()
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      const task = await api.tasks.create({
        title: newTask.title,
        description: newTask.description || undefined,
      })
      setTasks([task, ...tasks])
      setNewTask({ title: '', description: '' })
    } catch (err) {
      setError('Failed to create task')
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      const updated = await api.tasks.update(task.id, { completed: !task.completed })
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)))
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.tasks.delete(id)
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  return (
    <div>
      <div className="header">
        <h1>My Tasks</h1>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="card">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>New Task</label>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <input
              type="text"
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-success">
            Add Task
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="card">No tasks yet. Create one above!</p>
      ) : (
        <ul className="card task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-content">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                />
                <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                  {task.title}
                </span>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
              </div>
              <div className="task-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
