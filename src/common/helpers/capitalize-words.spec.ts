import { capitalizeWords } from './capitalize-words';

describe('capitalizeWords', () => {
  it('When passing value is all lowercase words, should return all capitalized words', () => {
    const value = 'hello world';

    expect(capitalizeWords(value)).toBe('Hello World');
  });
  it('When passing empty string, should return empty string', () => {
    const value = '';

    expect(capitalizeWords(value)).toBe('');
  });
});
