import { isAlphabeticWords } from './is-alphabetic-words';

describe('isAlphabeticWords', () => {
  it('When string is all alphabetic words, should return true', () => {
    expect(isAlphabeticWords('Hello World')).toBe(true);
  });
  it('When string contains non-alphabetic words, should return false', () => {
    expect(isAlphabeticWords('Hello 123')).toBe(false);
  });
  it('When string is empty, should return false', () => {
    expect(isAlphabeticWords('')).toBe(false);
  });
});
