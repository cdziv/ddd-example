import { faker } from '@faker-js/faker';
import { DomainPrimitiveProps, ValueObject } from '../ddd';
import { voSchema } from './vo.schema';

describe('voSchema', () => {
  class TestVO extends ValueObject<DomainPrimitiveProps<string>> {
    validate(): Error | void {
      return;
    }
  }
  class TestVO2 extends ValueObject<DomainPrimitiveProps<string>> {
    validate(): Error | void {
      return;
    }
  }

  it('schema validate with vo instance that extends from same class should be passed', () => {
    const schema = voSchema(TestVO);
    const otherVO = new TestVO({ value: faker.string.alpha() });

    const result = schema.safeParse(otherVO);

    expect(result.success).toBe(true);
  });
  it('schema validate with vo instance that extends from different class should be failed and with correct message', () => {
    const schema = voSchema(TestVO);
    const otherVO = new TestVO2({ value: faker.string.alpha() });

    const result = schema.safeParse(otherVO);

    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe(
      `the value must be a TestVO instance`,
    );
  });
});
