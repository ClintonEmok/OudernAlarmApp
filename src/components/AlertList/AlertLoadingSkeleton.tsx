
import { Card, CardContent } from '../ui/card';

const AlertLoadingSkeleton = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Alarmen</h2>
        <p className="text-sm text-gray-600">Laden van alarmen...</p>
      </div>
      
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlertLoadingSkeleton;
