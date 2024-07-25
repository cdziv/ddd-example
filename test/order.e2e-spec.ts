import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { OrderModule } from '../src/order/order.module';
import {
  DOMAIN_EVENT_EMITTER,
  ORDER_REPOSITORY,
} from '../src/order/order.constants';
import { generateCapitalizedWords } from '../src/test-utils';

describe('OrderController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderModule],
    })
      .overrideProvider(ORDER_REPOSITORY)
      .useValue({
        save: jest.fn(),
      })
      .overrideProvider(DOMAIN_EVENT_EMITTER)
      .useValue({
        emit: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/orders (POST)', () => {
    const validProps = {
      id: faker.string.uuid(),
      name: generateCapitalizedWords(3, 5),
      address: {
        city: faker.word.words(2),
        district: faker.word.words(2),
        street: faker.word.words(3),
      },
      price: faker.finance.amount({ dec: 0, max: 2000 }),
      currency: 'TWD',
    };

    it('When request body is valid, should return 201 with the order response', () => {
      const expectedResponse = validProps;

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(validProps)
        .expect(201)
        .expect(expectedResponse);
    });
    it('When name contains non-english characters, should return 400 with error message "Name contains non-English characters"', () => {
      const body = {
        ...validProps,
        name: '中文',
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Name contains non-English characters',
          error: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When name contains no capitalized words, should return 400 with error message "Name is not capitalized"', () => {
      const body = {
        ...validProps,
        name: 'Some Order Name with No Capitalized Words',
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Name is not capitalized',
          error: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When currency is not TWD or USD, should return 400 with error message "Currency format is wrong"', () => {
      const body = {
        ...validProps,
        currency: 'JPY',
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Currency format is wrong',
          error: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When currency of body is USD, should receive the result that converted to TWD and price * 31', () => {
      const usdPrice = faker.finance.amount({ dec: 0, max: 2000 / 31 });
      const USDBody = {
        ...validProps,
        price: usdPrice,
        currency: 'USD',
      };
      const expectedResponse = {
        ...validProps,
        price: String(parseInt(usdPrice) * 31),
        currency: 'TWD',
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(USDBody)
        .expect(201)
        .expect(expectedResponse);
    });
    it('When currency is TWD but price is greater than 2000, should return 400 with error message "Price is over 2000"', () => {
      const body = {
        ...validProps,
        price: '2001',
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Price is over 2000',
          error: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When currency is USD but price is greater than 2000 after exchange to TWD, should return 400 with error message "Price is over 2000"', () => {
      const body = {
        ...validProps,
        price: '65',
        currency: 'USD',
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Price is over 2000',
          error: 'Bad Request',
          statusCode: 400,
        });
    });
    /** data type tests */
    it('When id is not a string, should return 400 with error message "Id is not a string"', () => {
      const body = {
        ...validProps,
        id: 123,
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When name is not a string, should return 400 with error message "Bad Request"', () => {
      const body = {
        ...validProps,
        name: 123,
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When address is not an object, should return 400 with error message "Bad Request"', () => {
      const body = {
        ...validProps,
        address: 'address',
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When address.city is not a string, should return 400 with error message "Bad Request"', () => {
      const body = {
        ...validProps,
        address: {
          city: 123,
          district: 'district',
          street: 'street',
        },
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When address.district is not a string, should return 400 with error message "Bad Request"', () => {
      const body = {
        ...validProps,
        address: {
          city: 'city',
          district: 123,
          street: 'street',
        },
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When address.street is not a string, should return 400 with error message "Bad Request"', () => {
      const body = {
        ...validProps,
        address: {
          city: 'city',
          district: 'district',
          street: 123,
        },
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When price is not a string, should return 400 with error message "Bad Request"', () => {
      const body = {
        ...validProps,
        price: 123,
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });
    it('When currency is not a string, should return 400 with error message "Bad Request"', () => {
      const body = {
        ...validProps,
        currency: 123,
      };

      return request(app.getHttpServer())
        .post('/api/orders')
        .send(body)
        .expect(400)
        .expect({
          message: 'Bad Request',
          statusCode: 400,
        });
    });
  });
});
