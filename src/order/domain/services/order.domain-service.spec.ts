import { TestBed } from '@automock/jest';
import { OrderDomainService } from './order.domain-service';
import { EXCHANGE_RATE_PROVIDER } from '../../order.constants';
import { MockExchangeRateProvider } from '../../infra';
// import {
//   Address,
//   City,
//   Currency,
//   District,
//   OrderName,
//   Price,
//   Street,
// } from '../vo';
// import { faker } from '@faker-js/faker';
// import { OrderAR } from '../entities';
// import { generateCapitalizedWords } from '../../../test-utils';

describe('OrderDomainService', () => {
  const { unit: orderDomainService, unitRef } = TestBed.create(
    OrderDomainService,
  )
    .mock(EXCHANGE_RATE_PROVIDER)
    .using(new MockExchangeRateProvider())
    .compile();

  it('should be defined', () => {
    expect(orderDomainService).toBeDefined();
  });

  // describe('switchToTWDCurrencyOrder', () => {
  //   it('should switch USD to TWD', async () => {
  //     const currencyUSD = new Currency({ value: CurrencyType.USD });
  //     const originalPrice = Price.create(faker.finance.amount());
  //     const exchangeRateProvider = unitRef.get<MockExchangeRateProvider>(
  //       EXCHANGE_RATE_PROVIDER,
  //     );
  //     const rate = await exchangeRateProvider.usdToTwd();
  //     const order = OrderAR.create({
  //       name: new OrderName({ value: generateCapitalizedWords(3, 5) }),
  //       address: new Address({
  //         city: new City({ value: faker.word.words(2) }),
  //         district: new District({ value: faker.word.words(2) }),
  //         street: new Street({ value: faker.word.words(3) }),
  //       }),
  //       price: originalPrice,
  //       currency: currencyUSD,
  //     });

  //     const updatedOrder =
  //       await orderDomainService.switchToTWDCurrencyOrder(order);
  //     const expectedCurrency = new Currency({ value: CurrencyType.TWD });
  //     const expectedPrice = originalPrice.mul(rate);

  //     expect(updatedOrder.props.currency).toEqual(expectedCurrency);
  //     expect(updatedOrder.props.price).toEqual(expectedPrice);
  //   });
  //   it('When currency is TWD, should return original order', async () => {
  //     const currencyTWD = new Currency({ value: CurrencyType.TWD });
  //     const originalPrice = Price.create(faker.finance.amount());
  //     const order = OrderAR.create({
  //       name: new OrderName({ value: generateCapitalizedWords(3, 5) }),
  //       address: new Address({
  //         city: new City({ value: faker.word.words(2) }),
  //         district: new District({ value: faker.word.words(2) }),
  //         street: new Street({ value: faker.word.words(3) }),
  //       }),
  //       price: originalPrice,
  //       currency: currencyTWD,
  //     });

  //     const updatedOrder =
  //       await orderDomainService.switchToTWDCurrencyOrder(order);

  //     expect(updatedOrder).toBe(order);
  //   });
  // });

  // describe('switchUSDToTWD', () => {
  //   it('should switch USD to TWD', async () => {
  //     const currencyUSD = new Currency({ value: CurrencyType.USD });
  //     const originalPrice = Price.create(faker.finance.amount());
  //     const exchangeRateProvider = unitRef.get<MockExchangeRateProvider>(
  //       EXCHANGE_RATE_PROVIDER,
  //     );
  //     const rate = await exchangeRateProvider.usdToTwd();

  //     const newPrice = await orderDomainService.switchUSDToTWD(
  //       currencyUSD,
  //       originalPrice,
  //     );

  //     expect(newPrice).toEqual(originalPrice.mul(rate));
  //   });
  //   it('When currency is not USD, should throw ParamInvalidDomainError', async () => {
  //     const currencyTWD = new Currency({ value: CurrencyType.TWD });
  //     const originalPrice = Price.create(faker.finance.amount());

  //     await expect(
  //       orderDomainService.switchUSDToTWD(currencyTWD, originalPrice),
  //     ).rejects.toThrow('Invalid currency');
  //   });
  // });
});
