import { TypeOf, z } from 'zod';

export const developerInputSchema = z
  .object({
    id: z.number().optional(),
    name: z.string({ required_error: 'Введите имя' }).min(3, 'Введите наименование'),
    fullName: z
      .string({ required_error: 'Обязательное поле' })
      .min(3, 'Введите полное наименование'),
    legalAddress: z.string().min(3).nullable(),
    actualAddress: z.string().nullable(),
    inn: z
      .string({ required_error: 'Заполните ИНН' })
      .min(10, 'Минимум 10 цифр')
      .max(10, 'Максимум 10 цифр'),
    kpp: z.string().min(9, 'Минимум 9 цифр').max(9, 'Максимум 9 цифр').nullable(),
    ogrn: z.string().min(13, 'Минимум 13 цифр').max(13, 'Максимум 13 цифр').nullable(),
    email: z.string().email().nullable(),
    phone: z.string().nullable(),
    manager: z.string().nullable(),
    website: z.string().nullable(),
    info: z.string().nullable(),
    groupId: z.number().nullable(),
  })
  .refine((data) => data.groupId !== null, {
    message: 'Не выбрана группа компаний',
    path: ['groupId'],
  });

export type DeveloperInput = TypeOf<typeof developerInputSchema>;
