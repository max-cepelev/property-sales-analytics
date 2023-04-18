import { z } from 'zod';

export const buildingInputSchema = z
  .object({
    id: z.number().optional(),
    name: z.string({ required_error: 'Введите имя' }).min(2, 'Введите наименование'),
    address: z.string().min(2, 'Введите адрес'),
    completionDate: z.string({ required_error: 'Введите срок сдачи' }).nullish(),
    completed: z.boolean(),
    latitude: z.number().nullish(),
    longitude: z.number().nullish(),
    propertyClass: z.enum(['TYPICAL', 'ECONOMY', 'COMFORT', 'BUSINESS', 'PREMIUM']).nullish(),
    decorType: z.enum(['WITHOUT', 'UNDER_FINISHING', 'FINISHING', 'FULL', 'OPTIONALLY']).nullish(),
    wallMaterial: z.enum(['MONOLITH_BRICK', 'BLOCKS', 'BRICK', 'PANEL', 'MONOLITH']).nullish(),
    img: z.string().url('Укажите ссылку').nullish(),
    domRfId: z.number().nullish(),
    domClickId: z.number().nullish(),
    cityId: z.number().nullish(),
    districtId: z.number().nullish(),
    developerId: z.number().nullish(),
    groupId: z.number().nullish(),
    complexId: z.number().nullish(),
  })
  .superRefine((val, ctx) => {
    if (!val.completionDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Выберите срок сдачи',
        path: ['completionDate'],
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

    if (!val.groupId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Выберите группу компаний',
        path: ['groupId'],
      });
    }

    if (!val.developerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Выберите застройщика',
        path: ['developerId'],
      });
    }

    if (!val.complexId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Выберите ЖК',
        path: ['complexId'],
      });
    }
  });

export type BuildingInputSchema = z.infer<typeof buildingInputSchema>;
