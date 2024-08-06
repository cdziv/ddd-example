import { z } from 'zod';
import {
  AggregateRoot,
  Id,
  validateDomain,
  voSchema,
  entitySchema,
  DddArgumentInvalidDomainError,
} from '@/common';
import { PriceV3 } from '../vo';
import { BedEntity } from './bed.entity';

const roomSchema = z.object({
  id: voSchema(Id),
  bnbId: voSchema(Id),
  name: z.string().min(3).max(60),
  beds: z.array(entitySchema(BedEntity)),
  price: voSchema(PriceV3),
});

type RoomARProps = {
  id: Id;
  bnbId: Id;
  name: string;
  beds: BedEntity[];
  price: PriceV3;
};

export class RoomAR extends AggregateRoot<RoomARProps, Id> {
  addBed(bed: BedEntity): this {
    return this.patchValues({ beds: [...this.props.beds, bed] });
  }

  static create(props: CreateRoomARProps): RoomAR {
    const id = Id.create();
    return new RoomAR({ ...props, id });
  }

  get id() {
    return this.props.id;
  }

  /** 驗證 schema 外，還需確認領域邏輯（不變量） */
  validate() {
    const schemaError = validateDomain(roomSchema, this.props);
    if (schemaError) return schemaError;
    if (this.props.beds.length === 0) {
      return new DddArgumentInvalidDomainError(
        'Room must have at least one bed',
      );
    }
  }
}

export type CreateRoomARProps = {
  bnbId: Id;
  name: string;
  price: PriceV3;
  beds: BedEntity[];
};
