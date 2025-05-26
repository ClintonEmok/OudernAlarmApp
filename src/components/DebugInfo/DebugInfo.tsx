
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/button';

const DebugInfo = () => {
  const { user, devices, isAuthenticated } = useStore();
  
  const checkTokenInfo = () => {
    const token = localStorage.getItem('access_token');
    console.log('=== TOKEN DEBUG INFO ===');
    console.log('Token exists:', !!token);
    console.log('Token length:', token ? token.length : 0);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('User authenticated:', isAuthenticated);
    console.log('User object:', user);
    console.log('Devices count:', devices.length);
    console.log('Devices:', devices);
  };

  const testApiCall = async () => {
    console.log('=== MANUAL API TEST (CORRECTED ENDPOINT) ===');
    try {
      const response = await fetch('https://api.ouderen-alarmering.nl/api/my-devices/own', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include'
      });
      
      console.log('Manual test response status:', response.status);
      console.log('Manual test response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Manual test response body:', responseText);
      
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          console.log('Manual test parsed response:', parsed);
        } catch (e) {
          console.log('Manual test response is not JSON');
        }
      }
    } catch (error) {
      console.error('Manual test error:', error);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs space-y-1">
          <div>Auth: {isAuthenticated ? '✓' : '✗'}</div>
          <div>User: {user ? user.name : 'None'}</div>
          <div>Devices: {devices.length}</div>
          <div>Token: {localStorage.getItem('access_token') ? 'Present' : 'Missing'}</div>
          <div className="text-blue-600">Endpoint: /my-devices/own</div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={checkTokenInfo}>
            Log Token Info
          </Button>
          <Button variant="outline" size="sm" onClick={testApiCall}>
            Test /own API
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugInfo;
