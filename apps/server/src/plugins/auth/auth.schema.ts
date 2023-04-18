import { Role } from '@prisma/client';
import { z } from 'zod';

export const REGISTRATION_SCHEMA = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const AUTH_RESPONSE_SCHEMA = z.object({
  token: z.string(),
  user: z.object({
    id: z.number().int(),
    name: z.string().nullable(),
    email: z.string().email(),
    phone: z.string().nullable(),
    role: z.nativeEnum(Role),
    activated: z.boolean().nullable(),
  }),
});

export const LOGIN_SCHEMA = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string(),
});

export const JWT_PAYLOAD_SCHEMA = z.object({
  userId: z.number().int(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
  activated: z.boolean(),
});

export type RegistrationInput = z.infer<typeof REGISTRATION_SCHEMA>;

export type LoginInput = z.infer<typeof LOGIN_SCHEMA>;

export type AuthResponse = z.infer<typeof AUTH_RESPONSE_SCHEMA>;

export type JwtPayload = z.infer<typeof JWT_PAYLOAD_SCHEMA>;
