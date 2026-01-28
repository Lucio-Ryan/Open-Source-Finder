import mongoose from 'mongoose';

/**
 * MongoDB Connection Manager - Optimized for Vercel Serverless
 * 
 * Key optimizations for serverless without static IP:
 * 1. Single connection per function instance (maxPoolSize: 1)
 * 2. Aggressive connection reuse via global cache
 * 3. Short timeouts to fail fast on network issues
 * 4. No keepAlive since functions are ephemeral
 * 5. Disabled auto-indexing in production
 * 6. Promise deduplication to prevent connection storms
 */

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    lastConnected: number;
    connectionId: number;
  };
}

// Global cache for connection - survives across warm invocations
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { 
    conn: null, 
    promise: null, 
    lastConnected: 0,
    connectionId: 0 
  };
}

// Connection health check interval - shorter for serverless (2 minutes)
const CONNECTION_HEALTH_INTERVAL = 2 * 60 * 1000;

// Connection timeout for serverless - slightly more generous for cold starts
const SERVERLESS_TIMEOUT = 8000;

// Maximum retries for initial connection
const MAX_CONNECTION_RETRIES = 2;

// Delay between connection retries (ms)
const CONNECTION_RETRY_DELAY = 1000;

/**
 * Get or create a MongoDB connection optimized for Vercel serverless.
 * Uses aggressive caching and connection reuse to minimize connections.
 * Includes retry logic for cold start reliability.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  const now = Date.now();
  
  // Fast path: return existing healthy connection
  if (cached.conn) {
    const readyState = mongoose.connection.readyState;
    
    // Connection states: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (readyState === 1) {
      // Skip health check if recently connected (saves a round trip)
      if (now - cached.lastConnected < CONNECTION_HEALTH_INTERVAL) {
        return cached.conn;
      }
      
      // Quick health check - use cached connection if ping succeeds
      try {
        // Use Promise.race to enforce timeout on ping
        const pingPromise = mongoose.connection.db?.admin().ping();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Ping timeout')), 2000)
        );
        await Promise.race([pingPromise, timeoutPromise]);
        cached.lastConnected = now;
        return cached.conn;
      } catch {
        // Connection stale, will reconnect below
        console.warn('⚠️ MongoDB connection stale, reconnecting...');
        resetCache();
      }
    } else if (readyState === 2 && cached.promise) {
      // Currently connecting, wait for existing promise (deduplication)
      return cached.promise;
    } else {
      // Connection lost or in bad state
      resetCache();
    }
  }

  // If there's already a connection promise in flight, wait for it
  // This prevents connection storms during concurrent requests
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch {
      // Promise failed, reset and try again
      resetCache();
    }
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // Optimized MongoDB connection options for Vercel serverless
  // These settings minimize connections while maintaining reliability
  const opts: mongoose.ConnectOptions = {
    // Disable command buffering - fail fast if not connected
    bufferCommands: false,
    
    // === CRITICAL: Connection pool for serverless ===
    // Use minimal pool size since each serverless function instance
    // gets its own pool. This dramatically reduces total connections.
    maxPoolSize: 1,               // Single connection per instance
    minPoolSize: 0,               // Don't maintain idle connections
    
    // === Timeout Configuration ===
    // Aggressive timeouts to fail fast and not waste function execution time
    serverSelectionTimeoutMS: SERVERLESS_TIMEOUT,  // Fast fail on server selection
    socketTimeoutMS: 30000,       // Socket timeout for operations
    connectTimeoutMS: SERVERLESS_TIMEOUT,  // Connection establishment timeout
    
    // === Connection Lifecycle ===
    maxIdleTimeMS: 10000,         // Close idle connections quickly (10s)
    waitQueueTimeoutMS: SERVERLESS_TIMEOUT, // Don't wait long for pool slot
    
    // === Reliability ===
    writeConcern: { w: 1 },       // Acknowledge writes
    readPreference: 'primaryPreferred', // Prefer primary, fallback to secondary
    retryWrites: true,            // Auto-retry transient write failures
    retryReads: true,             // Auto-retry transient read failures
    
    // === Monitoring (reduced for serverless) ===
    heartbeatFrequencyMS: 30000,  // Less frequent heartbeats
    
    // === Indexing ===
    autoIndex: false,             // Never auto-index in serverless (use migration)
    
    // === Compression ===
    compressors: ['zstd', 'zlib'], // Compress data transfer
  };

  // Create connection promise with retry wrapper
  const connectionId = ++cached.connectionId;
  
  // Connection function with retry logic
  const attemptConnection = async (attempt: number = 0): Promise<typeof mongoose> => {
    try {
      const connection = await mongoose.connect(MONGODB_URI, opts);
      
      // Only log on actual new connections, not cached
      if (connectionId === cached.connectionId) {
        console.log(`✅ MongoDB connected (id: ${connectionId}, attempt: ${attempt + 1})`);
      }
      
      cached.lastConnected = Date.now();
      
      // Set up error handlers only once
      if (!mongoose.connection.listeners('error').length) {
        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err.message);
          resetCache();
        });

        mongoose.connection.on('disconnected', () => {
          console.warn('⚠️ MongoDB disconnected');
          resetCache();
        });
      }

      return connection;
    } catch (error) {
      const isRetryable = attempt < MAX_CONNECTION_RETRIES;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (isRetryable) {
        console.warn(`⚠️ MongoDB connection attempt ${attempt + 1} failed: ${errorMessage}. Retrying in ${CONNECTION_RETRY_DELAY}ms...`);
        // Reset before retry
        resetCache();
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, CONNECTION_RETRY_DELAY));
        // Retry with incremented attempt
        return attemptConnection(attempt + 1);
      }
      
      // All retries exhausted
      console.error(`❌ MongoDB connection failed after ${attempt + 1} attempts: ${errorMessage}`);
      resetCache();
      throw error;
    }
  };
  
  cached.promise = attemptConnection();

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    resetCache();
    throw e;
  }

  return cached.conn;
}

/**
 * Reset the connection cache - used on errors and disconnects
 */
function resetCache(): void {
  cached.conn = null;
  cached.promise = null;
}

/**
 * Lightweight connection check without creating new connection
 * Use this to check if we have an active connection before expensive operations
 */
export function hasActiveConnection(): boolean {
  return cached.conn !== null && mongoose.connection.readyState === 1;
}

/**
 * Get the current connection status for debugging/monitoring
 */
export function getConnectionStatus(): {
  isConnected: boolean;
  readyState: number;
  lastConnected: number;
  connectionId: number;
} {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    lastConnected: cached.lastConnected,
    connectionId: cached.connectionId,
  };
}

/**
 * Close the database connection gracefully
 * Call this before function termination if doing cleanup
 */
export async function closeConnection(): Promise<void> {
  if (cached.conn) {
    try {
      await mongoose.connection.close();
    } catch (e) {
      console.warn('Error closing MongoDB connection:', e);
    }
    resetCache();
  }
}

/**
 * Execute a database operation with automatic connection management.
 * This is the recommended way to run database operations in serverless.
 * 
 * @param operation - Async function that performs database operations
 * @returns Result of the operation
 * 
 * @example
 * const users = await withDatabase(async () => {
 *   return User.find({ active: true }).lean();
 * });
 */
export async function withDatabase<T>(operation: () => Promise<T>): Promise<T> {
  await connectToDatabase();
  return operation();
}

export default connectToDatabase;
