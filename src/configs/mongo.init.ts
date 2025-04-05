import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const MONGO_DB_URL = process.env.MONGO_DB_URL
class Database {
  private static INSTANCE: Database
  private constructor() {}
  private async connect(): Promise<void> {
    try {
      if (!MONGO_DB_URL) {
        throw new Error('MONGO_DB_URL is not defined in environment variables')
      }
      await mongoose.connect(MONGO_DB_URL)
      console.log('✅ Connected to database successfully')
    } catch (err) {
      console.error('❌ Error connecting to database', err)
      process.exit(1)
    }
  }
  public static async getInstance(): Promise<Database> {
    if (!Database.INSTANCE) {
      Database.INSTANCE = new Database()
      await Database.INSTANCE.connect()
    }
    return Database.INSTANCE
  }
}
const startDatabase = async () => {
  await Database.getInstance()
}

export default startDatabase
