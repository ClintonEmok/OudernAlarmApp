
import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Ongeldig email adres'),
  password: z.string().min(1, 'Wachtwoord is verplicht')
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten'),
  email: z.string().email('Ongeldig email adres'),
  password: z.string().min(8, 'Wachtwoord moet minimaal 8 karakters bevatten'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Wachtwoorden komen niet overeen",
  path: ["password_confirmation"],
});

// User update schemas
export const updateUserSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten').optional(),
  email: z.string().email('Ongeldig email adres').optional(),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Ongeldig telefoonnummer').optional()
});

export const updatePasswordSchema = z.object({
  current_password: z.string().min(1, 'Huidig wachtwoord is verplicht'),
  new_password: z.string().min(8, 'Nieuw wachtwoord moet minimaal 8 karakters bevatten'),
  new_password_confirmation: z.string()
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "Nieuwe wachtwoorden komen niet overeen",
  path: ["new_password_confirmation"],
});

// Device schemas
export const deviceAssignSchema = z.object({
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Ongeldig telefoonnummer'),
  nickname: z.string().min(1, 'Nickname is verplicht').max(50, 'Nickname mag maximaal 50 karakters bevatten').optional()
});

// Caregiver schemas
export const inviteCaregiverSchema = z.object({
  email: z.string().email('Ongeldig email adres')
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1, 'Token is verplicht'),
  name: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten'),
  password: z.string().min(8, 'Wachtwoord moet minimaal 8 karakters bevatten'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Wachtwoorden komen niet overeen",
  path: ["password_confirmation"],
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type DeviceAssignFormData = z.infer<typeof deviceAssignSchema>;
export type InviteCaregiverFormData = z.infer<typeof inviteCaregiverSchema>;
export type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;
