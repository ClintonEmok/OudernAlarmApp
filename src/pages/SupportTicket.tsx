
import { ArrowLeft, Send, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { toast } from 'sonner';

const SupportTicket = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to send support ticket
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Uw ticket is succesvol verzonden. We nemen zo spoedig mogelijk contact met u op.');
      navigate('/settings');
    } catch (error) {
      toast.error('Er is een fout opgetreden bij het verzenden van uw ticket. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-blue-50 pb-20">
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
            <h2 className="text-xl font-bold text-gray-900">Hulp & Ondersteuning</h2>
            <p className="text-sm text-gray-600">Stuur een ticket naar ons support team</p>
          </div>
        </div>

        {/* Support Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle size={20} className="text-blue-600" />
              <span>Support Ticket</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Info Display */}
              {user && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Ticket wordt verzonden voor:</p>
                  <p className="font-medium">{user.name} ({user.email})</p>
                </div>
              )}

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Prioriteit</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Laag - Algemene vraag</option>
                  <option value="medium">Gemiddeld - Technische ondersteuning</option>
                  <option value="high">Hoog - Dringend probleem</option>
                  <option value="urgent">Urgent - Noodgeval</option>
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Onderwerp *</Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Korte beschrijving van uw probleem"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Beschrijving *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Beschrijf uw probleem zo gedetailleerd mogelijk..."
                  rows={6}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !formData.subject || !formData.description}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verzenden...
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Ticket Versturen
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Andere contactmogelijkheden</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📞 Telefoon: 085 - 123 4567</p>
              <p>✉️ Email: support@ouderen-alarmering.nl</p>
              <p>🕒 Bereikbaar: Ma-Vr 09:00 - 17:00</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportTicket;
