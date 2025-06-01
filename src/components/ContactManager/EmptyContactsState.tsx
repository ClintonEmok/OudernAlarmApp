
import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface EmptyContactsStateProps {
  searchTerm: string;
  hasContacts: boolean;
}

const EmptyContactsState: React.FC<EmptyContactsStateProps> = ({ searchTerm, hasContacts }) => {
  if (hasContacts) return null;

  return (
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
  );
};

export default EmptyContactsState;
