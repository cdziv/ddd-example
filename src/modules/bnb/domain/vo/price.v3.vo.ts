import { z } from 'zod';
import { ValueObject, validateDomain, voSchema } from '@/common';
import { DecimalAmount } from './decimal-amount.vo';
import { CurrencyType } from '../../bnb.constants';

const priceSchema = z.object({
  amount: voSchema(DecimalAmount),
  currency: z.nativeEnum(CurrencyType),
});
type PriceV3Props = { amount: DecimalAmount; currency: CurrencyType };

export class PriceV3 extends ValueObject<PriceV3Props> {
  validate() {
    return validateDomain(priceSchema, this.value);
  }
}
