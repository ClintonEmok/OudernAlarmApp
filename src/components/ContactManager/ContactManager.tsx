
import { Phone, Edit, Star, Shield, UserPlus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';

const ContactManager = () => {
  const { caregivers, patients } = useStore();

  const handleInviteCaregiver = () => {
    console.log('Invite caregiver - will use API endpoint /api/caregivers/invite');
  };

  const handleRemoveContact = (contactId: string) => {
    console.log('Remove contact - will use API endpoint /api/caregivers/remove', contactId);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Contacten</h2>
        <p className="text-sm text-gray-600">Beheer uw zorgverleners en patiënten</p>
      </div>

      {/* Caregivers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield size={20} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Zorgverleners</h3>
          </div>
          <Button size="sm" onClick={handleInviteCaregiver}>
            <UserPlus size={16} className="mr-1" />
            Uitnodigen
          </Button>
        </div>
        
        <div className="space-y-3">
          {caregivers.map((caregiver) => (
            <Card key={caregiver.id} className="border-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-lg">
                          {caregiver.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{caregiver.name}</h4>
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500 ml-1">#{caregiver.priority}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{caregiver.email}</p>
                      {caregiver.phone_number && (
                        <p className="text-sm text-gray-500">{caregiver.phone_number}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {caregiver.phone_number && (
                      <Button size="sm" variant="outline" className="p-2">
                        <Phone size={16} />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="p-2"
                      onClick={() => handleRemoveContact(caregiver.id)}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Patients */}
      {patients.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Shield size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Patiënten</h3>
          </div>
          
          <div className="space-y-3">
            {patients.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold">
                            {patient.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                        {patient.phone_number && (
                          <p className="text-sm text-gray-500">{patient.phone_number}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {patient.phone_number && (
                        <Button size="sm" variant="outline" className="p-2">
                          <Phone size={16} />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="p-2">
                        <Edit size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManager;
