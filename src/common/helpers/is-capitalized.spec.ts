import { isCapitalized } from './is-capitalized';

describe('isCapitalized', () => {
  it('When first letter of each word is capitalized, should return true', () => {
    const str = 'Hello World';

    expect(isCapitalized(str)).toBe(true);
  });
  it('When first letter of each word is not capitalized, should return false', () => {
    const str = 'hello world';

    expect(isCapitalized(str)).toBe(false);
  });
  it('When some words that first letter is not capitalized, should return false', () => {
    const str = 'hello World';

    expect(isCapitalized(str)).toBe(false);
  });
  it('When passing empty string, should return false', () => {
    const str = '';

    expect(isCapitalized(str)).toBe(false);
  });
});
