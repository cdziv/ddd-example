import { faker } from '@faker-js/faker';
import { isAlphabetic } from './is-alphabetic';

describe('isAlphabetic', () => {
  it('When string is all alphabetic, should return true', () => {
    expect(isAlphabetic(faker.string.alpha())).toBe(true);
  });

  it('When string is alphanumeric, should return false', () => {
    expect(isAlphabetic(faker.string.alpha() + '1')).toBe(false);
  });

  it('When string contains symbol, should return false', () => {
    const str =
      faker.string.alpha() + faker.string.symbol() + faker.string.alpha();

    expect(isAlphabetic(str)).toBe(false);
  });
});
