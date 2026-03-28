import { Router } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
})

router.get('/', async (req: AuthRequest, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(tasks)
    console.log("USER ID:", req.user)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = taskSchema.parse(req.body)

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        userId: req.user!.userId,
      },
    })

    res.status(201).json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id)
    const data = updateTaskSchema.parse(req.body)

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask || existingTask.userId !== req.user!.userId) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const task = await prisma.task.update({
      where: { id },
      data,
    })

    res.json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const id = String(req.params.id)

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask || existingTask.userId !== req.user!.userId) {
      return res.status(404).json({ error: 'Task not found' })
    }

    await prisma.task.delete({
      where: { id },
    })

    res.status(204).send()
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
