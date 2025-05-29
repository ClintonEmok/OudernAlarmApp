
import { useState } from 'react';
import { z } from 'zod';

interface ValidationError {
  [key: string]: string[];
}

interface UseFormValidationReturn<T> {
  errors: ValidationError;
  validate: (data: T) => boolean;
  clearErrors: () => void;
  setFieldError: (field: string, message: string) => void;
}

export function useFormValidation<T>(schema: z.ZodSchema<T>): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<ValidationError>({});

  const validate = (data: T): boolean => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: ValidationError = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(err.message);
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const setFieldError = (field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: [message]
    }));
  };

  return {
    errors,
    validate,
    clearErrors,
    setFieldError
  };
}
