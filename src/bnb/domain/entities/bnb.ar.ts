import { z } from 'zod';
import { AggregateRoot, Id, validateDomain, voSchema } from '@/common';
import { AddressV2 } from '../vo';

const bnbSchema = z.object({
  id: voSchema(Id),
  name: z.string().min(3).max(60),
  address: voSchema(AddressV2),
});

type BnbARProps = {
  id: Id;
  name: string;
  address: AddressV2;
};

export class BnbAR extends AggregateRoot<BnbARProps, Id> {
  static create(props: CreateBnbARProps): BnbAR {
    const id = Id.create();
    return new BnbAR({ ...props, id });
  }

  get id() {
    return this.props.id;
  }

  validate() {
    return validateDomain(bnbSchema, this.props);
  }
}

export type CreateBnbARProps = {
  name: string;
  address: AddressV2;
};
