import { OnEvent } from '@nestjs/event-emitter';
import { BookingCreated } from '../../domain';
import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_PROVIDER, EmailProviderPort } from '../../infra';
import { Id } from '@/common';

@Injectable()
export class BookingEventHandler {
  constructor(
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: EmailProviderPort,
  ) {}

  @OnEvent(BookingCreated.name)
  async handleBookingCreated(evt: BookingCreated) {
    // 執行一些業務邏輯，例如發送通知、發送郵件等
    const bookingId = new Id({ value: evt.aggregateId });
    await this.emailProvider.sendBookingCreatedEmail(bookingId);
  }
}
