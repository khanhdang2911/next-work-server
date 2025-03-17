import app from '~/app'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8999

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Closing server')
    process.exit(0)
  })
})
