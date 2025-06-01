
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { userService } from '../services/user-service';
import { useToast } from '../components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

const DeleteAccountSettings = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useStore();
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      toast({
        title: "Wachtwoord vereist",
        description: "Voer uw wachtwoord in om door te gaan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await userService.deleteUser(password);
      toast({
        title: "Account verwijderd",
        description: "Uw account is succesvol verwijderd",
      });
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast({
        title: "Fout bij verwijderen",
        description: "Er is een fout opgetreden. Controleer uw wachtwoord.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-blue-50 flex flex-col">
      <div className="flex-1 overflow-y-auto pt-safe">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Account Verwijderen</h2>
              <p className="text-sm text-gray-600">Verwijder uw account permanent</p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-red-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Let op: Deze actie is onomkeerbaar!</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Al uw gegevens worden permanent verwijderd</li>
                  <li>• Gekoppelde apparaten worden ontkoppeld</li>
                  <li>• Zorgverlener verbindingen worden verbroken</li>
                  <li>• Alarm geschiedenis gaat verloren</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Password Confirmation */}
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Bevestig met uw wachtwoord
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Voer uw wachtwoord in"
                className="w-full"
              />
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={!password.trim() || isLoading}
                >
                  {isLoading ? "Verwijderen..." : "Account Verwijderen"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Definitief verwijderen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deze actie kan niet ongedaan worden gemaakt. Uw account en alle gegevens worden permanent verwijderd.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ja, verwijder account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Alternatieven</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Overweeg eerst het uitloggen van alle apparaten</li>
              <li>• Contact opnemen met ondersteuning voor hulp</li>
              <li>• Account tijdelijk deactiveren (neem contact op)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountSettings;
