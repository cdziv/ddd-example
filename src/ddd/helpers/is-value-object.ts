import { ValueObject } from '../base-classes';

export function isValueObject(value: unknown): boolean {
  return value instanceof ValueObject;
}
