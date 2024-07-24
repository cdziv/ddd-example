export function isCapitalized(str: string): boolean {
  if (str.length === 0) return false;
  return str.split(' ').every((word) => word[0] === word[0].toUpperCase());
}
