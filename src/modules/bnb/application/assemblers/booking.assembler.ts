import { Injectable } from '@nestjs/common';
import { BookingAR } from '../../domain';
import { BookingResponseDto } from '../../dtos';

@Injectable()
export class BookingAssembler {
  toDto(bookingAR: BookingAR): BookingResponseDto {
    return {
      id: bookingAR.id.value,
      bnbId: bookingAR.props.bnbId.value,
      roomId: bookingAR.props.roomId.value,
      clientId: bookingAR.props.clientId.value,
      checkInAt: bookingAR.props.period.value.startsAt,
      checkOutAt: bookingAR.props.period.value.endsAt,
      price: bookingAR.props.price.value.amount.value.decimal.toString(),
      currency: bookingAR.props.price.value.currency,
      createdAt: bookingAR.props.createdAt,
    };
  }
}
