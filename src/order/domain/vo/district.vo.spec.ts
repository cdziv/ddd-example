import { faker } from '@faker-js/faker';
import { District } from './district.vo';
import { DddArgumentInvalidDomainError } from '../../../common';

describe('District', () => {
  describe('constructor', () => {
    it('When length of passing string is between 1 and 30, should create a new District instance', () => {
      const value = faker.string.alpha({ length: { min: 1, max: 30 } });
      const district = new District({ value });

      expect(district).toBeInstanceOf(District);
      expect(district.value).toBe(value);
    });
    it('When length of passing string is less than 1, should throw DddArgumentInvalidDomainError', () => {
      const value = '';

      expect(() => new District({ value })).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
    it('When length of passing string is greater than 30, should throw DddArgumentInvalidDomainError', () => {
      const value = faker.string.alpha({ length: 31 });

      expect(() => new District({ value })).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });
});
