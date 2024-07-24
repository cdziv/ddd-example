import {
  isCapitalized,
  ValueObject,
  DomainPrimitiveProps,
  validateDomain,
  isAlphabeticWords,
} from '../../../common';
import { z } from 'zod';

export const orderNameSchema = z
  .string()
  .min(3)
  .max(60)
  .trim()
  .refine((value) => isAlphabeticWords(value), {
    message: 'Name contains non-English characters',
  })
  .refine((value) => isCapitalized(value), {
    message: 'Name is not capitalized',
  });

export class OrderName extends ValueObject<DomainPrimitiveProps<string>> {
  validate() {
    console.log(orderNameSchema.safeParse(this.value).error);
    return validateDomain(orderNameSchema, this.value);
  }
}
