import { faker } from '@faker-js/faker';
import { OrderDtoAssembler } from './order.dto-assembler';
import { BadRequestException } from '@nestjs/common';
import { generateCapitalizedWords } from '../../../test-utils';
import {
  Address,
  City,
  Currency,
  District,
  OrderAR,
  OrderName,
  Price,
  Street,
} from '../../domain';
import { Id } from '../../../common';
import { CurrencyType } from '../../order.constants';
import { OrderCreateParams } from '../dto/order.dto';

describe('OrderDtoAssembler', () => {
  describe('orderCreateBodyToParams', () => {
    const validBody = {
      id: faker.string.uuid(),
      name: generateCapitalizedWords(3, 5),
      address: {
        city: faker.word.words(3),
        district: faker.word.words(3),
        street: faker.word.words(3),
      },
      price: faker.finance.amount({ dec: 0 }),
      currency: 'USD',
    };

    it('When datatype of id is not string, should throw BadRequestException', () => {
      const invalidBody = { ...validBody, id: faker.number.float() } as any;

      expect(() =>
        OrderDtoAssembler.orderCreateBodyToParams(invalidBody),
      ).toThrow(BadRequestException);
    });
    it('When datatype of name is not string, should throw BadRequestException', () => {
      const invalidBody = { ...validBody, name: faker.number.float() } as any;

      expect(() =>
        OrderDtoAssembler.orderCreateBodyToParams(invalidBody),
      ).toThrow(BadRequestException);
    });
    it('When datatype of address.city is not string, should throw BadRequestException', () => {
      const invalidBody = {
        ...validBody,
        address: { ...validBody.address, city: faker.number.float() },
      } as any;

      expect(() =>
        OrderDtoAssembler.orderCreateBodyToParams(invalidBody),
      ).toThrow(BadRequestException);
    });
    it('When datatype of address.district is not string, should throw BadRequestException', () => {
      const invalidBody = {
        ...validBody,
        address: { ...validBody.address, district: faker.number.float() },
      } as any;

      expect(() =>
        OrderDtoAssembler.orderCreateBodyToParams(invalidBody),
      ).toThrow(BadRequestException);
    });
    it('When datatype of address.street is not string, should throw BadRequestException', () => {
      const invalidBody = {
        ...validBody,
        address: { ...validBody.address, street: faker.number.float() },
      } as any;

      expect(() =>
        OrderDtoAssembler.orderCreateBodyToParams(invalidBody),
      ).toThrow(BadRequestException);
    });
    it('When datatype of price is not string, should throw BadRequestException', () => {
      const invalidBody = { ...validBody, price: faker.number.float() } as any;

      expect(() =>
        OrderDtoAssembler.orderCreateBodyToParams(invalidBody),
      ).toThrow(BadRequestException);
    });
    it('When datatype of currency is not string, should throw BadRequestException', () => {
      const invalidBody = {
        ...validBody,
        currency: faker.number.float(),
      } as any;

      expect(() =>
        OrderDtoAssembler.orderCreateBodyToParams(invalidBody),
      ).toThrow(BadRequestException);
    });
  });

  describe('orderARToResponse', () => {
    it('When passing OrderAR, should return OrderResponse', () => {
      const idValue = faker.string.uuid();
      const nameValue = generateCapitalizedWords(3, 5);
      const cityValue = faker.word.words(3);
      const districtValue = faker.word.words(3);
      const streetValue = faker.word.words(3);
      const priceValue = faker.finance.amount({ dec: 0 });
      const currencyValue = CurrencyType.USD;
      const order = new OrderAR({
        id: new Id({ value: idValue }),
        name: new OrderName({ value: nameValue }),
        address: new Address({
          city: new City({ value: cityValue }),
          district: new District({ value: districtValue }),
          street: new Street({ value: streetValue }),
        }),
        price: Price.create(priceValue),
        currency: new Currency({ value: currencyValue }),
      });
      const result = OrderDtoAssembler.orderARToResponse(order);

      expect(result).toEqual({
        id: idValue,
        name: nameValue,
        address: {
          city: cityValue,
          district: districtValue,
          street: streetValue,
        },
        price: priceValue,
        currency: currencyValue,
      });
    });
  });

  describe('orderCreateParamsToOrderAR', () => {
    const validParams: OrderCreateParams = {
      id: faker.string.uuid(),
      name: generateCapitalizedWords(3, 5),
      address: {
        city: faker.word.words(3),
        district: faker.word.words(3),
        street: faker.word.words(3),
      },
      price: faker.finance.amount({ dec: 0, max: 2000 }),
      currency: 'TWD',
    };

    it('When passing valid OrderCreateParams, should return OrderAR', () => {
      const result = OrderDtoAssembler.orderCreateParamsToOrderAR(validParams);

      expect(result).toBeInstanceOf(OrderAR);
    });
    it('When name contains non-English characters, should throw BadRequestException with message "Name contains non-English characters"', () => {
      const invalidParams = { ...validParams, name: '中文' };

      expect(() =>
        OrderDtoAssembler.orderCreateParamsToOrderAR(invalidParams),
      ).toThrowWithMessage(
        BadRequestException,
        'Name contains non-English characters',
      );
    });
    it('When name is not capitalized, should throw BadRequestException with message "Name is not capitalized"', () => {
      const invalidParams = { ...validParams, name: 'Not all capitalized' };

      expect(() =>
        OrderDtoAssembler.orderCreateParamsToOrderAR(invalidParams),
      ).toThrowWithMessage(BadRequestException, 'Name is not capitalized');
    });
    it('When currency is not in CurrencyType, should throw BadRequestException with message "Currency format is wrong"', () => {
      const invalidParams1 = { ...validParams, currency: 'JPY' };
      const invalidParams2 = { ...validParams, currency: 'CNY' };

      expect(() =>
        OrderDtoAssembler.orderCreateParamsToOrderAR(invalidParams1),
      ).toThrowWithMessage(BadRequestException, 'Currency format is wrong');
      expect(() =>
        OrderDtoAssembler.orderCreateParamsToOrderAR(invalidParams2),
      ).toThrowWithMessage(BadRequestException, 'Currency format is wrong');
    });
    it('When id is not a valid UUID, should throw BadRequestException with message "Invalid id format"', () => {
      const invalidParams = { ...validParams, id: 'invalid' };

      expect(() =>
        OrderDtoAssembler.orderCreateParamsToOrderAR(invalidParams),
      ).toThrowWithMessage(BadRequestException, 'Invalid id format');
    });
  });
});
