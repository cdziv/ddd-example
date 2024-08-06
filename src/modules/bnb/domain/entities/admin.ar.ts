import { z } from 'zod';
import { AggregateRoot, Id, validateDomain, voSchema } from '@/common';

const adminSchema = z.object({
  id: voSchema(Id),
  bnbId: voSchema(Id),
  email: z.string().email(),
});

type AdminARProps = {
  id: Id;
  bnbId: Id;
  email: string;
};

export class AdminAR extends AggregateRoot<AdminARProps, Id> {
  static create(props: CreateOrderProps): AdminAR {
    const id = Id.create();
    return new AdminAR({ ...props, id });
  }

  get id() {
    return this.props.id;
  }

  validate() {
    return validateDomain(adminSchema, this.props);
  }
}

export type CreateOrderProps = {
  bnbId: Id;
  email: string;
};
