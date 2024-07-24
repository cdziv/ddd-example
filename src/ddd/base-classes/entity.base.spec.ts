import { faker } from '@faker-js/faker';
import { DddArgumentInvalidDomainError } from '../errors';
import { ValueObject } from './value-object.base';
import { Entity } from './entity.base';

describe('Entity', () => {
  type EntityIdProps = { value: string };
  class EntityId extends ValueObject<EntityIdProps> {
    static create(value: string) {
      return new EntityId({ value });
    }

    validate() {
      return;
    }
  }
  type TestEntityProps = {
    id: EntityId;
    foo: string;
    bar: number;
  };
  class TestEntity extends Entity<TestEntityProps, EntityId> {
    get id() {
      return this.props.id;
    }
    validate() {
      return;
    }
  }

  describe('constructor', () => {
    it('When passing props is a empty object, should throw DddArgumentInvalidDomainError', () => {
      expect(() => new TestEntity({} as any)).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
    it('When validate method return error, should throw DddArgumentInvalidDomainError', () => {
      class TestChildWithInvalidValidate extends Entity<
        TestEntityProps,
        EntityId
      > {
        get id() {
          return this.props.id;
        }
        validate() {
          return new Error('Invalid');
        }
      }

      expect(
        () =>
          new TestChildWithInvalidValidate({
            id: EntityId.create(faker.string.alphanumeric()),
            foo: faker.string.alphanumeric(),
            bar: faker.number.int(),
          }),
      ).toThrow(DddArgumentInvalidDomainError);
    });
    it('When validate method return undefined, should return the entity', () => {
      class TestChildWithInvalidValidate extends Entity<
        TestEntityProps,
        EntityId
      > {
        get id() {
          return this.props.id;
        }
        validate() {
          return;
        }
      }
      const entity = new TestChildWithInvalidValidate({
        id: EntityId.create(faker.string.alphanumeric()),
        foo: faker.string.alphanumeric(),
        bar: faker.number.int(),
      });
      expect(entity).toBeInstanceOf(TestChildWithInvalidValidate);
    });
  });

  describe('props getter', () => {
    const id = EntityId.create(faker.string.alphanumeric());
    const foo = faker.string.alphanumeric();
    const bar = faker.number.float();
    const props = { id, foo, bar };
    it('When get props, should return the props', () => {
      const entity = new TestEntity(props);

      expect(entity.props).toEqual(props);
    });
    it('Before first get props, _cachedValue should be undefined', () => {
      const entity = new TestEntity(props);

      expect(entity['_cachedValue']).toBeUndefined();
    });
    it('After first get props, _cachedValue should be _props', () => {
      const entity = new TestEntity(props);
      // read props
      entity.props;

      expect(entity['_cachedValue']).toBe(props);
      expect(entity.props).toBe(props);
    });
  });

  describe('equals', () => {
    it('When id value objects are equal even if props are not equal, should return true', () => {
      const idValue = faker.string.alphanumeric();
      const id = EntityId.create(idValue);
      const id2 = EntityId.create(idValue);
      const entity1 = new TestEntity({
        id,
        foo: faker.string.alphanumeric(),
        bar: faker.number.int(),
      });
      const entity2 = new TestEntity({
        id: id2,
        foo: faker.string.alphanumeric(),
        bar: faker.number.int(),
      });

      expect(entity1.equals(entity2)).toBe(true);
    });
    it('When id value objects are not equal even if props are same, should return false', () => {
      const idValue = faker.string.alphanumeric();
      const idValue2 = faker.string.alphanumeric();
      const id = EntityId.create(idValue);
      const id2 = EntityId.create(idValue2);
      const otherProps = {
        foo: faker.string.alphanumeric(),
        bar: faker.number.int(),
      };
      const entity1 = new TestEntity({
        id,
        ...otherProps,
      });
      const entity2 = new TestEntity({
        id: id2,
        ...otherProps,
      });

      expect(entity1.equals(entity2)).toBe(false);
    });
  });

  describe('notEquals', () => {
    it('When id value objects are equal even if props are not equal, should return false', () => {
      const idValue = faker.string.alphanumeric();
      const id = EntityId.create(idValue);
      const id2 = EntityId.create(idValue);
      const entity1 = new TestEntity({
        id,
        foo: faker.string.alphanumeric(),
        bar: faker.number.int(),
      });
      const entity2 = new TestEntity({
        id: id2,
        foo: faker.string.alphanumeric(),
        bar: faker.number.int(),
      });

      expect(entity1.notEquals(entity2)).toBe(false);
    });
    it('When id value objects are not equal even if props are same, should return true', () => {
      const idValue = faker.string.alphanumeric();
      const idValue2 = faker.string.alphanumeric();
      const id = EntityId.create(idValue);
      const id2 = EntityId.create(idValue2);
      const otherProps = {
        foo: faker.string.alphanumeric(),
        bar: faker.number.int(),
      };
      const entity1 = new TestEntity({
        id,
        ...otherProps,
      });
      const entity2 = new TestEntity({
        id: id2,
        ...otherProps,
      });

      expect(entity1.notEquals(entity2)).toBe(true);
    });
  });

  describe('patchValues', () => {
    class TestEntity extends Entity<TestEntityProps, EntityId> {
      get id() {
        return this.props.id;
      }

      updateFoo(foo: string) {
        return this.patchValues({ foo });
      }
      addCountWithUpdater() {
        return this.patchValues((entity) => ({
          bar: entity.props.bar + 1,
        }));
      }

      validate() {
        return;
      }
    }

    it('When passing a partial object, should return a new entity with updated props', () => {
      const id = EntityId.create(faker.string.alphanumeric());
      const foo = faker.string.alphanumeric();
      const bar = faker.number.int();
      const entity = new TestEntity({ id, foo, bar });

      const newFoo = faker.string.alphanumeric();
      const updatedEntity = entity.updateFoo(newFoo);

      expect(updatedEntity).toBeInstanceOf(TestEntity);
      expect(updatedEntity.props).toEqual({
        ...entity.props,
        foo: newFoo,
      });
    });
    it('When passing a updater function, should return a new entity with updated props', () => {
      const id = EntityId.create(faker.string.alphanumeric());
      const foo = faker.string.alphanumeric();
      const bar = faker.number.int();
      const entity = new TestEntity({ id, foo, bar });

      const updatedEntity = entity.addCountWithUpdater();

      expect(updatedEntity).toBeInstanceOf(TestEntity);
      expect(updatedEntity.props).toEqual({
        ...entity.props,
        bar: entity.props.bar + 1,
      });
    });
  });
});
