import { faker } from '@faker-js/faker';
import { City } from './city.vo';
import { DddArgumentInvalidDomainError } from '../../../common';

describe('City', () => {
  describe('constructor', () => {
    it('When length of passing string is between 1 and 30, should create a new City instance', () => {
      const value = faker.string.alpha({ length: { min: 1, max: 30 } });
      const city = new City({ value });

      expect(city).toBeInstanceOf(City);
      expect(city.value).toBe(value);
    });
    it('When length of passing string is less than 1, should throw DddArgumentInvalidDomainError', () => {
      const value = '';

      expect(() => new City({ value })).toThrow(DddArgumentInvalidDomainError);
    });
    it('When length of passing string is greater than 30, should throw DddArgumentInvalidDomainError', () => {
      const value = faker.string.alpha({ length: 31 });

      expect(() => new City({ value })).toThrow(DddArgumentInvalidDomainError);
    });
  });
});
