import { TestBed } from '@automock/jest';
import { OrderDomainService } from './order.domain-service';
import { Currency, DecimalAmount, ExchangeRate, PriceV2 } from '../vo';
import { CurrencyType } from '../../order.constants';

describe('OrderDomainService', () => {
  const { unit: orderDomainService } =
    TestBed.create(OrderDomainService).compile();

  describe('exchange', () => {
    it('When passing originalAmount value is 5, and exchangeRate is 10.5 and currency is TWD, it should return Price with amount 52.5 and currency TWD', () => {
      const originalAmount = DecimalAmount.create(5);
      const exchangeRate = new ExchangeRate({
        from: new Currency({ value: CurrencyType.USD }),
        to: new Currency({ value: CurrencyType.TWD }),
        rate: DecimalAmount.create(10.5),
      });

      const result = orderDomainService.exchange(originalAmount, exchangeRate);

      expect(result).toEqual(
        new PriceV2({
          amount: DecimalAmount.create(52.5),
          currency: new Currency({ value: CurrencyType.TWD }),
        }),
      );
    });
  });
});
