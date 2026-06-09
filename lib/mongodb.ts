import mongoose from "mongoose";
import { getConfig } from "@/lib/config";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  return connectDBWithUri();
}

export async function connectDBWithUri(
  uriOverride?: string
): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return cached.conn;
  }

  const uri = uriOverride ?? (await getConfig("MONGODB_URI"));
  if (!uri) {
    throw new Error("MongoDB URI is not configured");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function testMongoConnection(uri: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const conn = await mongoose.createConnection(uri).asPromise();
    await conn.close();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Connection failed",
    };
  }
}
