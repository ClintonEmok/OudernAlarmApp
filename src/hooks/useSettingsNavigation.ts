
import { useNavigate } from 'react-router-dom';

export const useSettingsNavigation = () => {
  const navigate = useNavigate();

  const handleSettingClick = (settingName: string) => {
    switch (settingName) {
      case 'Persoonlijke Gegevens':
        navigate('/settings/profile');
        break;
      case 'Wachtwoord Wijzigen':
        navigate('/settings/password');
        break;
      case 'Account Verwijderen':
        navigate('/settings/delete-account');
        break;
      case 'Zorgverleners Beheren':
        navigate('/contacts');
        break;
      case 'Uitnodigingen':
        navigate('/settings/invitations');
        break;
      case 'Mijn Apparaten':
        navigate('/device');
        break;
      case 'Apparaat Koppelen':
        navigate('/settings/device-pairing');
        break;
      case 'Apparaat Ontkoppelen':
        navigate('/settings/device-unpairing');
        break;
      case 'Apparaattoegang Aanvragen':
        navigate('/settings/device-access-request');
        break;
      case 'Hulp & Ondersteuning':
        navigate('/settings/support');
        break;
      case 'Privacy Beleid':
        navigate('/settings/privacy');
        break;
      default:
        console.log('Setting not implemented yet:', settingName);
    }
  };

  return { handleSettingClick };
};
