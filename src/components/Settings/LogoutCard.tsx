
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface LogoutCardProps {
  onLogout: () => void;
}

const LogoutCard = ({ onLogout }: LogoutCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={onLogout}
        >
          Uitloggen
        </Button>
      </CardContent>
    </Card>
  );
};

export default LogoutCard;
