import { z } from 'zod';
import { AggregateRoot, Id, validateDomain, voSchema } from '../../../common';
import { Address, Currency, OrderName, Price } from '../vo';

const orderSchema = z.object({
  id: voSchema(Id),
  name: voSchema(OrderName),
  address: voSchema(Address),
  price: voSchema(Price),
  currency: voSchema(Currency),
});

type OrderProps = {
  id: Id;
  name: OrderName;
  address: Address;
  price: Price;
  currency: Currency;
};

/**
 * TODO: domain events
 */
export class OrderAR extends AggregateRoot<OrderProps, Id> {
  update(props: UpdateOrderProps) {
    return this.patchValues(props);
  }

  static create(props: CreateOrderProps): OrderAR {
    const id = Id.create();
    return new OrderAR({ ...props, id });
  }

  get id() {
    return this.props.id;
  }

  validate() {
    return validateDomain(orderSchema, this.props);
  }
}

export type CreateOrderProps = {
  name: OrderName;
  address: Address;
  price: Price;
  currency: Currency;
};
export type UpdateOrderProps = Partial<CreateOrderProps>;
