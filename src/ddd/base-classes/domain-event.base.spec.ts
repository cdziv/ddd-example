import { faker } from '@faker-js/faker';
import { DomainEvent } from './domain-event.base';

describe('DomainEvent', () => {
  describe('constructor', () => {
    class TestDomainEvent extends DomainEvent {}

    it('Should create the instance of DomainEvent and set aggregateId', () => {
      const aggregateId = faker.string.uuid();
      const domainEvent = new TestDomainEvent(aggregateId);

      expect(domainEvent).toBeInstanceOf(DomainEvent);
      expect(domainEvent.aggregateId).toBe(aggregateId);
    });
  });
});
