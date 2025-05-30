
import { User } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { User as UserType } from '../../types';

interface UserInfoCardProps {
  user: UserType;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.phone_number && (
              <p className="text-xs text-gray-500">{user.phone_number}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
