import { z } from 'zod';
import { AggregateRoot, Id, validateDomain, voSchema } from '@/common';

const clientSchema = z.object({
  id: voSchema(Id),
  email: z.string().email(),
});

type ClientARProps = {
  id: Id;
  email: string;
};

export class ClientAR extends AggregateRoot<ClientARProps, Id> {
  static create(props: CreateClientProps): ClientAR {
    const id = Id.create();
    return new ClientAR({ ...props, id });
  }

  get id() {
    return this.props.id;
  }

  validate() {
    return validateDomain(clientSchema, this.props);
  }
}

export type CreateClientProps = {
  email: string;
};
