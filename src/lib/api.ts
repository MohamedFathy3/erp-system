// lib/api.ts
import TokenManager from './tokenManager';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${endpoint}`;

  const headers = new Headers(options.headers || {});
  const tokenHeaders = TokenManager.getAuthHeaders();
  tokenHeaders.forEach((value, key) => headers.set(key, value));

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  const res = await fetch(url, finalOptions);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message);
  }

  const contentType = res.headers.get('content-type');
  return contentType?.includes('application/json') ? res.json() : res.text();
}
