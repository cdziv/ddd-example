import { faker } from '@faker-js/faker';
import { ValueObject } from './value-object.base';
import { AggregateRoot } from './aggregate-root.base';
import { DomainEvent } from './domain-event.base';
import { DomainEventEmitter } from '../interfaces';

describe('AggregateRoot', () => {
  type AggregateRootIdProps = { value: string };
  class AggregateRootId extends ValueObject<AggregateRootIdProps> {
    static create() {
      const value = faker.string.uuid();
      return new AggregateRootId({ value });
    }

    validate() {
      return;
    }
  }
  type TestAggregateRootProps = {
    id: AggregateRootId;
    foo: string;
    bar: number;
  };
  class TestAggregateRoot extends AggregateRoot<
    TestAggregateRootProps,
    AggregateRootId
  > {
    get id() {
      return this.props.id;
    }

    validate() {
      return;
    }
  }
  class TestAggregateRootCreated extends DomainEvent {}
  class TestAggregateRootUpdated extends DomainEvent {}

  describe('constructor', () => {
    const props = {
      id: AggregateRootId.create(),
      foo: faker.string.alphanumeric(),
      bar: faker.number.int(),
    };

    it('When passing valid props, should return the instance with passing props', () => {
      const ar = new TestAggregateRoot(props);

      expect(ar.props).toEqual(props);
    });
    it('When not passing domain events, should return the instance with empty domain events', () => {
      const ar = new TestAggregateRoot(props);

      expect(ar.domainEvents).toEqual([]);
    });
    it('When passing domain events, should return the instance with passing domain events', () => {
      const arId = AggregateRootId.create();
      const createdEvt = new TestAggregateRootCreated(arId.value);
      const updatedEvt = new TestAggregateRootUpdated(arId.value);
      const domainEvents = [createdEvt, updatedEvt];
      const ar = new TestAggregateRoot(props, domainEvents);

      expect(ar.domainEvents).toEqual(domainEvents);
    });
  });

  describe('domainEvents getter', () => {
    const arId = AggregateRootId.create();
    const props = {
      id: arId,
      foo: faker.string.alphanumeric(),
      bar: faker.number.int(),
    };

    it('Should return the domain events', () => {
      const createdEvt = new TestAggregateRootCreated(arId.value);
      const updatedEvt = new TestAggregateRootUpdated(arId.value);
      const domainEvents = [createdEvt, updatedEvt];
      const ar = new TestAggregateRoot(props, domainEvents);

      expect(ar.domainEvents).toEqual(domainEvents);
    });
  });

  describe('addDomainEvent', () => {
    const creationProps = {
      foo: faker.string.alphanumeric(),
      bar: faker.number.int(),
    };
    class TestAggregateRoot extends AggregateRoot<
      TestAggregateRootProps,
      AggregateRootId
    > {
      static create(props: Pick<TestAggregateRootProps, 'foo' | 'bar'>) {
        const id = AggregateRootId.create();
        const createdEvt = new TestAggregateRootCreated(id.value);
        return new TestAggregateRoot({ id, ...props }).addDomainEvent(
          createdEvt,
        );
      }

      update(props: Partial<Pick<TestAggregateRootProps, 'foo' | 'bar'>>) {
        const updatedEvt = new TestAggregateRootUpdated(this.id.value);
        return this.patchValues(props).addDomainEvent(updatedEvt);
      }

      get id() {
        return this.props.id;
      }

      validate() {
        return;
      }
    }

    it('should has created and updated event in order', () => {
      const newAR = TestAggregateRoot.create(creationProps);
      const updatedAR = newAR.update({ foo: faker.string.alphanumeric() });

      expect(updatedAR.domainEvents).toEqual([
        new TestAggregateRootCreated(updatedAR.id.value),
        new TestAggregateRootUpdated(updatedAR.id.value),
      ]);
    });
  });

  describe('publishDomainEvents', () => {
    const creationProps = {
      foo: faker.string.alphanumeric(),
      bar: faker.number.int(),
    };
    class TestAggregateRoot extends AggregateRoot<
      TestAggregateRootProps,
      AggregateRootId
    > {
      static create(props: Pick<TestAggregateRootProps, 'foo' | 'bar'>) {
        const id = AggregateRootId.create();
        const createdEvt = new TestAggregateRootCreated(id.value);
        return new TestAggregateRoot({ id, ...props }).addDomainEvent(
          createdEvt,
        );
      }

      update(props: Partial<Pick<TestAggregateRootProps, 'foo' | 'bar'>>) {
        const updatedEvt = new TestAggregateRootUpdated(this.id.value);
        return this.patchValues(props).addDomainEvent(updatedEvt);
      }

      get id() {
        return this.props.id;
      }

      validate() {
        return;
      }
    }

    it('should call eventEmitter.emit twice for created event and updated event', () => {
      const newAR = TestAggregateRoot.create(creationProps);
      const updatedAR = newAR.update({ foo: faker.string.alphanumeric() });
      const mockEmit = jest.fn();
      const eventEmitter: DomainEventEmitter = { emit: mockEmit };

      // publish
      updatedAR.publishDomainEvents(eventEmitter);

      expect(mockEmit).toHaveBeenCalledTimes(2);
      expect(mockEmit.mock.calls[0][0]).toEqual(TestAggregateRootCreated.name);
      expect(mockEmit.mock.calls[0][1]).toEqual(
        new TestAggregateRootCreated(updatedAR.id.value),
      );
      expect(mockEmit.mock.calls[1][0]).toEqual(TestAggregateRootUpdated.name);
      expect(mockEmit.mock.calls[1][1]).toEqual(
        new TestAggregateRootUpdated(updatedAR.id.value),
      );
    });
  });

  describe('clearDomainEvents', () => {
    const creationProps = {
      foo: faker.string.alphanumeric(),
      bar: faker.number.int(),
    };
    class TestAggregateRoot extends AggregateRoot<
      TestAggregateRootProps,
      AggregateRootId
    > {
      static create(props: Pick<TestAggregateRootProps, 'foo' | 'bar'>) {
        const id = AggregateRootId.create();
        const createdEvt = new TestAggregateRootCreated(id.value);
        return new TestAggregateRoot({ id, ...props }).addDomainEvent(
          createdEvt,
        );
      }

      get id() {
        return this.props.id;
      }

      validate() {
        return;
      }
    }

    it('should return the instance with empty domain events', () => {
      const newAR = TestAggregateRoot.create(creationProps);
      const clearedAR = newAR.clearDomainEvents();

      expect(clearedAR.domainEvents).toEqual([]);
    });
  });
});
