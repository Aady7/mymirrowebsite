interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SessionCache {
  private static instance: SessionCache;
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  static getInstance(): SessionCache {
    if (!SessionCache.instance) {
      SessionCache.instance = new SessionCache();
    }
    return SessionCache.instance;
  }

  private getStorageKey(key: string): string {
    return `mymirro_cache_${key}`;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    try {
      const cacheEntry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL
      };
      
      sessionStorage.setItem(
        this.getStorageKey(key),
        JSON.stringify(cacheEntry)
      );
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const cached = sessionStorage.getItem(this.getStorageKey(key));
      if (!cached) return null;

      const cacheEntry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache has expired
      if (now - cacheEntry.timestamp > cacheEntry.ttl) {
        this.remove(key);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      this.remove(key);
      return null;
    }
  }

  remove(key: string): void {
    try {
      sessionStorage.removeItem(this.getStorageKey(key));
    } catch (error) {
      console.warn('Failed to remove cached data:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('mymirro_cache_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Method to check if cache exists but is expired
  isExpired(key: string): boolean {
    try {
      const cached = sessionStorage.getItem(this.getStorageKey(key));
      if (!cached) return false;

      const cacheEntry: CacheEntry<any> = JSON.parse(cached);
      const now = Date.now();
      
      return now - cacheEntry.timestamp > cacheEntry.ttl;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const cache = SessionCache.getInstance();

// Cache keys constants
export const CACHE_KEYS = {
  STYLE_QUIZ_DATA: 'style_quiz_data',
  USER_OUTFITS: 'user_outfits',
  GENERATED_OUTFITS: 'generated_outfits',
  USER_ID: 'user_id'
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,    // 2 minutes
  MEDIUM: 5 * 60 * 1000,   // 5 minutes
  LONG: 15 * 60 * 1000,    // 15 minutes
  VERY_LONG: 30 * 60 * 1000 // 30 minutes
} as const; 