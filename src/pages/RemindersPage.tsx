
import { Calendar, Clock, Bell } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const RemindersPage = () => {
  return (
    <div className="min-h-screen bg-purple-50 pb-20">
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Herinneringen</h2>
          <p className="text-sm text-gray-600">Deze functie is niet beschikbaar</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Herinneringen Niet Beschikbaar
            </h3>
            <p className="text-gray-600 mb-4">
              De API ondersteunt momenteel geen herinnering functionaliteit.
            </p>
            <p className="text-sm text-gray-500">
              Deze functie kan worden toegevoegd wanneer de backend API wordt uitgebreid.
            </p>
          </CardContent>
        </Card>

        {/* Information about what would be here */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Verwachte Functionaliteit:</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Medicatie herinneringen</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Afspraak herinneringen</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Bell size={16} />
                <span>Activiteit herinneringen</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RemindersPage;
