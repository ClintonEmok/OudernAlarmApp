
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useStore } from '../store/useStore';
import { apiService } from '../services/api';
import { AuthResponse } from '../types';
import { loginSchema, LoginFormData } from '../schemas/validation';
import { securityUtils } from '../utils/env';

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      securityUtils.log('Starting login process...');
      const response = await apiService.login(formData.email, formData.password) as AuthResponse;
      
      securityUtils.log('Login successful, setting user data');
      setUser(response.user);
      navigate('/dashboard');
    } catch (err) {
      securityUtils.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('CSRF token mismatch')) {
          setError('Beveiligingsfout. De pagina wordt ververst...');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else if (err.message.includes('419')) {
          setError('Sessie verlopen. Ververs de pagina en probeer opnieuw.');
        } else if (err.message.includes('401') || err.message.includes('Unauthenticated')) {
          setError('Ongeldige inloggegevens. Controleer uw email en wachtwoord.');
        } else {
          setError(err.message || 'Inloggen mislukt');
        }
      } else {
        setError('Inloggen mislukt');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Ouderen Alarmering</h1>
            <p className="text-gray-600">Log in om door te gaan</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
                {(error.includes('Sessie verlopen') || error.includes('Beveiligingsfout')) && (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      Pagina verversen
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {validationErrors.email && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {validationErrors.password && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
            </Button>
            
            <div className="text-center">
              <Link to="/register" className="text-blue-600 hover:text-blue-800 text-sm">
                Nog geen account? Registreren
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
