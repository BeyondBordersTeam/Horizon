
import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import universitiesRoutes from './routes/universityRoutes.js'
import programRoutes from './routes/programRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/universities', universitiesRoutes)
app.use('/api/university', programRoutes)


app.get('/', (req, res) => {
  res.send('Backend API is running...')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
