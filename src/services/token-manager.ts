
import { authService } from './auth-service';
import { securityUtils, env } from '../utils/env';

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
    
    securityUtils.log('Tokens stored successfully');
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
      // If no expiry info, check if token exists
      return !this.getAccessToken();
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
      securityUtils.log('No refresh token available');
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
      securityUtils.log('Attempting to refresh token...');
      
      // Implement actual token refresh with the API
      const response = await fetch(`${env.API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      if (response.ok) {
        const tokenData = await response.json();
        this.setTokens(tokenData);
        securityUtils.log('Token refresh successful');
        return tokenData.access_token;
      } else {
        securityUtils.error('Token refresh failed with status:', response.status);
      }
    } catch (error) {
      securityUtils.error('Token refresh failed:', error);
    }
    
    this.clearTokens();
    return null;
  }

  clearTokens(): void {
    localStorage.removeItem(TokenManager.TOKEN_KEY);
    localStorage.removeItem(TokenManager.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TokenManager.EXPIRES_KEY);
    securityUtils.log('Tokens cleared');
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }
}

export const tokenManager = new TokenManager();
