
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/button';
import { env, securityUtils } from '../../utils/env';

const DebugInfo = () => {
  const { user, devices, isAuthenticated } = useStore();
  
  // Only show debug info in development
  if (!env.IS_DEVELOPMENT) {
    return null;
  }
  
  const checkTokenInfo = () => {
    const token = localStorage.getItem('access_token');
    securityUtils.log('=== TOKEN DEBUG INFO ===');
    securityUtils.log('Token exists:', !!token);
    securityUtils.log('Token length:', token ? token.length : 0);
    securityUtils.log('User authenticated:', isAuthenticated);
    securityUtils.log('User object:', securityUtils.sanitizeForLogging(user));
    securityUtils.log('Devices count:', devices.length);
    securityUtils.log('Devices:', securityUtils.sanitizeForLogging(devices));
  };

  const testApiCall = async () => {
    securityUtils.log('=== MANUAL API TEST ===');
    try {
      const response = await fetch(`${env.API_BASE_URL}/my-devices/own`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include'
      });
      
      securityUtils.log('Manual test response status:', response.status);
      
      const responseText = await response.text();
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          securityUtils.log('Manual test parsed response:', securityUtils.sanitizeForLogging(parsed));
        } catch (e) {
          securityUtils.log('Manual test response is not JSON');
        }
      }
    } catch (error) {
      securityUtils.error('Manual test error:', error);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">Debug Info (Development Only)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs space-y-1">
          <div>Auth: {isAuthenticated ? '✓' : '✗'}</div>
          <div>User: {user ? user.name : 'None'}</div>
          <div>Devices: {devices.length}</div>
          <div>Token: {localStorage.getItem('access_token') ? 'Present' : 'Missing'}</div>
          <div className="text-blue-600">Endpoint: /my-devices/own</div>
          <div>Environment: {env.IS_DEVELOPMENT ? 'Development' : 'Production'}</div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={checkTokenInfo}>
            Log Token Info
          </Button>
          <Button variant="outline" size="sm" onClick={testApiCall}>
            Test API
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugInfo;
