
import React from 'react';
import { Shield } from 'lucide-react';
import NativeFeatureCard from './NativeFeatureCard';

const SecurityStatus: React.FC = () => {
  const statusIndicator = (
    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
  );

  return (
    <NativeFeatureCard
      icon={Shield}
      iconColor="text-red-600"
      title="Veiligheid"
      description="SOS knop en alarm systeem"
      statusIndicator={statusIndicator}
    />
  );
};

export default SecurityStatus;
