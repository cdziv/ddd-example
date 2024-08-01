import { z } from 'zod';
import { Entity, Id, validateDomain, voSchema } from '@/common';
import { BedSize } from '../../bnb.constants';

const bedSchema = z.object({
  id: voSchema(Id),
  size: z.nativeEnum(BedSize),
});

type BedEntityProps = {
  id: Id;
  size: BedSize;
};

export class BedEntity extends Entity<BedEntityProps, Id> {
  static create(props: CreateBedEntityProps): BedEntity {
    const id = Id.create();
    return new BedEntity({ ...props, id });
  }

  get id() {
    return this.props.id;
  }

  validate() {
    return validateDomain(bedSchema, this.props);
  }
}

export type CreateBedEntityProps = {
  size: BedSize;
};
