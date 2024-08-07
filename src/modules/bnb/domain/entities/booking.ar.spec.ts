import { faker } from '@faker-js/faker';
import { DddArgumentInvalidDomainError, Id } from '@/common';
import { BookingAR } from './booking.ar';
import { CurrencyType } from '../../bnb.constants';
import { DecimalAmount, Period, Price } from '../vo';

describe('BookingAR', () => {
  const validProps = {
    id: Id.create(),
    bnbId: Id.create(),
    roomId: Id.create(),
    clientId: Id.create(),
    period: new Period({
      startsAt: faker.date.recent(),
      endsAt: faker.date.soon(),
    }),
    price: new Price({
      currency: faker.helpers.enumValue(CurrencyType),
      amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
    }),
    createdAt: faker.date.recent(),
  };

  describe('constructor', () => {
    it('When passing valid props, should create BookingAR instance', () => {
      const booking = new BookingAR(validProps);

      expect(booking).toBeInstanceOf(BookingAR);
    });
    it('When passing invalid props, should throw DddArgumentInvalidDomainError', () => {
      const invalidProps = { ...validProps, bnbId: null } as any;

      expect(() => new BookingAR(invalidProps)).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });

  describe('static create', () => {
    it('When passing valid props, should create BookingAR instance with same props and new id', () => {
      const props = {
        bnbId: Id.create(),
        roomId: Id.create(),
        clientId: Id.create(),
        period: new Period({
          startsAt: faker.date.recent(),
          endsAt: faker.date.soon(),
        }),
        price: new Price({
          currency: faker.helpers.enumValue(CurrencyType),
          amount: DecimalAmount.create(faker.finance.amount({ dec: 0 })),
        }),
      };

      const booking = BookingAR.create(props);

      expect(booking).toBeInstanceOf(BookingAR);
      expect(booking.id).toBeInstanceOf(Id);
      expect(booking.props.bnbId).toEqual(props.bnbId);
      expect(booking.props.roomId).toEqual(props.roomId);
      expect(booking.props.clientId).toEqual(props.clientId);
      expect(booking.props.period).toEqual(props.period);
      expect(booking.props.price).toEqual(props.price);
    });
  });
});
