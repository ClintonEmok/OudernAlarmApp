
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useToast } from '../../hooks/use-toast';
import { Contact } from '../../types';
import ContactSearch from './ContactSearch';
import PendingInvitesAlert from './PendingInvitesAlert';
import CaregiversList from './CaregiversList';
import CaregiverInviteForm from './CaregiverInviteForm';
import PatientsList from './PatientsList';
import EmptyContactsState from './EmptyContactsState';

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

  const hasContacts = filteredCaregivers.length > 0 || filteredPatients.length > 0;

  return (
    <div className="space-y-4 pb-8">
      <ContactSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <PendingInvitesAlert pendingInvites={pendingInvites} />
      
      <CaregiversList
        caregivers={filteredCaregivers}
        onUpdatePriorities={updateCaregiverPriorities}
        onReorderCaregivers={reorderCaregivers}
        onRemoveCaregiver={handleRemoveCaregiver}
        onEditCaregiver={handleEditCaregiver}
      />
      
      <CaregiverInviteForm onInviteCaregiver={inviteCaregiver} />
      
      <PatientsList patients={filteredPatients} />
      
      <EmptyContactsState searchTerm={searchTerm} hasContacts={hasContacts} />
    </div>
  );
};

export default ContactManager;
