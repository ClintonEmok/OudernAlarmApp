
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
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/settings')}
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Uitnodigingen</h1>
            <p className="text-sm text-gray-600 mt-1">Beheer verzonden uitnodigingen</p>
          </div>
        </div>

        {/* Pending Invitations */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock size={20} className="text-blue-600" />
              </div>
              <span>Openstaande Uitnodigingen</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {pendingInvites && pendingInvites.length > 0 ? (
              <div className="space-y-3">
                {pendingInvites.map((invite, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Mail size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{invite.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Uitgenodigd op {invite.created_at ? new Date(invite.created_at).toLocaleDateString('nl-NL') : 'Onbekend'}
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            In afwachting
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <UserPlus size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen openstaande uitnodigingen</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed max-w-sm mx-auto">
                  Er zijn momenteel geen uitnodigingen verzonden naar zorgverleners.
                </p>
                <Button onClick={() => navigate('/contacts')} className="w-full sm:w-auto">
                  <UserPlus size={18} className="mr-2" />
                  Nieuwe uitnodiging versturen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <Button 
              className="w-full h-12 text-base font-medium" 
              onClick={() => navigate('/contacts')}
            >
              <UserPlus size={20} className="mr-3" />
              Nieuwe Zorgverlener Uitnodigen
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invitations;
