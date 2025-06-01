import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authService } from '../services/auth-service';
import { Eye, EyeOff } from 'lucide-react';
import { logger } from '../utils/logger';

const registerSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten'),
  email: z.string().email('Ongeldig e-mailadres'),
  password: z.string().min(8, 'Wachtwoord moet minimaal 8 karakters bevatten'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Wachtwoorden komen niet overeen",
  path: ["password_confirmation"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation
      });
      
      toast({
        title: "Account aangemaakt!",
        description: "Je account is succesvol aangemaakt. Je kunt nu inloggen.",
      });
      
      navigate('/login');
    } catch (error) {
      logger.error('Registration failed', error);
      toast({
        title: "Registratie mislukt",
        description: error instanceof Error ? error.message : "Er is een fout opgetreden tijdens de registratie.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="iphone-page-container flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Maak een account aan</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Naam</Label>
              <Input id="name" type="text" placeholder="Uw naam" {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="voorbeeld@email.com" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Wachtwoord"
                  {...form.register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Wachtwoord tonen</span>
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Wachtwoord bevestigen</Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  placeholder="Wachtwoord bevestigen"
                  {...form.register('password_confirmation')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                >
                  {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Wachtwoord tonen</span>
                </Button>
              </div>
              {form.formState.errors.password_confirmation && (
                <p className="text-sm text-red-500">{form.formState.errors.password_confirmation.message}</p>
              )}
            </div>
            <Button disabled={isLoading} className="w-full">
              {isLoading ? 'Aanmaken...' : 'Account aanmaken'}
            </Button>
          </form>
          <div className="text-sm text-gray-500 text-center">
            Heb je al een account? <Link to="/login" className="text-blue-600 hover:underline">Inloggen</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
