import { isPlainObject } from './is-plain-object';
import { faker } from '@faker-js/faker';

describe('isPlainObject', () => {
  it('Should return true when passing plain object', () => {
    expect(
      isPlainObject({
        a: faker.number.float(),
        b: faker.word.words(),
      }),
    ).toBe(true);
  });
  it('Should return true when passing empty plain object', () => {
    expect(isPlainObject({})).toBe(true);
  });
  it('Should return false when passing array', () => {
    expect(isPlainObject([])).toBe(false);
  });
  it('Should return false when passing null', () => {
    expect(isPlainObject(null)).toBe(false);
  });
  it('Should return false when passing undefined', () => {
    expect(isPlainObject(undefined)).toBe(false);
  });
  it('Should return false when passing Date', () => {
    expect(isPlainObject(new Date())).toBe(false);
  });
  it('Should return false when passing string', () => {
    expect(isPlainObject(faker.word.words())).toBe(false);
  });
  it('Should return false when passing number', () => {
    expect(isPlainObject(faker.number.float())).toBe(false);
  });
  it('Should return false when passing boolean', () => {
    expect(isPlainObject(faker.datatype.boolean())).toBe(false);
  });
  it('Should return false when passing function', () => {
    expect(isPlainObject(() => {})).toBe(false);
  });
  it('Should return false when passing Map', () => {
    expect(isPlainObject(new Map())).toBe(false);
  });
  it('Should return false when passing Set', () => {
    expect(isPlainObject(new Set())).toBe(false);
  });
});
