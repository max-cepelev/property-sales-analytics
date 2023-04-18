import { TypeOf, z } from 'zod';

export const complexInputSchema = z
  .object({
    id: z.number().optional(),
    name: z.string({ required_error: 'Введите имя' }).min(2, 'Введите наименование'),
    shortName: z.string().nullable(),
    website: z.string().nullable(),
    info: z.string().nullable(),
    domRfId: z.number().nullable(),
    domClickId: z.number().nullable(),
    groupId: z.number().nullable(),
    cityId: z.number().nullable(),
    districtId: z.number().nullable(),
  })
  .superRefine((val, ctx) => {
    if (!val.groupId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Выберите группу компаний',
        path: ['groupId'],
      });
    }

    if (!val.cityId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Выберите город',
        path: ['cityId'],
      });
    }

    if (!val.districtId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Выберите район',
        path: ['districtId'],
      });
    }
  });

export type ComplexInputSchema = TypeOf<typeof complexInputSchema>;
