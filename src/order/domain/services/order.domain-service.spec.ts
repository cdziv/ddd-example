import { TestBed } from '@automock/jest';
import { OrderDomainService } from './order.domain-service';
import { CurrencyType, EXCHANGE_RATE_PROVIDER } from '../../order.constants';
import { MockExchangeRateProvider } from '../../infra';
import { Currency, Price } from '../vo';
import { faker } from '@faker-js/faker';

describe('OrderDomainService', () => {
  const { unit: orderDomainService, unitRef } = TestBed.create(
    OrderDomainService,
  )
    .mock(EXCHANGE_RATE_PROVIDER)
    .using(new MockExchangeRateProvider())
    .compile();

  describe('switchUSDToTWD', () => {
    it('should switch USD to TWD', async () => {
      const currencyUSD = new Currency({ value: CurrencyType.USD });
      const originalPrice = Price.create(faker.finance.amount());
      const exchangeRateProvider = unitRef.get<MockExchangeRateProvider>(
        EXCHANGE_RATE_PROVIDER,
      );
      const rate = await exchangeRateProvider.usdToTwd();

      const newPrice = await orderDomainService.switchUSDToTWD(
        currencyUSD,
        originalPrice,
      );

      expect(newPrice).toEqual(originalPrice.mul(rate));
    });
    it('When currency is not USD, should throw ParamInvalidDomainError', async () => {
      const currencyTWD = new Currency({ value: CurrencyType.TWD });
      const originalPrice = Price.create(faker.finance.amount());

      await expect(
        orderDomainService.switchUSDToTWD(currencyTWD, originalPrice),
      ).rejects.toThrow('Invalid currency');
    });
  });
});
