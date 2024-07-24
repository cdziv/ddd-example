import { faker } from '@faker-js/faker';
import {
  capitalizeWords,
  DddArgumentInvalidDomainError,
} from '../../../common';
import { OrderName } from './order-name.vo';

describe('OrderName', () => {
  describe('constructor', () => {
    it('When passing value is empty string, should throw DddArgumentInvalidDomainError with correct message', () => {
      const value = '';

      expect(() => new OrderName({ value })).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object OrderName is invalid: String must contain at least 3 character(s); Name contains non-English characters; Name is not capitalized',
      );
    });
    it('When passing value is all capitalized words but length is more than 60, should throw DddArgumentInvalidDomainError with correct message', () => {
      const value = capitalizeWords(
        Array.from({ length: 11 })
          .map(() => faker.string.alpha(6))
          .join(' '),
      );

      expect(value.length).toBeGreaterThan(60);
      expect(() => new OrderName({ value })).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object OrderName is invalid: String must contain at most 60 character(s)',
      );
    });
    it('When passing value is all capitalized words but contains non-English characters, should throw DddArgumentInvalidDomainError with correct message', () => {
      const value = capitalizeWords(
        Array.from({ length: 5 })
          .map(() => faker.string.alpha(5) + '1')
          .join(' '),
      );

      expect(() => new OrderName({ value })).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object OrderName is invalid: Name contains non-English characters',
      );
    });
    it('When passing value is all alphabetic words but some not capitalized, should throw DddArgumentInvalidDomainError with correct message', () => {
      const value = capitalizeWords(
        Array.from({ length: 5 })
          .map(() => faker.string.alpha(5))
          .join(' '),
      )
        .split(' ')
        .map((word, index) => (index % 2 === 0 ? word : word.toLowerCase()))
        .join(' ');

      expect(() => new OrderName({ value })).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object OrderName is invalid: Name is not capitalized',
      );
    });
  });
});
