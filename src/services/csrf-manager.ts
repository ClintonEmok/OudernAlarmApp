
export class CsrfManager {
  private csrfToken: string | null = null;
  private isRetrying: boolean = false;

  private getCsrfTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    console.log('Available cookies:', cookies);
    
    // Laravel Sanctum sets XSRF-TOKEN cookie
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'XSRF-TOKEN' && value) {
        console.log('Found XSRF-TOKEN cookie');
        // URL decode the token value as per Laravel Sanctum docs
        return decodeURIComponent(value);
      }
    }
    
    console.log('No XSRF-TOKEN cookie found');
    return null;
  }

  private async waitForCookie(maxAttempts = 5): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
      const token = this.getCsrfTokenFromCookie();
      if (token) {
        return token;
      }
      // Wait 200ms before trying again (reduced from 100ms)
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    return null;
  }

  async getCsrfToken(): Promise<void> {
    // Prevent multiple simultaneous requests
    if (this.isRetrying) {
      console.log('CSRF token request already in progress, waiting...');
      // Wait for existing request to complete
      let attempts = 0;
      while (this.isRetrying && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      return;
    }

    try {
      this.isRetrying = true;
      console.log('Fetching CSRF token from /sanctum/csrf-cookie...');
      
      const response = await fetch('https://api.ouderen-alarmering.nl/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Referer': window.location.origin,
        },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch CSRF cookie:', response.status);
        this.csrfToken = null;
        return;
      }
      
      console.log('CSRF cookie request successful, waiting for XSRF-TOKEN cookie...');
      
      // Wait for XSRF-TOKEN cookie to be available in document.cookie
      this.csrfToken = await this.waitForCookie();
      console.log('CSRF token obtained:', this.csrfToken ? 'Yes' : 'No');
      
      // If still no token, try to proceed without it
      if (!this.csrfToken) {
        console.warn('Could not obtain CSRF token, proceeding without CSRF protection');
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      this.csrfToken = null;
    } finally {
      this.isRetrying = false;
    }
  }

  getToken(): string | null {
    return this.csrfToken;
  }

  clearToken(): void {
    this.csrfToken = null;
  }

  hasCsrfSupport(): boolean {
    // Check if we're in a cross-origin situation where CSRF might not work
    const apiDomain = 'api.ouderen-alarmering.nl';
    const currentDomain = window.location.hostname;
    
    return currentDomain.includes(apiDomain) || currentDomain === 'localhost';
  }
}
