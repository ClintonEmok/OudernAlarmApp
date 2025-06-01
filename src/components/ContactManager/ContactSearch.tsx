
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface ContactSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ContactSearch: React.FC<ContactSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        placeholder="Zoek contacten..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default ContactSearch;
