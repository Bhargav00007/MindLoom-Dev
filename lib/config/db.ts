import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "⚠️ Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Extend the global type to add a mongoose property
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("✅ MongoDB connected successfully!");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
