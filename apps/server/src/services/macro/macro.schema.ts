import { z } from 'zod';

export const MACRO_RESPONSE_SCHEMA = z.array(
  z.object({
    id: z.number().int(),
    category: z.string(),
    image: z.string().url().nullable(),
    status: z.string(),
    square: z.number(),
    price: z.number(),
    decorPrice: z.number().nullable(),
    stockPrice: z.number().nullable(),
    mPrice: z.number(),
    floor: z.number().int(),
    rooms: z.number().int().nullable(),
    flat: z.string().nullable(),
    entrance: z.number().int().nullable(),
    plan: z.string().nullable(),
  }),
);

export const ERROR_RESPONSE_SCHEMA = z.object({
  message: z.string(),
});

export type MacroResponseType = z.infer<typeof MACRO_RESPONSE_SCHEMA>;
