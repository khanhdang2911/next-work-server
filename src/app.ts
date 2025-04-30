import express from 'express'
import cors from 'cors'
import { handleError, handleNotFound } from './middlewares/handle-error'
import router from './routes'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import startDatabase from './configs/mongo.init'
dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const allowedOrigins = process.env.FE_URL?.split(',').map((origin) => origin.trim()) || []

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(null, false)
      }
    },
    credentials: true
  })
)
startDatabase()
app.use('/api', router)
app.use(handleNotFound)
app.use(handleError)
export default app
