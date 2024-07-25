import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { OrderModule } from '../src/order/order.module';
import {
  DOMAIN_EVENT_EMITTER,
  ORDER_REPOSITORY,
} from '../src/order/order.constants';

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

  it('/api/orders (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/orders')
      .expect(200)
      .expect('Hello World!');
  });
});
