import { z } from 'zod';
import {
  ValueObject,
  DomainPrimitiveProps,
  validateDomain,
} from '../../../common';

const streetSchema = z.string().min(1).max(120);

export class Street extends ValueObject<DomainPrimitiveProps<string>> {
  validate() {
    return validateDomain(streetSchema, this.value);
  }
}
