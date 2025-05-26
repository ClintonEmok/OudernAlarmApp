
import DeviceStatus from '../components/DeviceStatus/DeviceStatus';
import DebugInfo from '../components/DebugInfo/DebugInfo';
import { capacitorService } from '../services/capacitor-service';
import { useEffect, useState } from 'react';

const Device = () => {
  const [platformInfo, setPlatformInfo] = useState({
    platform: '',
    isNative: false,
    isMobile: false
  });

  useEffect(() => {
    setPlatformInfo({
      platform: capacitorService.getPlatform(),
      isNative: capacitorService.isNative(),
      isMobile: capacitorService.isMobile()
    });
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      {/* Platform info for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-100 p-2 text-xs text-blue-800 border-b">
          Platform: {platformInfo.platform} | Native: {platformInfo.isNative ? 'Yes' : 'No'} | Mobile: {platformInfo.isMobile ? 'Yes' : 'No'}
        </div>
      )}
      
      <DeviceStatus />
    </div>
  );
};

export default Device;
