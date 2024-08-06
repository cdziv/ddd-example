import { z } from 'zod';
import { ValueObject, validateDomain, voSchema } from '../../../common';
import { DecimalAmount } from './decimal-amount.vo';
import { Currency } from './currency.vo';

const priceSchema = z.object({
  amount: voSchema(DecimalAmount),
  currency: voSchema(Currency),
});
type PriceV2Props = { amount: DecimalAmount; currency: Currency };

export class PriceV2 extends ValueObject<PriceV2Props> {
  validate() {
    return validateDomain(priceSchema, this.value);
  }
}
