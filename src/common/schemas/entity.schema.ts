import { Entity, PlainObject } from '../ddd';
import { z } from 'zod';

type EntityConstructor<T extends Entity<PlainObject> = Entity<PlainObject>> =
  abstract new (...args: any[]) => T;
type ConstructorInstance<T> = T extends abstract new (...args: any[]) => infer R
  ? R
  : never;

export function entitySchema<T extends EntityConstructor>(voConstructor: T) {
  return z.custom<ConstructorInstance<T>>(
    (value) => {
      try {
        if (!(value instanceof Entity)) return false;
        if (!(value instanceof voConstructor)) return false;
        return true;
      } catch (err: any) {
        throw new Error(`entitySchemaError: ${err.message}`);
      }
    },
    {
      message: `the value must be a ${voConstructor.name} instance`,
    },
  );
}
