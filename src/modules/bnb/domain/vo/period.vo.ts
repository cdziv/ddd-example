import { z } from 'zod';
import { ValueObject, validateDomain } from '@/common';

/**
 * @note 實際情況的驗證可能更為複雜
 */
const periodSchema = z
  .object({
    startsAt: z.date(),
    endsAt: z.date(),
  })
  .refine((val) => val.startsAt < val.endsAt, {
    message: 'startsAt should be less than endsAt',
  });
type PeriodProps = { startsAt: Date; endsAt: Date };

export class Period extends ValueObject<PeriodProps> {
  validate() {
    return validateDomain(periodSchema, this.value);
  }
}
