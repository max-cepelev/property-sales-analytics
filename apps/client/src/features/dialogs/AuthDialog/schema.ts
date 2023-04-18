import { z } from 'zod';

export const registrationSchema = z
  .object({
    email: z.string().email('неверный формат email'),
    password: z.string().min(6, 'минимум 6 символов').max(30, 'максимум 30 символов'),
    name: z.nullable(z.string().min(2, 'Введите имя')),
    phone: z.nullable(z.string().min(10, 'неверный формат').max(12, 'неверный формат')),
  })
  .superRefine((val, ctx) => {
    if (!val.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Введите Email',
        path: ['email'],
      });
    }

    if (!val.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Введите пароль',
        path: ['password'],
      });
    }
  });
export type RegistrationInput = z.infer<typeof registrationSchema>;

export const loginSchema = z.object({
  email: z.string().email('неверный формат email'),
  password: z.string().min(6, 'Минимум 6 символов').max(30, 'Максимум 30 символов'),
});

export type LoginInput = z.infer<typeof loginSchema>;
