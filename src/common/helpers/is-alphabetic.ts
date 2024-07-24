export function isAlphabetic(str: string): boolean {
  const alphaRegex = /^[A-Za-z]+$/;
  return alphaRegex.test(str);
}
