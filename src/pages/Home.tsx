
import MapView from '../components/MapView/MapView';
import { useAuthCheck } from '../hooks/useAuthCheck';

const Home = () => {
  const { isAuthenticated } = useAuthCheck();

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <MapView />
    </div>
  );
};

export default Home;
