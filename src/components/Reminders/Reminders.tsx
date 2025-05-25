
import { Bell, Clock, Pill, Calendar, Plus, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

const Reminders = () => {
  const { reminders } = useStore();

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'Medication': return <Pill size={20} className="text-blue-600" />;
      case 'Appointment': return <Calendar size={20} className="text-green-600" />;
      case 'Activity': return <Bell size={20} className="text-purple-600" />;
      default: return <Bell size={20} className="text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Medication': return 'Medicatie';
      case 'Appointment': return 'Afspraak';
      case 'Activity': return 'Activiteit';
      default: return type;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'Daily': return 'Dagelijks';
      case 'Weekly': return 'Wekelijks';
      case 'Monthly': return 'Maandelijks';
      default: return frequency;
    }
  };

  const activeReminders = reminders.filter(r => r.isActive);
  const upcomingToday = activeReminders.filter(r => r.frequency === 'Daily');

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Herinneringen</h2>
        <p className="text-sm text-gray-600">Medicatie, afspraken en activiteiten</p>
      </div>

      {/* Today's Reminders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Vandaag</h3>
          <span className="text-sm text-gray-600">{upcomingToday.length} herinneringen</span>
        </div>
        
        {upcomingToday.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Bell size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Geen herinneringen voor vandaag</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingToday.map((reminder) => (
              <Card key={reminder.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getReminderIcon(reminder.type)}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{reminder.title}</h4>
                        <p className="text-sm text-gray-600">{reminder.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-500">{reminder.time}</span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {getTypeLabel(reminder.type)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Button size="sm" variant="outline">
                        ✓ Gedaan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* All Reminders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Alle Herinneringen</h3>
          <Button size="sm" variant="outline">
            <Settings size={16} className="mr-1" />
            Beheren
          </Button>
        </div>
        
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className={!reminder.isActive ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getReminderIcon(reminder.type)}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{reminder.title}</h4>
                      <p className="text-sm text-gray-600">{reminder.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">{reminder.time}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {getFrequencyLabel(reminder.frequency)}
                        </span>
                        {!reminder.isActive && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            Gepauzeerd
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Reminder Button */}
      <Button className="w-full" variant="secondary">
        <Plus size={16} className="mr-2" />
        Nieuwe Herinnering Toevoegen
      </Button>
    </div>
  );
};

export default Reminders;
