import Decimal from 'decimal.js';
import { Price } from './price.vo';
import {
  DddArgumentInvalidDomainError,
  ParamInvalidDomainError,
} from '../../../common';
import { faker } from '@faker-js/faker';

describe('Price', () => {
  describe('constructor', () => {
    it('When passing value is valid props with Decimal, should return Price with same value', () => {
      const decimal = new Decimal(faker.finance.amount());
      const price = new Price({ decimal });

      expect(price).toBeInstanceOf(Price);
      expect(price.value).toEqual({ decimal });
    });
    it('When passing value is 0, should return Price with same value', () => {
      const decimal = new Decimal(0);
      const price = new Price({ decimal });

      expect(price).toBeInstanceOf(Price);
      expect(price.value).toEqual({ decimal });
    });
    it('When passing value is a negative decimal, should throw ParamInvalidDomainError with correct message', () => {
      const decimal = new Decimal('-' + faker.finance.amount());

      expect(() => new Price({ decimal })).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object Price is invalid: [decimal]:Price must be positive number',
      );
    });
  });

  describe('static create', () => {
    it('When passing amount is valid decimal string, should return Price with same value', () => {
      const amount = faker.finance.amount();
      const price = Price.create(amount);

      expect(price).toBeInstanceOf(Price);
      expect(price.value).toEqual({ decimal: new Decimal(amount) });
    });
    it('When passing amount is valid number, should return Price with same value', () => {
      const amount = faker.finance.amount();
      const price = Price.create(Number(amount));

      expect(price).toBeInstanceOf(Price);
      expect(price.value).toEqual({ decimal: new Decimal(amount) });
    });
    it('When passing amount is 0, should return Price with same value', () => {
      const amount = 0;
      const price = Price.create(amount);

      expect(price).toBeInstanceOf(Price);
      expect(price.value).toEqual({ decimal: new Decimal(amount) });
    });
    it('When passing amount is invalid decimal string, should throw ParamInvalidDomainError with correct message', () => {
      const amount = faker.string.alpha(5);

      expect(() => Price.create(amount)).toThrowWithMessage(
        ParamInvalidDomainError,
        'Invalid decimal value',
      );
    });
    it('When passing amount is negative decimal string, should throw DddArgumentInvalidDomainError with correct message', () => {
      const amount = '-' + faker.finance.amount();

      expect(() => Price.create(amount)).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object Price is invalid: [decimal]:Price must be positive number',
      );
    });
    it('When passing amount is negative number, should throw DddArgumentInvalidDomainError with correct message', () => {
      const amount = -Number(faker.finance.amount());

      expect(() => Price.create(amount)).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object Price is invalid: [decimal]:Price must be positive number',
      );
    });
  });

  describe('operators', () => {
    it('When calling eq with same value, should return true', () => {
      const amount = faker.finance.amount();
      const price = new Price({ decimal: new Decimal(amount) });
      const price2 = new Price({ decimal: new Decimal(amount) });

      expect(price.eq(price2)).toBe(true);
    });
    it('When calling eq with different value, should return false', () => {
      const amount1 = faker.finance.amount();
      const amount2 = faker.finance.amount();
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(price1.eq(price2)).toBe(false);
    });
    it('When calling gt with smaller value, should return true', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(price1.gt(price2)).toBe(true);
    });
    it('When calling gt with greater value, should return false', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(price1.gt(price2)).toBe(false);
    });
    it('When calling gte with smaller value, should return true', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(price1.gte(price2)).toBe(true);
    });
    it('When calling gte with same value, should return true', () => {
      const amount = faker.finance.amount();
      const price = new Price({
        decimal: new Decimal(amount),
      });
      const price2 = new Price({
        decimal: new Decimal(amount),
      });

      expect(price.gte(price2)).toBe(true);
    });
    it('When calling gte with greater value, should return false', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(price1.gte(price2)).toBe(false);
    });
    it('When calling lt with smaller value, should return false', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(price1.lt(price2)).toBe(false);
    });
    it('When calling lt with greater value, should return true', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(price1.lt(price2)).toBe(true);
    });
    it('When calling lte with smaller value, should return false', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(price1.lte(price2)).toBe(false);
    });
    it('When calling lte with same value, should return true', () => {
      const amount = faker.finance.amount();
      const price = new Price({
        decimal: new Decimal(amount),
      });
      const price2 = new Price({
        decimal: new Decimal(amount),
      });

      expect(price.lte(price2)).toBe(true);
    });
    it('When calling lte with greater value, should return true', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(price1.lte(price2)).toBe(true);
    });
    it('should return a new Price that added by two prices', () => {
      const amount1 = faker.finance.amount();
      const amount2 = faker.finance.amount();
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      const result = price1.add(price2);

      expect(result).toBeInstanceOf(Price);
      expect(result.value).toEqual({
        decimal: new Decimal(amount1).add(new Decimal(amount2)),
      });
    });
    it('When subtracting a greater price, should throw ParamInvalidDomainError with correct message', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      expect(() => price1.sub(price2)).toThrowWithMessage(
        ParamInvalidDomainError,
        'cannot subtract with a greater Price',
      );
    });
    it('should return a new Price that subtracted by two prices', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      const result = price1.sub(price2);

      expect(result).toBeInstanceOf(Price);
      expect(result.value).toEqual({
        decimal: new Decimal(amount1).sub(new Decimal(amount2)),
      });
    });
    it('should return a new Price that multiplied by two prices', () => {
      const amount1 = faker.finance.amount();
      const amount2 = faker.finance.amount();
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      const result = price1.mul(price2);

      expect(result).toBeInstanceOf(Price);
      expect(result.value).toEqual({
        decimal: new Decimal(amount1).mul(new Decimal(amount2)),
      });
    });
    it('should return a new Price that divided by two prices', () => {
      const amount1 = faker.finance.amount();
      const amount2 = faker.finance.amount();
      const price1 = new Price({
        decimal: new Decimal(amount1),
      });
      const price2 = new Price({
        decimal: new Decimal(amount2),
      });

      const result = price1.div(price2);

      expect(result).toBeInstanceOf(Price);
      expect(result.value).toEqual({
        decimal: new Decimal(amount1).div(new Decimal(amount2)),
      });
    });
  });
});
