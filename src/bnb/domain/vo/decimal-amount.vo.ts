import { z } from 'zod';
import {
  DecimalString,
  ParamInvalidDomainError,
  ValueObject,
  validateDomain,
} from '@/common';
import Decimal from 'decimal.js';

const decimalAmountSchema = z.object({
  decimal: z.instanceof(Decimal).refine((value) => value.isPositive(), {
    message: 'DecimalAmount must be positive number',
  }),
});
type DecimalAmountProps = { decimal: Decimal };

export class DecimalAmount extends ValueObject<DecimalAmountProps> {
  eq(other: DecimalAmount): boolean {
    return this.value.decimal.eq(other.value.decimal);
  }
  gt(other: DecimalAmount): boolean {
    return this.value.decimal.gt(other.value.decimal);
  }
  gte(other: DecimalAmount): boolean {
    return this.value.decimal.gte(other.value.decimal);
  }
  lt(other: DecimalAmount): boolean {
    return this.value.decimal.lt(other.value.decimal);
  }
  lte(other: DecimalAmount): boolean {
    return this.value.decimal.lte(other.value.decimal);
  }
  add(other: DecimalAmount): DecimalAmount {
    return new DecimalAmount({
      decimal: this.value.decimal.add(other.value.decimal),
    });
  }
  sub(other: DecimalAmount): DecimalAmount {
    if (this.lt(other)) {
      throw new ParamInvalidDomainError(
        'cannot subtract with a greater DecimalAmount',
      );
    }
    return new DecimalAmount({
      decimal: this.value.decimal.sub(other.value.decimal),
    });
  }
  mul(amount: number): DecimalAmount {
    return new DecimalAmount({ decimal: this.value.decimal.mul(amount) });
  }
  div(amount: number): DecimalAmount {
    return new DecimalAmount({ decimal: this.value.decimal.div(amount) });
  }

  static create(amount: DecimalString | number) {
    let decimal: Decimal;
    try {
      decimal = new Decimal(amount);
    } catch (error) {
      throw new ParamInvalidDomainError('Invalid decimal value');
    }
    return new DecimalAmount({ decimal });
  }

  validate() {
    return validateDomain(decimalAmountSchema, this.value);
  }
}
