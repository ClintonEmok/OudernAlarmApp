import { Phone, Edit, Star, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

const ContactManager = () => {
  const { contacts } = useStore();

  const emergencyContacts = contacts.filter(c => c.isEmergencyContact).sort((a, b) => a.priority - b.priority);
  const otherContacts = contacts.filter(c => !c.isEmergencyContact);

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Contacten</h2>
        <p className="text-sm text-gray-600">Beheer uw noodcontacten en zorgverleners</p>
      </div>

      {/* Emergency Contacts */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Shield size={20} className="text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Noodcontacten</h3>
        </div>
        
        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <Card key={contact.id} className="border-red-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-lg">
                          {contact.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500 ml-1">#{contact.priority}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="p-2">
                      <Phone size={16} />
                    </Button>
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

      {/* Other Contacts */}
      {otherContacts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Andere contacten</h3>
          
          <div className="space-y-3">
            {otherContacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold">
                            {contact.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="p-2">
                        <Phone size={16} />
                      </Button>
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

      {/* Add Contact Button */}
      <Button className="w-full" variant="secondary">
        + Nieuw contact toevoegen
      </Button>
    </div>
  );
};

export default ContactManager;
