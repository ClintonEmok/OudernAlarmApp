
import { logger } from '../utils/logger';

export class RequestBuilder {
  private getHeaders(includeAuth = true, includeCsrf = false, csrfToken: string | null = null): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    // Only include Bearer token for authenticated requests (not login/register)
    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    // Include XSRF token for SPA authentication (Laravel Sanctum) - only if available
    if (includeCsrf && csrfToken) {
      headers['X-XSRF-TOKEN'] = csrfToken;
      logger.debug('Including X-XSRF-TOKEN in headers');
    } else if (includeCsrf && !csrfToken) {
      logger.warn('CSRF token requested but not available - proceeding without CSRF protection');
    }

    return headers;
  }

  buildRequest(
    method: string,
    data?: any,
    includeAuth = true,
    includeCsrf = false,
    csrfToken: string | null = null
  ): RequestInit {
    const requestOptions: RequestInit = {
      method,
      headers: this.getHeaders(includeAuth, includeCsrf, csrfToken),
      credentials: 'include', // Essential for Laravel Sanctum SPA auth
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    return requestOptions;
  }
}
