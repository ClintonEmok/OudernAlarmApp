
import React from 'react';
import { Device } from '../../types';
import BatteryStatusCard from './BatteryStatusCard';
import SignalStatusCard from './SignalStatusCard';
import DeviceActivityCard from './DeviceActivityCard';
import DeviceHealthCard from './DeviceHealthCard';

interface DeviceMetricsProps {
  device: Device;
}

const DeviceMetrics: React.FC<DeviceMetricsProps> = ({ device }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <BatteryStatusCard device={device} />
        <SignalStatusCard device={device} />
      </div>

      <DeviceActivityCard device={device} />
      <DeviceHealthCard device={device} />
    </div>
  );
};

export default DeviceMetrics;
