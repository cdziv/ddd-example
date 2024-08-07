import { Module } from '@nestjs/common';
import {
  BookingAssembler,
  BookingEventHandler,
  CreateBookingService,
} from './application';
import {
  BOOKING_REPOSITORY,
  EMAIL_PROVIDER,
  EXCHANGE_PROVIDER,
  ROOM_REPOSITORY,
} from './infra';
import { BookingController } from './presentation';

const infraProviders = [
  {
    provide: EMAIL_PROVIDER,
    useValue: {}, // Mock implementation
  },
  {
    provide: EXCHANGE_PROVIDER,
    useValue: {}, // Mock implementation
  },
  {
    provide: ROOM_REPOSITORY,
    useValue: {}, // Mock implementation
  },
  {
    provide: BOOKING_REPOSITORY,
    useValue: {}, // Mock implementation
  },
];
const services = [CreateBookingService];
const eventHandlers = [BookingEventHandler];
const assemblers = [BookingAssembler];
const controllers = [BookingController];

@Module({
  controllers,
  providers: [...infraProviders, ...services, ...eventHandlers, ...assemblers],
  exports: [...services],
})
export class BnbModule {}
