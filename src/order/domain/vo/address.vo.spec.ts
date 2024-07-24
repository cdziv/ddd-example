import { faker } from '@faker-js/faker';
import { Address } from './address.vo';
import { Street } from './street.vo';
import { City } from './city.vo';
import { District } from './district.vo';
import { DddArgumentInvalidDomainError } from '../../../common';

describe('Address', () => {
  describe('constructor', () => {
    it('When passing valid props, should create a new Address instance and value equals props', () => {
      const city = new City({
        value: faker.string.alpha({ length: { min: 1, max: 30 } }),
      });
      const district = new District({
        value: faker.string.alpha({ length: { min: 1, max: 30 } }),
      });
      const street = new Street({
        value: faker.string.alpha({ length: { min: 1, max: 120 } }),
      });
      const props = { city, district, street };

      const address = new Address(props);

      expect(address).toBeInstanceOf(Address);
      expect(address.value).toEqual(props);
    });
    it('When passing invalid props, should throw DddArgumentInvalidDomainError', () => {
      const city = new City({
        value: faker.string.alpha({ length: { min: 1, max: 30 } }),
      });
      const district = new District({
        value: faker.string.alpha({ length: { min: 1, max: 30 } }),
      });
      const notHere = new Date();
      const props = { city, district, notHere } as any;

      expect(() => new Address(props)).toThrow(DddArgumentInvalidDomainError);
    });
  });
});
