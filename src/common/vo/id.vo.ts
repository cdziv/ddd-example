import { ValueObject } from '../ddd';
import { v4 as uuidv4 } from 'uuid';

/**
 * 使用 UUID 產生的 ID
 */
export class Id extends ValueObject<{ value: string }> {
  static create() {
    return new Id({ value: uuidv4() });
  }

  validate() {
    return;
  }
}
