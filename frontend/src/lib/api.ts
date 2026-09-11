export const API_BASE =
  typeof window !== 'undefined'
    ? '/api'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api');

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

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
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

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `API Error: ${res.status}`);
  }

  return data;
}

export const formatEUR = (amount: number): string => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount || 0);
};
