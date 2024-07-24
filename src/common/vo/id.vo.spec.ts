import { faker } from '@faker-js/faker';
import { Id } from './id.vo';
import { DddArgumentInvalidDomainError } from '../ddd';
import { z } from 'zod';

describe('Id', () => {
  describe('constructor', () => {
    it('When passing value is not valid uuid, should throw DddArgumentInvalidDomainError', () => {
      expect(() => new Id({ value: faker.string.alphanumeric() })).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
    it('When passing value is valid uuid, should return Id instance', () => {
      const value = faker.string.uuid();
      const id = new Id({ value });

      expect(id).toBeInstanceOf(Id);
      expect(id.value).toBe(value);
    });
  });

  describe('create', () => {
    it('Should return Id instance and its value is uuid', () => {
      const id = Id.create();

      expect(id).toBeInstanceOf(Id);
      expect(z.string().uuid().safeParse(id.value).success).toBe(true);
    });
  });
});
