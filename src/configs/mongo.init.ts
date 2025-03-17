import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const MONGO_DB_URL = process.env.MONGO_DB_URL
class Database {
  private static INSTANCE: Database
  private constructor() {
    this.connect()
  }
  private connect() {
    mongoose
      .connect(MONGO_DB_URL!)
      .then((_) => {
        console.log('Connected to database successfully')
      })
      .catch((err) => {
        console.log('Error connecting to database', err)
      })
  }
  public static getInstance(): Database {
    if (!Database.INSTANCE) {
      Database.INSTANCE = new Database()
    }
    return Database.INSTANCE
  }
}

const mongoInstance = Database.getInstance()
export default mongoInstance
