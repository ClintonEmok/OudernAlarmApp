
import DeviceStatus from '../components/DeviceStatus/DeviceStatus';
import DebugInfo from '../components/DebugInfo/DebugInfo';

const Device = () => {
  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      <div className="p-4">
        <DebugInfo />
      </div>
      <DeviceStatus />
    </div>
  );
};

export default Device;
