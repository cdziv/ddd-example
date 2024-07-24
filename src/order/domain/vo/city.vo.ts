import { z } from 'zod';
import {
  ValueObject,
  DomainPrimitiveProps,
  validateDomain,
} from '../../../common';

const citySchema = z.string().min(1).max(30);

export class City extends ValueObject<DomainPrimitiveProps<string>> {
  validate() {
    return validateDomain(citySchema, this.value);
  }
}
