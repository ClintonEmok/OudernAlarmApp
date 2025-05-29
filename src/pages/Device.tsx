
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../hooks/useAuth';
import DeviceStatus from '../components/DeviceStatus/DeviceStatus';
import DeviceAssignment from '../components/DeviceAssignment/DeviceAssignment';
import MapView from '../components/MapView/MapView';
import NotificationSettings from '../components/NotificationSettings/NotificationSettings';
import DebugInfo from '../components/DebugInfo/DebugInfo';
import { Button } from '../components/ui/button';

const Device = () => {
  useAuth();
  
  const { 
    devices, 
    selectedDevice, 
    fetchDevices,
    ownDevices,
    caregivingDevices,
    fetchOwnDevices,
    fetchCaregivingDevices
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'notifications' | 'debug'>('overview');

  useEffect(() => {
    fetchDevices();
    fetchOwnDevices();
    fetchCaregivingDevices();
  }, [fetchDevices, fetchOwnDevices, fetchCaregivingDevices]);

  const handleDeviceRefresh = async () => {
    await fetchDevices();
    await fetchOwnDevices();
    await fetchCaregivingDevices();
  };

  // Show loading state while devices are being fetched
  if (devices.length === 0) {
    return (
      <div className="min-h-screen bg-blue-50 pb-20">
        <div className="p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Apparaten</h2>
            <div className="animate-pulse space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      <div className="p-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Apparaten</h2>
          <p className="text-sm text-gray-600">
            Bekijk en beheer uw gekoppelde apparaten
          </p>
        </div>

        {/* Debug Info */}
        <DebugInfo />

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overzicht
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'map'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Kaart
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Meldingen
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'debug'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Debug
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {devices.length === 0 ? (
                <DeviceAssignment />
              ) : (
                <DeviceStatus />
              )}
            </>
          )}

          {activeTab === 'map' && selectedDevice && (
            <MapView />
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <NotificationSettings />
              
              {/* Test Notification Buttons */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Test Notificaties</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Test low battery notification
                      if (window.Notification && Notification.permission === 'granted') {
                        new Notification('🔋 Lage Batterij', {
                          body: 'Test apparaat heeft nog 15% batterij',
                          icon: '/favicon.ico'
                        });
                      }
                    }}
                  >
                    Test Batterij Alarm
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Test emergency notification
                      if (window.Notification && Notification.permission === 'granted') {
                        new Notification('🚨 Noodoproep', {
                          body: 'Test apparaat heeft een noodknop ingedrukt!',
                          icon: '/favicon.ico'
                        });
                      }
                    }}
                  >
                    Test Noodoproep
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'debug' && (
            <div className="space-y-4">
              <DebugInfo />
              
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Apparaat Data</h3>
                <div className="space-y-3">
                  <div>
                    <strong>Eigen Apparaten:</strong> {ownDevices.length}
                  </div>
                  <div>
                    <strong>Zorgapparaten:</strong> {caregivingDevices.length}
                  </div>
                  <div>
                    <strong>Totaal Apparaten:</strong> {devices.length}
                  </div>
                  <div>
                    <strong>Geselecteerd Apparaat:</strong> {selectedDevice ? selectedDevice.nickname || selectedDevice.phone_number : 'Geen'}
                  </div>
                </div>
                
                <Button
                  onClick={handleDeviceRefresh}
                  className="mt-4 w-full"
                  size="sm"
                >
                  Ververs Apparaten
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Device;
