import { isPrimitive } from './is-primitive';
import { faker } from '@faker-js/faker';

describe('isPrimitive', () => {
  it('Should return true when passing string', () => {
    expect(isPrimitive(faker.string.alphanumeric())).toBe(true);
  });
  it('Should return true when passing number', () => {
    expect(isPrimitive(faker.number.float())).toBe(true);
  });
  it('Should return true when passing boolean', () => {
    expect(isPrimitive(faker.datatype.boolean())).toBe(true);
  });
  it('Should return true when passing undefined', () => {
    expect(isPrimitive(undefined)).toBe(true);
  });
  it('Should return true when passing null', () => {
    expect(isPrimitive(null)).toBe(true);
  });
  it('Should return false when passing object', () => {
    expect(isPrimitive({})).toBe(false);
  });
  it('Should return false when passing array', () => {
    expect(isPrimitive([])).toBe(false);
  });
  it('Should return false when passing function', () => {
    expect(isPrimitive(() => {})).toBe(false);
  });
  it('Should return false when passing Date', () => {
    expect(isPrimitive(new Date())).toBe(false);
  });
});
