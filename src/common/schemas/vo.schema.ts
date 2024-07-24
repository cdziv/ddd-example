import { ValueObjectProps, ValueObject, isValueObject } from '../ddd';
import { z } from 'zod';

type ValueObjectConstructor<
  T extends ValueObject<ValueObjectProps> = ValueObject<ValueObjectProps>,
> = abstract new (...args: any[]) => T;
type ConstructorInstance<T> = T extends abstract new (...args: any[]) => infer R
  ? R
  : never;

export function voSchema<T extends ValueObjectConstructor>(voConstructor: T) {
  return z.custom<ConstructorInstance<T>>(
    (value) => {
      try {
        if (!isValueObject(value)) return false;
        if (!(value instanceof voConstructor)) return false;
        return true;
      } catch (err: any) {
        throw new Error(`voSchemaError: ${err.message}`);
      }
    },
    {
      message: `the value must be a ${voConstructor.name} instance`,
    },
  );
}
