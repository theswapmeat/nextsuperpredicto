import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || { conn: null, promise: null };

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string) // ✅ TypeScript-safe assertion
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        console.error("❌ Failed to connect to MongoDB:", err);
        throw new Error("MongoDB connection failed");
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
