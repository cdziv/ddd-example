import { TestBed } from '@automock/jest';
import { faker } from '@faker-js/faker';
import { OrderController } from './order.controller';
import { OrderService } from '../application';
import { CurrencyType } from '../order.constants';
import { BadRequestException } from '@nestjs/common';

describe('OrderDomainService', () => {
  let mockCreateOrderResult: symbol;
  let mockCreateOrder: jest.Mock;
  let orderController: OrderController;

  beforeEach(() => {
    mockCreateOrderResult = Symbol('mockCreateOrderResult');
    mockCreateOrder = jest.fn().mockResolvedValue(mockCreateOrderResult);
    const { unit } = TestBed.create(OrderController)
      .mock(OrderService)
      .using({
        createOrder: mockCreateOrder,
      })
      .compile();
    orderController = unit;
  });

  describe('createOrder', () => {
    const validProps = {
      id: faker.string.uuid(),
      name: faker.string.alpha({ length: { min: 1, max: 30 } }),
      address: {
        city: faker.string.alpha({ length: { min: 1, max: 30 } }),
        district: faker.string.alpha({ length: { min: 1, max: 30 } }),
        street: faker.string.alpha({ length: { min: 1, max: 120 } }),
      },
      price: faker.finance.amount(),
      currency: CurrencyType.USD,
    };

    it('When passing valid body, should return the result of orderService.createOrder', async () => {
      const result = await orderController.createOrder(validProps);

      expect(result).toBe(mockCreateOrderResult);
    });
    it('When passing invalid body, should throw BadRequestException', async () => {
      // price is not a string but a number
      const invalidProps = {
        ...validProps,
        price: faker.number.int(),
      } as any;

      await expect(orderController.createOrder(invalidProps)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
