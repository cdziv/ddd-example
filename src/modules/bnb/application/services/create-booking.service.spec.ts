import { TestBed } from '@automock/jest';
import {
  DecimalAmount,
  BookingAR,
  Price,
  RoomAR,
  BedEntity,
  BookingCreated,
  Period,
} from '../../domain';
import { faker } from '@faker-js/faker';
import { Id } from '../../../../common';
import {
  BOOKING_REPOSITORY,
  BookingRepositoryPort,
  EXCHANGE_PROVIDER,
  ExchangeProviderPort,
  ROOM_REPOSITORY,
  RoomRepositoryPort,
} from '../../infra';
import { BookingAssembler } from '../assemblers';
import { CreateBookingService } from './create-booking.service';
import { CreateBookingRequestDto } from '../../dtos';
import { BedSize, CurrencyType } from '../../bnb.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('CreateBookingService', () => {
  describe('createBooking', () => {
    it('should call roomRepository.ofId with passing roomId', async () => {
      const requestDto: CreateBookingRequestDto = {
        bnbId: faker.string.uuid(),
        roomId: faker.string.uuid(),
        clientId: faker.string.uuid(),
        checkInAt: faker.date.recent(),
        checkOutAt: faker.date.soon(),
        useCurrency: faker.helpers.enumValue(CurrencyType),
      };
      const { unit: createBookingService, unitRef } =
        TestBed.create(CreateBookingService).compile();
      const roomRepository = unitRef.get<RoomRepositoryPort>(ROOM_REPOSITORY);

      await createBookingService.createBooking(requestDto).catch(() => {});
      const expectedRoomId = new Id({
        value: requestDto.roomId,
      });

      expect(roomRepository.ofId).toHaveBeenCalledWith(expectedRoomId);
    });
    it('When room price currency is not same as useCurrency, should call exchangeProvider.getExchangePrice with room price', async () => {
      const requestDtoUseUSD: CreateBookingRequestDto = {
        bnbId: faker.string.uuid(),
        roomId: faker.string.uuid(),
        clientId: faker.string.uuid(),
        checkInAt: faker.date.recent(),
        checkOutAt: faker.date.soon(),
        useCurrency: CurrencyType.USD,
      };
      const roomUseTWD = new RoomAR({
        id: new Id({ value: requestDtoUseUSD.roomId }),
        bnbId: Id.create(),
        name: faker.commerce.product(),
        beds: [
          BedEntity.create({
            size: faker.helpers.enumValue(BedSize),
          }),
        ],
        price: new Price({
          currency: CurrencyType.TWD,
          amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
        }),
      });
      const { unit: createBookingService, unitRef } = TestBed.create(
        CreateBookingService,
      )
        .mock(ROOM_REPOSITORY)
        .using({
          ofId: jest.fn().mockResolvedValue(roomUseTWD),
        })
        .mock(EXCHANGE_PROVIDER)
        .using({
          getExchangePrice: jest.fn(),
        })
        .compile();
      const exchangeProvider =
        unitRef.get<ExchangeProviderPort>(EXCHANGE_PROVIDER);

      await createBookingService
        .createBooking(requestDtoUseUSD)
        .catch(() => {});

      expect(exchangeProvider.getExchangePrice).toHaveBeenCalledWith({
        currencyFrom: roomUseTWD.props.price.value.currency,
        currencyTo: requestDtoUseUSD.useCurrency,
        amount: roomUseTWD.props.price.value.amount,
        date: expect.any(Date),
      });
    });
    it('When room price currency is same as useCurrency, should not call exchangeProvider.getExchangePrice', async () => {
      const requestDtoUseUSD: CreateBookingRequestDto = {
        bnbId: faker.string.uuid(),
        roomId: faker.string.uuid(),
        clientId: faker.string.uuid(),
        checkInAt: faker.date.recent(),
        checkOutAt: faker.date.soon(),
        useCurrency: CurrencyType.TWD,
      };
      const roomUseTWD = new RoomAR({
        id: new Id({ value: requestDtoUseUSD.roomId }),
        bnbId: Id.create(),
        name: faker.commerce.product(),
        beds: [
          BedEntity.create({
            size: faker.helpers.enumValue(BedSize),
          }),
        ],
        price: new Price({
          currency: CurrencyType.TWD,
          amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
        }),
      });
      const { unit: createBookingService, unitRef } = TestBed.create(
        CreateBookingService,
      )
        .mock(ROOM_REPOSITORY)
        .using({
          ofId: jest.fn().mockResolvedValue(roomUseTWD),
        })
        .mock(EXCHANGE_PROVIDER)
        .using({
          getExchangePrice: jest.fn(),
        })
        .compile();
      const exchangeProvider =
        unitRef.get<ExchangeProviderPort>(EXCHANGE_PROVIDER);

      await createBookingService
        .createBooking(requestDtoUseUSD)
        .catch(() => {});

      expect(exchangeProvider.getExchangePrice).not.toHaveBeenCalled();
    });
    it('should call bookingRepository.save with created new booking that props match the room', async () => {
      const requestDto: CreateBookingRequestDto = {
        bnbId: faker.string.uuid(),
        roomId: faker.string.uuid(),
        clientId: faker.string.uuid(),
        checkInAt: faker.date.recent(),
        checkOutAt: faker.date.soon(),
        useCurrency: CurrencyType.USD,
      };
      const room = new RoomAR({
        id: new Id({ value: requestDto.roomId }),
        bnbId: Id.create(),
        name: faker.commerce.product(),
        beds: [
          BedEntity.create({
            size: faker.helpers.enumValue(BedSize),
          }),
        ],
        price: new Price({
          currency: CurrencyType.TWD,
          amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
        }),
      });
      const exchangedPrice = new Price({
        currency: CurrencyType.USD,
        amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
      });
      const { unit, unitRef } = TestBed.create(CreateBookingService)
        .mock(EXCHANGE_PROVIDER)
        .using({
          getExchangePrice: jest.fn().mockResolvedValue(exchangedPrice),
        })
        .mock(ROOM_REPOSITORY)
        .using({
          ofId: jest.fn().mockResolvedValue(room),
        })
        .mock(BOOKING_REPOSITORY)
        .using({
          save: jest.fn(),
        })
        .compile();
      const createBookingService = unit;
      const bookingRepository =
        unitRef.get<BookingRepositoryPort>(BOOKING_REPOSITORY);

      await createBookingService.createBooking(requestDto).catch(() => {});

      expect(bookingRepository.save).toHaveBeenCalledOnce();
      const passedBooking = bookingRepository.save.mock
        .calls[0][0] as BookingAR;
      expect(passedBooking).toBeInstanceOf(BookingAR);
      expect(
        (bookingRepository.save.mock.calls[0][0] as BookingAR).props,
      ).toMatchObject({
        bnbId: room.props.bnbId,
        roomId: room.id,
        clientId: new Id({ value: requestDto.clientId }),
        period: new Period({
          startsAt: requestDto.checkInAt,
          endsAt: requestDto.checkOutAt,
        }),
        price: exchangedPrice,
      });
    });
    it('should call EventEmitter.emit with BookingCreated', async () => {
      const requestDto: CreateBookingRequestDto = {
        bnbId: faker.string.uuid(),
        roomId: faker.string.uuid(),
        clientId: faker.string.uuid(),
        checkInAt: faker.date.recent(),
        checkOutAt: faker.date.soon(),
        useCurrency: CurrencyType.USD,
      };
      const room = new RoomAR({
        id: new Id({ value: requestDto.roomId }),
        bnbId: Id.create(),
        name: faker.commerce.product(),
        beds: [
          BedEntity.create({
            size: faker.helpers.enumValue(BedSize),
          }),
        ],
        price: new Price({
          currency: CurrencyType.TWD,
          amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
        }),
      });
      const exchangedPrice = new Price({
        currency: CurrencyType.USD,
        amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
      });
      const { unit, unitRef } = TestBed.create(CreateBookingService)
        .mock(EXCHANGE_PROVIDER)
        .using({
          getExchangePrice: jest.fn().mockResolvedValue(exchangedPrice),
        })
        .mock(ROOM_REPOSITORY)
        .using({
          ofId: jest.fn().mockResolvedValue(room),
        })
        .mock(BOOKING_REPOSITORY)
        .using({
          save: jest.fn(),
        })
        .compile();
      const createBookingService = unit;
      const eventEmitter = unitRef.get<EventEmitter2>(EventEmitter2);

      await createBookingService.createBooking(requestDto).catch(() => {});

      expect(eventEmitter.emit).toHaveBeenCalledOnce();
      const passedEventName = eventEmitter.emit.mock.calls[0][0] as string;
      const passedEvent = eventEmitter.emit.mock.calls[0][1] as BookingCreated;
      expect(passedEventName).toBe(BookingCreated.name);
      expect(passedEvent).toBeInstanceOf(BookingCreated);
    });
    it('should return result of BookingDtoAssembler.toDto', async () => {
      const requestDto: CreateBookingRequestDto = {
        bnbId: faker.string.uuid(),
        roomId: faker.string.uuid(),
        clientId: faker.string.uuid(),
        checkInAt: faker.date.recent(),
        checkOutAt: faker.date.soon(),
        useCurrency: CurrencyType.USD,
      };
      const room = new RoomAR({
        id: new Id({ value: requestDto.roomId }),
        bnbId: Id.create(),
        name: faker.commerce.product(),
        beds: [
          BedEntity.create({
            size: faker.helpers.enumValue(BedSize),
          }),
        ],
        price: new Price({
          currency: CurrencyType.TWD,
          amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
        }),
      });
      const exchangedPrice = new Price({
        currency: CurrencyType.USD,
        amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
      });
      const mockResult = Symbol('mockResult');
      const { unit } = TestBed.create(CreateBookingService)
        .mock(EXCHANGE_PROVIDER)
        .using({
          getExchangePrice: jest.fn().mockResolvedValue(exchangedPrice),
        })
        .mock(ROOM_REPOSITORY)
        .using({
          ofId: jest.fn().mockResolvedValue(room),
        })
        .mock(BookingAssembler)
        .using({
          toDto: jest.fn().mockReturnValue(mockResult),
        })
        .compile();
      const createBookingService = unit;

      const result = await createBookingService.createBooking(requestDto);

      expect(result).toBe(mockResult);
    });
  });
});
