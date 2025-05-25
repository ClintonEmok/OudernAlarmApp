import { AlertTriangle, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const AlertList = () => {
  const { alerts, markAlertAsResolved, toggleFalseAlarm } = useStore();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'SOS': return '🚨';
      case 'Fall': return '⚠️';
      case 'Medical': return '💊';
      case 'Geofence': return '📍';
      case 'Battery': return '🔋';
      default: return '⚠️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-red-600 bg-red-50';
      case 'Responding': return 'text-yellow-600 bg-yellow-50';
      case 'Resolved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} min geleden`;
    if (diffHours < 24) return `${diffHours} uur geleden`;
    return `${diffDays} dag(en) geleden`;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Meldingen</h2>
        <p className="text-sm text-gray-600">Overzicht van alle alarmen en gebeurtenissen</p>
      </div>

      {alerts.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen meldingen</h3>
            <p className="text-gray-600">Alles is momenteel in orde!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className={alert.isFalseAlarm ? 'border-gray-300 bg-gray-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${alert.isFalseAlarm ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {alert.type} Melding
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                      
                      {alert.location && (
                        <div className="flex items-center space-x-1">
                          <span>📍</span>
                          <span>{alert.location}</span>
                        </div>
                      )}
                      
                      {alert.responder && (
                        <div className="flex items-center space-x-1">
                          <User size={14} />
                          <span>Reactie van: {alert.responder}</span>
                        </div>
                      )}
                    </div>
                    
                    {alert.isFalseAlarm && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        ⚠️ Gemarkeerd als loos alarm
                      </div>
                    )}
                  </div>
                </div>
                
                {alert.status !== 'Resolved' && (
                  <div className="mt-3 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFalseAlarm(alert.id)}
                      className="text-xs"
                    >
                      {alert.isFalseAlarm ? 'Ongedaan maken' : 'Loos alarm'}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => markAlertAsResolved(alert.id)}
                      className="text-xs"
                    >
                      Opgelost
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertList;
