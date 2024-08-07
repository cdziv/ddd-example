import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import {
  BnbModule,
  BookingResponseDto,
  CreateBookingService,
  CurrencyType,
} from '../src/modules/bnb';

describe('BnbModule (e2e)', () => {
  let app: INestApplication;
  let mockBookingResponseDto: BookingResponseDto;

  beforeEach(async () => {
    mockBookingResponseDto = {
      id: faker.string.uuid(),
      bnbId: faker.string.uuid(),
      roomId: faker.string.uuid(),
      clientId: faker.string.uuid(),
      checkInAt: faker.date.recent(),
      checkOutAt: faker.date.soon(),
      price: faker.finance.amount({ dec: 0 }),
      currency: faker.helpers.enumValue(CurrencyType),
      createdAt: faker.date.recent(),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BnbModule],
    })
      .overrideProvider(CreateBookingService)
      .useValue({
        createBooking: jest.fn().mockResolvedValue(mockBookingResponseDto),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/bookings (POST)', () => {
    const validProps = {
      bnbId: faker.string.uuid(),
      roomId: faker.string.uuid(),
      clientId: faker.string.uuid(),
      checkInAt: faker.date.recent().toISOString(),
      checkOutAt: faker.date.soon().toISOString(),
      useCurrency: faker.helpers.enumValue(CurrencyType),
    };

    it('When request body is valid, should return 201 with the booking response', async () => {
      const expectedResponse = {
        ...mockBookingResponseDto,
        checkInAt: mockBookingResponseDto.checkInAt.toISOString(),
        checkOutAt: mockBookingResponseDto.checkOutAt.toISOString(),
        createdAt: mockBookingResponseDto.createdAt.toISOString(),
      };

      return request(app.getHttpServer())
        .post('/bookings')
        .send(validProps)
        .expect(201)
        .then((resp) => {
          expect(resp.body).toMatchObject(expectedResponse);
        });
    });
  });
});
