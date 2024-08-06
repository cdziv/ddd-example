import { idSchema } from '@/common';
import { z } from 'zod';
import { CurrencyType } from '../bnb.constants';

export const bookingResponseDtoSchema = z.object({
  id: idSchema,
  bnbId: idSchema,
  roomId: idSchema,
  clientId: idSchema,
  checkInAt: z.date(),
  checkOutAt: z.date(),
  price: z.string(),
  currency: z.nativeEnum(CurrencyType),
  createdAt: z.date(),
});

export type BookingResponseDto = z.infer<typeof bookingResponseDtoSchema>;
