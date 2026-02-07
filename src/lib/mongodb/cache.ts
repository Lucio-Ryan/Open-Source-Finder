/**
 * In-memory caching layer for MongoDB queries
 * Optimized for both serverless and persistent server environments
 * 
 * Features:
 * - Query result caching with TTL
 * - Request deduplication (prevents concurrent identical queries)
 * - Pattern-based invalidation
 * - Memory-safe with automatic eviction
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  deduplicated: number;
  size: number;
}

// Default TTL values (in milliseconds)
// Longer TTLs for serverless to maximize cache hits
export const CacheTTL = {
  SHORT: 60 * 1000,         // 1 minute - for frequently changing data
  MEDIUM: 3 * 60 * 1000,    // 3 minutes - for moderately changing data
  LONG: 10 * 60 * 1000,     // 10 minutes - for rarely changing data
  STATIC: 30 * 60 * 1000,   // 30 minutes - for static reference data (categories, tags)
  SEARCH: 2 * 60 * 1000,    // 2 minutes - for search results
};

class QueryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private stats: CacheStats = { hits: 0, misses: 0, deduplicated: 0, size: 0 };
  private maxSize: number = 500; // Reduced for serverless memory constraints

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.size = this.cache.size;
      return null;
    }

    this.stats.hits++;
    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl: number = CacheTTL.MEDIUM): void {
    // Limit cache size to prevent memory issues in serverless
    if (this.cache.size >= this.maxSize) {
      this.evictOldest(Math.floor(this.maxSize * 0.2)); // Evict 20%
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    this.stats.size = this.cache.size;
  }

  /**
   * Check if a request is already pending for this key
   */
  hasPending(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  /**
   * Get a pending request promise
   */
  getPending<T>(key: string): Promise<T> | null {
    return this.pendingRequests.get(key) || null;
  }

  /**
   * Set a pending request
   */
  setPending<T>(key: string, promise: Promise<T>): void {
    this.pendingRequests.set(key, promise);
    // Clean up after promise resolves
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.stats.size = this.cache.size;
    return result;
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      count++;
    });
    
    this.stats.size = this.cache.size;
    return count;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    this.stats.size = 0;
  }

  /**
   * Evict oldest entries when cache is full
   */
  private evictOldest(count: number = 1): void {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, count);
    
    for (const [key] of entries) {
      this.cache.delete(key);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats & { hitRate: number; deduplicationRate: number } {
    const total = this.stats.hits + this.stats.misses;
    const dedupeTotal = this.stats.deduplicated + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      deduplicationRate: dedupeTotal > 0 ? this.stats.deduplicated / dedupeTotal : 0,
    };
  }

  /**
   * Increment deduplicated count
   */
  recordDeduplicated(): void {
    this.stats.deduplicated++;
  }
}

// Singleton cache instance
export const queryCache = new QueryCache();

/**
 * Cache key generators for consistent key naming
 */
export const CacheKeys = {
  // Alternatives
  alternatives: (options?: Record<string, any>) => 
    `alternatives:${JSON.stringify(options || {})}`,
  alternativeBySlug: (slug: string) => `alternative:slug:${slug}`,
  alternativesByCategory: (categorySlug: string) => `alternatives:category:${categorySlug}`,
  alternativesByTag: (tagSlug: string) => `alternatives:tag:${tagSlug}`,
  alternativesByTechStack: (techSlug: string) => `alternatives:tech:${techSlug}`,
  alternativesFor: (proprietarySlug: string) => `alternatives:for:${proprietarySlug}`,
  selfHostedAlternatives: () => `alternatives:self-hosted`,
  featuredAlternatives: () => `alternatives:featured`,
  
  // Categories
  categories: () => `categories:all`,
  categoryBySlug: (slug: string) => `category:slug:${slug}`,
  categoriesWithCount: () => `categories:with-count`,
  
  // Tech Stacks
  techStacks: () => `techstacks:all`,
  techStackBySlug: (slug: string) => `techstack:slug:${slug}`,
  techStacksWithCount: () => `techstacks:with-count`,
  
  // Tags
  tags: () => `tags:all`,
  tagBySlug: (slug: string) => `tag:slug:${slug}`,
  tagsWithCount: () => `tags:with-count`,
  
  // Proprietary Software
  proprietarySoftware: () => `proprietary:all`,
  proprietaryBySlug: (slug: string) => `proprietary:slug:${slug}`,
  
  // Stats
  stats: () => `stats:global`,
  
  // Search
  search: (query: string) => `search:${query.toLowerCase().trim()}`,
  
  // Launches
  launches: (params: Record<string, any>) => `launches:${JSON.stringify(params)}`,
  
  // Votes
  voteScore: (alternativeId: string) => `vote:score:${alternativeId}`,
};

/**
 * Decorator-style cache wrapper for async functions
 * Includes request deduplication to prevent duplicate DB calls
 * With retry logic for transient failures
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>,
  options?: { retries?: number; retryDelay?: number }
): Promise<T> {
  const { retries = 2, retryDelay = 500 } = options || {};
  
  // Try to get from cache first
  const cached = queryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Check if there's already a pending request for this key
  // This prevents multiple concurrent requests from hitting the database
  const pending = queryCache.getPending<T>(key);
  if (pending) {
    queryCache.recordDeduplicated();
    try {
      return await pending;
    } catch (error) {
      // If the pending request failed, we should try our own fetch
      // Don't return the failed promise, fall through to retry
      console.warn(`Pending request for ${key} failed, retrying...`);
    }
  }

  // Create fetch with retry logic
  const fetchWithRetry = async (attempt: number = 0): Promise<T> => {
    try {
      const data = await fetcher();
      queryCache.set(key, data, ttl);
      return data;
    } catch (error) {
      // Check for stale data to return on error
      const staleKey = `${key}:stale`;
      const staleData = queryCache.get<T>(staleKey);
      
      if (attempt < retries) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        return fetchWithRetry(attempt + 1);
      }
      
      // All retries exhausted, try to return stale data if available
      if (staleData !== null) {
        console.warn(`Using stale data for ${key} after ${retries + 1} failed attempts`);
        return staleData;
      }
      
      // No stale data, re-throw the error
      throw error;
    }
  };

  // Create and track the fetch promise
  const fetchPromise = fetchWithRetry();

  queryCache.setPending(key, fetchPromise);
  
  // Also store as stale data for future fallback (with longer TTL)
  fetchPromise.then((data) => {
    const staleKey = `${key}:stale`;
    queryCache.set(staleKey, data, ttl * 5); // Stale data lives 5x longer
  }).catch(() => {
    // Ignore - stale data storage is best-effort
  });
  
  return fetchPromise;
}

/**
 * Cache wrapper that allows stale data while revalidating
 * Good for data that can be slightly stale (e.g., counts, stats)
 */
export async function withStaleWhileRevalidate<T>(
  key: string,
  ttl: number,
  staleTtl: number, // How long stale data can be served while revalidating
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = queryCache.get<T>(key);
  
  if (cached !== null) {
    return cached;
  }

  // Check for stale data
  const staleKey = `${key}:stale`;
  const staleData = queryCache.get<T>(staleKey);
  
  if (staleData !== null) {
    // Return stale data immediately, revalidate in background
    // Don't await - fire and forget
    withCache(key, ttl, fetcher).catch(() => {});
    return staleData;
  }

  // No stale data, must fetch
  const data = await withCache(key, ttl, fetcher);
  
  // Store as stale for future use
  queryCache.set(staleKey, data, staleTtl);
  
  return data;
}

/**
 * Invalidate cache after write operations
 */
export function invalidateOnWrite(entities: string[]): void {
  for (const entity of entities) {
    switch (entity) {
      case 'alternative':
      case 'alternatives':
        queryCache.invalidatePattern('^alternatives?:');
        queryCache.invalidatePattern('^search:');
        queryCache.invalidatePattern('^launches:');
        queryCache.invalidatePattern('^stats:');
        break;
      case 'category':
      case 'categories':
        queryCache.invalidatePattern('^categor');
        queryCache.invalidatePattern('^alternatives:category:');
        break;
      case 'techstack':
      case 'tech_stacks':
        queryCache.invalidatePattern('^techstack');
        queryCache.invalidatePattern('^alternatives:tech:');
        break;
      case 'tag':
      case 'tags':
        queryCache.invalidatePattern('^tag');
        queryCache.invalidatePattern('^alternatives:tag:');
        break;
      case 'proprietary':
        queryCache.invalidatePattern('^proprietary:');
        queryCache.invalidatePattern('^alternatives:for:');
        break;
      case 'vote':
      case 'votes':
        queryCache.invalidatePattern('^vote:');
        queryCache.invalidatePattern('^alternatives:');
        queryCache.invalidatePattern('^launches:');
        break;
      default:
        // Clear all if unknown entity type
        queryCache.clear();
    }
  }
}

export default queryCache;
