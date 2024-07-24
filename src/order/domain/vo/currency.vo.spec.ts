import { CurrencyType } from '../../order.constants';
import { Currency } from './currency.vo';
import { DddArgumentInvalidDomainError } from '../../../common';

describe('Currency', () => {
  describe('constructor', () => {
    it('When passing "TWD", should create a new Currency instance', () => {
      const value = CurrencyType.TWD;
      const currency = new Currency({ value });

      expect(currency).toBeInstanceOf(Currency);
      expect(currency.value).toBe(value);
    });
    it('When passing "USD", should create a new Currency instance', () => {
      const value = CurrencyType.USD;
      const currency = new Currency({ value });

      expect(currency).toBeInstanceOf(Currency);
      expect(currency.value).toBe(value);
    });
    it('When passing invalid currency string, should throw DddArgumentInvalidDomainError', () => {
      const value = 'INVALID_CURRENCY' as any;

      expect(() => new Currency({ value })).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });
});
