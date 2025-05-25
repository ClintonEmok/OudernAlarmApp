
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useStore } from '../store/useStore';
import { apiService } from '../services/api';
import { AuthResponse } from '../types';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setAccessToken } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Starting login process...');
      const response = await apiService.login(email, password) as AuthResponse;
      
      console.log('Login successful, storing token and user data');
      // Store token in localStorage and state
      localStorage.setItem('access_token', response.access_token);
      setAccessToken(response.access_token);
      setUser(response.user);
      
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('CSRF token mismatch')) {
          setError('Beveiligingsfout. De pagina wordt ververst...');
          // Auto-refresh after a short delay
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
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-purple-600 mb-2">Ouderen Alarmering</h1>
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
            </Button>
            
            <div className="text-center">
              <Link to="/register" className="text-purple-600 hover:text-purple-800 text-sm">
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
