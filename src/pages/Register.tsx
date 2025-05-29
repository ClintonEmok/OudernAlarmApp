
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useStore } from '../store/useStore';
import { apiService } from '../services/api';
import { AuthResponse } from '../types';
import { registerSchema, RegisterFormData } from '../schemas/validation';
import { securityUtils } from '../utils/env';

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
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
      registerSchema.parse(formData);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      securityUtils.log('Starting registration process...');
      const response = await apiService.register(formData) as AuthResponse;
      
      securityUtils.log('Registration successful, setting user data');
      setUser(response.user);
      navigate('/');
    } catch (err) {
      securityUtils.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registratie mislukt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-purple-600 mb-2">Ouderen Alarmering</h1>
            <p className="text-gray-600">Maak een nieuw account aan</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Naam
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>
            
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                minLength={8}
              />
              {validationErrors.password && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Bevestig Wachtwoord
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  validationErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                minLength={8}
              />
              {validationErrors.password_confirmation && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.password_confirmation}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Bezig met registreren...' : 'Registreren'}
            </Button>
            
            <div className="text-center">
              <Link to="/login" className="text-purple-600 hover:text-purple-800 text-sm">
                Al een account? Inloggen
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
