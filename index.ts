import app, { corsOptions } from '~/app'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import socketHandler from '~/socket'
dotenv.config()

const PORT = process.env.PORT ?? 8099
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

const io = new Server(server, {
  cors: corsOptions
})
socketHandler(io)

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Closing server')
    process.exit(0)
  })
})
