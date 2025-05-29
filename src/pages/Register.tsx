
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useStore } from '../store/useStore';
import { apiService } from '../services/api';
import { AuthResponse } from '../types';
import { registerSchema, RegisterFormData } from '../schemas/validation';
import { securityUtils } from '../utils/env';
import { useFormValidation } from '../hooks/useFormValidation';

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { errors, validate, clearErrors } = useFormValidation(registerSchema);
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearErrors();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form before submission
    if (!validate(formData)) {
      return;
    }

    setIsLoading(true);

    try {
      securityUtils.log('Starting registration process...');
      // Ensure all required fields are present
      const registrationData: RegisterFormData = {
        name: formData.name || '',
        email: formData.email || '',
        password: formData.password || '',
        password_confirmation: formData.password_confirmation || ''
      };
      const response = await apiService.register(registrationData) as AuthResponse;
      
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
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>
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
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email[0]}</p>
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
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                minLength={8}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password[0]}</p>
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
                  errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                minLength={8}
              />
              {errors.password_confirmation && (
                <p className="text-red-600 text-sm mt-1">{errors.password_confirmation[0]}</p>
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
