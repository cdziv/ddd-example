import { faker } from '@faker-js/faker';
import { z } from 'zod';
import { validateDomain } from './validate-domain';
import { DddArgumentInvalidDomainError } from '../errors';

describe('validateDomain', () => {
  it('When passing valid props, should return undefined', () => {
    const schema = z.object({
      foo: z.string(),
      bar: z.number(),
    });
    const props = {
      foo: faker.string.alphanumeric(),
      bar: faker.number.int(),
    };
    const result = validateDomain(schema, props);
    expect(result).toBeUndefined();
  });
  it('When passing invalid props, should return the DddArgumentInvalidDomainError', () => {
    const schema = z.object({
      foo: z.string(),
      bar: z.number(),
    });
    const props = {
      foo: faker.string.alphanumeric(),
      bar: faker.string.alphanumeric(),
    };
    const result = validateDomain(schema, props);
    expect(result).toBeInstanceOf(DddArgumentInvalidDomainError);
  });
  it('When passing invalid props, should return the DddArgumentInvalidDomainError with correct message', () => {
    const schema = z.object({
      foo: z.string(),
      bar: z.number(),
    });
    const props = {
      foo: faker.number.int(),
      bar: faker.string.alphanumeric(),
    };
    const result = validateDomain(schema, props);
    expect(result?.message).toBe(
      '[foo]:Expected string, received number; [bar]:Expected number, received string',
    );
  });
});
