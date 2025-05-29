
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const AlertEmptyState = () => {
  return (
    <Card className="text-center py-8">
      <CardContent>
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Alles is in orde
        </h3>
        <p className="text-gray-600">
          Er zijn momenteel geen actieve alarmen.
        </p>
      </CardContent>
    </Card>
  );
};

export default AlertEmptyState;
