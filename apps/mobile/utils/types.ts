import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  language: z.string().min(1, 'Please select a language'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  language: string;
  role: 'student' | 'teacher' | 'admin';
  avatarUrl: string | null;
  isVerified: boolean;
  createdAt: Date;
};
