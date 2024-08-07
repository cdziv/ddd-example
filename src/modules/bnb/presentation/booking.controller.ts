import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  BookingResponseDto,
  CreateBookingRequestDto,
  createBookingRequestDtoSchema,
} from '../dtos';
import { CreateBookingService } from '../application';
import { ZodValidationPipe } from '@/common';

@Controller('bookings')
export class BookingController {
  constructor(private createBookingService: CreateBookingService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createBookingRequestDtoSchema))
  async createBooking(
    @Body() dto: CreateBookingRequestDto,
  ): Promise<BookingResponseDto> {
    return this.createBookingService.createBooking(dto);
  }
}
