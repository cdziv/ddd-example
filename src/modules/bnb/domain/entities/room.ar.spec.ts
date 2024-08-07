import { faker } from '@faker-js/faker';
import { DddArgumentInvalidDomainError, Id } from '@/common';
import { RoomAR } from './room.ar';
import { BedEntity } from './bed.entity';
import { BedSize, CurrencyType } from '../../bnb.constants';
import { DecimalAmount, Price } from '../vo';

describe('RoomAR', () => {
  const validProps = {
    id: Id.create(),
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
  };

  describe('constructor', () => {
    it('When passing valid props, should create RoomAR instance', () => {
      const room = new RoomAR(validProps);

      expect(room).toBeInstanceOf(RoomAR);
    });
    it('When passing invalid props, should throw DddArgumentInvalidDomainError', () => {
      const invalidProps = { ...validProps, name: null } as any;

      expect(() => new RoomAR(invalidProps)).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });

  describe('static create', () => {
    it('When passing valid props, should create RoomAR instance with same props and new id', () => {
      const props = {
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
      };

      const admin = RoomAR.create(props);

      expect(admin).toBeInstanceOf(RoomAR);
      expect(admin.id).toBeInstanceOf(Id);
      expect(admin.props.beds).toEqual(props.beds);
      expect(admin.props.price).toEqual(props.price);
    });
  });

  describe('addBed', () => {
    it('When passing valid bed, should add bed to beds', () => {
      const room = new RoomAR(validProps);
      const newBed = BedEntity.create({
        size: faker.helpers.enumValue(BedSize),
      });

      const newRoom = room.addBed(newBed);

      expect(newRoom.props.beds).toEqual([...validProps.beds, newBed]);
    });
    it('When passing invalid bed, should throw DddArgumentInvalidDomainError', () => {
      const room = new RoomAR(validProps);
      const invalidBed = { size: faker.helpers.enumValue(BedSize) } as any;

      expect(() => room.addBed(invalidBed)).toThrow(
        DddArgumentInvalidDomainError,
      );
    });
  });
});
