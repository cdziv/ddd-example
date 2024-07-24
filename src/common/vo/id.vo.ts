import { z } from 'zod';
import { DomainPrimitiveProps, ValueObject } from '../ddd';
import { v4 as uuidv4 } from 'uuid';
import { validateDomain } from '../ddd/helpers/validate-domain';

const idSchema = z.string().uuid();

/**
 * 使用 UUID 產生的 ID
 */
export class Id extends ValueObject<DomainPrimitiveProps<string>> {
  static create() {
    return new Id({ value: uuidv4() });
  }

  validate() {
    return validateDomain(idSchema, this.value);
  }
}
