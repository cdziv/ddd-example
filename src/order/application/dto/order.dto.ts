import { IOrderCreateBody } from '../../api-interfaces';
import { z } from 'zod';

export const orderCreateBodySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.object({
    city: z.string(),
    district: z.string(),
    street: z.string(),
  }),
  price: z.string(),
  currency: z.string(),
});

/**
 * @note 若 API 的資料想要轉換成具功能的物件，可以修改此實踐將之轉換成 DTO。
 */
export type OrderCreateBody = IOrderCreateBody;

export const orderResponseSchema = orderCreateBodySchema;
