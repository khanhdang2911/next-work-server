import express from 'express'
import cors from 'cors'
import mongoInstance from './configs/mongo.init'
import { handleError, handleNotFound } from './middlewares/handleError'
import router from './routes'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FE_URL, // Frontend URL
    credentials: true // Allow cookies
  })
)
app.use('/api', router)
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
mongoInstance
app.use(handleNotFound)
app.use(handleError)
export default app
