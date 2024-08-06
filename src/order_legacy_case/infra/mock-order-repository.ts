import { Id, RepositoryPort } from '../../common';
import {
  Address,
  City,
  Currency,
  DecimalAmount,
  District,
  OrderAR,
  OrderName,
  PriceV2,
  Street,
} from '../domain';
import { CurrencyType } from '../order.constants';

const MOCK_ORDERS = [
  new OrderAR({
    id: Id.create(),
    name: new OrderName({ value: 'Mock Order One' }),
    address: new Address({
      city: new City({ value: 'mock city one' }),
      district: new District({ value: 'mock district one' }),
      street: new Street({ value: 'mock street one' }),
    }),
    price: new PriceV2({
      amount: DecimalAmount.create(1000),
      currency: new Currency({ value: CurrencyType.TWD }),
    }),
  }),
  new OrderAR({
    id: Id.create(),
    name: new OrderName({ value: 'Mock Order Two' }),
    address: new Address({
      city: new City({ value: 'mock city two' }),
      district: new District({ value: 'mock district two' }),
      street: new Street({ value: 'mock street two' }),
    }),
    price: new PriceV2({
      amount: DecimalAmount.create(50),
      currency: new Currency({ value: CurrencyType.USD }),
    }),
  }),
];

/**
 * @note just for demo
 */
export class MockOrderRepository implements RepositoryPort<OrderAR, Id> {
  async save(ars: OrderAR | OrderAR[]): Promise<void> {
    return;
  }

  async ofId(id: Id): Promise<OrderAR> {
    return MOCK_ORDERS[0];
  }

  async ofIds(ids: Id[]): Promise<OrderAR[]> {
    return MOCK_ORDERS;
  }

  async delete(ids: Id | Id[]): Promise<void> {
    return;
  }
}
