import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local')

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.error("❌ Failed to connect to MongoDB:", err);
        throw new Error("MongoDB connection failed");
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    throw err; // Let your route or page handler catch this
  }
}
