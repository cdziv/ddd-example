import { faker } from '@faker-js/faker';
import { CurrencyType } from '../../bnb.constants';
import { Price } from './price.vo';
import { DecimalAmount } from './decimal-amount.vo';

describe('Price', () => {
  const validProps = {
    amount: DecimalAmount.create(faker.finance.amount()),
    currency: CurrencyType.TWD,
  };

  describe('constructor', () => {
    it('When passing value is valid props with Decimal, should return Price with same value', () => {
      const price = new Price(validProps);

      expect(price).toBeInstanceOf(Price);
      expect(price.value).toEqual(validProps);
    });
  });
});
