import { Phone, Edit, Star, Shield, UserPlus, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
const ContactManager = () => {
  useAuth();
  const {
    caregivers,
    patients,
    fetchCaregivers,
    fetchPatients,
    inviteCaregiver,
    removeCaregiver,
    updateCaregiverPriorities
  } = useStore();
  const {
    toast
  } = useToast();
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingCaregiver, setEditingCaregiver] = useState<number | null>(null);
  const [editPriority, setEditPriority] = useState<number>(1);
  const [removeDialog, setRemoveDialog] = useState<{
    isOpen: boolean;
    caregiver: any;
  }>({
    isOpen: false,
    caregiver: null
  });
  const [patientsError, setPatientsError] = useState<boolean>(false);
  useEffect(() => {
    const loadData = async () => {
      await fetchCaregivers();
      try {
        await fetchPatients();
        setPatientsError(false);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setPatientsError(true);
      }
    };
    loadData();
  }, [fetchCaregivers, fetchPatients]);
  const handleInviteCaregiver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      await inviteCaregiver(inviteEmail);
      setInviteEmail('');
      setShowInviteForm(false);
      toast({
        title: "✓ Uitnodiging Verstuurd",
        description: `Uitnodiging is verstuurd naar ${inviteEmail}`
      });
    } catch (error: any) {
      console.error('Failed to invite caregiver:', error);

      // Better error handling for different scenarios
      let errorMessage = "Er is een fout opgetreden bij het versturen van de uitnodiging.";
      if (error.message?.includes('409') || error.message?.includes('conflict')) {
        errorMessage = "Deze persoon heeft al een uitnodiging ontvangen of is al gekoppeld.";
      } else if (error.message?.includes('422')) {
        errorMessage = "Ongeldig email adres of gebruiker bestaat niet.";
      } else if (error.message?.includes('400')) {
        errorMessage = "Controleer het email adres en probeer opnieuw.";
      }
      toast({
        title: "Uitnodiging Mislukt",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };
  const handleRemoveCaregiver = async () => {
    if (!removeDialog.caregiver) return;
    try {
      await removeCaregiver(removeDialog.caregiver.id);
      toast({
        title: "✓ Zorgverlener Verwijderd",
        description: `${removeDialog.caregiver.name} is verwijderd uit uw contacten.`
      });
      setRemoveDialog({
        isOpen: false,
        caregiver: null
      });
    } catch (error) {
      console.error('Failed to remove caregiver:', error);
      toast({
        title: "Verwijderen Mislukt",
        description: "Er is een fout opgetreden bij het verwijderen.",
        variant: "destructive"
      });
    }
  };
  const handleUpdatePriority = async (caregiverId: number, newPriority: number) => {
    try {
      const updatedCaregivers = caregivers.map(c => c.id === caregiverId.toString() ? {
        user_id: parseInt(c.id),
        priority: newPriority
      } : {
        user_id: parseInt(c.id),
        priority: c.priority
      });
      await updateCaregiverPriorities(updatedCaregivers);
      setEditingCaregiver(null);
      toast({
        title: "✓ Prioriteit Bijgewerkt",
        description: "De prioriteit is succesvol aangepast."
      });
    } catch (error) {
      console.error('Failed to update priority:', error);
      toast({
        title: "Update Mislukt",
        description: "Er is een fout opgetreden bij het bijwerken van de prioriteit.",
        variant: "destructive"
      });
    }
  };
  return <>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Contacten</h2>
          <p className="text-sm text-gray-600">Beheer uw zorgverleners en gekoppelde accounts</p>
        </div>

        {/* Caregivers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Zorgverleners</h3>
            </div>
            <Button size="sm" onClick={() => setShowInviteForm(!showInviteForm)}>
              <UserPlus size={16} className="mr-1" />
              Uitnodigen
            </Button>
          </div>

          {/* Invite Form */}
          {showInviteForm && <Card className="mb-3 border-blue-200">
              <CardContent className="p-4">
                <form onSubmit={handleInviteCaregiver} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email adres
                    </label>
                    <input id="email" type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="zorgverlener@email.com" required />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" size="sm" disabled={isInviting}>
                      {isInviting ? 'Uitnodigen...' : 'Verstuur Uitnodiging'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowInviteForm(false)}>
                      Annuleren
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>}
          
          <div className="space-y-3">
            {caregivers.map(caregiver => <Card key={caregiver.id} className="border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {caregiver.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{caregiver.name}</h4>
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            {editingCaregiver === parseInt(caregiver.id) ? <div className="flex items-center space-x-1 ml-1">
                                <input type="number" min="1" max="10" value={editPriority} onChange={e => setEditPriority(parseInt(e.target.value))} className="w-12 text-xs border border-gray-300 rounded px-1" />
                                <Button size="sm" variant="outline" className="p-1 h-6 w-6" onClick={() => handleUpdatePriority(parseInt(caregiver.id), editPriority)}>
                                  <Save size={12} />
                                </Button>
                                <Button size="sm" variant="outline" className="p-1 h-6 w-6" onClick={() => setEditingCaregiver(null)}>
                                  <X size={12} />
                                </Button>
                              </div> : <span className="text-xs text-gray-500 ml-1">#{caregiver.priority}</span>}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{caregiver.email}</p>
                        {caregiver.phone_number && <p className="text-sm text-gray-500">{caregiver.phone_number}</p>}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {caregiver.phone_number && <Button size="sm" variant="outline" className="p-2">
                          <Phone size={16} />
                        </Button>}
                      <Button size="sm" variant="outline" className="p-2" onClick={() => {
                    setEditingCaregiver(parseInt(caregiver.id));
                    setEditPriority(caregiver.priority);
                  }}>
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="outline" className="p-2 text-red-600 border-red-300 hover:bg-red-50" onClick={() => setRemoveDialog({
                    isOpen: true,
                    caregiver
                  })}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
            
            {caregivers.length === 0 && <Card className="text-center py-8">
                <CardContent>
                  <Shield size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Geen Zorgverleners
                  </h3>
                  <p className="text-gray-600">
                    Gebruik de uitnodiging functie om zorgverleners toe te voegen.
                  </p>
                </CardContent>
              </Card>}
          </div>
        </div>

        {/* Patients / Gekoppelde Accounts */}
        
      </div>

      {/* Remove Confirmation Dialog */}
      <Dialog open={removeDialog.isOpen} onOpenChange={open => !open && setRemoveDialog({
      isOpen: false,
      caregiver: null
    })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <span>Zorgverlener Verwijderen</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Weet u zeker dat u <strong>{removeDialog.caregiver?.name}</strong> wilt verwijderen uit uw contacten?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Deze actie kan niet ongedaan gemaakt worden. De zorgverlener verliest toegang tot uw apparaten en alarmen.
              </p>
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setRemoveDialog({
            isOpen: false,
            caregiver: null
          })}>
              Annuleren
            </Button>
            <Button variant="destructive" onClick={handleRemoveCaregiver}>
              <Trash2 size={16} className="mr-2" />
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};
export default ContactManager;