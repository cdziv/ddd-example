import { DomainPrimitive } from '../interfaces';
import { isPrimitive } from './is-primitive';

export function isDomainPrimitive(value: unknown): value is DomainPrimitive {
  return isPrimitive(value) || value instanceof Date;
}
