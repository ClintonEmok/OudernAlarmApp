
import React, { useState, useEffect } from 'react';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { useStore } from '../../store/useStore';
import { useToast } from '../../hooks/use-toast';
import SwipeableCaregiverList from './SwipeableCaregiverList';
import { Contact } from '../../types';

const ContactManager: React.FC = () => {
  const { 
    caregivers, 
    patients, 
    pendingInvites,
    fetchCaregivers, 
    fetchPatients,
    fetchPendingInvites,
    inviteCaregiver, 
    removeCaregiver,
    updateCaregiverPriorities,
    reorderCaregivers
  } = useStore();

  const { toast } = useToast();
  const [newCaregiverEmail, setNewCaregiverEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchCaregivers(),
          fetchPatients(),
          fetchPendingInvites()
        ]);
      } catch (error) {
        console.error('Failed to load contact data:', error);
      }
    };

    loadData();
  }, [fetchCaregivers, fetchPatients, fetchPendingInvites]);

  const handleInviteCaregiver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaregiverEmail.trim()) return;

    setIsLoading(true);
    try {
      await inviteCaregiver(newCaregiverEmail);
      setNewCaregiverEmail('');
      toast({
        title: "Uitnodiging verzonden",
        description: `Een uitnodiging is verzonden naar ${newCaregiverEmail}`,
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verzenden van de uitnodiging.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCaregiver = async (caregiver: Contact) => {
    try {
      await removeCaregiver(parseInt(caregiver.id));
      toast({
        title: "Zorgverlener verwijderd",
        description: `${caregiver.name} is verwijderd uit uw zorgverleners.`,
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het verwijderen van de zorgverlener.",
        variant: "destructive",
      });
    }
  };

  const handleEditCaregiver = (caregiverId: number, priority: number) => {
    console.log('Edit caregiver:', caregiverId, priority);
    // Implement edit functionality
  };

  const filteredCaregivers = caregivers.filter(caregiver =>
    caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caregiver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 pb-20">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Zoek contacten..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Pending Invites Alert */}
        {pendingInvites.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle size={20} className="text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800">Openstaande uitnodigingen</h4>
                  <p className="text-sm text-yellow-700">
                    U heeft {pendingInvites.length} openstaande uitnodiging(en) voor zorgverleners.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Caregiver */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus size={20} className="text-blue-600" />
              <span>Zorgverlener Uitnodigen</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteCaregiver} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="zorgverlener@voorbeeld.nl"
                  value={newCaregiverEmail}
                  onChange={(e) => setNewCaregiverEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Uitnodiging versturen...' : 'Uitnodiging versturen'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Caregivers List */}
        {filteredCaregivers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mijn Zorgverleners ({filteredCaregivers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <SwipeableCaregiverList
                caregivers={filteredCaregivers}
                onUpdatePriorities={updateCaregiverPriorities}
                onReorderCaregivers={reorderCaregivers}
                onRemoveCaregiver={handleRemoveCaregiver}
                onEditCaregiver={handleEditCaregiver}
              />
            </CardContent>
          </Card>
        )}

        {/* Patients List */}
        {filteredPatients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mijn Patiënten ({filteredPatients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="border-green-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                          {patient.phone_number && (
                            <p className="text-sm text-gray-500">{patient.phone_number}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredCaregivers.length === 0 && filteredPatients.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen contacten gevonden</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `Geen contacten gevonden voor "${searchTerm}"`
                  : "U heeft nog geen zorgverleners of patiënten."
                }
              </p>
              {!searchTerm && (
                <p className="text-sm text-gray-500">
                  Nodig een zorgverlener uit met het formulier hierboven.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default ContactManager;
