import { idSchema } from '@/common';
import { z } from 'zod';
import { CurrencyType } from '../bnb.constants';

export const createBookingRequestDtoSchema = z.object({
  bnbId: idSchema,
  roomId: idSchema,
  clientId: idSchema,
  checkInAt: z.date(),
  checkOutAt: z.date(),
  useCurrency: z.nativeEnum(CurrencyType),
});

export type CreateBookingRequestDto = z.infer<
  typeof createBookingRequestDtoSchema
>;
