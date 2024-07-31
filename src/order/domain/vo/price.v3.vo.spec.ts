import { faker } from '@faker-js/faker';
import { CurrencyType } from '../../order.constants';
import { PriceV3 } from './price.v3.vo';
import { DecimalAmount } from './decimal-amount.vo';

describe('Price', () => {
  const validProps = {
    amount: DecimalAmount.create(faker.finance.amount()),
    currency: CurrencyType.TWD,
  };

  describe('constructor', () => {
    it('When passing value is valid props with Decimal, should return Price with same value', () => {
      const price = new PriceV3(validProps);

      expect(price).toBeInstanceOf(PriceV3);
      expect(price.value).toEqual(validProps);
    });
  });
});
