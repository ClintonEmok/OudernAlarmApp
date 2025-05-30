
import { User, Smartphone, Users, MapPin } from 'lucide-react';

export const settingsCategories = [
  {
    title: 'Account & Profiel',
    icon: User,
    items: [
      { name: 'Persoonlijke Gegevens', description: 'Naam, email en telefoonnummer' },
      { name: 'Wachtwoord Wijzigen', description: 'Account beveiliging' },
      { name: 'Account Verwijderen', description: 'Permanente verwijdering' }
    ]
  },
  {
    title: 'Kaart & Locatie',
    icon: MapPin,
    items: []
  },
  {
    title: 'Zorgverlening',
    icon: Users,
    items: [
      { name: 'Zorgverleners Beheren', description: 'Uitnodigen en prioriteiten' },
      { name: 'Uitnodigingen', description: 'Pending invites beheren' }
    ]
  },
  {
    title: 'Apparaten',
    icon: Smartphone,
    items: [
      { name: 'Mijn Apparaten', description: 'Gekoppelde alarm apparaten' },
      { name: 'Apparaat Koppelen', description: 'Nieuw apparaat toevoegen' },
      { name: 'Apparaat Ontkoppelen', description: 'Apparaat verwijderen' },
      { name: 'Apparaattoegang Aanvragen', description: 'Toegang tot ander apparaat' }
    ]
  }
];
