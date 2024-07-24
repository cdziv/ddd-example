import { isAlphabetic } from './is-alphabetic';

export function isAlphabeticWords(str: string): boolean {
  if (str.length === 0) return false;
  return str.split(' ').every((word) => isAlphabetic(word));
}
