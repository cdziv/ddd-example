import { z } from 'zod';
import {
  ValueObject,
  DomainPrimitiveProps,
  validateDomain,
} from '../../../common';

const districtSchema = z.string().min(1).max(30);

export class District extends ValueObject<DomainPrimitiveProps<string>> {
  validate() {
    return validateDomain(districtSchema, this.value);
  }
}
