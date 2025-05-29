
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertTriangle, Check } from 'lucide-react';
import { env } from '../../utils/env';

interface MapboxTokenProps {
  onTokenSaved: (token: string) => void;
}

const MapboxToken: React.FC<MapboxTokenProps> = ({ onTokenSaved }) => {
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState('');

  useEffect(() => {
    // Check for stored token first, otherwise use environment variable
    const storedToken = localStorage.getItem('mapbox_token') || env.MAPBOX_PUBLIC_TOKEN;
    setSavedToken(storedToken);
    onTokenSaved(storedToken);
  }, [onTokenSaved]);

  const handleSaveToken = () => {
    if (token.trim()) {
      // Validate token format (basic check for Mapbox public token)
      if (!token.trim().startsWith('pk.')) {
        alert('Ongeldig token format. Mapbox public tokens beginnen met "pk."');
        return;
      }
      
      localStorage.setItem('mapbox_token', token.trim());
      setSavedToken(token.trim());
      onTokenSaved(token.trim());
      setToken('');
    }
  };

  if (savedToken) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-600">
              <Check size={16} />
              <span className="text-sm font-medium">Mapbox token geconfigureerd</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                localStorage.removeItem('mapbox_token');
                setSavedToken('');
              }}
            >
              Wijzigen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center space-x-2">
          <AlertTriangle size={16} className="text-yellow-600" />
          <span>Mapbox Token Vereist</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-gray-600">
          Voor de kaart functionaliteit heeft u een Mapbox public token nodig. 
          Ga naar <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mapbox.com</a> om een gratis account aan te maken.
        </p>
        <div className="space-y-2">
          <Label htmlFor="mapbox-token" className="text-xs">Mapbox Public Token</Label>
          <div className="flex space-x-2">
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="text-xs"
            />
            <Button 
              size="sm" 
              onClick={handleSaveToken}
              disabled={!token.trim()}
            >
              Opslaan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapboxToken;
