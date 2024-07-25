import { generateCapitalizedWords } from './generate-capitalized-words';

describe('generateCapitalizedWords', () => {
  it('should generate capitalized words', () => {
    const wordsCount = 5;
    const wordLength = 6;
    const words = generateCapitalizedWords(wordsCount, wordLength);

    expect(words.split(' ')).toHaveLength(wordsCount);
    expect(words).toMatch(/^[A-Z][a-z]{5}( [A-Z][a-z]{5}){4}$/);
  });
});
