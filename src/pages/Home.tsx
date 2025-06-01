
import MapView from '../components/MapView/MapView';
import { useAuthCheck } from '../hooks/useAuthCheck';

const Home = () => {
  const { isAuthenticated } = useAuthCheck();

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
