import { faker } from '@faker-js/faker';
import { DddArgumentInvalidDomainError } from '../errors';
import { ValueObject } from './value-object.base';

describe('ValueObject', () => {
  describe('constructor', () => {
    class TestChild extends ValueObject<any> {
      validate() {
        return;
      }
    }

    it('When passing props is not plain Object, should throw DddArgumentInvalidDomainError', () => {
      expect(() => new TestChild(faker.string.alphanumeric())).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
    it('When passing props is DomainPrimitive but not DomainPrimitiveProps, should throw DddArgumentInvalidDomainError', () => {
      expect(() => new TestChild(faker.number.float())).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
    it('When passing props is a plain Object, should return TestChild instance', () => {
      const child = new TestChild({
        a: faker.number.float(),
        b: faker.string.alphanumeric(),
      });

      expect(child).toBeInstanceOf(TestChild);
    });
    it('When passing props is a domain primitive props, should return TestChild instance', () => {
      const child = new TestChild({ value: faker.string.alphanumeric() });

      expect(child).toBeInstanceOf(TestChild);
    });
    it('Should call validate method', () => {
      const spy = jest.spyOn(TestChild.prototype, 'validate');
      new TestChild({ value: faker.string.alphanumeric() });

      expect(spy).toHaveBeenCalled();
    });
    it('When validate method return error, should throw DddArgumentInvalidDomainError', () => {
      class TestChildWithInvalidValidate extends ValueObject<any> {
        validate() {
          return new Error('Invalid');
        }
      }

      expect(
        () =>
          new TestChildWithInvalidValidate({
            value: faker.string.alphanumeric(),
          }),
      ).toThrow(DddArgumentInvalidDomainError);
    });
  });

  describe('isDomainPrimitive getter', () => {
    class TestChild extends ValueObject<any> {
      validate() {
        return;
      }
    }

    it('When value is a DomainPrimitive, should return true', () => {
      const instance = new TestChild({ value: faker.string.alphanumeric() });

      expect(instance.isDomainPrimitive).toBe(true);
    });
    it('When value is not a DomainPrimitive, should return false', () => {
      const instance = new TestChild({
        a: faker.number.float(),
        b: faker.string.alphanumeric(),
      });

      expect(instance.isDomainPrimitive).toBe(false);
    });
    it('When value is a empty object, should return false', () => {
      const instance = new TestChild({});

      expect(instance.isDomainPrimitive).toBe(false);
    });
  });

  describe('value getter', () => {
    class TestChild extends ValueObject<any> {
      validate() {
        return;
      }
    }
    it('When ValueObject.isDomainPrimitive is true, should return the domain primitive value directly', () => {
      const value = faker.string.alphanumeric();
      const props = { value };
      const instance = new TestChild(props);

      expect(instance.value).toBe(value);
    });
    it('When ValueObject.isDomainPrimitive is false, should return the _props', () => {
      const bar = faker.string.alphanumeric();
      const props = { foo: faker.number.float(), bar };
      const instance = new TestChild(props);

      expect(instance.value).toBe(props);
    });
    it('Before first get value, _cachedValue should be undefined', () => {
      const props = { value: faker.string.alphanumeric() };
      const instance = new TestChild(props);

      expect(instance['_cachedValue']).toBeUndefined();
    });
    it('After first get value, _cachedValue should be ValueObjectValue', () => {
      const value = faker.string.alphanumeric();
      const props = { value };
      const instance = new TestChild(props);
      // read value
      instance.value;

      expect(instance['_cachedValue']).toBe(value);
      expect(instance.value).toBe(value);
    });
  });

  describe('equals', () => {
    class TestChild extends ValueObject<{ value: string }> {
      validate() {
        return;
      }
    }

    it('When other is instance of origin and value is equal, should return true', () => {
      const value = faker.string.alphanumeric();
      const props = { value };
      const origin = new TestChild(props);
      const other = new TestChild(props);

      expect(origin.equals(other)).toBe(true);
    });
    it('When other is instance of origin but value is not equal, should return false', () => {
      const value = faker.string.alphanumeric();
      const props1 = { value };
      const origin = new TestChild(props1);
      const props2 = { value: faker.string.alphanumeric() };
      const other = new TestChild(props2);

      expect(origin.equals(other)).toBe(false);
    });
    it('When other has same props but not instance of origin, should return false', () => {
      class TestChild2 extends ValueObject<{ value: string }> {
        validate() {
          return;
        }
      }
      const value = faker.string.alphanumeric();
      const props = { value };
      const origin = new TestChild(props);
      const other = new TestChild2(props);

      expect(origin.equals(other)).toBe(false);
    });
  });

  describe('notEquals', () => {
    class TestChild extends ValueObject<{ value: string }> {
      validate() {
        return;
      }
    }

    it('When other is instance of origin and value is equal, should return false', () => {
      const value = faker.string.alphanumeric();
      const props = { value };
      const origin = new TestChild(props);
      const other = new TestChild(props);

      expect(origin.notEquals(other)).toBe(false);
    });
    it('When other is instance of origin but value is not equal, should return true', () => {
      const value = faker.string.alphanumeric();
      const props1 = { value };
      const origin = new TestChild(props1);
      const props2 = { value: faker.string.alphanumeric() };
      const other = new TestChild(props2);

      expect(origin.notEquals(other)).toBe(true);
    });
    it('When other has same props but not instance of origin, should return true', () => {
      class TestChild2 extends ValueObject<{ value: string }> {
        validate() {
          return;
        }
      }
      const value = faker.string.alphanumeric();
      const props = { value };
      const origin = new TestChild(props);
      const other = new TestChild2(props);

      expect(origin.notEquals(other)).toBe(true);
    });
  });

  describe('patchValues', () => {
    class TestChild extends ValueObject<{ foo: string; count: number }> {
      updateFoo(foo: string) {
        return this.patchValues({ foo });
      }

      addCountWithUpdater() {
        return this.patchValues((vo) => ({ count: vo.value.count + 1 }));
      }

      validate() {
        return;
      }
    }

    it('When passing partial props, should return new instance with patched values', () => {
      const foo = faker.string.alphanumeric();
      const count = faker.number.int();
      const origin = new TestChild({ foo, count });

      const newFoo = faker.string.alphanumeric();
      const patched = origin.updateFoo(newFoo);

      expect(patched).not.toBe(origin);
      expect(patched).toBeInstanceOf(TestChild);
      expect(patched.value).toEqual({ foo: newFoo, count });
    });
    it('When passing updater, should return new instance with patched values', () => {
      const foo = faker.string.alphanumeric();
      const count = faker.number.int();
      const origin = new TestChild({ foo, count });

      const patched = origin.addCountWithUpdater();

      expect(patched).not.toBe(origin);
      expect(patched).toBeInstanceOf(TestChild);
      expect(patched.value).toEqual({ foo, count: count + 1 });
    });
  });
});
