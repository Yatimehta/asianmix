export const API_BASE =
  typeof window !== 'undefined'
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api');

export function getGuestId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('asianmix_guest_id');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('asianmix_guest_id', id);
  }
  return id;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('asianmix_token');
}

// In-memory cache for fast, snappy client-side navigation
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

const apiCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<any>>();

export interface FetchApiOptions extends RequestInit {
  cacheTtlMs?: number; // 0 to disable cache, default 60000ms for GET products/categories
  skipCache?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchApiOptions = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  const isCacheable = isGet && !options.skipCache && (
    endpoint.startsWith('/products') ||
    endpoint.startsWith('/categories') ||
    endpoint.startsWith('/collections')
  );

  const cacheKey = `${endpoint}`;
  const now = Date.now();

  // Check valid cache entry
  if (isCacheable) {
    const cached = apiCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    // Deduplicate in-flight requests for the same endpoint
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }
  }

  const token = getToken();
  const guestId = getGuestId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-guest-id': guestId,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `API Error: ${res.status}`);
      }

      if (isCacheable) {
        const ttl = options.cacheTtlMs ?? 60_000; // 1 minute default cache
        apiCache.set(cacheKey, {
          data,
          timestamp: now,
          expiresAt: now + ttl,
        });
      }

      return data;
    } finally {
      if (isCacheable) {
        inFlightRequests.delete(cacheKey);
      }
    }
  })();

  if (isCacheable) {
    inFlightRequests.set(cacheKey, fetchPromise);
  }

  return fetchPromise;
}

export function clearApiCache(endpointPattern?: string) {
  if (!endpointPattern) {
    apiCache.clear();
  } else {
    apiCache.forEach((_, key) => {
      if (key.includes(endpointPattern)) {
        apiCache.delete(key);
      }
    });
  }
}

export const formatEUR = (amount: number): string => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount || 0);
};

