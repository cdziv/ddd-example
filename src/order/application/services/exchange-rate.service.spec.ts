import { TestBed } from '@automock/jest';
import { ExchangeRateService } from './exchange-rate.service';
import { CurrencyType, EXCHANGE_RATE_PROVIDER } from '../../order.constants';
import {
  Address,
  City,
  Currency,
  District,
  OrderName,
  Street,
  OrderAR,
  DecimalAmount,
  PriceV2,
  OrderDomainService,
  ExchangeRate,
} from '../../domain';
import { faker } from '@faker-js/faker';
import { generateCapitalizedWords } from '../../../test-utils';

describe('ExchangeRateService', () => {
  const mockExchangeRate = new ExchangeRate({
    from: new Currency({ value: CurrencyType.USD }),
    to: new Currency({ value: CurrencyType.TWD }),
    rate: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
  });
  const mockPriceTWD = new PriceV2({
    amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
    currency: new Currency({ value: CurrencyType.TWD }),
  });

  const { unit: exchangeRateService, unitRef } = TestBed.create(
    ExchangeRateService,
  )
    .mock(EXCHANGE_RATE_PROVIDER)
    .using({
      getUsdToTwdRate: jest.fn().mockResolvedValue(mockExchangeRate),
    })
    .mock(OrderDomainService)
    .using({
      exchange: jest.fn().mockReturnValue(mockPriceTWD),
    })
    .compile();
  const orderDomainService = unitRef.get(OrderDomainService);

  describe('switchToTWDCurrencyOrder', () => {
    it('When currency is USD, should call orderDomainService.exchange with the result of exchangeRateProvider.getUsdToTwdRate', async () => {
      const currencyUSD = new Currency({ value: CurrencyType.USD });
      const originalAmount = DecimalAmount.create(faker.finance.amount());
      const order = OrderAR.create({
        name: new OrderName({ value: generateCapitalizedWords(3, 5) }),
        address: new Address({
          city: new City({ value: faker.word.words(2) }),
          district: new District({ value: faker.word.words(2) }),
          street: new Street({ value: faker.word.words(3) }),
        }),
        price: new PriceV2({
          amount: originalAmount,
          currency: currencyUSD,
        }),
      });

      await exchangeRateService.switchToTWDCurrencyOrder(order);

      expect(orderDomainService.exchange).toHaveBeenCalledWith(
        originalAmount,
        mockExchangeRate,
      );
    });
    it('When currency is USD, should return order with the price from orderDomainService.exchange', async () => {
      const currencyUSD = new Currency({ value: CurrencyType.USD });
      const originalAmount = DecimalAmount.create(faker.finance.amount());
      const order = OrderAR.create({
        name: new OrderName({ value: generateCapitalizedWords(3, 5) }),
        address: new Address({
          city: new City({ value: faker.word.words(2) }),
          district: new District({ value: faker.word.words(2) }),
          street: new Street({ value: faker.word.words(3) }),
        }),
        price: new PriceV2({
          amount: originalAmount,
          currency: currencyUSD,
        }),
      });

      const updatedOrder =
        await exchangeRateService.switchToTWDCurrencyOrder(order);

      expect(updatedOrder.props.price).toEqual(mockPriceTWD);
    });

    it('When currency is TWD, should return original order', async () => {
      const currencyTWD = new Currency({ value: CurrencyType.TWD });
      const originalAmount = DecimalAmount.create(faker.finance.amount());
      const order = OrderAR.create({
        name: new OrderName({ value: generateCapitalizedWords(3, 5) }),
        address: new Address({
          city: new City({ value: faker.word.words(2) }),
          district: new District({ value: faker.word.words(2) }),
          street: new Street({ value: faker.word.words(3) }),
        }),
        price: new PriceV2({
          amount: originalAmount,
          currency: currencyTWD,
        }),
      });

      const updatedOrder =
        await exchangeRateService.switchToTWDCurrencyOrder(order);

      expect(updatedOrder).toBe(order);
    });
  });
});
