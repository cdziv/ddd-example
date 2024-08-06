import { faker } from '@faker-js/faker';
import { ClientAR } from './client.ar';
import { DddArgumentInvalidDomainError, Id } from '@/common';

describe('ClientAR', () => {
  const validProps = {
    id: Id.create(),
    email: faker.internet.email(),
  };

  describe('constructor', () => {
    it('When passing valid props, should create ClientAR instance', () => {
      const order = new ClientAR(validProps);

      expect(order).toBeInstanceOf(ClientAR);
    });
    it('When passing invalid props, should throw DddArgumentInvalidDomainError', () => {
      const invalidProps = { ...validProps, email: null } as any;

      expect(() => new ClientAR(invalidProps)).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });

  describe('static create', () => {
    it('When passing valid props, should create ClientAR instance with same props and new id', () => {
      const props = { bnbId: Id.create(), email: faker.internet.email() };

      const admin = ClientAR.create(props);

      expect(admin).toBeInstanceOf(ClientAR);
      expect(admin.id).toBeInstanceOf(Id);
      expect(admin.props.email).toBe(props.email);
    });
  });
});
