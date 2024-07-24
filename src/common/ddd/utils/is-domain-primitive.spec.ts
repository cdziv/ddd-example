import { faker } from '@faker-js/faker';
import { isDomainPrimitive } from './is-domain-primitive';

describe('isDomainPrimitive', () => {
  it('Should return true when passing string', () => {
    expect(isDomainPrimitive(faker.string.alphanumeric())).toBe(true);
  });
  it('Should return true when passing number', () => {
    expect(isDomainPrimitive(faker.number.float())).toBe(true);
  });
  it('Should return true when passing boolean', () => {
    expect(isDomainPrimitive(faker.datatype.boolean())).toBe(true);
  });
  it('Should return true when passing undefined', () => {
    expect(isDomainPrimitive(undefined)).toBe(true);
  });
  it('Should return true when passing null', () => {
    expect(isDomainPrimitive(null)).toBe(true);
  });
  it('Should return true when passing Date', () => {
    expect(isDomainPrimitive(new Date())).toBe(true);
  });
  it('Should return false when passing object', () => {
    expect(isDomainPrimitive({})).toBe(false);
  });
  it('Should return false when passing array', () => {
    expect(isDomainPrimitive([])).toBe(false);
  });
  it('Should return false when passing function', () => {
    expect(isDomainPrimitive(() => {})).toBe(false);
  });
});
