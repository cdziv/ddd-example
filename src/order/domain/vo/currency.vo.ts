import { z } from 'zod';
import {
  DomainPrimitiveProps,
  validateDomain,
  ValueObject,
} from '../../../common';
import { CurrencyType } from '../../order.constants';

const currencySchema = z.nativeEnum(CurrencyType);

export class Currency extends ValueObject<DomainPrimitiveProps<CurrencyType>> {
  validate() {
    return validateDomain(currencySchema, this.value);
  }
}
