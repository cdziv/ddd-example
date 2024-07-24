import { z } from 'zod';
import {
  DecimalString,
  ParamInvalidDomainError,
  ValueObject,
  validateDomain,
} from '../../../common';
import Decimal from 'decimal.js';

const priceSchema = z.object({
  decimal: z.instanceof(Decimal).refine((value) => value.isPositive(), {
    message: 'Price must be positive number',
  }),
});
type PriceProps = { decimal: Decimal };

export class Price extends ValueObject<PriceProps> {
  eq(other: Price): boolean {
    return this.value.decimal.eq(other.value.decimal);
  }
  gt(other: Price): boolean {
    return this.value.decimal.gt(other.value.decimal);
  }
  gte(other: Price): boolean {
    return this.value.decimal.gte(other.value.decimal);
  }
  lt(other: Price): boolean {
    return this.value.decimal.lt(other.value.decimal);
  }
  lte(other: Price): boolean {
    return this.value.decimal.lte(other.value.decimal);
  }
  add(other: Price): Price {
    return new Price({ decimal: this.value.decimal.add(other.value.decimal) });
  }
  sub(other: Price): Price {
    if (this.lt(other)) {
      throw new ParamInvalidDomainError('cannot subtract with a greater Price');
    }
    return new Price({ decimal: this.value.decimal.sub(other.value.decimal) });
  }
  mul(amount: number): Price {
    return new Price({ decimal: this.value.decimal.mul(amount) });
  }
  div(amount: number): Price {
    return new Price({ decimal: this.value.decimal.div(amount) });
  }

  static create(amount: DecimalString | number) {
    let decimal: Decimal;
    try {
      decimal = new Decimal(amount);
    } catch (error) {
      throw new ParamInvalidDomainError('Invalid decimal value');
    }
    return new Price({ decimal });
  }

  validate() {
    return validateDomain(priceSchema, this.value);
  }
}
