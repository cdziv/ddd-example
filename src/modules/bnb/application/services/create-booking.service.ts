import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BookingResponseDto, CreateBookingRequestDto } from '../../dtos';
import {
  BOOKING_REPOSITORY,
  BookingRepositoryPort,
  EXCHANGE_PROVIDER,
  ExchangeProviderPort,
  ROOM_REPOSITORY,
  RoomRepositoryPort,
} from '../../infra';
import { Id } from '@/common';
import { BookingAR, Period } from '../../domain';
import { BookingAssembler } from '../assemblers';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CreateBookingService {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepositoryPort,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepositoryPort,
    @Inject(EXCHANGE_PROVIDER)
    private readonly exchangeProvider: ExchangeProviderPort,
    private readonly eventEmitter: EventEmitter2,
    private readonly bookingAssembler: BookingAssembler,
  ) {}

  async createBooking(
    dto: CreateBookingRequestDto,
  ): Promise<BookingResponseDto> {
    const now = new Date();
    const roomId = new Id({ value: dto.roomId });
    const clientId = new Id({ value: dto.clientId });
    const period = new Period({
      startsAt: dto.checkInAt,
      endsAt: dto.checkOutAt,
    });
    const room = await this.roomRepository.ofId(roomId);
    if (!room) {
      throw new BadRequestException('Room not found');
    }
    const bnbId = room.props.bnbId;
    const roomPrice = room.props.price;
    const bookingPrice =
      roomPrice.value.currency === dto.useCurrency
        ? roomPrice
        : await this.exchangeProvider.getExchangePrice({
            currencyFrom: roomPrice.value.currency,
            currencyTo: dto.useCurrency,
            amount: roomPrice.value.amount,
            date: now,
          });
    const newBooking = BookingAR.create({
      bnbId,
      roomId,
      clientId,
      period,
      price: bookingPrice,
    });
    await this.bookingRepository.save(newBooking);
    // 顯式呼叫 publishDomainEvents。也可以將其實作在 repository.save 方法中。
    newBooking.publishDomainEvents(this.eventEmitter);

    return this.bookingAssembler.toDto(newBooking);
  }
}
