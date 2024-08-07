import { z } from 'zod';
import { AggregateRoot, Id, validateDomain, voSchema } from '@/common';
import { Price, Period } from '../vo';
import { BookingCreated } from '../events';

const bookingSchema = z.object({
  id: voSchema(Id),
  bnbId: voSchema(Id),
  roomId: voSchema(Id),
  clientId: voSchema(Id),
  period: voSchema(Period),
  price: voSchema(Price),
  createdAt: z.date(),
});

type BookingARProps = {
  id: Id;
  bnbId: Id;
  roomId: Id;
  clientId: Id;
  period: Period;
  price: Price;
  createdAt: Date;
};

export class BookingAR extends AggregateRoot<BookingARProps, Id> {
  static create(props: CreateBookingARProps): BookingAR {
    const id = Id.create();
    const createdAt = new Date();
    return new BookingAR({ ...props, id, createdAt }).addDomainEvent(
      new BookingCreated(id.value),
    );
  }

  get id() {
    return this.props.id;
  }

  validate() {
    return validateDomain(bookingSchema, this.props);
  }
}

export type CreateBookingARProps = {
  bnbId: Id;
  roomId: Id;
  clientId: Id;
  period: Period;
  price: Price;
};
