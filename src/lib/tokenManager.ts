// lib/tokenManager.ts
'use client';
import Cookies from 'js-cookie';

class TokenManager {
  private static tokenKey = 'token';

  // Get token from cookies
  static getToken(): string | null {
    return Cookies.get(this.tokenKey) || null;
  }

  // Set token in cookies
  static setToken(token: string) {
    Cookies.set(this.tokenKey, token, {
      expires: 7, // أيام
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
    });
  }

  // Remove token from cookies
  static clearToken() {
    Cookies.remove(this.tokenKey, { path: '/' });
  }

  static getAuthHeaders(): Headers {
    const headers = new Headers();
    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}

export default TokenManager;
