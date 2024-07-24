import { faker } from '@faker-js/faker';
import { isValueObject } from './is-value-object';
import { ValueObject } from '../base-classes';

describe('isValueObject', () => {
  it('When passing value is a Value Object instance, should return true', () => {
    class TestValueObject extends ValueObject<{ value: string }> {
      validate() {
        return;
      }
    }
    expect(
      isValueObject(
        new TestValueObject({ value: faker.string.alphanumeric() }),
      ),
    ).toBe(true);
  });
  it('When passing value is not a Value Object instance, should return false', () => {
    expect(isValueObject(new Date())).toBe(false);
  });
});
