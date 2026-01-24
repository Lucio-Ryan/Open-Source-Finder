import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Global cache for connection
// This prevents multiple connections in serverless environments (Vercel)
// - Cold starts: creates new connection
// - Warm invocations: reuses existing connection
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if available and still connected
  if (cached.conn) {
    // Verify the connection is still alive
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
    // Connection was lost, reset cache
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      // Vercel serverless optimization settings
      maxPoolSize: 10, // Limit connections per function instance
      serverSelectionTimeoutMS: 5000, // Fail fast on connection issues
      socketTimeoutMS: 45000, // Close sockets after inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((connection) => {
      console.log('✅ Connected to MongoDB');
      return connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset promise on error so next call can retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
