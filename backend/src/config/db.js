import mongoose from 'mongoose'
import { ENV } from './env.js'

const connectDB = async () => {
  try {
  await mongoose.connect(ENV.DB_URL)
    console.log(`MongoDB connected successfully: ${mongoose.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB