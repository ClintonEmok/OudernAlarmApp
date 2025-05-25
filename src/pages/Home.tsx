
import { useAuth } from '../hooks/useAuth';
import MapView from '../components/MapView/MapView';

const Home = () => {
  useAuth();
  
  return (
    <div className="h-screen flex flex-col">
      <MapView />
    </div>
  );
};

export default Home;
