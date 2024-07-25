import { faker } from '@faker-js/faker';
import {
  Address,
  City,
  Currency,
  District,
  OrderName,
  Price,
  Street,
} from '../vo';
import { OrderAR } from './order.ar';
import {
  capitalizeWords,
  DddArgumentInvalidDomainError,
  Id,
} from '../../../common';
import { CurrencyType } from '../..//order.constants';
import { OrderCreated, OrderUpdated } from '../events';

describe('OrderAR', () => {
  const city = new City({
    value: faker.string.alpha({ length: { min: 1, max: 30 } }),
  });
  const district = new District({
    value: faker.string.alpha({ length: { min: 1, max: 30 } }),
  });
  const street = new Street({
    value: faker.string.alpha({ length: { min: 1, max: 120 } }),
  });
  const address = new Address({ city, district, street });
  const name = new OrderName({
    value: capitalizeWords(
      Array.from({ length: 3 })
        .map(() => faker.string.alpha(6))
        .join(' '),
    ),
  });
  const price = Price.create(faker.finance.amount());
  const currency = new Currency({ value: CurrencyType.TWD });
  const id = Id.create();
  const validProps = { id, name, address, price, currency };

  describe('constructor', () => {
    it('When passing valid props, should create OrderAR instance', () => {
      const order = new OrderAR(validProps);

      expect(order).toBeInstanceOf(OrderAR);
    });
    it('When passing invalid props, should throw DddArgumentInvalidDomainError', () => {
      const invalidProps = { ...validProps, name: null } as any;

      expect(() => new OrderAR(invalidProps)).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });

  describe('static create', () => {
    it('When passing valid props, should create OrderAR instance with same props and new id', () => {
      const order = OrderAR.create({
        name,
        address,
        price,
        currency,
      });

      expect(order).toBeInstanceOf(OrderAR);
      expect(order.id).toBeInstanceOf(Id);
      expect(order.id).not.toEqual(id);
      expect(order.props).toMatchObject({
        name,
        address,
        price,
        currency,
      });
    });
    it('When passing valid props, should create OrderAR instance with OrderCreated domain event', () => {
      const order = OrderAR.create({
        name,
        address,
        price,
        currency,
      });

      expect(order.domainEvents).toHaveLength(1);
      expect(order.domainEvents[0]).toEqual(new OrderCreated(order.id.value));
    });
    it('When passing invalid props, should throw DddArgumentInvalidDomainError', () => {
      const invalidProps = { price: null } as any;

      expect(() => OrderAR.create(invalidProps)).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });

  describe('update', () => {
    it('When passing valid props, should update OrderAR instance with updated props', () => {
      const order = new OrderAR(validProps);
      const newPrice = Price.create(faker.finance.amount());
      const newCurrency = new Currency({ value: CurrencyType.USD });

      const updatedOrder = order.update({
        price: newPrice,
        currency: newCurrency,
      });

      expect(updatedOrder).toBeInstanceOf(OrderAR);
      expect(updatedOrder.id).toEqual(order.id);
      expect(updatedOrder.props).toMatchObject({
        name,
        address,
        price: newPrice,
        currency: newCurrency,
      });
    });
    it('When passing valid props, should add OrderUpdated domain event', () => {
      const order = new OrderAR(validProps);
      const newPrice = Price.create(faker.finance.amount());
      const newCurrency = new Currency({ value: CurrencyType.USD });

      const updatedOrder = order.update({
        price: newPrice,
        currency: newCurrency,
      });

      expect(updatedOrder.domainEvents).toHaveLength(1);
      expect(updatedOrder.domainEvents[0]).toEqual(
        new OrderUpdated(order.id.value),
      );
    });
  });
});
