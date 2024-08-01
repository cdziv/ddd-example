import { faker } from '@faker-js/faker';
import { Entity } from '../ddd';
import { entitySchema } from './entity.schema';
import { Id } from '../vo';

describe('entitySchema', () => {
  type TestEntityProps = {
    id: Id;
    foo: string;
  };
  class TestEntity extends Entity<TestEntityProps> {
    get id() {
      return this.props.id;
    }

    validate(): Error | void {
      return;
    }
  }
  class TestEntity2 extends Entity<TestEntityProps> {
    get id() {
      return this.props.id;
    }
    validate(): Error | void {
      return;
    }
  }

  it('schema validate with vo instance that extends from same class should be passed', () => {
    const schema = entitySchema(TestEntity);
    const otherEntity = new TestEntity({
      id: Id.create(),
      foo: faker.string.alpha(),
    });

    const result = schema.safeParse(otherEntity);

    expect(result.success).toBe(true);
  });
  it('schema validate with vo instance that extends from different class should be failed and with correct message', () => {
    const schema = entitySchema(TestEntity);
    const otherEntity = new TestEntity2({
      id: Id.create(),
      foo: faker.string.alpha(),
    });

    const result = schema.safeParse(otherEntity);

    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe(
      `the value must be a TestEntity instance`,
    );
  });
});
