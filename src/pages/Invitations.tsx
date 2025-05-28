
import { ArrowLeft, Mail, UserPlus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';

const Invitations = () => {
  const navigate = useNavigate();
  const { pendingInvites, fetchPendingInvites } = useStore();

  useEffect(() => {
    fetchPendingInvites();
  }, [fetchPendingInvites]);

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/settings')}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Uitnodigingen</h2>
            <p className="text-sm text-gray-600">Beheer verzonden uitnodigingen</p>
          </div>
        </div>

        {/* Pending Invitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock size={20} className="text-blue-600" />
              <span>Openstaande Uitnodigingen</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingInvites && pendingInvites.length > 0 ? (
              <div className="space-y-3">
                {pendingInvites.map((invite, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{invite.email}</p>
                        <p className="text-xs text-gray-500">
                          Uitgenodigd op {invite.created_at ? new Date(invite.created_at).toLocaleDateString('nl-NL') : 'Onbekend'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        In afwachting
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Geen openstaande uitnodigingen</h3>
                <p className="text-gray-600 mb-4">Er zijn momenteel geen uitnodigingen verzonden.</p>
                <Button onClick={() => navigate('/contacts')}>
                  Nieuwe uitnodiging versturen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <Button 
              className="w-full" 
              onClick={() => navigate('/contacts')}
            >
              <UserPlus size={20} className="mr-2" />
              Nieuwe Zorgverlener Uitnodigen
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invitations;
