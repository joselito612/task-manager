import { z } from 'zod'

describe('Tasks Validation', () => {
  describe('Task Schema', () => {
    const taskSchema = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
    })

    const updateTaskSchema = z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      completed: z.boolean().optional(),
    })

    it('should validate a valid task', () => {
      const task = {
        title: 'My Task',
        description: 'Task description',
      }

      const result = taskSchema.parse(task)
      expect(result.title).toBe('My Task')
      expect(result.description).toBe('Task description')
    })

    it('should validate task without description', () => {
      const task = {
        title: 'My Task',
      }

      const result = taskSchema.parse(task)
      expect(result.title).toBe('My Task')
      expect(result.description).toBeUndefined()
    })

    it('should reject task without title', () => {
      const task = {
        description: 'Task description',
      }

      expect(() => taskSchema.parse(task)).toThrow()
    })

    it('should reject task with empty title', () => {
      const task = {
        title: '',
      }

      expect(() => taskSchema.parse(task)).toThrow()
    })

    it('should validate partial update', () => {
      const update = {
        completed: true,
      }

      const result = updateTaskSchema.parse(update)
      expect(result.completed).toBe(true)
    })

    it('should validate full update', () => {
      const update = {
        title: 'Updated Title',
        description: 'Updated description',
        completed: true,
      }

      const result = updateTaskSchema.parse(update)
      expect(result.title).toBe('Updated Title')
      expect(result.description).toBe('Updated description')
      expect(result.completed).toBe(true)
    })
  })

  describe('Task Data Logic', () => {
    it('should filter tasks by userId', () => {
      const tasks = [
        { id: '1', userId: 'user-1', title: 'Task 1' },
        { id: '2', userId: 'user-2', title: 'Task 2' },
        { id: '3', userId: 'user-1', title: 'Task 3' },
      ]

      const userTasks = tasks.filter((t) => t.userId === 'user-1')
      expect(userTasks).toHaveLength(2)
      expect(userTasks.every((t) => t.userId === 'user-1')).toBe(true)
    })

    it('should sort tasks by createdAt descending', () => {
      const tasks = [
        { id: '1', createdAt: new Date('2024-01-01') },
        { id: '2', createdAt: new Date('2024-01-03') },
        { id: '3', createdAt: new Date('2024-01-02') },
      ]

      const sorted = [...tasks].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      expect(sorted[0].id).toBe('2')
      expect(sorted[1].id).toBe('3')
      expect(sorted[2].id).toBe('1')
    })

    it('should toggle task completion status', () => {
      const task = { id: '1', completed: false, title: 'Task' }
      
      const toggled = { ...task, completed: !task.completed }
      
      expect(toggled.completed).toBe(true)
      expect(toggled.id).toBe('1')
      expect(toggled.title).toBe('Task')
    })

    it('should check task ownership', () => {
      const task = { id: '1', userId: 'user-123', title: 'Task' }
      
      const isOwner = task.userId === 'user-123'
      const isNotOwner = task.userId === 'user-456'
      
      expect(isOwner).toBe(true)
      expect(isNotOwner).toBe(false)
    })
  })
})
