import { faker } from '@faker-js/faker';
import { Street } from './street.vo';
import { DddArgumentInvalidDomainError } from '../../../common';

describe('Street', () => {
  describe('constructor', () => {
    it('When length of passing string is between 1 and 120, should create a new Street instance', () => {
      const value = faker.string.alpha({ length: { min: 1, max: 120 } });
      const city = new Street({ value });

      expect(city).toBeInstanceOf(Street);
      expect(city.value).toBe(value);
    });
    it('When length of passing string is less than 1, should throw DddArgumentInvalidDomainError', () => {
      const value = '';

      expect(() => new Street({ value })).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
    it('When length of passing string is greater than 120, should throw DddArgumentInvalidDomainError', () => {
      const value = faker.string.alpha({ length: 121 });

      expect(() => new Street({ value })).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });
});
