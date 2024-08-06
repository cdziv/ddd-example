import { faker } from '@faker-js/faker';
import { capitalizeWords } from '@/common';

export function generateCapitalizedWords(
  wordsCount: number,
  wordLength: number,
): string {
  return capitalizeWords(
    Array.from({ length: wordsCount })
      .map(() => faker.string.alpha(wordLength))
      .join(' '),
  );
}
