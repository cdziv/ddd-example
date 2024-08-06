import { BedEntity } from './bed.entity';
import { DddArgumentInvalidDomainError, Id } from '@/common';
import { BedSize } from '../../bnb.constants';
import { faker } from '@faker-js/faker';

describe('BedEntity', () => {
  const validProps = {
    id: Id.create(),
    size: faker.helpers.enumValue(BedSize),
  };

  describe('constructor', () => {
    it('When passing valid props, should create BedEntity instance', () => {
      const order = new BedEntity(validProps);

      expect(order).toBeInstanceOf(BedEntity);
    });
    it('When passing invalid props, should throw DddArgumentInvalidDomainError', () => {
      const invalidProps = { ...validProps, size: null } as any;

      expect(() => new BedEntity(invalidProps)).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });

  describe('static create', () => {
    it('When passing valid props, should create BedEntity instance with same props and new id', () => {
      const props = { size: BedSize.Double };

      const admin = BedEntity.create(props);

      expect(admin).toBeInstanceOf(BedEntity);
      expect(admin.id).toBeInstanceOf(Id);
      expect(admin.props.size).toBe(props.size);
    });
  });
});
