class TokenManager {
  private static tokenKey = 'token';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  static setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  static clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
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
