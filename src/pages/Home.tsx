
import { useEffect } from 'react';
import MapView from '../components/MapView/MapView';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { useStore } from '../store/useStore';

const Home = () => {
  const { isAuthenticated } = useAuthCheck();
  const { initializeApp } = useStore();

  // Initialize app settings when component mounts
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <MapView />
    </div>
  );
};

export default Home;
