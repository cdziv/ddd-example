import { z } from 'zod';
import { ValueObject, validateDomain, voSchema } from '../../../common';
import { DecimalAmount } from './decimal-amount.vo';
import { Currency } from './currency.vo';

const exchangeRateSchema = z.object({
  from: voSchema(Currency),
  to: voSchema(Currency),
  rate: voSchema(DecimalAmount),
});
type ExchangeRateProps = { from: Currency; to: Currency; rate: DecimalAmount };

export class ExchangeRate extends ValueObject<ExchangeRateProps> {
  validate() {
    return validateDomain(exchangeRateSchema, this.value);
  }
}
