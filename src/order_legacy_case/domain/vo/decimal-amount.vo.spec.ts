import Decimal from 'decimal.js';
import { DecimalAmount } from './decimal-amount.vo';
import {
  DddArgumentInvalidDomainError,
  ParamInvalidDomainError,
} from '../../../common';
import { faker } from '@faker-js/faker';

describe('DecimalAmount', () => {
  describe('constructor', () => {
    it('When passing value is valid props with Decimal, should return DecimalAmount with same value', () => {
      const decimal = new Decimal(faker.finance.amount());
      const decimalAmount = new DecimalAmount({ decimal });

      expect(decimalAmount).toBeInstanceOf(DecimalAmount);
      expect(decimalAmount.value).toEqual({ decimal });
    });
    it('When passing value is 0, should return DecimalAmount with same value', () => {
      const decimal = new Decimal(0);
      const decimalAmount = new DecimalAmount({ decimal });

      expect(decimalAmount).toBeInstanceOf(DecimalAmount);
      expect(decimalAmount.value).toEqual({ decimal });
    });
    it('When passing value is a negative decimal, should throw ParamInvalidDomainError with correct message', () => {
      const decimal = new Decimal('-' + faker.finance.amount());

      expect(() => new DecimalAmount({ decimal })).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object DecimalAmount is invalid: [decimal]:DecimalAmount must be positive number',
      );
    });
  });

  describe('static create', () => {
    it('When passing amount is valid decimal string, should return DecimalAmount with same value', () => {
      const amount = faker.finance.amount();
      const decimalAmount = DecimalAmount.create(amount);

      expect(decimalAmount).toBeInstanceOf(DecimalAmount);
      expect(decimalAmount.value).toEqual({ decimal: new Decimal(amount) });
    });
    it('When passing amount is valid number, should return DecimalAmount with same value', () => {
      const amount = faker.finance.amount();
      const decimalAmount = DecimalAmount.create(Number(amount));

      expect(decimalAmount).toBeInstanceOf(DecimalAmount);
      expect(decimalAmount.value).toEqual({ decimal: new Decimal(amount) });
    });
    it('When passing amount is 0, should return DecimalAmount with same value', () => {
      const amount = 0;
      const decimalAmount = DecimalAmount.create(amount);

      expect(decimalAmount).toBeInstanceOf(DecimalAmount);
      expect(decimalAmount.value).toEqual({ decimal: new Decimal(amount) });
    });
    it('When passing amount is invalid decimal string, should throw ParamInvalidDomainError with correct message', () => {
      const amount = faker.string.alpha(5);

      expect(() => DecimalAmount.create(amount)).toThrowWithMessage(
        ParamInvalidDomainError,
        'Invalid decimal value',
      );
    });
    it('When passing amount is negative decimal string, should throw DddArgumentInvalidDomainError with correct message', () => {
      const amount = '-' + faker.finance.amount();

      expect(() => DecimalAmount.create(amount)).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object DecimalAmount is invalid: [decimal]:DecimalAmount must be positive number',
      );
    });
    it('When passing amount is negative number, should throw DddArgumentInvalidDomainError with correct message', () => {
      const amount = -Number(faker.finance.amount());

      expect(() => DecimalAmount.create(amount)).toThrowWithMessage(
        DddArgumentInvalidDomainError,
        'the value object DecimalAmount is invalid: [decimal]:DecimalAmount must be positive number',
      );
    });
  });

  describe('operators', () => {
    it('When calling eq with same value, should return true', () => {
      const amount = faker.finance.amount();
      const decimalAmount = new DecimalAmount({ decimal: new Decimal(amount) });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount),
      });

      expect(decimalAmount.eq(decimalAmount2)).toBe(true);
    });
    it('When calling eq with different value, should return false', () => {
      const amount1 = faker.finance.amount();
      const amount2 = faker.finance.amount();
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(decimalAmount1.eq(decimalAmount2)).toBe(false);
    });
    it('When calling gt with smaller value, should return true', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(decimalAmount1.gt(decimalAmount2)).toBe(true);
    });
    it('When calling gt with greater value, should return false', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(decimalAmount1.gt(decimalAmount2)).toBe(false);
    });
    it('When calling gte with smaller value, should return true', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(decimalAmount1.gte(decimalAmount2)).toBe(true);
    });
    it('When calling gte with same value, should return true', () => {
      const amount = faker.finance.amount();
      const decimalAmount = new DecimalAmount({
        decimal: new Decimal(amount),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount),
      });

      expect(decimalAmount.gte(decimalAmount2)).toBe(true);
    });
    it('When calling gte with greater value, should return false', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(decimalAmount1.gte(decimalAmount2)).toBe(false);
    });
    it('When calling lt with smaller value, should return false', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(decimalAmount1.lt(decimalAmount2)).toBe(false);
    });
    it('When calling lt with greater value, should return true', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(decimalAmount1.lt(decimalAmount2)).toBe(true);
    });
    it('When calling lte with smaller value, should return false', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(decimalAmount1.lte(decimalAmount2)).toBe(false);
    });
    it('When calling lte with same value, should return true', () => {
      const amount = faker.finance.amount();
      const decimalAmount = new DecimalAmount({
        decimal: new Decimal(amount),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount),
      });

      expect(decimalAmount.lte(decimalAmount2)).toBe(true);
    });
    it('When calling lte with greater value, should return true', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(decimalAmount1.lte(decimalAmount2)).toBe(true);
    });
    it('should return a new DecimalAmount that added by two decimalAmounts', () => {
      const amount1 = faker.finance.amount();
      const amount2 = faker.finance.amount();
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      const result = decimalAmount1.add(decimalAmount2);

      expect(result).toBeInstanceOf(DecimalAmount);
      expect(result.value).toEqual({
        decimal: new Decimal(amount1).add(new Decimal(amount2)),
      });
    });
    it('When subtracting a greater decimalAmount, should throw ParamInvalidDomainError with correct message', () => {
      const amount1 = faker.finance.amount({ max: 1000 });
      const amount2 = faker.finance.amount({ min: 1001, max: 2000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      expect(() => decimalAmount1.sub(decimalAmount2)).toThrowWithMessage(
        ParamInvalidDomainError,
        'cannot subtract with a greater DecimalAmount',
      );
    });
    it('should return a new DecimalAmount that subtracted by two decimalAmounts', () => {
      const amount1 = faker.finance.amount({ min: 1001, max: 2000 });
      const amount2 = faker.finance.amount({ max: 1000 });
      const decimalAmount1 = new DecimalAmount({
        decimal: new Decimal(amount1),
      });
      const decimalAmount2 = new DecimalAmount({
        decimal: new Decimal(amount2),
      });

      const result = decimalAmount1.sub(decimalAmount2);

      expect(result).toBeInstanceOf(DecimalAmount);
      expect(result.value).toEqual({
        decimal: new Decimal(amount1).sub(new Decimal(amount2)),
      });
    });
    it('should return a new DecimalAmount that multiplied by given amount', () => {
      const amount = faker.finance.amount();
      const decimalAmount = new DecimalAmount({
        decimal: new Decimal(amount),
      });
      const mulAmount = faker.number.float();

      const result = decimalAmount.mul(mulAmount);

      expect(result).toBeInstanceOf(DecimalAmount);
      expect(result.value).toEqual({
        decimal: new Decimal(amount).mul(mulAmount),
      });
    });
    it('should return a new DecimalAmount that divided by given amount', () => {
      const amount = faker.finance.amount();
      const decimalAmount = new DecimalAmount({
        decimal: new Decimal(amount),
      });
      const divAmount = faker.number.float();

      const result = decimalAmount.div(divAmount);

      expect(result).toBeInstanceOf(DecimalAmount);
      expect(result.value).toEqual({
        decimal: new Decimal(amount).div(new Decimal(divAmount)),
      });
    });
  });
});
