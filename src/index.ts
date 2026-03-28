import express from 'express'
import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors())
app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)


app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
