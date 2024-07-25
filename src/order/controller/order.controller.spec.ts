import { TestBed } from '@automock/jest';
import { faker } from '@faker-js/faker';
import { OrderController } from './order.controller';
import { OrderDtoAssembler, OrderService } from '../application';
import { CurrencyType } from '../order.constants';

describe('OrderDomainService', () => {
  let mockOrderCreateBodyToParamsResult: symbol;
  let mockOrderCreateBodyToParams: jest.Mock;
  let mockCreateOrderResult: symbol;
  let mockCreateOrder: jest.Mock;
  let orderController: OrderController;

  beforeEach(() => {
    mockOrderCreateBodyToParamsResult = Symbol(
      'mockOrderCreateBodyToParamsResult',
    );
    mockOrderCreateBodyToParams = jest
      .fn()
      .mockReturnValue(mockOrderCreateBodyToParamsResult);
    mockCreateOrderResult = Symbol('mockCreateOrderResult');
    mockCreateOrder = jest.fn().mockResolvedValue(mockCreateOrderResult);
    const { unit } = TestBed.create(OrderController)
      .mock(OrderDtoAssembler)
      .using({
        orderCreateBodyToParams: mockOrderCreateBodyToParams,
      })
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

    it('should return the result of OrderService.createOrder', async () => {
      const result = await orderController.createOrder(validProps);

      expect(result).toBe(mockCreateOrderResult);
    });
    it('should call OrderDtoAssembler.orderCreateBodyToParams with passing body', async () => {
      await orderController.createOrder(validProps);

      expect(mockOrderCreateBodyToParams).toHaveBeenCalledWith(validProps);
    });
    it('should call OrderService.createOrder with result of OrderDtoAssembler.orderCreateBodyToParams', async () => {
      await orderController.createOrder(validProps);

      expect(mockCreateOrder).toHaveBeenCalledWith(
        mockOrderCreateBodyToParamsResult,
      );
    });
  });
});
