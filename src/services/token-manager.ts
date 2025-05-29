
import { authService } from './auth-service';

interface TokenData {
  access_token: string;
  expires_at?: number;
  refresh_token?: string;
}

class TokenManager {
  private static readonly TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly EXPIRES_KEY = 'token_expires_at';
  
  private refreshPromise: Promise<string> | null = null;

  setTokens(tokenData: TokenData): void {
    localStorage.setItem(TokenManager.TOKEN_KEY, tokenData.access_token);
    
    if (tokenData.refresh_token) {
      localStorage.setItem(TokenManager.REFRESH_TOKEN_KEY, tokenData.refresh_token);
    }
    
    if (tokenData.expires_at) {
      localStorage.setItem(TokenManager.EXPIRES_KEY, tokenData.expires_at.toString());
    }
    
    console.log('Tokens stored successfully');
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TokenManager.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(TokenManager.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(TokenManager.EXPIRES_KEY);
    if (!expiresAt) {
      // If no expiry info, assume token is valid for now
      return false;
    }
    
    const now = Date.now();
    const expiry = parseInt(expiresAt, 10);
    
    // Add 5 minute buffer for token refresh
    return now >= (expiry - 5 * 60 * 1000);
  }

  async getValidToken(): Promise<string | null> {
    const token = this.getAccessToken();
    
    if (!token) {
      return null;
    }

    // If token is not expired, return it
    if (!this.isTokenExpired()) {
      return token;
    }

    // Try to refresh the token
    return this.refreshToken();
  }

  private async refreshToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.log('No refresh token available');
      this.clearTokens();
      return null;
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken);
    
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<string | null> {
    try {
      console.log('Attempting to refresh token...');
      
      // Here you would call your refresh endpoint
      // For now, we'll clear tokens if refresh is not implemented
      console.warn('Token refresh not implemented yet');
      this.clearTokens();
      return null;
      
      // TODO: Implement actual token refresh
      // const response = await fetch('/api/refresh', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ refresh_token: refreshToken })
      // });
      // 
      // if (response.ok) {
      //   const tokenData = await response.json();
      //   this.setTokens(tokenData);
      //   return tokenData.access_token;
      // }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    this.clearTokens();
    return null;
  }

  clearTokens(): void {
    localStorage.removeItem(TokenManager.TOKEN_KEY);
    localStorage.removeItem(TokenManager.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TokenManager.EXPIRES_KEY);
    console.log('Tokens cleared');
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }
}

export const tokenManager = new TokenManager();
