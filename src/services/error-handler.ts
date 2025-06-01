
import { toast } from '@/hooks/use-toast';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public context?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: any) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: any) {
    super(message, 'CONFLICT_ERROR', 409, context);
    this.name = 'ConflictError';
  }
}

export const handleApiError = (error: any, context?: string) => {
  logger.error(`API Error in ${context || 'Unknown'}`, error);

  // Extract meaningful error information
  let errorMessage = 'Er is een onbekende fout opgetreden.';
  let errorTitle = 'Fout';

  if (error instanceof AppError) {
    errorMessage = error.message;
    errorTitle = getErrorTitle(error.code);
  } else if (error?.response?.status) {
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        errorMessage = data?.message || 'Ongeldige aanvraag. Controleer uw invoer.';
        errorTitle = 'Invoerfout';
        break;
      case 401:
        errorMessage = 'U bent niet geautoriseerd. Log opnieuw in.';
        errorTitle = 'Authenticatie Vereist';
        break;
      case 403:
        errorMessage = 'U heeft geen toestemming voor deze actie.';
        errorTitle = 'Toegang Geweigerd';
        break;
      case 404:
        errorMessage = 'De gevraagde resource is niet gevonden.';
        errorTitle = 'Niet Gevonden';
        break;
      case 409:
        errorMessage = data?.message || 'Er is een conflict opgetreden.';
        errorTitle = 'Conflict';
        break;
      case 422:
        errorMessage = data?.message || 'De invoer kon niet worden verwerkt.';
        errorTitle = 'Validatiefout';
        break;
      case 429:
        errorMessage = 'Te veel aanvragen. Probeer later opnieuw.';
        errorTitle = 'Rate Limit';
        break;
      case 500:
        errorMessage = 'Server fout. Probeer later opnieuw.';
        errorTitle = 'Server Fout';
        break;
      case 503:
        errorMessage = 'Service tijdelijk niet beschikbaar.';
        errorTitle = 'Service Onbeschikbaar';
        break;
      default:
        errorMessage = data?.message || `HTTP ${status} fout opgetreden.`;
        errorTitle = 'Network Fout';
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }

  // Show toast notification
  toast({
    title: errorTitle,
    description: errorMessage,
    variant: "destructive"
  });

  return new AppError(errorMessage, error?.code, error?.response?.status);
};

const getErrorTitle = (code?: string): string => {
  switch (code) {
    case 'NETWORK_ERROR':
      return 'Netwerkfout';
    case 'VALIDATION_ERROR':
      return 'Validatiefout';
    case 'AUTH_ERROR':
      return 'Authenticatiefout';
    case 'CONFLICT_ERROR':
      return 'Conflict';
    default:
      return 'Fout';
  }
};

export const showSuccessToast = (title: string, description?: string) => {
  toast({
    title: `✓ ${title}`,
    description,
  });
};

export const showInfoToast = (title: string, description?: string) => {
  toast({
    title: `ℹ ${title}`,
    description,
  });
};

export const showWarningToast = (title: string, description?: string) => {
  toast({
    title: `⚠ ${title}`,
    description,
    variant: "destructive"
  });
};
