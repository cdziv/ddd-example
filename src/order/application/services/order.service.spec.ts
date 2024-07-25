import { TestBed } from '@automock/jest';
import {
  CurrencyType,
  DOMAIN_EVENT_EMITTER,
  ORDER_REPOSITORY,
} from '../../order.constants';
import {
  Currency,
  OrderAR,
  OrderName,
  Address,
  City,
  District,
  Street,
  PriceV2,
  DecimalAmount,
} from '../../domain';
import { faker } from '@faker-js/faker';
import { OrderService } from './order.service';
import { OrderDtoAssembler } from '../dto-assemblers';
import { DomainEventEmitter } from '../../../common';
import { generateCapitalizedWords } from '../../../test-utils';
import { OrderCreateParams } from '../dto';
import { OrderRepositoryPort } from '../../infra';
import { BadRequestException } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';

describe('OrderService', () => {
  let mockValidOrder: OrderAR;
  let mockTransformedOrder: OrderAR;
  let mockOrderARToResponseResult: symbol;
  let orderDtoAssembler: OrderDtoAssembler;
  let exchangeRateService: ExchangeRateService;
  let orderService: OrderService;
  let orderRepository: OrderRepositoryPort;
  let domainEventEmitter: DomainEventEmitter;

  beforeEach(() => {
    mockValidOrder = OrderAR.create({
      name: new OrderName({ value: generateCapitalizedWords(3, 6) }),
      address: new Address({
        city: new City({ value: faker.word.words(2) }),
        district: new District({ value: faker.word.words(2) }),
        street: new Street({ value: faker.word.words(3) }),
      }),
      price: new PriceV2({
        amount: DecimalAmount.create(faker.finance.amount({ dec: 0, max: 50 })),
        currency: new Currency({ value: CurrencyType.USD }),
      }),
    });
    mockTransformedOrder = mockValidOrder.update({
      price: new PriceV2({
        amount: mockValidOrder.props.price.value.amount.mul(31),
        currency: new Currency({ value: CurrencyType.TWD }),
      }),
    });
    mockOrderARToResponseResult = Symbol('mockOrderARToResponseResult');

    const { unit, unitRef } = TestBed.create(OrderService)
      .mock(OrderDtoAssembler)
      .using({
        orderCreateParamsToOrderAR: jest.fn().mockReturnValue(mockValidOrder),
        orderARToResponse: jest
          .fn()
          .mockReturnValue(mockOrderARToResponseResult),
      })
      .mock(ExchangeRateService)
      .using({
        switchToTWDCurrencyOrder: jest
          .fn()
          .mockResolvedValue(mockTransformedOrder),
      })
      .mock(ORDER_REPOSITORY)
      .using({
        save: jest.fn(),
      })
      .mock(DOMAIN_EVENT_EMITTER)
      .using({
        emit: jest.fn(),
      })
      .compile();
    orderService = unit;
    orderDtoAssembler = unitRef.get(OrderDtoAssembler);
    exchangeRateService = unitRef.get(ExchangeRateService);
    orderRepository = unitRef.get(ORDER_REPOSITORY);
    domainEventEmitter = unitRef.get(DOMAIN_EVENT_EMITTER);
  });

  describe('createOrder', () => {
    it('should return result of OrderDtoAssembler.orderARToResponse', async () => {
      const result = await orderService.createOrder({} as OrderCreateParams);

      expect(result).toBe(mockOrderARToResponseResult);
    });
    it('should call OrderDtoAssembler.orderCreateParamsToOrderAR with passing params', async () => {
      const params = Symbol() as any as OrderCreateParams;

      await orderService.createOrder(params);

      expect(orderDtoAssembler.orderCreateParamsToOrderAR).toHaveBeenCalledWith(
        params,
      );
    });
    it('When transformed order price is over 2000, should throw BadRequestException with message "Price is over 2000"', async () => {
      const params = Symbol() as any as OrderCreateParams;
      jest
        .spyOn(exchangeRateService, 'switchToTWDCurrencyOrder')
        .mockResolvedValue(
          new OrderAR({
            ...mockValidOrder.props,
            price: new PriceV2({
              amount: DecimalAmount.create(2001),
              currency: new Currency({ value: CurrencyType.TWD }),
            }),
          }),
        );

      await expect(orderService.createOrder(params)).rejects.toThrowWithMessage(
        BadRequestException,
        'Price is over 2000',
      );
    });
    it('should call OrderRepository.save with transformed order', async () => {
      const params = Symbol() as any as OrderCreateParams;

      await orderService.createOrder(params);

      expect(orderRepository.save).toHaveBeenCalledWith(mockTransformedOrder);
    });
    it('DomainEventEmitter.emit should be called with OrderCreated', async () => {
      const params = Symbol() as any as OrderCreateParams;

      await orderService.createOrder(params);
      const transformedOrder = mockTransformedOrder;
      const createdEvent = transformedOrder.domainEvents[0];

      expect(domainEventEmitter.emit).toHaveBeenCalledWith(
        'OrderCreated',
        createdEvent,
      );
    });
  });
});
