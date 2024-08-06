import { faker } from '@faker-js/faker';
import { AdminAR } from './admin.ar';
import { DddArgumentInvalidDomainError, Id } from '@/common';

describe('AdminAR', () => {
  const validProps = {
    id: Id.create(),
    bnbId: Id.create(),
    email: faker.internet.email(),
  };

  describe('constructor', () => {
    it('When passing valid props, should create AdminAR instance', () => {
      const order = new AdminAR(validProps);

      expect(order).toBeInstanceOf(AdminAR);
    });
    it('When passing invalid props, should throw DddArgumentInvalidDomainError', () => {
      const invalidProps = { ...validProps, email: null } as any;

      expect(() => new AdminAR(invalidProps)).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });

  describe('static create', () => {
    it('When passing valid props, should create AdminAR instance with same props and new id', () => {
      const props = { bnbId: Id.create(), email: faker.internet.email() };

      const admin = AdminAR.create(props);

      expect(admin).toBeInstanceOf(AdminAR);
      expect(admin.id).toBeInstanceOf(Id);
      expect(admin.props.email).toBe(props.email);
    });
  });
});
