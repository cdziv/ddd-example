import { faker } from '@faker-js/faker';
import { DddArgumentInvalidDomainError } from '@/common';
import { AddressV2 } from './address.v2.vo';

describe('AddressV2', () => {
  const validProps = {
    city: faker.string.alpha({ length: { min: 1, max: 30 } }),
    district: faker.string.alpha({ length: { min: 1, max: 30 } }),
    street: faker.string.alpha({ length: { min: 1, max: 120 } }),
  };
  describe('constructor', () => {
    it('When passing valid props, should create a new Address instance and value equals props', () => {
      const address = new AddressV2(validProps);

      expect(address).toBeInstanceOf(AddressV2);
      expect(address.value).toEqual(validProps);
    });
    it('When passing invalid props, should throw DddArgumentInvalidDomainError', () => {
      const city = faker.string.alpha({ length: { min: 1, max: 30 } });
      const district = faker.string.alpha({ length: { min: 1, max: 30 } });
      const notHere = new Date();
      const props = { city, district, notHere } as any;

      expect(() => new AddressV2(props)).toThrow(DddArgumentInvalidDomainError);
    });
  });

  describe('getters', () => {
    it('When call city, should return city', () => {
      const address = new AddressV2(validProps);

      expect(address.city).toBe(validProps.city);
    });
    it('When call district, should return district', () => {
      const address = new AddressV2(validProps);

      expect(address.district).toBe(validProps.district);
    });
    it('When call street, should return street', () => {
      const address = new AddressV2(validProps);

      expect(address.street).toBe(validProps.street);
    });
    it('When call fullAddress, should return full address', () => {
      const address = new AddressV2(validProps);

      expect(address.fullAddress).toBe(
        `${validProps.city} ${validProps.district} ${validProps.street}`,
      );
    });
  });
});
